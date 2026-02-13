import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import TaskList from './TaskList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // keep state in sync if token changes in localStorage
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: redirect to login or tasks */}
        <Route path="/" element={<Navigate to={token ? "/tasks" : "/login"} />} />

        {/* Auth routes */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/tasks" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/tasks" />} />

        {/* Protected route */}
        <Route path="/tasks" element={token ? <TaskList /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
