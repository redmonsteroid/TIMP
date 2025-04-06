import { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordItem = ({ password, onDelete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-item">
      <h3>{password.title}</h3>
      <p>Login: {password.login}</p>
      <p>
        Password: 
        {visible ? password.password : '••••••••'}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </p>
      <div className="actions">
        <Link to={`/edit/${password.id}`}>Edit</Link>
        <button onClick={() => onDelete(password.id)}>Delete</button>
      </div>
    </div>
  );
};

export default PasswordItem;