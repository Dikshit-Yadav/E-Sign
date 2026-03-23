import { useState, useEffect, useMemo } from "react";
import { Table, Input, Select, Button, Space, message, Tag } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { throttle } from "lodash";
const { Option } = Select;

const roleColors = {
  admin: "red",
  officer: "blue",
  reader: "green",
};

const UserTable = ({ type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState(type || null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/admin/users?role=${type}`);
      const data = await res.json();
      setUsers(data);
      message.success("Users loaded successfully");
    } catch (err) {
      console.error("Error fetching users:", err);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const throttleFetchUsers = useMemo(
      ()=>{
        throttle(fetchUsers, 2000, {trailing: false}), [fetchUsers]
      }
    );
  useEffect(() => {
    fetchUsers();
  }, [type]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchText, roleFilter]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Officer", value: "officer" },
        { text: "Reader", value: "reader" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => <Tag color={roleColors[role] || "gray"}>{role.toUpperCase()}</Tag>,
    },
  ];

  const clearFilters = () => {
    setSearchText("");
    setRoleFilter(type || null);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

        <Select
          placeholder="Filter by role"
          value={roleFilter}
          onChange={setRoleFilter}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="officer">Officer</Option>
          <Option value="reader">Reader</Option>
        </Select>

        <Button onClick={clearFilters}>Reset</Button>
        <Button onClick={throttleFetchUsers} icon={<ReloadOutlined />} loading={loading}>
          Refresh
        </Button>
      </Space>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"
        }
      />
    </div>
  );
};

export default UserTable;
