import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteWrapper = ({ allowedRoles }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API}/auth/isme`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.isauthenticate) {
          setUser(data.user);
          sessionStorage.setItem("user", JSON.stringify(data.user._id));
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading || user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}-dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteWrapper;