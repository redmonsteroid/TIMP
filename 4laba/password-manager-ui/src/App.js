import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav style={{ padding: "10px", background: "#f4f4f4" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Dashboard</Link>
        {token ? (
          <>
            <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
