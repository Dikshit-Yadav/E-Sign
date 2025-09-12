// import React, { useState } from "react";
// import { Input, Button, message } from "antd";

// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// const Login = ({setIsLoggedIn}) => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: ""
//   });

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();
//     if (!formData.email || !formData.password || !formData.role) {
//       return message.error("All fields are required!");
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:4500/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         message.error(result.message || "Login failed");
//         return;
//       }

//       message.success("Login successful!");
// // console.log("User:", result.user);

// Cookies.set("token", result.token, {
//   expires: 1,
//   secure: true,
//   sameSite: "Strict",
// });
// Cookies.set("role", result.user.role, { expires: 1 });
// Cookies.set("userId", result.user.id, { expires: 1 });

// setIsLoggedIn(true);

// if (result.user.role === "reader") {
//   navigate("/reader-dashboard");
// } else if (result.user.role === "officer") {
//   navigate("/officer-dashboard");
// } else {
//   navigate("/home");
// }

//     } catch (err) {
//       message.error(err.message || "Login error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//     <style>{`
//   .container {
//     width: 350px;
//     margin: 100px auto;
//     padding: 20px;
//     border: 1px solid #ddd;
//     border-radius: 8px;
//     text-align: center;
//   }
//   .form {
//     display: flex;
//     flex-direction: column;
//   }
//   .input {
//     margin-bottom: 15px;
//     padding: 8px;
//     font-size: 14px;
//     border-radius: 4px;
//     border: 1px solid #ccc;
//   }
// `}</style>
//     <div className="container">
//       <h2 style={{ marginBottom: 20 }}>Login</h2>
//       <form onSubmit={handleSubmit} className="form">
//         <Input
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//           className="input"
//         />
//         <Input.Password
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => handleChange("password", e.target.value)}
//           className="input"
//         />

//         <select
//           value={formData.role}
//           onChange={(e) => handleChange("role", e.target.value)}
//           className="input"
//         >
//           <option value="">Select Role</option>
//           <option value="admin">Admin</option>
//           <option value="officer">Officer</option>
//           <option value="reader">Reader</option>
//         </select>

//         <Button
//           type="primary"
//           htmlType="submit"
//           loading={loading}
//           block
//           style={{ marginTop: 10 }}
//         >
//           Login
//         </Button>
//       </form>
//     </div>
//     </>
//   );
// };



// export default Login;



import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
    if (!formData.email || !formData.password || !formData.role) {
      return message.error("All fields are required!");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4500/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        message.error(result.message || "Login failed");
        return;
      }

      message.success("Login successful!");

      Cookies.set("token", result.token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("role", result.user.role, { expires: 1 });
      Cookies.set("userId", result.user.id, { expires: 1 });

      setIsLoggedIn(true);

      setTimeout(() => {
        if (result.user.role === "reader") {
          navigate("/reader-dashboard");
        } else if (result.user.role === "officer") {
          navigate("/officer-dashboard");
        } else {
          navigate("/home");
        }
      }, 50); 
    } catch (err) {
      message.error(err.message || "Login error");
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
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="input"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
            <option value="reader">Reader</option>
          </select>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 10 }}>
            Login
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
