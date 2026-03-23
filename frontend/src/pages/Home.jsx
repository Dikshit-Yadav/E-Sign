import React, { useState, useEffect } from "react";
import { Layout, Button, Divider, Typography, Input, Table, Space, Modal, Descriptions } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import SideBar from "../components/SideBar";
import Header from "../components/Header";
import CourtStats from "../components/home/CourtStatus";
import CourtTable from "../components/home/CourtTable";
import UserTable from "../components/home/UserTable";
import DocumentTable from "../components/home/DocumentTable";
import CourtModals from "../components/home/CourtModals";
import AddUserCourt from "../components/home/AddUserCourt";

const { Content } = Layout;
const { Title } = Typography;

const Home = ({ setIsLoggedIn }) => {
  const [isCourtModalOpen, setCourtModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [isActive, setIsActive] = useState("courts");
  const [selectedCourtId, setSelectedCourtId] = useState(null);

  // Court Details modal
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCourtDetails, setSelectedCourtDetails] = useState(null);

  const handleAddUser = (court) => {
    setSelectedCourtId(court._id);
    setUserModalOpen(true);
  };

  const handleCourtDetails = async (court) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/admin/courts/${court._id}`);
      if (!res.ok) throw new Error("Failed to fetch court details");
      const data = await res.json();
      // console.log(data)
      setSelectedCourtDetails(data);
      setDetailsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/admin/courts`);

      const data = await res.json();
      setCourts(
        data.map((c, index) => ({
          key: index + 1,
          _id: c._id,
          courtName: c.courtName,
          officers: c.officerCount || 0,
          readers: c.readerCount || 0,
          documents: c.documentsCount || 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  const handleRemoveCourt = async (court) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/admin/courts/${court._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCourts();
      } else {
        console.error("Failed to remove court");
      }
    } catch (err) {
      console.error("Error removing court:", err);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header setIsLoggedIn={setIsLoggedIn} />
      <Layout>
        <SideBar />
        <Layout style={{ marginLeft: 200, paddingTop: 64, background: "#fafafa" }}>
          <Content
            style={{
              margin: "20px",
              padding: "20px",
              borderRadius: 8,
              minHeight: "calc(100vh - 84px)",
              overflowY: "auto",
            }}
          >
            <CourtStats courts={courts} setisactive={setIsActive} />
            <Divider />

            {isActive === "courts" && (
              <>
                <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <Title level={4}>Courts Overview</Title>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setCourtModalOpen(true)}>
                    Add New Court
                  </Button>
                </Space>
                <CourtTable
                  courts={courts}
                  onAddUser={handleAddUser}
                  onDetails={handleCourtDetails}
                  onRemove={handleRemoveCourt}
                />
              </>
            )}

            {isActive === "readers" && <UserTable type="reader" />}
            {isActive === "officers" && <UserTable type="officer" />}
            {isActive === "documents" && <DocumentTable />}

            <AddUserCourt
              isOpen={isUserModalOpen}
              setIsOpen={setUserModalOpen}
              courtId={selectedCourtId}
              onUserAdded={fetchCourts}
            />

            <CourtModals
              isCourt={isCourtModalOpen}
              setCourt={setCourtModalOpen}
              fetchCourts={fetchCourts}
              isUserModalOpen={isUserModalOpen}
              setUserModalOpen={setUserModalOpen}
            />

            <Modal
              title="Court Details"
              open={isDetailsModalOpen}
              onCancel={() => setDetailsModalOpen(false)}
              footer={null}
              width={800}
            >
              {selectedCourtDetails && (
                <>
                  <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="Court Name">{selectedCourtDetails.courtName}</Descriptions.Item>
                    <Descriptions.Item label="Location">{selectedCourtDetails.courtLocation || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Description">{selectedCourtDetails.courtDesc || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Documents">{selectedCourtDetails.documentsCount}</Descriptions.Item>
                  </Descriptions>

                  <Table
                    title={() => "Officers"}
                    dataSource={selectedCourtDetails.officers || []}
                    columns={[
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        sorter: (a, b) => a.name.localeCompare(b.name),
                        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                          <div style={{ padding: 8 }}>
                            <Input
                              placeholder="Search Name"
                              value={selectedKeys[0]}
                              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                              onPressEnter={() => confirm()}
                              style={{ marginBottom: 8, display: "block" }}
                            />
                            <Button onClick={confirm} size="small" type="primary" style={{ marginRight: 8 }}>
                              Search
                            </Button>
                            <Button onClick={clearFilters} size="small">
                              Reset
                            </Button>
                          </div>
                        ),
                        onFilter: (value, record) =>
                          record.name.toLowerCase().includes(value.toLowerCase()),
                      },
                      { title: "Email", dataIndex: "email", key: "email" },
                      {
                        title: "Role",
                        dataIndex: "role",
                        key: "role",
                        filters: [
                          { text: "Officer", value: "officer" },
                          { text: "Reader", value: "reader" },
                        ],
                        onFilter: (value, record) => record.role === value,
                      },
                    ]}
                    rowKey={(record, index) => index}
                    pagination={false}
                    style={{ marginBottom: 20 }}
                  />

                  <Table
                    title={() => "Readers"}
                    dataSource={selectedCourtDetails.readers || []}
                    columns={[
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        sorter: (a, b) => a.name.localeCompare(b.name),
                        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                          <div style={{ padding: 8 }}>
                            <Input
                              placeholder="Search Name"
                              value={selectedKeys[0]}
                              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                              onPressEnter={() => confirm()}
                              style={{ marginBottom: 8, display: "block" }}
                            />
                            <Button onClick={confirm} size="small" type="primary" style={{ marginRight: 8 }}>
                              Search
                            </Button>
                            <Button onClick={clearFilters} size="small">
                              Reset
                            </Button>
                          </div>
                        ),
                        onFilter: (value, record) =>
                          record.name.toLowerCase().includes(value.toLowerCase()),
                      },
                      { title: "Email", dataIndex: "email", key: "email" },
                      {
                        title: "Role",
                        dataIndex: "role",
                        key: "role",
                        filters: [
                          { text: "Officer", value: "officer" },
                          { text: "Reader", value: "reader" },
                        ],
                        onFilter: (value, record) => record.role === value,
                      },
                    ]}
                    rowKey={(record, index) => index}
                    pagination={false}
                  />
                </>
              )}
            </Modal>



          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
