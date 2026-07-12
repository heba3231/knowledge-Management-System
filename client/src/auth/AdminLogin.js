// src/auth/AdminLogin.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../Features/StaffSlice';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [staffNumber, setStaffNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.staff);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    dispatch(clearError());

    const result = await dispatch(loginUser({ staffNumber, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      const loggedUser = result.payload?.user;
      if (loggedUser && loggedUser.role !== 'Admin') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoginError('Access denied. Only Admins are allowed to login.');
        return;
      }
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* أيقونة SVG بدلاً من الرمز التعبيري */}
        <div style={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Sign in with your staff number and password</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {(error || loginError) && (
            <div style={styles.error}>{error || loginError}</div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Staff Number</label>
            <input
              type="text"
              placeholder="Enter your staff number"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              required
              style={styles.input}
              className="admin-input"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              className="admin-input"
            />
          </div>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
            <Link to="/help" style={styles.link}>Need help?</Link>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn} className="admin-submit-btn">
            {loading ? 'Loading...' : 'Login as Admin'}
          </button>

          <div style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== الأنماط المحدثة وفق HKMS =====
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#F8FAFC', // خلفية الصفحة الأساسية
    padding: '20px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '16px', // Large radius
    padding: '40px 32px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  logo: {
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#0F172A',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    color: '#64748B',
    fontSize: '14px',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    color: '#0F172A',
    fontSize: '14px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#FFFFFF',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  extraLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  link: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  error: {
    color: '#EF4444',
    background: '#FEF2F2',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid #FECACA',
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginTop: '4px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  footer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: '14px',
    marginTop: '4px',
  },
};

// ===== CSS إضافي للتفاعلات =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .admin-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .admin-submit-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .admin-submit-btn:active {
    transform: scale(0.98);
  }
  .admin-link:hover {
    color: #1D4ED8;
  }
  .admin-link:focus-visible {
    outline: 2px solid #2563EB;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
document.head.appendChild(styleSheet);

export default AdminLogin;