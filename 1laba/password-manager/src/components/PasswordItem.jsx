
const PasswordItem = ({ password, onDelete }) => {
  return (
    <div className="password-item">
      <h3>{password.title}</h3>
      <p>Login: {password.login}</p>
      <p>Password: ••••••••</p>
      <button 
        onClick={() => onDelete(password.id)}
        className="btn btn-delete"
      >
      Delete
      </button>
    </div>
  );
};

export default PasswordItem;