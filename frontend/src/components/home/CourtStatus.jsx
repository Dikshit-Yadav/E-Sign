import { Card, Row, Col } from "antd";

const CourtStats = ({ courts, setisactive }) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Courts" hoverable onClick={() => setisactive("courts")}>
          {courts.length}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Readers" hoverable onClick={() => setisactive("readers")}>
          {courts.reduce((acc, c) => acc + (Number(c.readers) || 0), 0)}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Officers" hoverable onClick={() => setisactive("officers")}>
          {courts.reduce((acc, c) => acc + (Number(c.officers) || 0), 0)}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Documents Signed" hoverable onClick={() => setisactive("documents")}>
          {courts.reduce((acc, c) => acc + (Number(c.documents) || 0), 0)}
        </Card>
      </Col>
    </Row>
  );
};

export default CourtStats;
