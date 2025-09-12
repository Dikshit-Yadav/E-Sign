import AddCourt from "../AddCourt";

const CourtModals = ({ isCourt, setCourt, fetchCourts}) => (
  <>
    <AddCourt open={isCourt} onClose={() => { setCourt(false); fetchCourts(); }} />
  
  </>
);

export default CourtModals;
