import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordContext } from '../context/PasswordContext';
import { register } from '../services/api';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = usePasswordContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      loginUser(user);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username may be taken.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            required
            minLength="3"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="btn">Register</button>
        <p className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;