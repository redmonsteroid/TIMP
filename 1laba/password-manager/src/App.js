import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PasswordProvider, usePasswordContext } from './context/PasswordContext';
import AuthPage from './components/AuthPage';
import RegisterForm from './components/RegisterForm'; // Добавили импорт
import PasswordList from './components/PasswordList';
import AddPassword from './components/AddPassword';
import EditPassword from './components/EditPassword';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = usePasswordContext();
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
              <Route path="/register" element={<RegisterForm />} /> {/* Добавили маршрут */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PasswordList />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <EditPassword />
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