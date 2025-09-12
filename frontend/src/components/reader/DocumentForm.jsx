import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Typography,
  message,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
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
// console.log(formData)
    try {
      setSubmitLoading(true);
      // console.log(setSubmitLoading);
      await fetch("http://localhost:4500/documents", {
        method: "POST",
        body: formData,
      });

      

      message.success("Document request created!");
      setModalOpen(false);
      form.resetFields();
      fetchDocs();
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
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
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
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Request Description">
          <Input.TextArea />
        </Form.Item>
        <div style={{ marginBottom: 15 }}>
          <Text type="secondary">
            <b>Note:</b> {"{Case Id}, {Address}, {Signature}, {Delegation Message}, {QR Code}"} must be present in the template file. {"{Court}, {Reference Number}"} are optional.
          </Text>
          <br />
          <a
            href="http://localhost:4500/documents/templates/invoice.docx"
            download
            style={{ display: "inline-block", marginTop: 5 }}
          >
          </a>
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
