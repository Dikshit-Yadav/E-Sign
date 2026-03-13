import { Dropdown, Button, Modal } from "antd";
import {
  MoreOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const CourtActions = ({ record, onAddUser, onDetails, onRemove }) => {
  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserAddOutlined /> Add Users
        </span>
      ),
      onClick: () => onAddUser(record),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <InfoCircleOutlined /> Court Details
        </span>
      ),
      onClick: () => onDetails(record),
    },

    {
      key: "3",
       danger: true,
        label:
         <span className="flex items-center gap-2 text-red-500">
        <DeleteOutlined /> Remove Court
      </span>, onClick: () => onRemove(record)
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        shape="circle"
        icon={<MoreOutlined />}
        className="hover:bg-gray-100 transition-all duration-200"
      />
    </Dropdown>
  );
};

export default CourtActions;
