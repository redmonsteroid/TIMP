import { useEffect } from 'react';
import { usePasswordContext } from '../context/PasswordContext';
import { fetchPasswords, deletePassword } from '../services/api';
import PasswordItem from './PasswordItem';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const PasswordList = () => {
  const { state, dispatch, user } = usePasswordContext();
  const { passwords, loading } = state;

  useEffect(() => {
    const loadPasswords = async () => {
      try {
        const data = await fetchPasswords(user.id);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };
    loadPasswords();
  }, [user, dispatch]);

  const handleDelete = async (passwordId) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }
  
    try {
      await deletePassword(passwordId, user.id, user.token);
      dispatch({ type: 'DELETE_PASSWORD', payload: passwordId });
    } catch (error) {
      alert(`Delete failed: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="password-list">
      <div className="header">
        <h2>Welcome, {user.username}!</h2>
        <LogoutButton />
      </div>
      <Link to="/add" className="btn">Add New Password</Link>
      <div className="passwords">
        {passwords.length === 0 ? (
          <p>No passwords yet. Add your first password!</p>
        ) : (
          passwords.map(password => (
            <PasswordItem 
              key={password.id} 
              password={password} 
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordList;