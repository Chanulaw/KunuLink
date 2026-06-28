import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; 
import Activity from './pages/Activity';
import SmartNotifications from './pages/SmartNotifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers'; 
import EcoGuide from "./pages/EcoGuide"; 
import CollectorDashboard from './pages/CollectorDashboard';
import CollectorsPage from './pages/CollectorsPage';
import AddCollector from './pages/AddCollectors';
import './App.css';
import Footer from './components/Footer';

// 🔒 Protected Routes
const UserProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  if (!isLoggedIn || userRole !== 'user') return <Navigate to="/login" replace />;
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  if (!isLoggedIn || userRole !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

const CollectorProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  if (!isLoggedIn || userRole !== "collector") return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* පොදු පිටු */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/eco-guide" element={<EcoGuide />} />

        {/* පරිශීලක පිටු */}
        <Route path="/request" element={<UserProtectedRoute><UserDashboard /></UserProtectedRoute>} />
        <Route path="/activity" element={<UserProtectedRoute><Activity /></UserProtectedRoute>} />
        <Route path="/notifications" element={<UserProtectedRoute><SmartNotifications /></UserProtectedRoute>} />

        {/* ඇඩ්මින් පිටු */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
        <Route path="/collectors" element={<AdminProtectedRoute><CollectorsPage /></AdminProtectedRoute>} />
        <Route path="/collectors/add" element={<AdminProtectedRoute><AddCollector /></AdminProtectedRoute>} />

        {/* එකතු කරන්නන්ගේ පිටු */}
        <Route path="/collector" element={<CollectorProtectedRoute><CollectorDashboard /></CollectorProtectedRoute>} />

        {/* වැරදි URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;