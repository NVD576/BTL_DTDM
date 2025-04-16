import React, { useState } from "react";
import { Button, Avatar, Typography, Modal, Form, Input, message } from "antd";
import styled from "styled-components";
import axios from "../../axios";

import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import { useHistory } from "react-router-dom";

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  .user-info {
    display: flex;
    align-items: center;
  }

  .username {
    color: #ffcc00;
    font-weight: bold;
    margin-left: 10px;
    font-size: 16px;
  }

  .avatar {
    border: 2px solid #fff;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export default function UserInfo() {
  const history = useHistory();
  const {
    user: { username, avatar, id },
  } = React.useContext(AuthContext);
  const { setUser, setIsLogin, setRe } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newAvatar, setNewAvatar] = useState(null);
  const [form] = Form.useForm();
  const [avatarKey, setAvatarKey] = useState(0);

  const signOut = () => {
    setUser({});
    setIsLogin(false);
    setRe(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    history.push("/login");
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("username", newUsername);
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      }

      console.log("Dữ liệu gửi đi:", {
        username: newUsername,
        avatar: newAvatar ? newAvatar.name : "Không có ảnh mới",
      });

      const response = await axios.patch(`users/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response từ server:", response.data);

      // Lấy thông tin người dùng mới nhất từ server
      const userResponse = await axios.get(`users/${id}/`);
      console.log("Thông tin người dùng mới:", userResponse.data);

      const updatedUser = {
        ...userResponse.data,
        id: id,
        avatar: userResponse.data.avatar + `?t=${Date.now()}`,
      };

      console.log("Thông tin người dùng sẽ được cập nhật:", updatedUser);

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAvatarKey((prev) => prev + 1);
      message.success("Cập nhật thông tin thành công");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error(
        "Cập nhật thông tin thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewUsername(username);
    setNewAvatar(null);
  };

  return (
    <WrapperStyled>
      <div className="user-info">
        <Avatar
          key={avatarKey}
          src={avatar}
          onClick={handleAvatarClick}
          className="avatar"
        >
          {username?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{username}</Typography.Text>
      </div>

      <Button
        ghost
        onClick={() => {
          clearState();
          signOut();
        }}
      >
        Đăng xuất
      </Button>

      <Modal
        title="Cập nhật thông tin"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên người dùng">
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log("File được chọn:", e.target.files[0]);
                setNewAvatar(e.target.files[0]);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </WrapperStyled>
  );
}
