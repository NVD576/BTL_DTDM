import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import { AuthContext } from './AuthProvider';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});

  const {
    user: { id },
  } = React.useContext(AuthContext);

  // Hàm fetchRooms để lấy danh sách phòng
  const fetchRooms = useCallback(async () => {
    try {
      const response = await axios.get(`rooms/`);
      // Lọc các phòng mà người dùng hiện tại là participant
      const filteredRooms = response.data.filter(room => room.participants.includes(id));
      setRooms(filteredRooms);
    } catch (error) {
      console.error('Lỗi khi gọi API rooms:', error);
    }
  }, [id]);

  useEffect(() => {
    // Gọi hàm fetchRooms khi id thay đổi
    fetchRooms();
  }, [id,fetchRooms]);

  useEffect(() => {
    // Lấy thành viên của phòng hiện tại từ API
    if (selectedRoom.participants && selectedRoom.participants.length > 0) {
      const fetchMembers = async () => {
        try {
          const response = await axios.get(`users/?ids=${selectedRoom.participants.join(',')}`);
          console.log('Thành viên phòng:', response.data);
          console.log('selectedRoom:', selectedRoom);
          console.log('selectedRoom.participants:', selectedRoom.participants);
          setMembers(response.data);
        } catch (error) {
          console.error('Lỗi khi gọi API users:', error);
        }
      };

      fetchMembers();

      // Cleanup function to avoid state update after unmount
      return () => {
        setMembers([]);  // Reset members on component unmount
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    const room = rooms.find((room) => room.id === selectedRoomId);
  
    if (room) {
      if (room.participants.includes(id)) {
        setSelectedRoom(room);  // OK: user có trong participants
      } else {
        console.warn('User không có quyền vào phòng này');
        setSelectedRoom({});  // Không cho phép
        setSelectedRoomId(''); // Clear lựa chọn phòng sai
      }
    } else {
      setSelectedRoom({});
    }
  }, [rooms, selectedRoomId, id]);
  

  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        fetchRooms,  // Truyền fetchRooms cho các component cần
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
