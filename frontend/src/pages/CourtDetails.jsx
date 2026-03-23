import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Spin, Descriptions, Layout } from "antd";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const { Content } = Layout;

function CourtDetails({ setIsLoggedIn }) {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.API}/admin/courts/${id}/details`)
      .then((res) => res.json())
      .then((data) => setCourt(data.court))
      .catch((err) => console.error("Error fetching court:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar />

      <Layout style={{ marginLeft: 200 }}>
        <Header setIsLoggedIn={setIsLoggedIn} />

        <Content style={{ margin: "80px 20px 20px", overflowY: "auto" }}>
          {loading ? (
            <Card style={{ textAlign: "center", padding: 50 }}>
              <Spin size="large" />
            </Card>
          ) : court ? (
            <>
              <Card style={{ marginBottom: 20 }}>
                <Descriptions title="Court Details" bordered column={1}>
                  <Descriptions.Item label="Court Name">
                    {court.courtName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {court.courtDesc || "No description available"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {court.courtLocation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Readers">
                    {court.readers?.length || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Officers">
                    {court.officers?.length || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Documents">
                    {court.documents || 0}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <h3>Readers</h3>
              <Card style={{ marginBottom: 20 }}>
                <Table
                  columns={userColumns}
                  dataSource={court.readers || []}
                  rowKey="_id"
                  pagination={false}
                  locale={{ emptyText: "No readers assigned to this court" }}
                />
              </Card>

              <h3>Officers</h3>
              <Card>
                <Table
                  columns={userColumns}
                  dataSource={court.officers || []}
                  rowKey="_id"
                  pagination={false}
                  locale={{ emptyText: "No officers assigned to this court" }}
                />
              </Card>
            </>
          ) : (
            <Card style={{ textAlign: "center", padding: 50 }}>
              <p style={{ fontSize: 16 }}>Court not found</p>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default CourtDetails;
