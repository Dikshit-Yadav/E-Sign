import { useState, useMemo, useEffect } from "react";
import { throttle } from "lodash";

import { Table, Button, Tag, Space, Input, DatePicker, message } from "antd";
import { ReloadOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;

const statusColors = {
  pending: "orange",
  signed: "green",
  rejected: "red",
};

const DocumentTable = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);


  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4500/admin/documents");
      const data = await res.json();
      setDocs(data);
      message.success("Documents loaded successfully");
    } catch (err) {
      console.error("Error fetching documents:", err);
      message.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const throttleFetchDocs = useMemo(
    ()=>{
      throttle(fetchDocs, 2000, {trailing: false}), [fetchDocs]
    }
  );
  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        !statusFilter || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [docs, searchText, statusFilter]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Signed", value: "signed" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={statusColors[status] || "blue"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (val) => moment(val).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setDateRange([]);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by title"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

        <Input
          placeholder="Filter by status"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 150 }}
          list="status-options"
        />
        <datalist id="status-options">
          <option value="pending" />
          <option value="signed" />
          <option value="rejected" />
        </datalist>

        <Button icon={<ReloadOutlined />} onClick={clearFilters}>
          Reset
        </Button>
        <Button icon={<ReloadOutlined />} onClick={throttleFetchDocs} loading={loading}>
          Refresh
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredDocs}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0
            ? "bg-gray-50 hover:bg-gray-100"
            : "hover:bg-gray-100"
        }
      />
    </div>
  );
};

export default DocumentTable;
