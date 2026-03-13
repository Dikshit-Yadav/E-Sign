import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

function ReaderSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/reader-dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  ];

  return (
    <Sider
      width={200}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#001529",
        color: "#fff",
        paddingTop: 20,
      }}
    >
      <div style={{ color: "#fff", fontSize: 18, textAlign: "center", marginBottom: 20 }}>
        Reader Panel
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={(item) => navigate(item.key)}
        items={menuItems.map((i) => ({ key: i.key, icon: i.icon, label: i.label }))}
      />
    </Sider>
  );
}

export default ReaderSidebar;
