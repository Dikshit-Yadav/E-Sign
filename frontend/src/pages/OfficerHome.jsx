import React, { useState } from "react";
import { Layout } from "antd";
import Header from "../components/Header";
import OfficerSidebar from "../components/officer/OfficerSidebar";
import DocumentTable from "../components/officer/DocumentTable";

const { Content } = Layout;

const OfficerHome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OfficerSidebar />

      <Layout style={{ marginLeft: 200 }}>
        <Header setIsLoggedIn={setIsLoggedIn} />

        <Content style={{ margin: "80px 20px 20px", overflowY: "auto" }}>
          <DocumentTable />
        </Content>
      </Layout>
    </Layout>
  );
};

export default OfficerHome;
