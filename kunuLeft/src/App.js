import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

<<<<<<< HEAD
// පේජ් සහ කම්පෝනන්ට්ස් Import කිරීම
import Navbar from './components/Navbar';
import About from './pages/About';       // පද්ධතියට ආපු ගමන් පේන පේජ් එක
import Home from './pages/Home';         // Login පේජ් එක
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; // Map + Form පේජ් එක
import Tracking from './pages/Tracking';           // Activity History පේජ් එක
=======
// Components & Pages Import කිරීම
import Navbar from './components/Navbar';
import Home from './pages/Home';         // Login Page එක
import About from './pages/About';       // මුල් පිටුව
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Tracking from './pages/Tracking'; // User Activity Page එක
>>>>>>> parent of b251c18 (update dashboard)
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

<<<<<<< HEAD
// ආරක්ෂිතව පිටු පාලනය කරන Function එක (ProtectedRoute)
=======
// Protected Route Function: ලොග් වී නැති පරිශීලකයින් ආරක්ෂා කිරීමට
>>>>>>> parent of b251c18 (update dashboard)
const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    // ලොග් වී නැත්නම් Login පිටුවට යවයි
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
<<<<<<< HEAD
=======
    // අදාළ Role එක නැත්නම් (උදා: user කෙනෙක් admin පේජ් එකට යාම) Home එකට යවයි
>>>>>>> parent of b251c18 (update dashboard)
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
<<<<<<< HEAD
        {/* Navbar එක හැම පිටුවකම ඉහළින් පවතී */}
=======
        {/* හැම පේජ් එකකම පෙනෙන Navbar එක */}
>>>>>>> parent of b251c18 (update dashboard)
        <Navbar />

        <main className="main-content">
          <Routes>
<<<<<<< HEAD
            {/* 1. සයිට් එකට ආපු ගමන් පෙනෙන පිටුව (URL: /) */}
=======
            {/* Public Routes - ඕනෑම කෙනෙකුට බැලිය හැක */}
>>>>>>> parent of b251c18 (update dashboard)
            <Route path="/" element={<About />} />
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Register />} />

<<<<<<< HEAD
            {/* 3. User ලොග් වුණාම යන Dashboard එක (URL: /dashboard) */}
=======
            {/* User Protected Routes - User ලොග් වූ පසු පමණක් පෙනේ */}
>>>>>>> parent of b251c18 (update dashboard)
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
<<<<<<< HEAD

            {/* 4. Activity History පේජ් එක (URL: /tracking) */}
=======
            
>>>>>>> parent of b251c18 (update dashboard)
            <Route 
              path="/tracking" 
              element={
                <ProtectedRoute role="user">
                  <Tracking />
                </ProtectedRoute>
              } 
            />

<<<<<<< HEAD
            {/* 5. Admin Dashboard එක (URL: /admin) */}
=======
            {/* Admin Protected Routes */}
>>>>>>> parent of b251c18 (update dashboard)
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

<<<<<<< HEAD
            {/* වැරදි URL එකක් ආවොත් About එකට හරවා එවීම */}
=======
            {/* වැරදි URL එකක් ගැහුවොත් ස්වයංක්‍රීයව About Page එකට යොමු කරයි */}
>>>>>>> parent of b251c18 (update dashboard)
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;