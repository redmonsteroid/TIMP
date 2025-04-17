const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
      if (!password) return 'none';
      if (password.length < 6) return 'weak';
      if (password.length < 10) return 'medium';
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        return 'medium';
      }
      return 'strong';
    };
  
    const strength = getStrength();
    const strengthText = {
      none: 'Not set',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    };
  
    return (
      <span className={`strength-indicator ${strength}`}>
        {strengthText[strength]}
      </span>
    );
  };
  
  export default PasswordStrengthIndicator;