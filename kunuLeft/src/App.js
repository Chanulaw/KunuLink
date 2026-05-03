import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Navbar එක තියෙන තැන හරියටම දෙන්න
import Navbar from './components/Navbar'; 
import About from './pages/About';
import Home from './pages/Home'; 
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Tracking from './pages/Tracking';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Register />} />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/tracking" 
              element={
                <ProtectedRoute role="user">
                  <Tracking />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;