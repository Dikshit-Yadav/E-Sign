import { Button } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("role");
    localStorage.clear();
    navigate("/auth/login");
    window.location.reload();
  };

  return (
    <Button type="primary" danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
