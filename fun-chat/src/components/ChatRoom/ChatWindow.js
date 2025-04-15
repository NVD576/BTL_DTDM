import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
} from "antd";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "../../axios";
import { PaperClipOutlined } from "@ant-design/icons"; // icon đính kèm

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

      &:hover {
        opacity: 0.8;
      }
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
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
  const [fileUpload, setFileUpload] = useState(null);
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // mở dialog chọn file
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileUpload(file); // thêm dòng này để đảm bảo gửi file hoạt động
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        message.success("Tin nhắn đã được gửi thành công");
        const newMessage = {
          ...response.data,
          sender: id,
          username: username,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
      await fetchMessages();
      form.resetFields(["message"]);
      setSelectedFile(null);
      setFileUpload(null); // reset file
      if (inputRef?.current) inputRef.current.focus();
    } catch (error) {
      message.error("Gửi tin nhắn thất bại: " + error.message);
    }
  };

  const [messages, setMessages] = useState([]);

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
        userMap[user.id] = {
          username: user.username,
          photoURL: user.avatar,
        };
      });
  
      const messagesWithSenderNames = messageList.map((msg) => {
        const sender = userMap[msg.sender] || {};
        return {
          ...msg,
          username: sender.username || "Unknown",
          photoURL: sender.photoURL,
          createdAt: msg.timestamp,
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
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  const handleRenameRoom = async () => {
    if (newRoomName.trim() === "") {
      message.error("Tên phòng không được để trống");
      return;
    }

    console.log(
      "Đang đổi tên phòng:",
      selectedRoom.id,
      "thành",
      newRoomName.trim()
    );

    try {
      // Gửi yêu cầu PUT đến API để cập nhật tên phòng
      const response = await axios.patch(`rooms/${selectedRoom.id}/`, {
        name: newRoomName.trim(),
      });

      if (response.status === 200) {
        console.log("Đổi tên phòng thành công");
        message.success("Đổi tên phòng thành công");
        setNewRoomName("");
        setIsRenameModalVisible(false);
        // Cập nhật lại selectedRoom và danh sách phòng
        setSelectedRoomId(response.data.id); // Cập nhật selectedRoomId để nó tự động cập nhật selectedRoom
        fetchRooms(); // Làm mới danh sách phòng
      }
    } catch (error) {
      console.error("Lỗi khi đổi tên phòng:", error);
      message.error("Đổi tên phòng thất bại: " + error.message);
    }
  };

  const handleDeleteRoom = async () => {
    console.log("Đang xóa phòng:", selectedRoom.id);

    try {
      // Gửi yêu cầu DELETE tới API để xóa phòng
      const response = await axios.delete(`rooms/${selectedRoom.id}/`);

      if (response.status === 204) {
        // Status 204 nghĩa là thành công và không có nội dung trả về
        console.log("Xóa phòng thành công");
        message.success("Xóa phòng thành công");
        setIsDeleteModalVisible(false);
        setSelectedRoomId("");
        fetchRooms(); // Làm mới danh sách phòng
      }
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      message.error("Xóa phòng thất bại: " + error.message);
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      setNewRoomName(selectedRoom.name);
      setIsRenameModalVisible(true);
    } else if (e.key === "2") {
      setIsDeleteModalVisible(true);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<EditOutlined />}>
        Đổi tên nhóm
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
                  style={{ padding: 0, margin: 0, height: "auto" }}
                >
                  {selectedRoom.name}
                </Button>
              </Dropdown>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.username} key={member.id}>
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
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              {/* Icon chọn file */}
              <Tooltip title="Đính kèm tệp">
                <PaperClipOutlined
                  style={{ fontSize: 20, cursor: "pointer", marginRight: 8 }}
                  onClick={handleIconClick}
                />
              </Tooltip>
              {selectedFile && (
                <span style={{ marginRight: 8, fontSize: 12, color: "#888" }}>
                  {shortenFileName(selectedFile.name)}
                </span>
              )}
              {/* Input file ẩn đi */}
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
            title="Đổi tên nhóm"
            visible={isRenameModalVisible}
            onOk={handleRenameRoom}
            onCancel={() => setIsRenameModalVisible(false)}
          >
            <Input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Nhập tên mới cho nhóm"
              onPressEnter={handleRenameRoom}
              autoFocus
            />
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
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
