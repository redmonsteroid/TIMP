import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    
    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await axios.post(
          `http://localhost:8000${endpoint}`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // Сохраняем данные в localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('salt', response.data.salt);
        localStorage.setItem('userId', response.data.user_id);
        
        // Вызываем callback и перенаправляем
        if (onLogin) onLogin(response.data);
        navigate('/dashboard'); // Перенаправление на защищенную страницу
      } else {
        // Регистрация
        await axios.post(
          `http://localhost:8000${endpoint}`,
          { username, password },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        alert("Registration successful! Please login.");
        setIsLogin(true); // Переключаем на форму входа
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button 
        className="switch-mode" 
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}