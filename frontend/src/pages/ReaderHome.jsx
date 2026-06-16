import React, { useState, useEffect } from "react";
import { Button, message, Layout } from "antd";
import { getDocuments } from "../services/documentServices"; import DocumentTable from "../components/reader/DocumentTable";
import DocumentForm from "../components/reader/DocumentForm";
import ReaderSidebar from "../components/reader/ReaderSidebar";
import Header from "../components/Header";

const { Content } = Layout;

function ReaderDashboard() {
  const [docs, setDocs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDocs = async () => {
    const userId = JSON.parse(
      sessionStorage.getItem("user")
    );

    if (!userId) {
      message.error(
        "Missing user. Please login again."
      );
      return;
    }

    try {
      const data = await getDocuments(userId);

      setDocs(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        "Could not load documents"
      );
    }
  };
  useEffect(() => {
    fetchDocs();
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ReaderSidebar />

      <Layout style={{ marginLeft: 200 }}>
        <Header setIsLoggedIn={setIsLoggedIn} />

        <Content style={{ margin: "80px 20px 20px", overflowY: "auto" }}>
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => setModalOpen(true)}
          >
            New Request
          </Button>

          <DocumentTable docs={docs} refreshDocs={fetchDocs} />

          <DocumentForm
            modelOpen={modalOpen}
            setModalOpen={setModalOpen}
            fetchDocs={fetchDocs}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default ReaderDashboard;
