import React, { useCallback, useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Typography, Space, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getUserById } from "../services/userService";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const userId = JSON.parse(sessionStorage.getItem("user"));
  //  console.log(userId)
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const data = await getUserById(userId);

        setUserName(data?.name || "User");
      } catch (error) {
        console.error(error);
        setUserName("User");
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();

      sessionStorage.removeItem("user");

      setIsLoggedIn(false);

      message.success("Logged out successfully");

      navigate("/auth/login", { replace: true });

    } catch (error) {
      message.error("Server error while logging out");
    }
  }, [setIsLoggedIn, navigate]);


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
