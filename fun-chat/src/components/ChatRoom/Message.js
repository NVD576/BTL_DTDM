import React from "react";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import { WrapperStyled } from "./messStyle";
import { FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FilePdfOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />;
    case 'doc':
    case 'docx':
      return <FileWordOutlined style={{ fontSize: '20px', color: '#096dd9' }} />;
    case 'xls':
    case 'xlsx':
      return <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImageOutlined style={{ fontSize: '20px', color: '#faad14' }} />;
    default:
      return <FileOutlined style={{ fontSize: '20px', color: '#722ed1' }} />;
  }
};

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  image,
  file,
  isOwn
}) {
  return (
    <WrapperStyled isOwn={isOwn}>
      <div>
        <Avatar size="small" src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>

      <div className="content">
        {image && (
          <div style={{ marginTop: 8 }}>
            <img
              src={image}
              alt="Sent"
              style={{
                maxWidth: "250px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}

        {file &&
          (file.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) ? (
            <div style={{ marginTop: 8 }}>
              <img
                src={file}
                alt="Sent file"
                style={{
                  maxWidth: "250px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          ) : (
            <div className="file-wrapper">
              <a href={file} target="_blank" rel="noopener noreferrer" download>
                <div className="file-box">
                  <div className="file-icon" style={{ opacity: 1 }}>
                    {getFileIcon(file.split("/").pop())}
                  </div>
                  <span className="file-name">{file.split("/").pop()}</span>
                  <span className="download-text">Tải xuống</span>
                </div>
              </a>
            </div>
          ))}

        {text && <Typography.Text>{text}</Typography.Text>}
      </div>
    </WrapperStyled>
  );
}
