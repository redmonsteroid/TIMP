import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('salt');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h1>Welcome to your Dashboard</h1>
      <p>You are successfully logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}