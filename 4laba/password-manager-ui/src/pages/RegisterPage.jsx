import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.1.64:8001/api/users/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/login");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
