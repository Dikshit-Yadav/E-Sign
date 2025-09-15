import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import DocumentTable from "../components/reader/DocumentTable";
import DocumentForm from "../components/reader/DocumentForm";
import ReaderSidebar from "../components/reader/ReaderSidebar";
import Header  from "../components/Header";

function ReaderDashboard() {
  const [docs, setDocs] = useState([]);
   const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [modelOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:4500/documents");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      // console.error("Error documents:", err);
      message.error("Could not load documents");
    }
  };

  return (
  <>
    < Header setIsLoggedIn={setIsLoggedIn}/>
    <div style={{display: "flex"}}>
    <ReaderSidebar/>
    <div style={{ padding: 20, width: "100vw" }}>

      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => setModalOpen(true)}
      >
        New Request
      </Button>

      <DocumentTable docs={docs} />

      <DocumentForm
        modelOpen={modelOpen}
        setModalOpen={setModalOpen}
        fetchDocs={fetchDocs}
      />
    </div>
    </div>
    </>
  );
}

export default ReaderDashboard;
