import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { createDocument } from "../../services/documentServices";

const { Text } = Typography;

const DocumentForm = ({ modelOpen, setModalOpen, fetchDocs }) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (values) => {
  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  const userId = user?._id;

  if (!userId) {
    message.error(
      "Missing user. Please login again."
    );
    return;
  }

  try {
    setSubmitLoading(true);

    await createDocument({
      title: values.title,
      description: values.description,
      createdBy: userId,
    });

    message.success(
      "Document request created!"
    );

    fetchDocs();

    setModalOpen(false);

    form.resetFields();
  } catch (error) {
    message.error(
      error.response?.data?.message ||
      error.message ||
      "Failed to create document"
    );
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