import { usePasswordContext } from '../context/PasswordContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logoutUser } = usePasswordContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-logout">
      Logout
    </button>
  );
};

export default LogoutButton;