import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PasswordProvider, usePasswordContext } from './context/PasswordContext'; // Добавили импорт хука
import AuthPage from './components/AuthPage';
import PasswordList from './components/PasswordList';
import AddPassword from './components/AddPassword';
import './App.css';

// Вынесли ProtectedRoute в отдельный компонент для лучшей читаемости
const ProtectedRoute = ({ children }) => {
  const { user } = usePasswordContext(); // Теперь хук доступен
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <PasswordProvider>
      <BrowserRouter>
        <div className="app">
          <header>
            <h1>Password Manager</h1>
          </header>
          <main>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <PasswordList />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddPassword />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PasswordProvider>
  );
}

export default App;