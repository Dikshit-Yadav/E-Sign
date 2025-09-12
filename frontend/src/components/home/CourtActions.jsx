import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const CourtActions = ({ record, onAddUser, onDetails, onRemove }) => {
  const items = [
    { key: "1", label: "Add Users", onClick: () => onAddUser(record) },
    { key: "2", label: "Court Details", onClick: () => onDetails(record) },
    { key: "3", danger: true, label: "Remove Court", onClick: () => onRemove(record) },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default CourtActions;
