import { Button } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("role");
    navigate("/auth/login");
  };

  return (
    <Button type="primary" danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
