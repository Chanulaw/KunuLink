import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; 
import Activity from './pages/Activity';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers'; 
import EcoGuide from "./pages/EcoGuide"; 
import './App.css';
import Footer from './components/Footer';

// 🔒 User ආරක්ෂිත පියවර (ProtectedRoute)
const UserProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isLoggedIn || userRole !== 'user') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🔒 Admin ආරක්ෂිත පියවර (AdminProtectedRoute)
const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* පොදු පිටු (Public Routes) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* පරිශීලක පිටු (User Protected Routes) */}
        <Route path="/request" element={<UserProtectedRoute><UserDashboard /></UserProtectedRoute>} />
        <Route path="/activity" element={<UserProtectedRoute><Activity /></UserProtectedRoute>} />

        {/* ඇඩ්මින් පිටු (Admin Protected Routes) */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />

        {/* වැරදි URL ආවොත් Home එකට හරවා යැවීම */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/eco-guide" element={<EcoGuide />} />



      </Routes>

      

      <Footer />
    </Router>
  );
}

export default App;