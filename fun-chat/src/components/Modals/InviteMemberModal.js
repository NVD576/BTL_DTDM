import React, { useContext, useState, useMemo, useEffect } from "react";
import { Form, Modal, Select, Spin, Avatar, message, Button } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import axios from "../../axios";
import styled from "styled-components";

// Định nghĩa Styled Modal và Button
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    background: linear-gradient(135deg,rgb(218, 226, 230),rgb(110, 202, 233));
    padding: 2px;
  }

  .ant-modal-header {
    background-color: #1890ff;
    color: white;
    border-radius: 16px 16px 0 0;
    text-align: center;
    font-size: 20px;
    padding: 16px 0;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: center;
    border-top: none;
    padding: 20px 0;
  }

  .ant-modal-close {
    color: white;
    font-size: 20px;
    font-weight: bold;
    top: 3x;
    right: 5px;
  }
`;

const StyledButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
  margin-top: 16px;
  font-size: 14px;
  border: none; /* Thêm border để kiểm tra */
  &:hover {
    background-color: #40a9ff;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 8px !important;
    background-color: #ffffff !important;
    border: 1px solid #1890ff !important;
  }

  .ant-select-item-option-content {
    display: flex;
    align-items: center;
  }

  .ant-select-item-option {
    padding: 8px 12px;
    border-radius: 8px;
  }

  .ant-select-item-option-selected {
    background-color: #1890ff;
    color: white;
  }

  .ant-select-item-option-active {
    background-color: rgba(24, 144, 255, 0.1);
  }

  .ant-select-item-option-content .ant-avatar {
    margin-right: 10px;
  }
`;

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers)
        .then((newOptions) => {
          setOptions(newOptions);
          setFetching(false);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
          setFetching(false);
        });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  useEffect(() => {
    let isMounted = true;

    return () => {
      if (isMounted) {
        setOptions([]);
        isMounted = false;
      }
    };
  }, []);
  return (
    <StyledSelect
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.avatar}>
            {opt.avatar ? "" : opt.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.username}`}
        </Select.Option>
      ))}
    </StyledSelect>
  );
}

async function fetchUserList(search, curMembers = []) {
  try {
    const response = await axios.get("users/", {
      params: { search },
    });

    const curMembersSet = new Set(curMembers);

    return response.data
      .map((user) => ({
        username: user.username,
        value: user.id,
        avatar: user.avatar || null,
      }))
      .filter((opt) => {
        const matchesSearch = opt.username
          .toLowerCase()
          .includes(search.toLowerCase());
        return !curMembersSet.has(opt.value) && matchesSearch;
      });
  } catch (error) {
    console.error("Lỗi tìm user:", error);
    return [];
  }
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
    members,
    fetchRooms,
  } = useContext(AppContext);

  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      form.resetFields();
      setValue([]);

      const newMemberIds = [
        ...selectedRoom.participants,
        ...value.map((val) => val.value),
      ];

      await axios.patch(`/rooms/${selectedRoomId}/`, {
        participants: newMemberIds,
      });

      message.success("Đã thêm thành viên");
      setIsInviteMemberVisible(false);

      fetchRooms();
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err);
      message.error("Không thể thêm thành viên");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setValue([]);
    setIsInviteMemberVisible(false);
  };

  return (
    <StyledModal
      title="Mời thêm thành viên"
      open={isInviteMemberVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      width={500}
      footer={[
        <StyledButton
          key="submit"
          type="primary"
          onClick={handleOk}
          className="styled-button"
        >
          Mời
        </StyledButton>,
        <StyledButton key="cancel" onClick={handleCancel}>
          Hủy
        </StyledButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        <DebounceSelect
          mode="multiple"
          name="search-user"
          label="Tên các thành viên"
          value={value}
          placeholder="Nhập tên thành viên"
          fetchOptions={fetchUserList}
          onChange={(newValue) => setValue(newValue)}
          style={{ width: "100%" }}
          curMembers={selectedRoom.participants}
        />
      </Form>
      <div style={{ marginTop: 24 }}>
        <h4 style={{ marginBottom: 12 }}>Thành viên hiện tại</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {members &&
            members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                }}
              >
                <Avatar size="small" src={member.avatar}>
                  {member.avatar
                    ? ""
                    : member.username?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span>{member.username}</span>
              </div>
            ))}
        </div>
      </div>
    </StyledModal>
  );
}
