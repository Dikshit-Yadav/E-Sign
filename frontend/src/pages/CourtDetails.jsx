import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Card } from "antd";
import SideBar from "../components/SideBar";

function CourtDetails() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4500/admin/courts/${id}/details`)
      .then((res) => res.json())
      .then((data) => setCourt(data.court))
      .catch((err) => console.error("Error fetching court:", err));
  }, [id]);

  if (!court) return <p>Loading...</p>;

  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <main style={{ flex: 1, padding: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <h2>{court.courtName}</h2>
          <p>{court.courtDesc}</p>
          <p><b>Location:</b> {court.courtLocation}</p>
          <p><b>Readers:</b> {court.readers?.length || 0}</p>
          <p><b>Officers:</b> {court.officers?.length || 0}</p>
          <p><b>Documents:</b> {court.documents || 0}</p>
        </Card>

        <h3>Readers</h3>
        <Card style={{ marginBottom: 20 }}>
          <Table
            columns={userColumns}
            dataSource={court.readers || []}
            rowKey="_id"
            pagination={false}
          />
        </Card>

        <h3>Officers</h3>
        <Card>
          <Table
            columns={userColumns}
            dataSource={court.officers || []}
            rowKey="_id"
            pagination={false}
          />
        </Card>
      </main>
    </div>
  );
}

export default CourtDetails;
