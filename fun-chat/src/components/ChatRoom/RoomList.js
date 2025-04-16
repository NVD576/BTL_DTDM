import React, { useContext, useState } from "react";
import { Button, Input, Tooltip } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);

  align-items: center;
  justify-content: space-between;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const StyledInput = styled(Input)`
  flex-grow: 1;
  margin-right: 12px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff;
  border: none;
  transition: background-color 0.3s;

  &:hover,
  &:focus {
    background-color: rgba(255, 255, 255, 0.15) !important;
    outline: none;
  }

  &::placeholder {
    color: #ccc;
  }

  input {
    color: #fff;
    background-color: transparent;
  }

  .anticon {
    color: #fff;
  }
`;

const AddRoomButton = styled(Button)`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  background-color: #ffcc00;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffdb4d;
    transform: scale(1.1);
  }

  .anticon {
    font-size: 18px;
    color: #000;
  }
`;

const RoomLink = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  padding: 10px 16px;
  margin-bottom: 8px;
  border-radius: 50px;
  width: 85%;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffcc00;
    transform: translateX(4px);
  }

  &.selected {
    background-color: #64b5f6;
    color: #fff;
    font-weight: bold;
    transform: scale(1.02);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid #42a5f5;
  }
`;

export default function RoomList() {
  const {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    setIsAddRoomVisible,
  } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddRoom = () => setIsAddRoomVisible(true);
  const handleRoomClick = (roomId) => setSelectedRoomId(roomId);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <InputContainer>
        <StyledInput
          placeholder="Tìm kiếm phòng..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
        <Tooltip title="Thêm phòng">
          <AddRoomButton
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={handleAddRoom}
          />
        </Tooltip>
      </InputContainer>

      {filteredRooms.map((room) => (
        <RoomLink
          key={room.id}
          onClick={() => handleRoomClick(room.id)}
          className={selectedRoomId === room.id ? "selected" : ""}
        >
          {room.name}
        </RoomLink>
      ))}
    </Container>
  );
}
