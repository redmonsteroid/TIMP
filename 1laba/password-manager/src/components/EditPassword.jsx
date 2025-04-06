import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePassword, getPassword } from '../services/api';

const EditPassword = () => {
  const [form, setForm] = useState({ title: '', login: '', password: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPassword = async () => {
      const data = await getPassword(id);
      setForm(data);
    };
    loadPassword();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePassword(id, form, localStorage.getItem('token'));
    navigate('/');
  };

  return (
    <div className="password-form">
      <h2>Edit Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
          required
        />
        <input
          name="login"
          value={form.login}
          onChange={(e) => setForm({...form, login: e.target.value})}
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditPassword;