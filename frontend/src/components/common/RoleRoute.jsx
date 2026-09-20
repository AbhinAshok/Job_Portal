import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleRoute({ role }) {
  const { role: currentRole } = useAuth();
  if (currentRole !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
