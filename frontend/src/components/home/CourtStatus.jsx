import { Card, Row, Col, Statistic } from "antd";
import {
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const statCardStyle = {
  cursor: "pointer",
  borderRadius: "12px",
  textAlign: "center",
  transition: "all 0.2s ease",
};

const CourtStats = ({ courts, setisactive }) => {
  const totalReaders = courts.reduce((acc, c) => acc + (Number(c.readers) || 0), 0);
  const totalOfficers = courts.reduce((acc, c) => acc + (Number(c.officers) || 0), 0);

  const totalDocuments = courts.reduce((acc, c) => acc + (Number(c.documents) || 0), 0);

  

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} md={6}>
        <Card
          hoverable
          style={statCardStyle}
          onClick={() => setisactive("courts")}
          bodyStyle={{ padding: "20px" }}
        >
          <BankOutlined style={{ fontSize: "28px", color: "#1677ff" }} />
          <Statistic title="Courts" value={courts.length} valueStyle={{ fontSize: "24px" }} />
        </Card>
      </Col>

      <Col xs={12} md={6}>
        <Card
          hoverable
          style={statCardStyle}
          onClick={() => setisactive("readers")}
          bodyStyle={{ padding: "20px" }}
        >
          <UserOutlined style={{ fontSize: "28px", color: "#52c41a" }} />
          <Statistic title="Readers" value={totalReaders} valueStyle={{ fontSize: "24px" }} />
        </Card>
      </Col>

      <Col xs={12} md={6}>
        <Card
          hoverable
          style={statCardStyle}
          onClick={() => setisactive("officers")}
          bodyStyle={{ padding: "20px" }}
        >
          <TeamOutlined style={{ fontSize: "28px", color: "#faad14" }} />
          <Statistic title="Officers" value={totalOfficers} valueStyle={{ fontSize: "24px" }} />
        </Card>
      </Col>

      <Col xs={12} md={6}>
        <Card
          hoverable
          style={statCardStyle}
          onClick={() => setisactive("documents")}
          bodyStyle={{ padding: "20px" }}
        >
          <FileDoneOutlined style={{ fontSize: "28px", color: "#eb2f96" }} />
          <Statistic title="Documents" value={totalDocuments} valueStyle={{ fontSize: "24px" }} />
        </Card>
      </Col>
    </Row>
  );
};

export default CourtStats;
