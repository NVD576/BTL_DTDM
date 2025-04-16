import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Button } from "antd";
import styled from "styled-components";
import axios from "../../axios";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

// -------- Styled Components --------
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff, #f8f8f8);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    padding: 24px;
  }

  .ant-modal-header {
    border-bottom: none;
    background: transparent;
  }

  .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #222;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    border-top: none;
    padding-top: 24px;
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 16px;
`;

const AvatarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .label {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-top: 6px;
  }
`;

const UploadLabel = styled.label`
  display: inline-block;
  margin-top: 10px;
  background-color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #d2d2d2;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(to right, #6a11cb, #2575fc);
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 15px;

  &:hover {
    background: linear-gradient(to right, #2575fc, #6a11cb);
  }
`;

// -------- Component --------
export default function UpdateUserModal({ visible, onClose, user, setUser }) {
  const [form] = Form.useForm();
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        username: user?.username || "",
      });
      setNewAvatar(null);
      setPreviewUrl(null);
    }
  }, [visible, user, form]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("username", values.username);
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      }

      const response = await axios.patch(`users/${user.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = await axios.get(`users/${user.id}/`);
      const updatedUser = {
        ...updated.data,
        id: user.id,
        avatar: updated.data.avatar + `?t=${Date.now()}`,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("🎉 Cập nhật thông tin thành công");
      onClose();
    } catch (error) {
      message.error("❌ Cập nhật thất bại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      title="🎨 Cập nhật thông tin cá nhân"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <SubmitButton key="submit" onClick={handleOk} loading={loading}>
          Lưu
        </SubmitButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        <StyledFormItem
          label="👤 Tên người dùng"
          name="username"
          rules={[{ required: true, message: "Nhập tên người dùng mới!" }]}
        >
          <StyledInput prefix={<UserOutlined />} />
        </StyledFormItem>

        <StyledFormItem label="🖼️ Ảnh đại diện">
          <UploadLabel htmlFor="avatar-upload">
            <UploadOutlined /> Chọn ảnh
          </UploadLabel>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <AvatarPreview>
            <div>
              <img src={user.avatar} alt="Old" />
              <div className="label">Hiện tại</div>
            </div>
            {previewUrl && (
              <div>
                <img src={previewUrl} alt="Preview" />
                <div className="label">Mới</div>
              </div>
            )}
          </AvatarPreview>
        </StyledFormItem>
      </Form>
    </StyledModal>
  );
}
