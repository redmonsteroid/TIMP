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
      const currentDate = new Date().toISOString();
      await addPassword({ 
        ...form,
        userId: user.id,
        createdAt: currentDate,
        updatedAt: currentDate
      }, user.token);
      navigate('/');
    } catch (error) {
      alert(`Failed to add password: ${error.message}`);
    }
  };

  return (
    <div className="password-form">
      <h2>Add New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Gmail, GitHub"
            required
          />
        </div>
        <div className="form-group">
          <label>Username/Email:</label>
          <input
            name="login"
            value={form.login}
            onChange={handleChange}
            placeholder="Your login"
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
            placeholder="Strong password"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn cancel">
            Cancel
          </button>
          <button type="submit" className="btn save">
            Save Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPassword;