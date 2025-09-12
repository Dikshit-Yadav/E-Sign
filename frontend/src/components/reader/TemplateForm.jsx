import React from "react";
import { Modal, Form, Input, DatePicker } from "antd";

const TemplateForm = ({
  visible,
  onCancel,
  onOk,
  form,
  selectedTitle,
}) => {
  return (
    <Modal
      title={`Enter Details for ${selectedTitle}`}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="customerName"
          label="Customer Name(s)"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter names, comma separated" />
        </Form.Item>
        <Form.Item name="amount" label="Amount(s)" rules={[{ required: true }]}>
          <Input placeholder="Enter amounts, comma separated" />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date(s)" rules={[{ required: true }]}>
          <Input placeholder="YYYY-MM-DD, comma separated" />
        </Form.Item>
        <Form.Item name="address" label="Address(es)" rules={[{ required: true }]}>
          <Input placeholder="Enter addresses, comma separated" />
        </Form.Item>
        <Form.Item name="court" label="Court(s)" rules={[{ required: true }]}>
          <Input placeholder="Enter courts, comma separated" />
        </Form.Item>
        <Form.Item name="caseId" label="Case ID(s)" rules={[{ required: true }]}>
          <Input placeholder="Enter case IDs, comma separated" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateForm;
