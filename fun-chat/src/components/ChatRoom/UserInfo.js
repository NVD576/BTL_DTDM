import React, { useState } from "react";
import { Button, Avatar, Typography } from "antd";
import styled from "styled-components";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import { useHistory } from "react-router-dom";
import UpdateUserModal from "../Modals/UpdateUserModal";

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

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 30px;
  padding: 6px 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 75, 43, 0.5);
  }

  &:focus {
    outline: none;
  }
`;

export default function UserInfo() {
  const history = useHistory();
  const {
    user,
    setUser,
    setIsLogin,
    setRe,
  } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const signOut = () => {
    setUser({});
    setIsLogin(false);
    setRe(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    history.push("/login");
  };

  return (
    <WrapperStyled>
      <div className="user-info">
        <Avatar
          src={user.avatar}
          onClick={() => setIsModalVisible(true)}
          className="avatar"
        >
          {user.username?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{user.username}</Typography.Text>
      </div>

      <LogoutButton
        onClick={() => {
          clearState();
          signOut();
        }}
      >
        Đăng xuất
      </LogoutButton>

      <UpdateUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={user}
        setUser={setUser}
      />
    </WrapperStyled>
  );
}
