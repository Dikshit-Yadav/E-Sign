import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import ProtectedRoute from "./components/ProtectedRouteWrapper";
import Login from "./pages/Login";
import Home from "./pages/Home";
import OfficerHome from "./pages/OfficerHome";
import ReaderDashboard from "./pages/ReaderHome";
import CourtDetails from "./pages/CourtDetails";
import DocumentPreview from "./pages/DocumentPreview";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");

    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }

    setLoadingAuth(false);
  }, []);

  if (loadingAuth) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/login"
          element={
            isLoggedIn ? (
              role === "reader" ? (
                <Navigate to="/reader-dashboard" />
              ) : role === "officer" ? (
                <Navigate to="/officer-dashboard" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              role={role}
              loading={loadingAuth}
              allowedRoles={["admin"]}
            >
              <Home setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              role={role}
              loading={loadingAuth}
              allowedRoles={["officer"]}
            >
              <OfficerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reader-dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              role={role}
              loading={loadingAuth}
              allowedRoles={["reader"]}
            >
              <ReaderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courts/:id"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              role={role}
              loading={loadingAuth}
              allowedRoles={["admin"]}
            >
              <CourtDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id/preview"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              role={role}
              loading={loadingAuth}
              allowedRoles={["admin", "officer", "reader"]}
            >
              <DocumentPreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === "reader" ? (
                <Navigate to="/reader-dashboard" />
              ) : role === "officer" ? (
                <Navigate to="/officer-dashboard" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
