import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { createCourt } from "../services/courtServices";

function AddCourt({ open, onClose, onCourtAdded }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = await createCourt(values);
      message.success(
        "Court added successfully!"
      );
      onCourtAdded(data.court);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        error.message ||
        "Error adding court"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal title="Add New Court" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="courtName" label="Court Name" rules={[{ required: true, message: "Court name is required" }]}>
          <Input placeholder="Enter court name" />
        </Form.Item>

        <Form.Item name="courtDesc" label="Court Description">
          <Input.TextArea placeholder="Optional description..." />
        </Form.Item>

        <Form.Item name="courtLocation" label="Court Location" rules={[{ required: true, message: "Court location is required" }]}>
          <Input placeholder="Enter court location" />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Court
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddCourt;
