
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/services";

const AuthContext = createContext(null);

function normalizeUser(raw) {
  const next = raw?.user || raw || {};
  const role = String(next.role || raw?.role || "").toUpperCase();
  return { ...next, role };
}

function persistUserToStorage(user) {
  localStorage.setItem("hireflow_user", JSON.stringify(user));
  if (user?.role) localStorage.setItem("hireflow_role", user.role);
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hireflow_user") || "null");
      return saved ? normalizeUser(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((raw) => {
    const next = normalizeUser(raw);
    setUserState(next);
    persistUserToStorage(next);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hireflow_access");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => {
        // The Axios interceptor attempts token refresh on 401.
        // If refresh fails it redirects to /login and clears auth storage.
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  const login = useCallback(async (payload) => {
    const { data } = await authApi.login(payload);
    if (!data?.access || !data?.refresh) {
      throw new Error("Login response did not contain access and refresh tokens.");
    }

    localStorage.setItem("hireflow_access", data.access);
    localStorage.setItem("hireflow_refresh", data.refresh);

    // API reference says login returns { user, access, refresh }.
    setUser(data.user || data);
    return data;
  }, [setUser]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem("hireflow_refresh");
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // Logout should still clear local auth state when the server call fails.
    }

    localStorage.removeItem("hireflow_access");
    localStorage.removeItem("hireflow_refresh");
    localStorage.removeItem("hireflow_user");
    localStorage.removeItem("hireflow_role");
    setUserState(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user && localStorage.getItem("hireflow_access")),
    role: user?.role || null,
    login,
    register,
    logout,
    setUser
  }), [user, loading, login, register, logout, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
