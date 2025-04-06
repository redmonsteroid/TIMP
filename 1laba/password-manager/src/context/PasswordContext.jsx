import { createContext, useReducer, useContext, useState } from 'react';

const PasswordContext = createContext();

const initialState = {
  passwords: [],
  loading: false,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, passwords: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_PASSWORD':
      return { ...state, passwords: [...state.passwords, action.payload] };
    case 'UPDATE_PASSWORD':
      return { ...state, passwords: state.passwords.map(p => 
        p.id === action.payload.id ? action.payload : p
      )};
    case 'DELETE_PASSWORD':
      return { ...state, passwords: state.passwords.filter(p => 
        p.id !== action.payload
      )};
    case 'RESET_PASSWORDS':
      return { ...state, passwords: [] };
    default:
      return state;
  }
};

export const PasswordProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (userData) => {
    const userWithToken = {
      ...userData,
      token: 'secret-token'
    };
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
  };

  const logoutUser = () => {
    setUser(null);
    dispatch({ type: 'RESET_PASSWORDS' });
    localStorage.removeItem('user');
  };

  return (
    <PasswordContext.Provider value={{ 
      state, 
      dispatch,
      user,
      loginUser,
      logoutUser
    }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswordContext = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePasswordContext must be used within a PasswordProvider');
  }
  return context;
};