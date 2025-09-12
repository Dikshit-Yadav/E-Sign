import React from 'react'
import { Modal, Form, Input, Button, message } from "antd";

function AddCourt({ open, onClose, onCourtAdded }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // console.log(values);
      const res = await fetch("http://localhost:4500/admin/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add court");

      message.success("Court added successfully!");
      onCourtAdded(data.court); 
      form.resetFields();
      onClose();
    } catch (err) {
      message.error(err.message || "Error adding court");
    }
  };

  return (
    <Modal title="Add New Court" open={open} onCancel={onClose} footer={null}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="courtName" label="Court Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="courtDesc" label="Court Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="courtLocation" label="Court Location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">Add Court</Button>
      </Form>
    </Modal>
  );
}


export default AddCourt