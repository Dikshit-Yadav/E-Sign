import { useState, useEffect, useCallback, useMemo } from "react";
import { throttle } from "lodash";
import { Modal, Input, Select, Button, Form, message } from "antd";
import { UserOutlined, SafetyOutlined, ReadOutlined } from "@ant-design/icons";
import { assignUserToCourt } from "../../services/courtServices";

const { Option } = Select;

const AddUserCourtModal = ({ isOpen, setIsOpen, courtId, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const request = async (values) => {
    setLoading(true);

    try {
      await assignUserToCourt(
        courtId,
        values
      );

      message.success(
        `${values.role} created & assigned successfully`
      );

      form.resetFields();

      onUserAdded?.();

      setIsOpen(false);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        "Error assigning user"
      );
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
    (values) => {
      throttleSubmit(values);
    }, [throttleSubmit]
  );


  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      throttleSubmit.cancel();
    }

    return () => throttleSubmit.cancel();
  }, [isOpen, form, throttleSubmit]);

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
