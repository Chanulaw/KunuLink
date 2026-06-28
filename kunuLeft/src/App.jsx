import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; 
import Activity from './pages/Activity';
import SmartNotifications from './pages/SmartNotifications'; // 1. අලුත් පිටුව Import කළා
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers'; 
import EcoGuide from "./pages/EcoGuide"; 
import CollectorDashboard from './pages/CollectorDashboard';
import CollectorsPage from './pages/CollectorsPage';
import AddCollector from './pages/AddCollectors';
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

const CollectorProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn || userRole !== "collector") {
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
        <Route path="/eco-guide" element={<EcoGuide />} />

        {/* පරිශීලක පිටු (User Protected Routes) */}
        <Route path="/request" element={<UserProtectedRoute><UserDashboard /></UserProtectedRoute>} />
        <Route path="/activity" element={<UserProtectedRoute><Activity /></UserProtectedRoute>} />
        <Route path="/notifications" element={<UserProtectedRoute><SmartNotifications /></UserProtectedRoute>} /> {/* 2. අලුත් Route එක ඇතුළත් කළා */}

        {/* ඇඩ්මින් පිටු (Admin Protected Routes) */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />

        {/* එකතු කරන්නන්ගේ පිටු */}
        <Route path="/collector" element={<CollectorProtectedRoute><CollectorDashboard /></CollectorProtectedRoute>} />

        {/* වැරදි URL ආවොත් Home එකට හරවා යැවීම */}
        <Route path="*" element={<Navigate to="/" replace />} />
<<<<<<< HEAD
      </Routes>
=======

        <Route path="/eco-guide" element={<EcoGuide />} />


       <Route path="/collector" element={<CollectorProtectedRoute><CollectorDashboard /></CollectorProtectedRoute>} />      
       <Route path="/collectors" element={<CollectorsPage />} />
       <Route path="/collectors/add" element={<AddCollector />} />       
       </Routes>
       
      

>>>>>>> dd22401abc01ac9d982dfbfe955fb59713851d36
      <Footer />
    </Router>
  );
}

export default App;