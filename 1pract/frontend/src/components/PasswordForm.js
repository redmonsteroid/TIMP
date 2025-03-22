import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Container, 
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PasswordForm = () => {
  const [password, setPassword] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [length, setLength] = useState(12);
  const [useSpecial, setUseSpecial] = useState(true);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState([]);
  const abortControllerRef = useRef(new AbortController());

  // Загрузка паролей при монтировании
  useEffect(() => {
    fetchPasswords();
    return () => abortControllerRef.current.abort();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/passwords`);
      setPasswords(response.data);
    } catch (err) {
      setError('Не удалось загрузить пароли');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/generate`,
        { service_name: serviceName, length: Number(length), use_special: useSpecial },
        { signal: abortControllerRef.current.signal }
      );
      
      setPassword(response.data.password);
      setError('');
      await fetchPasswords(); // Обновляем список после генерации
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.detail || 'Ошибка генерации');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/passwords/${id}`);
      await fetchPasswords(); // Обновляем список после удаления
    } catch (err) {
      setError('Не удалось удалить пароль');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center">
        🔐 Генератор паролей
      </Typography>
      
      <form onSubmit={handleGenerate}>
        <TextField
          label="Название сервиса"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Длина пароля"
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          inputProps={{ min: 8, max: 32 }}
          fullWidth
          margin="normal"
          required
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={useSpecial}
              onChange={(e) => setUseSpecial(e.target.checked)}
              color="primary"
            />
          }
          label="Использовать спецсимволы"
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          size="large"
          style={{ marginTop: '20px' }}
        >
          Сгенерировать пароль
        </Button>
        
        {password && (
          <Typography 
            variant="h6" 
            align="center" 
            style={{ 
              marginTop: '30px', 
              wordBreak: 'break-all',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            🎉 Ваш пароль: <strong>{password}</strong>
          </Typography>
        )}
      </form>

      <Typography variant="h6" style={{ marginTop: '40px' }}>
        История паролей
      </Typography>
      
      <List>
        {passwords.map((entry) => (
          <ListItem 
            key={entry.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => handleDelete(entry.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={entry.service_name}
              secondary={`Пароль: ${entry.password} (${new Date(entry.created_at).toLocaleDateString()})`}
            />
          </ListItem>
        ))}
      </List>

      {/* Снекбар для ошибок */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PasswordForm;