import React, { useCallback, useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Typography, Space, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (token && userId) {
      fetch(`http://localhost:4500/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserName(data?.name || "User"))
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setUserName("User");
        });
    }
  }, []);

  const handleLogout = useCallback(async () => {
  try {
    const res = await fetch("http://localhost:4500/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("userId");

      setIsLoggedIn(false);
      message.success("Logged out successfully");
      navigate("/auth/login");
    } else {
      message.error("Failed to log out");
    }
  } catch (err) {
    console.error("Logout error:", err);
    message.error("Server error while logging out");
  }
}, [navigate, setIsLoggedIn]);

  const menuItems = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 64,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1001, 
      }}
    >
      <Text strong style={{ fontSize: 20 }}>
        Document Sign
      </Text>

      <Space size="middle">
        <Text>{userName || "Loading..."}</Text>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Header;
