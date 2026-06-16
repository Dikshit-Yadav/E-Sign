import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = ({ setIsLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return message.error("All fields are required!");
    }

    setLoading(true);

    try {
      const result = await login(formData);

      const role = result.user?.role;

      message.success("Login successful!");

      switch (role) {
        case "admin":
          navigate("/home", { replace: true });
          break;

        case "officer":
          navigate("/officer-dashboard", { replace: true });
          break;

        case "reader":
          navigate("/reader-dashboard", { replace: true });
          break;

        default:
          navigate("/", { replace: true });
      }

      setIsLoggedIn(true);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
 .container {
   width: 350px;
   margin: 100px auto;
   padding: 20px;
   border: 1px solid #ddd;
   border-radius: 8px;
   text-align: center;
 }
 .form {
   display: flex;
   flex-direction: column;
 }
 .input {
   margin-bottom: 15px;
   padding: 8px;
   font-size: 14px;
   border-radius: 4px;
   border: 1px solid #ccc;
 }
 `}</style>
      <div className="container">
        <h2 style={{ marginBottom: 20 }}>Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="input"
          />
          <Input.Password
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="input"
          />

          <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 10 }}>
            Login
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
