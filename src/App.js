import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RequestForm from './pages/RequestForm'; // මෙතන නම නිවැරදි කළා
import Tracking from './pages/Tracking';
import './App.css';

function App() {
  const ProtectedRoute = ({ children, role }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn) return <Navigate to="/" />;
    if (role && userRole !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/request" 
            element={
              <ProtectedRoute role="user">
                <RequestForm /> {/* මෙතනත් නම වෙනස් කළා */}
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