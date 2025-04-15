import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "../../axios";
import { AuthContext } from "../../Context/AuthProvider";
import styled from "styled-components";

// Styled-components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:rgb(255, 255, 255);
  padding: 2rem;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #7c3aed;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  background: #7c3aed;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  margin-top: 1rem;
  transition: background 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: #6d28d9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const AvatarPreview = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  object-fit: cover;
  border: 2px solid #a78bfa;
  margin-left: 1rem;
`;

const Register = () => {
  const formRef = useRef();
  const isMounted = useRef(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const { setUser, setRe } = React.useContext(AuthContext);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: "power3.out",
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      if (isMounted.current) setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      if (isMounted.current) setMessage("Mật khẩu không khớp");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      if (isMounted.current) setIsLoading(true);
      const response = await axios.post("register/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (isMounted.current) {
        setUser(data);
        setRe(true);
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      if (isMounted.current) {
        setMessage("Đăng ký không thành công. Vui lòng thử lại.");
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper ref={formRef}>
        <Title>Đăng ký tài khoản</Title>
        <form onSubmit={handleRegister}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            {preview && <AvatarPreview src={preview} alt="avatar preview" />}
          </div>
          <Button type="submit">
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
          {message && <ErrorMessage>{message}</ErrorMessage>}
        </form>
      </FormWrapper>
    </Container>
  );
};

export default Register;
