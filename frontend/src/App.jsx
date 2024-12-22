import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Profile from './components/Profile'; 
import PostDetail from './components/PostDetail'; 
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el token está en el localStorage al cargar la página
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true); // Si hay token, está autenticado
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  }, []);

  const handleLogout = () => {
    // Eliminar el token y actualizar el estado
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/profile" element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/posts/:id" element={isAuthenticated ? <PostDetail /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;