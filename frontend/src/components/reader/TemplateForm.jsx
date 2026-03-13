import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";

const TemplateForm = ({ visible, onCancel, onOk, form, selectedTitle }) => {
  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  return (
    <Modal
      title={`Enter Details for ${selectedTitle}`}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="customerName"
          label="Customer Name(s)"
          rules={[{ required: true, message: "Enter at least one customer name" }]}
        >
          <Input.TextArea placeholder="Enter names, comma separated" autoSize />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount(s)"
          rules={[
            { required: true },
            {
              pattern: /^(\d+(\.\d+)?)(,\s*\d+(\.\d+)?)*$/,
              message: "Enter valid numbers, comma separated",
            },
          ]}
        >
          <Input placeholder="Enter amounts, comma separated" />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date(s)"
          rules={[
            { required: true },
            {
              pattern: /^\d{4}-\d{2}-\d{2}(,\s*\d{4}-\d{2}-\d{2})*$/,
              message: "Dates must be in YYYY-MM-DD format",
            },
          ]}
        >
          <Input placeholder="YYYY-MM-DD, comma separated" />
        </Form.Item>

        <Form.Item name="address" label="Address(es)" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Enter addresses, comma separated" autoSize />
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
