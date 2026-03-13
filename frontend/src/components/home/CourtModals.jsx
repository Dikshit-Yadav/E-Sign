import { Modal, Button } from "antd";
import AddCourt from "../AddCourt";

const CourtModals = ({ 
  isCourt, 
  setCourt, 
  fetchCourts, 
  isDetailsOpen, 
  setDetailsOpen, 
  selectedCourt 
}) => (
  <>
    <AddCourt 
      open={isCourt} 
      onClose={() => { 
        setCourt(false); 
        fetchCourts(); 
      }} 
    />

    <Modal
      title="Court Details"
      open={isDetailsOpen}
      onCancel={() => setDetailsOpen(false)}
      footer={[
        <Button key="close" onClick={() => setDetailsOpen(false)}>
          Close
        </Button>
      ]}
    >
      {selectedCourt ? (
        <div>
          <p><b>Court Name:</b> {selectedCourt.courtName}</p>
          <p><b>Officers:</b> {selectedCourt.officers}</p>
          <p><b>Readers:</b> {selectedCourt.readers}</p>
          <p><b>Documents:</b> {selectedCourt.documents}</p>
        </div>
      ) : (
        <p>No court selected</p>
      )}
    </Modal>
  </>
);

export default CourtModals;
