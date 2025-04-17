import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import './PasswordItem.css';

const PasswordItem = ({ password, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Обработчик клика по карточке
  const handleCardClick = () => {
    navigate(`/password/${password.id}`);
  };

  // Остановка всплытия события для кнопок внутри карточки
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="password-item" 
      onClick={handleCardClick}
      title="Click for details"
    >
      <div className="password-header">
        <h3>{password.title}</h3>
        <span className="created-date">
          Created: {new Date(password.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="password-content">
        <div className="password-field">
          <span className="label">Login:</span>
          <span className="value">{password.login}</span>
        </div>
        
        <div className="password-field">
          <span className="label">Password:</span>
          <div className="password-value">
            {visible ? (
              <span className="visible-password">{password.password}</span>
            ) : (
              <span className="hidden-password">••••••••</span>
            )}
            <button 
              onClick={(e) => {
                handleButtonClick(e);
                setVisible(!visible);
              }}
              className="toggle-visibility"
            >
              {visible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="password-field">
          <span className="label">Strength:</span>
          <PasswordStrengthIndicator password={password.password} />
        </div>
      </div>

      <div className="password-actions" onClick={handleButtonClick}>
        <Link to={`/edit/${password.id}`} className="edit-btn">
          Edit
        </Link>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this password?')) {
              onDelete(password.id);
            }
          }}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PasswordItem;