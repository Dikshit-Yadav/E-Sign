import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Dropdown,
  Modal,
  Upload,
  Image,
  message,
} from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const DocumentTable = () => {
  const [docs, setDocs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
    fetchSignaturePreview();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("https://e-sign1.onrender.com/officer/documents", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("res", res);
      const data = await res.json();
      console.log("data", data)
      setDocs(data);
    } catch {
      message.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchSignaturePreview = async () => {
    try {
      const res = await fetch("https://e-sign1.onrender.com/officer/get-signature", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.signature) setPreview(`https://e-sign1.onrender.com${data.signature}`);
    } catch (err) {
      console.log(err.message)
    }
  };

  const handleReject = async (id) => {
    // console.log(id)
    await fetch(`https://e-sign1.onrender.com/documents/${id}/reject`, { method: "PUT" });
    message.success("Document rejected");
    fetchDocs();
  };

  const handleUploadSignature = async ({ file }) => {
    const formData = new FormData();
    formData.append("signature", file);
    setUploading(true);

    try {
      const res = await fetch("https://e-sign1.onrender.com/officer/upload-signature", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await res.json();
      if(!res.ok){
        throw new Error(result.message || "Upload failed");
      }
      setPreview(`https://e-sign1.onrender.com${result.signature}`);
      message.success("Signature uploaded successfully!");
    } catch (err) {
      message.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDispatchSignature = async () => {
    if (!selectedDoc) return;

    await fetch(`https://e-sign1.onrender.com/documents/${selectedDoc._id}/sign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature: preview }),
      credentials: "include",
    });

    message.success("Document signed successfully");
    setModalVisible(false);
    fetchDocs();
  };

  const handlePreview = (record) => {
    window.open(`https://e-sign1.onrender.com/documents/${record._id}/preview`, "_blank");
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
        const colors = {
          "pending-signature": "orange",
          signed: "green",
          rejected: "red",
        };
        return <Tag color={colors[status] || "blue"}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "1", label: "Read",
            onClick: () => handlePreview(record)
          },
          {
            key: "2", label: "Reject",
            disabled: record.status == "signed",
            onClick: () => handleReject(record._id)
          },
          {
            key: "3",
            label: "Dispatch Signature",
            disabled: record.status !== "pending-signature",
            onClick: () => openSignatureModal(record),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
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
      <Table
        dataSource={docs}
        columns={columns}
        rowKey={(record) => record._id || record.id}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

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
    </>
  );
};

export default DocumentTable;
