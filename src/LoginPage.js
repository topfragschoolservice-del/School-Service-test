import React, { useState } from 'react';
import './LoginPage.css';

/*
  LoginPage
  ─────────
  Looks up the user in localStorage (simulating a DB query).
  In a real app this would POST to /api/auth/login and receive a JWT.

  Demo credentials stored when you register:
    • Driver / Parent / Admin — just use the ID + phone number used during registration.
  Quick demo admin login:
    • ID: admin1 | Phone: 0771234567  (after registering with admin code ADMIN2026)
*/

const LoginPage = ({ onLogin, onNavigate }) => {
  const [userId, setUserId]   = useState('');
  const [phone, setPhone]     = useState('');
  const [userType, setUserType] = useState('parent');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a network delay
    setTimeout(() => {
      const saved = localStorage.getItem('schoolVanUser');

      if (!saved) {
        setError('No registered account found. Please register first.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(saved);

      // Validate: ID + phone + role must all match
      const idMatch    = user.id?.trim() === userId.trim();
      const phoneMatch = user.phone?.replace(/[-\s]/g, '') === phone.replace(/[-\s]/g, '');
      const typeMatch  = user.type === userType;

      if (idMatch && phoneMatch && typeMatch) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please check your ID, phone number, and account type.');
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🚐</div>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to School Van Service</p>

        <div className="role-tabs">
          {['parent', 'driver', 'admin'].map(role => (
            <button
              key={role}
              className={`role-tab ${userType === role ? 'active' : ''}`}
              onClick={() => { setUserType(role); setError(''); }}
              type="button"
            >
              {role === 'parent' ? '👪 Parent' : role === 'driver' ? '🚐 Driver' : '🔑 Admin'}
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>{userType === 'admin' ? 'Admin ID' : userType === 'driver' ? 'Driver ID' : 'Parent ID'}</label>
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder={`Enter your ${userType} ID`}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your registered phone number"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account?{' '}
            <button className="text-link" onClick={() => onNavigate('register')}>Register here</button>
          </p>
          <button className="text-link back-home" onClick={() => onNavigate('home')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
