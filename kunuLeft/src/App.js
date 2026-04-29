import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/About';       
import Home from './pages/Home';         
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RequestForm from './pages/RequestForm';
import Tracking from './pages/Tracking';

// මෙන්න මේ පේළිය පරීක්ෂා කරන්න - තිතක් සහ ස්ලෑෂ් එකක් පමණයි!
import './App.css'; 

function App() {
  // Login වී ඇත්දැයි පරීක්ෂා කරන සරල ශ්‍රිතය
  const ProtectedRoute = ({ children, role }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn) return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<About />} />        
          <Route path="/login" element={<Home />} />   
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/request" 
            element={
              <ProtectedRoute role="user">
                <RequestForm />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;