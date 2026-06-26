import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1️⃣ Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Firestore user data fetch
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        setError("User data not found in Firestore!");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const role = (userData.role || 'user').toLowerCase(); // safe lowercase

      // 3️⃣ Save user in localStorage (clean structure)
      const activeUser = {
        uid: user.uid,
        name: userData.name || 'User',
        email: user.email,
        role: role
      };

      localStorage.setItem('user', JSON.stringify(activeUser));

      // 4️⃣ Redirect based on role
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } 
      else if (role === 'collector') {
        navigate('/collector', { replace: true });
      } 
      else {
        navigate('/request', { replace: true });
      }

    } catch (err) {
      console.error(err);

      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError("Invalid email or password!");
      } else {
        setError("Login error: " + err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="login-card">

        <div className="brand-header">
          <h1 className="brand-logo">KUNULINK</h1>
          <p className="brand-tagline">Smart Waste Management Portal</p>
        </div>

        <h2 className="login-title">Login</h2>

        {error && (
          <p style={{
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '15px',
            background: '#fef2f2',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #fee2e2'
          }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="register-link"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;