import { Button } from "antd";
import Cookies from "js-cookie";

function LogoutButton() {
  const handleLogout = () => {
    sessionStorage.clear()
    window.location.href = "/auth/login"
  };

  return (
    <Button type="primary" danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;