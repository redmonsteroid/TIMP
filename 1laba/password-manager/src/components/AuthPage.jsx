import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordContext } from '../context/PasswordContext';
import { login } from '../services/api';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = usePasswordContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        token: 'secret-token' // Явно сохраняем токен
      }));
      loginUser(user);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Login
        </button>
          <p className="auth-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
      </form>
    </div>
    
  );
};

export default AuthPage;