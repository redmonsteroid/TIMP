import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const login = async (username, password) => {
  const response = await axios.get(
    `${API_URL}/users?username=${username}&password=${password}`
  );
  if (response.data.length === 0) throw new Error('Invalid credentials');
  return response.data[0];
};


export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, {
    ...userData,
    token: 'secret-token' // Генерируем токен
  });
  return response.data;
};



export const fetchPasswords = async (userId) => {
  const response = await axios.get(`${API_URL}/passwords?userId=${userId}`);
  return response.data;
};

export const addPassword = async (password, token) => {
  const response = await axios.post(`${API_URL}/passwords`, password, {
    headers: { Authorization: token }
  });
  return response.data;
};
export const getPassword = async (id) => {
  const response = await axios.get(`${API_URL}/passwords/${id}`);
  return response.data;
};

// Обновление пароля
export const updatePassword = async (id, updatedData, token) => {
  const response = await axios.patch(`${API_URL}/passwords/${id}`, updatedData, {
    headers: { Authorization: token }
  });
  return response.data;
};

export const deletePassword = async (passwordId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.token) throw new Error('Not authenticated');

  await axios.delete(`${API_URL}/passwords/${passwordId}`, {
    headers: { 
      Authorization: user.token,
      'Content-Type': 'application/json'
    }
  });
};