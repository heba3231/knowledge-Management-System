// client/src/components/common/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login'); // توجيه إلى صفحة تسجيل الدخول للأدمن
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>
          <span style={styles.logoIcon}>🏥</span>
          <span style={styles.logoText}>HKMS</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm} className="header-search-form">
        <input
          type="text"
          placeholder="Search documents, workshops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          className="header-search-input"
        />
        <button type="submit" style={styles.searchBtn} className="header-search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <nav style={styles.nav}>
        <Link to="/" style={styles.link} className="header-link">Home</Link>

        {/* الروابط العامة (تظهر للجميع) */}
        <Link to="/dashboard" style={styles.link} className="header-link">Dashboard</Link>
        <Link to="/documents" style={styles.link} className="header-link">Documents</Link>
        <Link to="/workshops" style={styles.link} className="header-link">Workshops</Link>
{/*         <Link to="/updates" style={styles.link} className="header-link">Updates</Link>
 */}        <Link to="/analytics" style={styles.link} className="header-link">Analytics</Link>

        {/* روابط الإدارة (للأدمن فقط) */}
        {token && isAdmin && (
          <>
            <Link to="/categories" style={styles.link} className="header-link">Categories</Link>
            <Link to="/users" style={styles.link} className="header-link">Users</Link>
          </>
        )}

        {token ? (
          <div style={styles.userSection} ref={dropdownRef}>
            <div
              style={styles.userAvatar}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="header-avatar"
            >
              <span>{getInitials(user.name)}</span>
              <span style={styles.avatarBadge}>{user.role || 'Staff'}</span>
            </div>

            {dropdownOpen && (
              <div style={styles.dropdown} className="header-dropdown">
                <div style={styles.dropdownHeader}>
                  <strong>{user.name || 'User'}</strong>
                  <span style={styles.dropdownEmail}>{user.email || ''}</span>
                </div>
                <div style={styles.dropdownDivider} />
                <Link to="/profile" style={styles.dropdownItem} className="dropdown-item">👤 Profile</Link>
                <div style={styles.dropdownDivider} />
                <button onClick={handleLogout} style={styles.dropdownLogout} className="dropdown-logout">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/admin-login" style={styles.adminLoginLink} className="header-admin-login-link">
            Admin Login
          </Link>
        )}
      </nav>
    </header>
  );
};

// ===== الأنماط (نفسها مع حذف loginLink و registerLink غير المستخدمين) =====
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '64px',
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    gap: '16px',
    flexWrap: 'wrap',
  },
  logo: { display: 'flex', alignItems: 'center' },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#0F172A',
    gap: '8px',
  },
  logoIcon: { fontSize: '24px' },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: '-0.3px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: '420px',
    minWidth: '180px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '0 12px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '8px 0',
    color: '#0F172A',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  searchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748B',
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'background 0.2s, color 0.2s',
  },
  adminLoginLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: '10px',
    border: '1px solid #2563EB',
    background: 'transparent',
    transition: 'background 0.2s, color 0.2s',
  },
  userSection: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  userAvatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#2563EB',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    background: '#F8FAFC',
    color: '#2563EB',
    fontSize: '8px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  },
  dropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '6px 0',
    minWidth: '200px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 100,
    border: '1px solid #E2E8F0',
  },
  dropdownHeader: {
    padding: '8px 16px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dropdownEmail: { fontSize: '12px', color: '#64748B' },
  dropdownDivider: { height: '1px', background: '#E2E8F0', margin: '6px 12px' },
  dropdownItem: {
    display: 'block',
    padding: '8px 16px',
    color: '#0F172A',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background 0.2s',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '0 6px',
  },
  dropdownLogout: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    color: '#EF4444',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderRadius: '4px',
    margin: '0 6px',
  },
};

// ===== CSS إضافي للتفاعلات (مع حذف الكلاسات غير المستخدمة) =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .header-link:hover {
    background: #F1F5F9;
    color: #0F172A;
  }
  .header-search-form:focus-within {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .header-search-btn:hover {
    color: #2563EB;
  }
  .header-avatar:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  .header-dropdown .dropdown-item:hover {
    background: #F1F5F9;
    color: #0F172A;
  }
  .header-dropdown .dropdown-logout:hover {
    background: #FEF2F2;
  }
  .header-admin-login-link:hover {
    background: #2563EB;
    color: #FFFFFF !important;
    border-color: #2563EB;
  }
  @media (max-width: 768px) {
    .header-search-form {
      order: 10;
      flex-basis: 100%;
      max-width: 100%;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Header;