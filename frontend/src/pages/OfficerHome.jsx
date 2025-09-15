import React, { useEffect, useState } from "react";
import  Header  from "../components/Header";
import  OfficerSidebar  from "../components/officer/OfficerSidebar";
import {
  Table,
  Upload,
  Button,
  message,
  Tag,
  Image,
  Dropdown,
  Modal,
} from "antd";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const OfficerHome = () => {
  const [docs, setDocs] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
 const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    fetchDocs();
    fetchSignaturePreview();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:4500/officer/documents", {
        credentials: "include",
      });
      const data = await res.json();
        console.log("Fetched officer docs:", data);
      setDocs(data);
    } catch (err) {
      console.error("Error fetching officer docs:", err);
      message.error("Failed to load documents");
    }
  };

  const fetchSignaturePreview = async () => {
    try {
      const res = await fetch("http://localhost:4500/officer/get-signature", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.signature) {
          setPreview(`http://localhost:4500${data.signature}`);
        }
      }
    } catch (err) {
      console.warn("No signature found");
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:4500/documents/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      message.success("Document rejected");
      fetchDocs();
    } catch (err) {
      message.error("Failed to reject document");
    }
  };

  const handleUploadSignature = async ({ file }) => {
    const formData = new FormData();
    formData.append("signature", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:4500/officer/upload-signature", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      message.success("Signature uploaded successfully!");
      setPreview(`http://localhost:4500${result.signature}`);
    } catch (err) {
      message.error(err.message);
    } finally {
      setUploading(false);
    }
  };

const handleDispatchSignature = async () => {
  if (!selectedDoc) return;
  try {
    const res = await fetch(
      `http://localhost:4500/documents/${selectedDoc._id}/sign`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: preview,
        }),
        credentials: "include",
      }
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    message.success("Document signed successfully");
    setModalVisible(false);
    fetchDocs();
  } catch (err) {
    message.error("Failed to sign document");
  }
};


const handlePreview = (record) => {
  console.log("Preview record:", record);
  window.open(`http://localhost:4500/documents/${record._id}/preview`, "_blank");
};


  const openSignatureModal = (record) => {
    setSelectedDoc(record);
    setModalVisible(true);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "No. of Docs", dataIndex: "numberOfDocuments", key: "numberOfDocuments" },
    { title: "Rejected Docs", dataIndex: "rejectedDocuments", key: "rejectedDocuments" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Last Activity",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "pending-signature"
            ? "orange"
            : status === "signed"
              ? "green"
              : status === "rejected"
                ? "red"
                : "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: "Read",
            onClick: () => handlePreview(record),
          },
          {
            key: "2",
            label: "Reject",
            onClick: () => handleReject(record),
          },
          {
            key: "3",
            label: "Dispatch Signature",
            disabled: record.status !== "pending-signature",
            onClick: () => openSignatureModal(record),
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
    <Header setIsLoggedIn={setIsLoggedIn}/>

<div style={{display:"flex"}}>
    <OfficerSidebar />
      <div style={{ padding: "20px" ,width: "100%" }}>
        <Table 
          dataSource={docs}
          columns={columns}
         rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        title="Dispatch Signature"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleDispatchSignature}
        okText="Confirm & Sign"
        okButtonProps={{ disabled: !preview }}
      >
        {preview ? (
          <>
            <p>Selected Signature:</p>
            <Image width={200} src={preview} style={{ marginBottom: 10 }} />
          </>
        ) : (
          <>
            <p style={{ color: "red" }}>No signature found. Please upload one:</p>
            <Upload
              maxCount={1}
              customRequest={handleUploadSignature}
              showUploadList={false}
              accept="image/png,image/jpeg"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? "Uploading..." : "Upload Signature"}
              </Button>
            </Upload>
          </>
        )}
      </Modal>
      </div>
    </>
  );
};

export default OfficerHome;
