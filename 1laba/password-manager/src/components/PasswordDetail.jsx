import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePasswordContext } from '../context/PasswordContext';
import { getPassword } from '../services/api';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import './PasswordDetail.css';

const PasswordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = usePasswordContext();
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const data = await getPassword(id);
        if (data.userId !== user?.id) {
          throw new Error('Unauthorized access');
        }
        setPassword(data);
      } catch (err) {
        setError(err.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPassword();
  }, [id, user?.id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="password-detail">
      <h2>{password.title}</h2>
      <div className="detail-item">
        <span className="label">Login:</span>
        <span className="value">{password.login}</span>
      </div>
      <div className="detail-item">
        <span className="label">Password:</span>
        <span className="value password-value">
          {password.password}
        </span>
      </div>
      <div className="detail-item">
        <span className="label">Strength:</span>
        <PasswordStrengthIndicator password={password.password} />
      </div>
      <div className="detail-item">
        <span className="label">Created:</span>
        <span className="value">
          {new Date(password.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="detail-item">
        <span className="label">Last Updated:</span>
        <span className="value">
          {new Date(password.updatedAt || password.createdAt).toLocaleDateString()}
        </span>
      </div>
      <button 
        onClick={() => navigate(`/edit/${id}`)}
        className="btn edit-btn"
      >
        Edit Password
      </button>
    </div>
  );
};

export default PasswordDetail;