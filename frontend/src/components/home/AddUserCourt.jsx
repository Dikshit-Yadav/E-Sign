import { useState, useEffect, useCallback, useMemo } from "react";
import { throttle } from "lodash";
import { Modal, Input, Select, Button, Form, message } from "antd";
import { UserOutlined, SafetyOutlined, ReadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddUserCourtModal = ({ isOpen, setIsOpen, courtId, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const request = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.API}/admin/courts/${courtId}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const result = await res.json();

      if (res.ok) {
        message.success(`${values.role} created & assigned successfully`);
        form.resetFields();
        onUserAdded && onUserAdded();
        setIsOpen(false);
      } else {
        message.error(result.message || "Error assigning user");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error while assigning user");
    } finally {
      setLoading(false);
    }
  };

  const throttleSubmit = useMemo(
    () =>
      throttle((values) => {
        request(values);
      }, 2000, { trailing: false }),
    [courtId]
  );

  const handleSubmit = useCallback(
    (values)=> {
      throttleSubmit(values);
    }, [throttleSubmit]
  );


  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      throttleSubmit.cancel();
    }
  }, [isOpen]);

  return (
    <Modal
      title="Create & Assign User"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        requiredMark={true}
        initialValues={{ role: null }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Option value="officer">
              <SafetyOutlined style={{ marginRight: 5 }} /> Officer
            </Option>
            <Option value="reader">
              <ReadOutlined style={{ marginRight: 5 }} /> Reader
            </Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Create & Assign
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserCourtModal;
