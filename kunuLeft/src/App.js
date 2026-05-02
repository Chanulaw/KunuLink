import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// පේජ් සහ කම්පෝනන්ට්ස් Import කිරීම
import Navbar from './components/Navbar';
import About from './pages/About';       // පද්ධතියට ආපු ගමන් පේන පේජ් එක
import Home from './pages/Home';         // Login පේජ් එක
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; // Map + Form පේජ් එක
import Tracking from './pages/Tracking';           // Activity History පේජ් එක
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

// ආරක්ෂිතව පිටු පාලනය කරන Function එක (ProtectedRoute)
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
        {/* Navbar එක හැම පිටුවකම ඉහළින් පවතී */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* 1. සයිට් එකට ආපු ගමන් පෙනෙන පිටුව (URL: /) */}
            <Route path="/" element={<About />} />

            {/* 2. Login සහ Register පිටු */}
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Register />} />

            {/* 3. User ලොග් වුණාම යන Dashboard එක (URL: /dashboard) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* 4. Activity History පේජ් එක (URL: /tracking) */}
            <Route 
              path="/tracking" 
              element={
                <ProtectedRoute role="user">
                  <Tracking />
                </ProtectedRoute>
              } 
            />

            {/* 5. Admin Dashboard එක (URL: /admin) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* වැරදි URL එකක් ආවොත් About එකට හරවා එවීම */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;