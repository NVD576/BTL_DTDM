import React, { useContext, useState } from 'react';
import { Form, Modal, Input, message, Spin, Button } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import axios from '../../axios';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    background-color: #f0f2f5;
  }

  .ant-modal-header {
    background-color: #1890ff;
    color: white;
    border-radius: 12px 12px 0 0;
    padding: 16px;
    text-align: center;
  }

  .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: center;
    border-top: none;
  }
`;

const StyledButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  &:hover {
    background-color: #40a9ff;
  }
`;

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible, fetchRooms } = useContext(AppContext);
  const {
    user: { id },
  } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    form.validateFields()
      .then(async (values) => {
        const roomData = {
          name: values.name || '',
          description: values.description || '',
          participants: [id],
        };
        console.log('Room data:', roomData); // Kiểm tra dữ liệu phòng trước khi gửi
        setLoading(true);

        try {
          const response = await axios.post('rooms/', roomData);
          const u = await axios.get('users/');
          console.log('Response from user:', u.data); // Kiểm tra phản hồi từ server
          if (response.status === 201) {
            message.success('Phòng đã được tạo thành công!');
            form.resetFields();
            setIsAddRoomVisible(false);

            // Gọi lại fetchRooms() để làm mới danh sách phòng
            fetchRooms();  // Cập nhật danh sách phòng mà không cần reload trang
          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi tạo phòng.');
          console.error('Error creating room:', error);
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAddRoomVisible(false);
  };

  return (
    <StyledModal
      title="Tạo phòng"
      visible={isAddRoomVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={500}
      footer={[
        <StyledButton key="cancel" type="primary" onClick={handleCancel}>
          Hủy
        </StyledButton>,

        <StyledButton
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={loading}
        >
          Tạo phòng
        </StyledButton>,
      ]}
    >
      <Form form={form} layout="vertical" name="add-room-form">
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>
      </Form>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Spin size="large" />
        </div>
      )}
    </StyledModal>
  );
}
