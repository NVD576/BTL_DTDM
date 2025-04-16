import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Tooltip,
  Avatar,
  Form,
  Input,
  Alert,
  Dropdown,
  Modal,
  Menu,
  message,
  Typography,
} from "antd";

import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "../../axios";
import Message from "./Message";

const { Text } = Typography;
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
      cursor: pointer;
      font-size: 18px;
      color: #1890ff;
      &:hover {
        opacity: 0.8;
        color: #40a9ff;
        text-decoration: underline;
      }
    }
    &__description {
      font-size: 12px;
      color: #888;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 100%;
  gap: 8px;

  .ant-avatar-group {
    overflow: hidden;
    max-width: 100%;
  }

  .invite-button {
    transition: all 0.3s ease;

    &:hover {
      background-color: #40a9ff !important; /* Màu hover */
      color: white !important;
      border-color: #40a9ff !important;
    }
  }
`;


const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const {
    selectedRoom,
    members,
    setIsInviteMemberVisible,
    setSelectedRoomId,
    fetchRooms,
  } = useContext(AppContext);
  const {
    user: { username, id },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);

  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [newRoomDescription, setNewRoomDescription] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(file); // Thiết lập file
  };

  const shortenFileName = (filename) => {
    const dotIndex = filename.lastIndexOf(".");
    const name = filename.slice(0, dotIndex);
    const ext = filename.slice(dotIndex);
    const shortName = name.slice(0, 5);
    return `${shortName}${name.length > 5 ? "..." : ""}${ext}`;
  };

  const handleOnSubmit = async () => {
    if (!inputValue && !fileUpload) {
      message.error("Vui lòng nhập tin nhắn hoặc chọn tệp để gửi.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", inputValue);
      formData.append("room", selectedRoom.id);
      formData.append("sender", id);
      if (fileUpload) {
        formData.append("file", fileUpload);
      }

      const response = await axios.post("messages/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        message.success("Tin nhắn đã được gửi thành công");
        setMessages((prev) => [...prev, response.data]);
      }

      form.resetFields();
      setFileUpload(null);
    } catch (error) {
      message.error("Gửi tin nhắn thất bại: " + error.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("messages/", {
        params: { roomId: selectedRoom.id },
      });
      const messageList = response.data;
      const senderIds = [...new Set(messageList.map((msg) => msg.sender))];
      const usersResponse = await axios.get(`users/`, {
        params: { ids: senderIds.join(",") },
      });

      const userMap = {};
      usersResponse.data.forEach((user) => {
        userMap[user.id] = { username: user.username, photoURL: user.avatar };
      });

      const messagesWithSenderNames = messageList.map((msg) => {
        const sender = userMap[msg.sender] || {};
        return {
          ...msg,
          username: sender.username || "Unknown",
          photoURL: sender.photoURL,
        };
      });

      setMessages(messagesWithSenderNames);
    } catch (error) {
      message.error("Không thể tải tin nhắn: " + error.message);
    }
  };

  useEffect(() => {
    if (selectedRoom.id) {
      fetchMessages();
    }
  }, [selectedRoom.id]);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  const handleRenameRoom = async () => {
    if (!newRoomName.trim()) {
      message.error("Tên phòng không được để trống");
      return;
    }

    try {
      const response = await axios.patch(`rooms/${selectedRoom.id}/`, {
        name: newRoomName.trim(),
        description: newRoomDescription.trim(),
      });
      if (response.status === 200) {
        message.success("Cập nhật nhóm thành công");
        setNewRoomName("");
        setNewRoomDescription("");
        setIsRenameModalVisible(false);
        setSelectedRoomId(response.data.id);
        fetchRooms();
      }
    } catch (error) {
      message.error("Cập nhật nhóm thất bại: " + error.message);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await axios.delete(`rooms/${selectedRoom.id}/`);
      if (response.status === 204) {
        message.success("Xóa phòng thành công");
        setIsDeleteModalVisible(false);
        setSelectedRoomId("");
        fetchRooms();
      }
    } catch (error) {
      message.error("Xóa phòng thất bại: " + error.message);
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      setNewRoomName(selectedRoom.name);
      setNewRoomDescription(selectedRoom.description || "");
      setIsRenameModalVisible(true);
    } else if (e.key === "2") {
      setIsDeleteModalVisible(true);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<EditOutlined />}>
        Chỉnh sửa nhóm
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />} danger>
        Xóa nhóm
      </Menu.Item>
    </Menu>
  );

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="text"
                  className="header__title"
                  style={{ padding: 0 }}
                >
                  {selectedRoom.name}
                </Button>
              </Dropdown>
              {selectedRoom.description && (
                <span className="header__description">
                  {selectedRoom.description}
                </span>
              )}
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="primary"
                ghost
                className="invite-button"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời thành viên
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member) => (
                  <Tooltip
                    overlayStyle={{ maxWidth: 200 }}
                    title={member.username}
                    key={member.id}
                  >
                    <Avatar src={member.avatar}>{member.avatar}</Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.content}
                  photoURL={mes.photoURL}
                  displayName={mes.username}
                  createdAt={mes.createdAt}
                  image={mes.image}
                  file={mes.file}
                  isOwn={mes.sender === id}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                />
              </Form.Item>
              <Tooltip title="Đính kèm tệp">
                <PaperClipOutlined
                  onClick={() => fileInputRef.current.click()}
                />
              </Tooltip>
              {fileUpload && <span>{shortenFileName(fileUpload.name)}</span>}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
          <Modal
            title="Chỉnh sửa nhóm"
            visible={isRenameModalVisible}
            onOk={handleRenameRoom}
            onCancel={() => setIsRenameModalVisible(false)}
          >
            <div style={{ marginBottom: 10 }}>
              <Text strong>Tên nhóm</Text>
              <Input
                placeholder="Tên nhóm"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <div>
              <Text strong>Mô tả nhóm</Text>
              <Input
                placeholder="Mô tả nhóm"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </div>
          </Modal>

          <Modal
            title="Xóa nhóm"
            visible={isDeleteModalVisible}
            onOk={handleDeleteRoom}
            onCancel={() => setIsDeleteModalVisible(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <p>Bạn có chắc chắn muốn xóa nhóm này không?</p>
          </Modal>
        </>
      ) : (
        <Alert message="Hãy chọn phòng" type="info" showIcon closable />
      )}
    </WrapperStyled>
  );
}
