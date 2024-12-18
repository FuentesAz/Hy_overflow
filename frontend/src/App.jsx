import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
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
          <Route path="/posts" element={isAuthenticated ? <PostList /> : <Navigate to="/login" />} />
          <Route path="/posts/:id" element={isAuthenticated ? <PostDetail /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/posts" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
