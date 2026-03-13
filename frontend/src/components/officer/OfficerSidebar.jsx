import React from "react";
import { Menu, Layout } from "antd";
import {
  DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "/officer-dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/home"),
    },
  ];

  return (
    <Sider
      width={200}
      style={{
        background: "#001529",
        height: "100vh",
        marginTop:65,
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
      />
    </Sider>
  );
};

export default SideBar;
