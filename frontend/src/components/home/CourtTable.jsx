import { Table } from "antd";
import CourtActions from "./CourtActions";

const CourtTable = ({ courts, onAddUser, onDetails, onRemove }) => {
  const columns = [
    { title: "No.", dataIndex: "key", key: "key" },
    { title: "Court Name", dataIndex: "courtName", key: "courtName" },
    { title: "Officers", dataIndex: "officers", key: "officers" },
    { title: "Readers", dataIndex: "readers", key: "readers" },
    { title: "Documents Signed", dataIndex: "documents", key: "documents" },
    {
      title: "Actions",
      key: "actions",
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

  return <Table columns={columns} dataSource={courts} rowKey="_id" pagination={false} />;
};

export default CourtTable;
