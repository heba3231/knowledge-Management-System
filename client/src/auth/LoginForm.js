// client/src/auth/LoginForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({
  title,
  subtitle,
  onSubmit,
  isLoading,
  error,
  showToggle = false,
  buttonText = 'Login',
  useStaffNumber = false,
}) => {
  const [loginType, setLoginType] = useState(useStaffNumber ? 'staffNumber' : 'email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = {};
    if (loginType === 'email') {
      credentials.email = identifier;
    } else {
      credentials.staffNumber = identifier;
    }
    credentials.password = password;
    onSubmit(credentials);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {showToggle && !useStaffNumber && (
            <div style={styles.toggleContainer}>
              <button
                type="button"
                style={{ ...styles.toggleBtn, ...(loginType === 'email' ? styles.toggleActive : {}) }}
                onClick={() => setLoginType('email')}
                className="login-toggle-btn"
              >
                Email
              </button>
              <button
                type="button"
                style={{ ...styles.toggleBtn, ...(loginType === 'staffNumber' ? styles.toggleActive : {}) }}
                onClick={() => setLoginType('staffNumber')}
                className="login-toggle-btn"
              >
                Staff Number
              </button>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.field}>
            <label style={styles.label}>
              {loginType === 'email' ? 'Email' : 'Staff Number'}
            </label>
            <input
              type={loginType === 'email' ? 'email' : 'text'}
              placeholder={loginType === 'email' ? 'Enter your email' : 'Enter staff number'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={styles.input}
              className="login-input"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.passwordInput}
                className="login-password-input"
              />
              <span
                style={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
                className="login-eye-icon"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link} className="login-link">Forgot password?</Link>
            <Link to="/help" style={styles.link} className="login-link">Need help?</Link>
          </div>

          <button type="submit" disabled={isLoading} style={styles.submitBtn} className="login-submit-btn">
            {isLoading ? 'Loading...' : buttonText}
          </button>

          <div style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link} className="login-link">Register here</Link>
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
    background: '#F8FAFC',
    padding: '20px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
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
  toggleContainer: {
    display: 'flex',
    background: '#F8FAFC',
    borderRadius: '10px',
    padding: '3px',
    border: '1px solid #E2E8F0',
  },
  toggleBtn: {
    flex: 1,
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    fontWeight: '500',
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    borderRadius: '8px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  toggleActive: {
    background: '#2563EB',
    color: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    width: '100%',
    padding: '10px 42px 10px 14px',
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
  eyeIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#94A3B8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
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
  .login-input:focus,
  .login-password-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .login-toggle-btn:hover {
    background: #F1F5F9;
  }
  .login-toggle-btn:active {
    transform: scale(0.98);
  }
  .login-eye-icon:hover {
    color: #2563EB;
  }
  .login-submit-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .login-submit-btn:active {
    transform: scale(0.98);
  }
  .login-link:hover {
    color: #1D4ED8;
  }
  .login-link:focus-visible {
    outline: 2px solid #2563EB;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
document.head.appendChild(styleSheet);

export default LoginForm;