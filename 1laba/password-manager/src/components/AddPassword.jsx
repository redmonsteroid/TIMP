import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordContext } from '../context/PasswordContext';
import { addPassword } from '../services/api';

const AddPassword = () => {
  const [form, setForm] = useState({
    title: '',
    login: '',
    password: ''
  });
  const { user } = usePasswordContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPassword({ ...form, userId: user.id }, user.token);
      navigate('/');
    } catch (error) {
      alert('Failed to add password');
    }
  };

  return (
    <div className="password-form">
      <h2>Add New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Login:</label>
          <input
            name="login"
            value={form.login}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn">Save</button>
      </form>
    </div>
  );
};

export default AddPassword;