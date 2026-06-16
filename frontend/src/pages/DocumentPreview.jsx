import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message } from "antd";
import { getDocumentPreview } from "../services/documentServices";

const DocumentPreview = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);

      const data = await getDocumentPreview(id);

      setDoc(data);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch document"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spin
        style={{
          display: "block",
          marginTop: 100,
        }}
      />
    );
  }

  if (!doc) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 50,
        }}
      >
        Document not found
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      <Card title={doc.title}>
        <p>
          <strong>Description:</strong> {doc.description}
        </p>

        <p>
          <strong>Status:</strong> {doc.status}
        </p>

        <p>
          <strong>Created By:</strong>{" "}
          {doc.createdBy?.email}
        </p>

        <h3>Templates</h3>

        {doc.templates?.length > 0 ? (
          <ul>
            {doc.templates.map((t, i) => (
              <li key={i}>
                <strong>{t.caseId}</strong> — {t.customer}
                {" | "}
                {t.date}
                {" | "}
                ₹{t.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No template data available.</p>
        )}
      </Card>
    </div>
  );
};

export default DocumentPreview;