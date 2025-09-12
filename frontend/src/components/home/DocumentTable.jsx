import { Table, Button } from "antd";
import { useEffect, useState } from "react";

const DocumentTable = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4500/documents")
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error("Error fetching documents:", err));
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val) => new Date(val).toLocaleString(),
    },
    // {
    //   title: "Action",
    //   render: (_, record) =>
    //     record.fileUrl ? (
    //       <Button type="link" onClick={() => window.open(`http://localhost:4500${record.fileUrl}`, "_blank")}>
    //         View
    //       </Button>
    //     ) : "No File",
    // },
  ];

  return <Table dataSource={docs} columns={columns} rowKey="_id" />;
};

export default DocumentTable;
