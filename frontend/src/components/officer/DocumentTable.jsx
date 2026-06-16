import React, { useEffect, useState } from "react";
import {Table,Button,Tag,Dropdown,Modal,Upload,Image,message,
} from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {getOfficerDocuments,getSignature,uploadSignature,
} from "../../services/officerService";
import {rejectDocument,signDocument,
} from "../../services/documentServices";


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
    setLoading(true);

    try {
      const data =
        await getOfficerDocuments();

      setDocs(data);
    } catch {
      message.error(
        "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSignaturePreview =
    async () => {
      try {
        const data =
          await getSignature();

        if (data.signature) {
          setPreview(
            `${import.meta.env.VITE_API}${data.signature}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const handleReject = async (id) => {
    try {
      await rejectDocument(id);

      message.success(
        "Document rejected"
      );

      fetchDocs();
    } catch {
      message.error(
        "Failed to reject document"
      );
    }
  };

  const handleUploadSignature = async ({
    file,
  }) => {
    setUploading(true);

    try {
      const result =
        await uploadSignature(file);

      setPreview(
        `${import.meta.env.VITE_API}${result.signature}`
      );

      message.success(
        "Signature uploaded successfully!"
      );
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDispatchSignature =
    async () => {
      if (!selectedDoc) return;

      try {
        await signDocument(
          selectedDoc._id,
          preview
        );

        message.success(
          "Document signed successfully"
        );

        setModalVisible(false);

        fetchDocs();
      } catch {
        message.error(
          "Failed to sign document"
        );
      }
    };

  const handlePreview = (record) => {
    window.open(`${import.meta.env.VITE_API}/documents/${record._id}/preview`, "_blank");
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
