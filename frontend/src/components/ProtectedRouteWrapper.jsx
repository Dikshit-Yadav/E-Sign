import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRouteWrapper = ({ children, allowedRoles, loading, isLoggedIn, role }) => {
  const token = Cookies.get("token");

  if (loading) return <div>Loading...</div>; 

  if (!token || !isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/home" replace />;
    if (role === "officer") return <Navigate to="/officer-dashboard" replace />;
    if (role === "reader") return <Navigate to="/reader-dashboard" replace />;
  }

  return children;
};

export default ProtectedRouteWrapper;
