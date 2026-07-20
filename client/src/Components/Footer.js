// client/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.left}>
          <span>© 2026 HKMS. All rights reserved.</span>
        </div>
        <div style={styles.center}>
          <Link to="/privacy" style={styles.link} className="footer-link">Privacy Policy</Link>
          <Link to="/terms" style={styles.link} className="footer-link">Terms of Use</Link>
          <Link to="/contact" style={styles.link} className="footer-link">Contact Us</Link>
        </div>
        <div style={styles.right}>
          <Link to="/login" style={{ ...styles.link, ...styles.adminLink }} className="footer-admin-link">
            🔐 Admin Login
          </Link>
          
        </div>
      </div>
    </footer>
  );
};

// ===== الأنماط المحدثة وفق HKMS =====
const styles = {
  footer: {
    background: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    color: '#0F172A',
    padding: '12px 24px',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '1440px',
    margin: '0 auto',
    gap: '12px',
  },
  left: {
    fontSize: '14px',
    color: '#64748B',
  },
  center: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
  },
  right: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  link: {
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  adminLink: {
    color: '#2563EB',
    border: '1px solid #2563EB',
    padding: '4px 12px',
    borderRadius: '10px',
    background: 'transparent',
    fontWeight: '500',
    transition: 'background 0.2s, color 0.2s',
  },
  staffLink: {
    color: '#475569',
    border: '1px solid #E2E8F0',
    padding: '4px 12px',
    borderRadius: '10px',
    background: 'transparent',
    fontWeight: '500',
    transition: 'background 0.2s, color 0.2s',
  },
};

// ===== CSS إضافي للتفاعلات =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .footer-link:hover {
    color: #2563EB;
  }
  .footer-admin-link:hover {
    background: #2563EB;
    color: #FFFFFF !important;
    border-color: #2563EB;
  }
  .footer-staff-link:hover {
    background: #F1F5F9;
    color: #0F172A !important;
    border-color: #CBD5E1;
  }
`;
document.head.appendChild(styleSheet);

export default Footer;