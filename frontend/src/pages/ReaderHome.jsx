import React, { useState, useEffect } from "react";
import { Button, message, Layout } from "antd";
import Cookies from "js-cookie";
import DocumentTable from "../components/reader/DocumentTable";
import DocumentForm from "../components/reader/DocumentForm";
import ReaderSidebar from "../components/reader/ReaderSidebar";
import Header from "../components/Header";

const { Content } = Layout;

function ReaderDashboard() {
  const [docs, setDocs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // const fetchDocs = async () => {
  //   try {
  //     const res = await fetch("http://localhost:4502/documents");
  //     const data = await res.json();
  //     setDocs(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     message.error("Could not load documents");
  //   }
  // };
  const fetchDocs = async () => {
  const userId = Cookies.get("userId");
  if (!userId) {
    message.error("Missing user. Please login again.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:4500/documents?userId=${userId}`);
    const data = await res.json();
    setDocs(Array.isArray(data) ? data : []);
  } catch (err) {
    message.error("Could not load documents");
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

          <DocumentTable docs={docs} refreshDocs={fetchDocs}/>

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
