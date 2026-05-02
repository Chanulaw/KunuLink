import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages Import කිරීම
import Navbar from './components/Navbar';
import Home from './pages/Home';         // Login Page එක
import About from './pages/About';       // මුල් පිටුව
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Tracking from './pages/Tracking'; // User Activity Page එක
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

// Protected Route Function: ලොග් වී නැති පරිශීලකයින් ආරක්ෂා කිරීමට
const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    // ලොග් වී නැත්නම් Login පිටුවට යවයි
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    // අදාළ Role එක නැත්නම් (උදා: user කෙනෙක් admin පේජ් එකට යාම) Home එකට යවයි
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* හැම පේජ් එකකම පෙනෙන Navbar එක */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes - ඕනෑම කෙනෙකුට බැලිය හැක */}
            <Route path="/" element={<About />} />
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected Routes - User ලොග් වූ පසු පමණක් පෙනේ */}
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

            {/* Admin Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* වැරදි URL එකක් ගැහුවොත් ස්වයංක්‍රීයව About Page එකට යොමු කරයි */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;