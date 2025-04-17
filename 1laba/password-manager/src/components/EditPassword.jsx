import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePasswordContext } from '../context/PasswordContext';
import { updatePassword, getPassword } from '../services/api';

const EditPassword = () => {
  const [form, setForm] = useState({ 
    title: '', 
    login: '', 
    password: '',
    createdAt: '',
    updatedAt: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = usePasswordContext();

  useEffect(() => {
    const loadPassword = async () => {
      try {
        const data = await getPassword(id);
        if (data.userId !== user?.id) {
          throw new Error('You can only edit your own passwords');
        }
        setForm({
          title: data.title,
          login: data.login,
          password: data.password,
          createdAt: data.createdAt
        });
      } catch (error) {
        alert(error.message);
        navigate('/');
      }
    };
    loadPassword();
  }, [id, user?.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(id, {
        ...form,
        updatedAt: new Date().toISOString()
      }, user.token);
      navigate('/');
    } catch (error) {
      alert(`Failed to update password: ${error.message}`);
    }
  };

  return (
    <div className="password-form">
      <h2>Edit Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name:</label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Username/Email:</label>
          <input
            name="login"
            value={form.login}
            onChange={(e) => setForm({...form, login: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
        </div>
        <div className="form-info">
          <p>Created: {new Date(form.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn cancel">
            Cancel
          </button>
          <button type="submit" className="btn save">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPassword;