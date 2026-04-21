import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLogin, setIsLogin] = useState(true); // Login සහ Register අතර මාරු වීමට
  const [user, setUser] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // --- Login Logic ---
      if (user.username === 'admin' && user.password === '123') {
        // Admin කෙනෙක් ලෙස දත්ත සේව් කිරීම
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin');
        window.location.reload(); // Navbar එක update වීමට refresh කිරීම
      } else {
        // සාමාන්‍ය User කෙනෙක් ලෙස දත්ත සේව් කිරීම
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/request');
        window.location.reload(); // Navbar එක update වීමට refresh කිරීම
      }
    } else {
      // --- Register Logic ---
      alert(`ලියාපදිංචිය සාර්ථකයි! දැන් Login වන්න.`);
      setIsLogin(true); // Register වුණාට පසු Login පිටුවට හරවයි
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#2e7d32', fontSize: '2.5rem' }}>Smart Waste Portal</h1>
      <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '10px auto' }}>
        පිරිසිදු පරිසරයක් වෙනුවෙන් අපද්‍රව්‍ය කළමනාකරණය විධිමත් කරන ශ්‍රී ලංකාවේ ප්‍රමුඛතම ඩිජිටල් පද්ධතිය.
      </p>

      <div style={{ 
        maxWidth: '380px', 
        margin: '40px auto', 
        padding: '30px', 
        border: '1px solid #2e7d32', 
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '20px' }}>
            {isLogin ? 'Login (ඇතුළු වන්න)' : 'Register (ලියාපදිංචි වන්න)'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
              onChange={(e) => setUser({...user, email: e.target.value})} 
            />
          )}
          <input 
            type="text" 
            placeholder="Username" 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setUser({...user, username: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setUser({...user, password: e.target.value})} 
          />
          
          <button type="submit" style={{ 
            backgroundColor: '#2e7d32', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          {isLogin ? "ගිණුමක් නොමැතිද? " : "දැනටමත් ගිණුමක් තිබේද? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </span>
        </p>
      </div>

      {/* Admin ටෙස්ට් කිරීමට කුඩා දැනුම්දීමක් (Presentation එකට ලේසියි) */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        <p>Admin ලෙස පරීක්ෂා කිරීමට: <b>admin / 123</b> භාවිතා කරන්න.</p>
      </div>
    </div>
  );
}

export default Home;