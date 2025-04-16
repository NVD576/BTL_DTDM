import React, { useState, useContext } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
`;

const Header = styled.h3`
  color: #ffc0cb;
  font-size: 18px;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1px;
`;

const RoomLink = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  padding: 10px 16px; /* Tăng padding cho dễ nhìn */
  margin-bottom: 8px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out; /* Thêm transition cho mượt mà */
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffcc00;
    transform: translateX(4px);
  }

  /* Style cho phòng được chọn (nổi bật hơn) */
  &.selected {
    background-color: #64b5f6; /* Màu xanh dương tươi */
    color: #fff;
    font-weight: bold;
    transform: scale(1.02); /* Phóng to nhẹ */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Đổ bóng rõ hơn */
    border: 1px solid #42a5f5; /* Thêm border */
  }
`;

const AddRoomButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  color: black;
  border: 1px dashed #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;

  span {
    margin-left: 8px;
    opacity: 1;
    transition: opacity 0.3s, color 0.3s;
  }

  &:hover {
    background-color: #ffcc00;
    color: #000;
    border-color: #ffcc00;

    span {
      color: #000;
    }
  }
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, selectedRoomId: globalSelectedRoomId, setSelectedRoomId: setGlobalSelectedRoomId } =
    useContext(AppContext);
  const [localSelectedRoomId, setLocalSelectedRoomId] = useState(null);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const handleRoomClick = (roomId) => {
    setLocalSelectedRoomId(roomId);
    setGlobalSelectedRoomId(roomId);
  };

  return (
    <Container>
      <Header>Danh sách các phòng</Header>
      {rooms.map((room) => (
        <RoomLink
          key={room.id}
          onClick={() => handleRoomClick(room.id)}
          className={localSelectedRoomId === room.id || globalSelectedRoomId === room.id ? 'selected' : ''}
        >
          {room.name}
        </RoomLink>
      ))}
      <AddRoomButton
        type="dashed"
        icon={<PlusSquareOutlined />}
        onClick={handleAddRoom}
      >
        <span>Thêm phòng</span>
      </AddRoomButton>
    </Container>
  );
}