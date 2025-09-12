import { useParams } from "react-router-dom";
import { Input, Select, Button, message } from "antd";
import { useState } from "react";

const { Option } = Select;

const AddUserCourt = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      message.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4500/admin/courts/${id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        message.success(`${formData.role} created & assigned successfully`);
        setFormData({ name: "", email: "", password: "", role: "" });
        window.dispatchEvent(new Event("courtsUpdated"));
      } else {
        message.error(result.message || "Error assigning user");
      }
    } catch (err) {
      message.error("Server error while assigning user");
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Create & Assign User</h2>
      <p><b>Court ID:</b> {id}</p>

      <div style={{ marginBottom: 10 }}>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <Input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <Input.Password
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <Select
          placeholder="Select role"
          style={{ width: "100%" }}
          value={formData.role}
          onChange={(value) => handleChange("role", value)}
        >
          <Option value="officer">Officer</Option>
          <Option value="reader">Reader</Option>
        </Select>
      </div>

      <Button type="primary" block onClick={handleSubmit}>
        Create & Assign
      </Button>
    </div>
  );
};

export default AddUserCourt;
