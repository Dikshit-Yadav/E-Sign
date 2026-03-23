import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Text } = Typography;

const DocumentForm = ({ modelOpen, setModalOpen, fetchDocs }) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (values) => {
    const userId = Cookies.get("userId");
    if (!userId) {
      message.error("Missing user. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("createdBy", userId);

    try {
      setSubmitLoading(true);
      const res = await fetch(`${import.meta.env.API}/documents`, {
        method: "POST",
        body: formData,
      });

      if(res.ok){
      message.success("Document request created!");
      fetchDocs();
      setModalOpen(false);
      form.resetFields();
      //  window.location.reload();
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Network error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Request"
      open={modelOpen}
      onCancel={() => setModalOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        validateTrigger="onBlur"
        onFinishFailed={({ errorFields }) => {
          if (errorFields?.length) {
            message.error(errorFields[0].errors?.[0] || "Please fix the errors");
          }
        }}
      >
        <Form.Item
          name="title"
          label="Request Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter title for the document request" />
        </Form.Item>

        <Form.Item name="description" label="Request Description">
          <Input.TextArea
            placeholder="Enter details about this document request"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <div
          style={{
            marginBottom: 15,
            background: "#fafafa",
            padding: "10px 12px",
            borderRadius: 6,
          }}
        >
          <Text type="secondary">
            <b>Note:</b> {"{Case Id}, {Address}, {Signature}, {Delegation Message}, {QR Code}"} must be
            present in the template file. {"{Court}, {Reference Number}"} are optional.
          </Text>
          <br />
        </div>

        <div style={{ textAlign: "right" }}>
          <Button onClick={() => setModalOpen(false)} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DocumentForm;
