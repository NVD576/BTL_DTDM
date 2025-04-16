import React from 'react';
import { Row, Col } from 'antd';
import UserInfo from './UserInfo';
import RoomList from './RoomList';
import styled from 'styled-components';


const SidebarStyled = styled.div`
  background: linear-gradient(135deg, #3f0e40, #7b1fa2);
  color: white;
  height: 100vh;
  padding: 20px 10px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
`;


export default function Sidebar() {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <RoomList />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
