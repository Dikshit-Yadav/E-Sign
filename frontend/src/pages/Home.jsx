import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import CourtStats from "../components/home/CourtStatus";
import CourtTable from "../components/home/CourtTable";
import UserTable from "../components/home/UserTable";
import DocumentTable from "../components/home/DocumentTable";
import CourtModals from "../components/home/CourtModals";

const Home = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isCourt, setCourt] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [isactive, setisactive] = useState("courts");

  const handleAddUser = (court) => navigate(`/courts/${court._id}/add-user`);
  const handleCourtDetails = (court) => navigate(`/courts/${court._id}`);
  const handleRemoveCourt = async (court) => {
    await fetch(`http://localhost:4500/admin/courts/${court._id}`, { method: "DELETE" });
    fetchCourts();
  };

  const fetchCourts = async () => {
    try {
      const res = await fetch("http://localhost:4500/admin/courts");
      const data = await res.json();
      setCourts(
        data.map((c, index) => ({
          key: index + 1,
          _id: c._id,
          courtName: c.courtName,
          officers: Number(c.officersCount) || 0,
          readers: Number(c.readersCount) || 0,
          documents: Number(c.documents) || 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header setIsLoggedIn={setIsLoggedIn} />

      <div style={{ display: "flex", flex: 1 }}>
        <SideBar />
        <main style={{ flex: 1, padding: "20px", background: "#fafafa" }}>
          <CourtStats courts={courts} setisactive={setisactive} />

          <div style={{ marginTop: 20 }}>
            {isactive === "courts" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0" }}>
                  <Button type="primary" onClick={() => setCourt(true)}>+ Add New Court</Button>
                </div>
                <h3>Courts Overview</h3>
                <CourtTable
                  courts={courts}
                  onAddUser={handleAddUser}
                  onDetails={handleCourtDetails}
                  onRemove={handleRemoveCourt}
                />
              </>
            )}
            {isactive === "readers" && (
              <>
                <h3>Readers Overview</h3>
                <UserTable type="reader" />
              </>
            )}
            {isactive === "officers" && (
              <>
                <h3>Officers Overview</h3>
                <UserTable type="officer" />
              </>
            )}
            {isactive === "documents" && (
              <>
                <h3>Documents Overview</h3>
                <DocumentTable />
              </>
            )}
          </div>
          <CourtModals
            isCourt={isCourt}
            setCourt={setCourt}
            fetchCourts={fetchCourts}
            isUserModalOpen={isUserModalOpen}
            setUserModalOpen={setUserModalOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
