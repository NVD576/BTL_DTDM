import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Form, Modal, Select, Spin, Avatar, message } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import axios from '../../axios';

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

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      }).catch((error) => {
        console.error('Error fetching options:', error);
        setFetching(false);
      });;
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
      setOptions([]);
    };
  }, []);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size='small' src={opt.avatar}>
            {opt.avatar ? '' : opt.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.username}`}
        </Select.Option>
      ))}
    </Select>
  );
}

// GỌI API TÌM KIẾM USER
async function fetchUserList(search, curMembers = []) {
  try {
    const response = await axios.get('users/', {
      params: { search },
    });

    const curMembersSet = new Set(curMembers); // Dùng Set để kiểm tra nhanh hơn

    return response.data
      .map((user) => ({
        username: user.username,
        value: user.id,
        avatar: user.avatar || null,
      }))
      .filter((opt) => {
        const matchesSearch = opt.username.toLowerCase().includes(search.toLowerCase());
        return !curMembersSet.has(opt.value) && matchesSearch; // Lọc theo tên và không có trong curMembers
      }); // Lọc ra các người dùng chưa có trong curMembers
  } catch (error) {
    console.error('Lỗi tìm user:', error);
    return [];
  }
}


export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
    fetchRooms,
  } = useContext(AppContext);

  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      form.resetFields();
      setValue([]);

      const newMemberIds = [...selectedRoom.participants, ...value.map((val) => val.value)];

      // Gọi API cập nhật room
      await axios.patch(`/rooms/${selectedRoomId}/`, {
        participants: newMemberIds,
      });

      message.success('Đã thêm thành viên');
      setIsInviteMemberVisible(false);

      fetchRooms(); // cập nhật lại context sau khi sửa
    } catch (err) {
      console.error('Lỗi khi thêm thành viên:', err);
      message.error('Không thể thêm thành viên');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setValue([]);
    setIsInviteMemberVisible(false);
  };

  return (
    <Modal
      title='Mời thêm thành viên'
      open={isInviteMemberVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <Form form={form} layout='vertical'>
        <DebounceSelect
          mode='multiple'
          name='search-user'
          label='Tên các thành viên'
          value={value}
          placeholder='Nhập tên thành viên'
          fetchOptions={fetchUserList}
          onChange={(newValue) => setValue(newValue)}
          style={{ width: '100%' }}
          curMembers={selectedRoom.participants}
        />
      </Form>
    </Modal>
  );
}
