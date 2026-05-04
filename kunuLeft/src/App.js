import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './components/Navbar';
import Login from './pages/Login'; 
import Home from './pages/Home';   
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RequestForm from './pages/RequestForm';
import Tracking from './pages/Tracking';
import UserDashboard from './pages/UserDashboard'; 
import './App.css';

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('uid', user.uid);
            localStorage.setItem('username', data.username || data.fullName);
          }
        } catch (e) {
          console.error("Error fetching user role:", e);
        }
      } else {
        localStorage.clear(); 
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children, role }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!authReady) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/login" />; // login නැත්නම් login පිටුවට යවන්න
    if (role && userRole !== role) return <Navigate to="/" />;
    return children;
  };

  if (!authReady) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} /> 
          
          <Route path="/login" element={<Login />} /> 

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
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

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