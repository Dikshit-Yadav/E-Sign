import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import CourtDetails from "./pages/CourtDetails";
import AddUserCourt from "./pages/AddUserCourt";
import ReaderDashboard from "./pages/ReaderHome";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

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
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/login"
          element={
            isLoggedIn
              ? role === "reader"
                ? <Navigate to="/reader-dashboard" />
                : role === "officer"
                ? <Navigate to="/officer-dashboard" />
                : <Navigate to="/home" />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn && role === "admin"
              ? <Home setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/auth/login" />
          }
        />

       

       
        <Route path="/courts/:id" element={<CourtDetails />} />
        <Route path="/courts/:id/add-user" element={<AddUserCourt />} />

        <Route
          path="/reader-dashboard"
          element={
            isLoggedIn && role === "reader"
              ? <ReaderDashboard />
              : <Navigate to="/auth/login" />
          }
        />


        <Route
          path="/"
          element={
            isLoggedIn
              ? role === "reader"
                ? <Navigate to="/reader-dashboard" />
                : role === "officer"
                ? <Navigate to="/officer-dashboard" />
                : <Navigate to="/home" />
              : <Navigate to="/auth/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


