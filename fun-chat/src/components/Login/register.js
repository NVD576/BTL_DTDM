import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHistory } from "react-router-dom";
import axios from "../../axios";
import { AuthContext } from "../../Context/AuthProvider";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <form
        ref={formRef}
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
          Đăng ký tài khoản
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tên đăng nhập"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
          onChange={handleAvatarChange}
        />

        {preview && (
          <div className="mb-4 text-center">
            <img
              src={preview}
              alt="avatar preview"
              className="w-20 h-20 rounded-full mx-auto border-2 border-purple-400"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition font-semibold text-lg"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-red-500 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
