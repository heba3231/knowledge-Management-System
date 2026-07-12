// src/auth/Register.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, clearSuccess } from '../Features/StaffSlice';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  name: yup.string().min(2).max(50).required('Full name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  staffNumber: yup.string().min(3).max(20).required('Staff number is required').matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers'),
  password: yup.string().min(6).max(30).required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password'),
  department: yup.string().oneOf(['General', 'ER', 'ICU', 'Lab', 'Pharmacy', 'Radiology', 'Nursing', 'HR'], 'Invalid department').required('Department required'),
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    staffNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Staff',
    department: 'General'
  });
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.staff);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      const { confirmPassword, ...userData } = formData;
      const result = await dispatch(registerUser(userData));
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(clearSuccess());
        setTimeout(() => navigate('/staff-login'), 1500);
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Registration error:', err);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register to access the Health Knowledge Management System</p>

        {success && (
          <div style={styles.success}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Registration successful! Redirecting to login...
          </div>
        )}
        {(error || localError) && (
          <div style={styles.error}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.name ? '#EF4444' : '#E2E8F0' }}
                className="register-input"
              />
              {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Staff Number *</label>
              <input
                type="text"
                name="staffNumber"
                placeholder="Enter staff number"
                value={formData.staffNumber}
                onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.staffNumber ? '#EF4444' : '#E2E8F0' }}
                className="register-input"
              />
              {errors.staffNumber && <div style={styles.fieldError}>{errors.staffNumber}</div>}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, borderColor: errors.email ? '#EF4444' : '#E2E8F0' }}
              className="register-input"
            />
            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.password ? '#EF4444' : '#E2E8F0' }}
                className="register-input"
              />
              {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.confirmPassword ? '#EF4444' : '#E2E8F0' }}
                className="register-input"
              />
              {errors.confirmPassword && <div style={styles.fieldError}>{errors.confirmPassword}</div>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{ ...styles.select, borderColor: errors.department ? '#EF4444' : '#E2E8F0' }}
                className="register-select"
              >
                <option value="General">General</option>
                <option value="ER">Emergency Room</option>
                <option value="ICU">ICU</option>
                <option value="Lab">Laboratory</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology</option>
                <option value="Nursing">Nursing</option>
                <option value="HR">Human Resources</option>
              </select>
              {errors.department && <div style={styles.fieldError}>{errors.department}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
                className="register-select"
              >
                <option value="Staff">Staff</option>
                <option value="DocumentController">Document Controller</option>
                <option value="DepartmentManager">Department Manager</option>
                <option value="QualityManager">Quality Manager</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading || success} style={styles.submitBtn} className="register-submit-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div style={styles.footer}>
            Already have an account? <Link to="/staff-login" style={styles.link} className="register-link">Login here</Link>
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
    maxWidth: '700px',
    width: '100%',
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
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '6px',
    textAlign: 'center',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  label: {
    fontWeight: '500',
    color: '#0F172A',
    fontSize: '14px',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    background: '#FFFFFF',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  fieldError: {
    color: '#EF4444',
    fontSize: '12px',
    marginTop: '2px',
  },
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '10px 14px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '10px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    background: '#ECFDF5',
    color: '#22C55E',
    padding: '10px 14px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '10px',
    border: '1px solid #BBF7D0',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  link: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
};

// ===== CSS إضافي للتفاعلات =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .register-input:focus, .register-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .register-submit-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .register-submit-btn:active {
    transform: scale(0.98);
  }
  .register-link:hover {
    color: #1D4ED8;
  }
  @media (max-width: 640px) {
    .register-row {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Register;