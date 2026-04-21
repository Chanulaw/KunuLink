import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components සහ Pages Import කිරීම
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import AdminDashboard from './pages/AdminDashboard';
import Tracking from './pages/Tracking'; // අනිවාර්යයෙන් මෙය තිබිය යුතුයි

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;