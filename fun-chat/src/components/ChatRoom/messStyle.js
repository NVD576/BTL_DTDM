// Message.styles.js
import styled from "styled-components";

export const WrapperStyled = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: ${props => props.isOwn ? '0' : '30px'};
    margin-right: ${props => props.isOwn ? '30px' : '0'};
    background-color: ${props => props.isOwn ? '#1890ff' : '#f5f5f5'};
    color: ${props => props.isOwn ? 'white' : 'black'};
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 70%;
  }

  .file-wrapper {
    margin-top: 6px;
  }

  .file-box {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: ${props => props.isOwn ? '#1890ff' : '#f5f5f5'};
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    max-width: 300px;
    transition: background-color 0.2s;
  }

  .file-box:hover {
    background-color: ${props => props.isOwn ? '#40a9ff' : '#e8f4ff'};
  }

  .file-icon {
    font-size: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.2s;
  }

  .file-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 10px;
    color: ${props => props.isOwn ? 'white' : 'black'};
  }

  .download-text {
    color: ${props => props.isOwn ? 'white' : '#1890ff'};
    font-size: 12px;
  }
`;
