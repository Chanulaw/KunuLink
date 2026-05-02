import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages Import
import Navbar from './components/Navbar';
import About from './pages/About';
import Home from './pages/Home';         // මෙය ඔබගේ Login Page එකයි
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Tracking from './pages/Tracking';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

// ආරක්ෂිතව පිටු වෙත පිවිසීම පාලනය කරන Function එක (Protected Route)
const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />; // වැරදි Role එකක් නම් මුල් පිටුවට යවයි
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-main-layout">
        {/* Navbar එක සැමවිටම ඉහළින් පවතී */}
        <Navbar />

        <div className="page-content">
          <Routes>
            {/* 1. ප්‍රධාන පිටුව (Run කළ සැනින් පෙනෙන පිටුව) */}
            <Route path="/" element={<About />} />

            {/* 2. Login සහ Register පිටු */}
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Register />} />

            {/* 3. User හට පමණක් පෙනෙන පිටු */}
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

            {/* 4. Admin හට පමණක් පෙනෙන පිටු */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* වැරදි URL එකක් ආවොත් ස්වයංක්‍රීයව About (මුල් පිටුවට) යොමු කරයි */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;