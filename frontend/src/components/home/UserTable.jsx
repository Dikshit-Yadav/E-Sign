import { Table } from "antd";
import { useEffect, useState } from "react";

const UserTable = ({ type }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4500/admin/users?role=${type}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, [type]);

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
  ];

  return <Table dataSource={users} columns={columns} rowKey="_id" />;
};

export default UserTable;
