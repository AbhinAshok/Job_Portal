import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL.endsWith("/") ? API_URL : `${API_URL}/`,
  timeout: 20000
});

let refreshing = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hireflow_access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original?._retry || !localStorage.getItem("hireflow_refresh")) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshing) {
        refreshing = axios.post(`${api.defaults.baseURL}auth/refresh/`, {
          refresh: localStorage.getItem("hireflow_refresh")
        }).then(({ data }) => {
          localStorage.setItem("hireflow_access", data.access);
          if (data.refresh) localStorage.setItem("hireflow_refresh", data.refresh);
          return data;
        }).finally(() => {
          refreshing = null;
        });
      }

      const data = await refreshing;
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem("hireflow_access");
      localStorage.removeItem("hireflow_refresh");
      localStorage.removeItem("hireflow_user");
      localStorage.removeItem("hireflow_role");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export function unwrapList(data) {
  return Array.isArray(data) ? data : (data?.results || []);
}

export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const messages = Object.entries(data).flatMap(([field, value]) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.map((message) => `${field}: ${message}`);
  });
  return messages.join(" · ") || "Request failed.";
}
