import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", formData.username);
    params.append("password", formData.password);
    params.append("scope", "");
    params.append("client_id", "string");
    params.append("client_secret", "string");

    try {
      const res = await axios.post(
        "http://192.168.1.64:8001/api/users/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
