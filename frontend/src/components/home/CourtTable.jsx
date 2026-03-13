import { useState, useMemo } from "react";
import { Table, Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import CourtActions from "./CourtActions";

const { Option } = Select;

const CourtTable = ({ courts, onAddUser, onDetails, onRemove }) => {
  const [searchText, setSearchText] = useState("");
  const [officerFilter, setOfficerFilter] = useState(null);

  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      const matchesSearch = court.courtName
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesOfficerFilter =
        officerFilter === null ||
        (officerFilter === "0" && court.officers === 0) ||
        (officerFilter === "1-5" && court.officers > 0 && court.officers <= 5) ||
        (officerFilter === "5+" && court.officers > 5);

      return matchesSearch && matchesOfficerFilter;
    });
  }, [courts, searchText, officerFilter]);

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
      width: 70,
      align: "center",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Court Name",
      dataIndex: "courtName",
      key: "courtName",
      sorter: (a, b) => a.courtName.localeCompare(b.courtName),
    },
    {
      title: "Officers",
      dataIndex: "officers",
      key: "officers",
      align: "right",
      sorter: (a, b) => a.officers - b.officers,
    },
    {
      title: "Readers",
      dataIndex: "readers",
      key: "readers",
      align: "right",
      sorter: (a, b) => a.readers - b.readers,
    },
    {
      title: "Documents Signed",
      dataIndex: "documents",
      key: "documents",
      align: "right",
      sorter: (a, b) => a.documents - b.documents,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <CourtActions
          record={record}
          onAddUser={onAddUser}
          onDetails={onDetails}
          onRemove={onRemove}
        />
      ),
    },
  ];

  const clearFilters = () => {
    setSearchText("");
    setOfficerFilter(null);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by court name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

        <Select
          placeholder="Filter by officers"
          value={officerFilter}
          onChange={setOfficerFilter}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="0">No Officers</Option>
          <Option value="1-5">1 - 5 Officers</Option>
          <Option value="5+">More than 5</Option>
        </Select>

        <Button onClick={clearFilters} icon={<ReloadOutlined />}>
          Reset
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredCourts}
        rowKey="_id"
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"
        }
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default CourtTable;
