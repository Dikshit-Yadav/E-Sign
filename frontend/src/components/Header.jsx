import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "antd";
import "../style/header.css";

function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (token && userId) {
      fetch(`http://localhost:4500/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) {
            setUserName(data.name);
          } else {
            setUserName("User");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("userId");
    setIsLoggedIn(false);
    navigate("/auth/login");
  }, [navigate, setIsLoggedIn]);

  return (
    <header className="header">
      <h2 className="header-title">Document Sign</h2>
      <div className="header-right">
        <span className="user-name">
          {userName ? `${userName}` : "Loading..."}
        </span>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
        <i className="fa-regular fa-circle-user avatar-icon"></i>
      </div>
    </header>
  );
}

export default Header;
