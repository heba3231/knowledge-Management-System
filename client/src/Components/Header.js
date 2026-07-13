// client/src/components/common/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// استيراد الصور
import img1 from '../images/img1.jpg';
import img2 from '../images/img3.png';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
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
      {/* صف واحد يحتوي على جميع العناصر */}
      <div style={styles.topRow}>
        {/* الجهة اليسرى: شريط البحث + أيقونة المستخدم */}
        <div style={styles.leftGroup}>
          <form onSubmit={handleSearch} style={styles.searchForm} className="header-search-form">
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              className="header-search-input"
            />
            <button type="submit" style={styles.searchBtn} className="header-search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

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
                  <Link to="/profile" style={styles.dropdownItem} className="dropdown-item">👤 الملف الشخصي</Link>
                  <div style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={styles.dropdownLogout} className="dropdown-logout">
                    🚪 تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/admin-login" style={styles.adminLoginLink} className="header-admin-login-link">
              دخول الأدمن
            </Link>
          )}
        </div>

        {/* المنتصف: الروابط + زر الإدارة (للأدمن) */}
        <nav style={styles.nav}>
          <Link to="/" style={styles.link} className="header-link">الرئيسية</Link>
          <Link to="/dashboard" style={styles.link} className="header-link">لوحة التحكم</Link>
          <Link to="/documents" style={styles.link} className="header-link">المستندات</Link>
          <Link to="/workshops" style={styles.link} className="header-link">ورش العمل</Link>
          <Link to="/analytics" style={styles.link} className="header-link">تحليلات</Link>

          {token && isAdmin && (
            <div style={styles.adminSection} ref={adminDropdownRef}>
              <button
                style={styles.adminButton}
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                className="header-admin-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                الإدارة
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {adminDropdownOpen && (
                <div style={styles.adminDropdown} className="header-admin-dropdown">
                  <Link to="/admin/news" style={styles.adminDropdownItem} className="admin-dropdown-item">📰 الأخبار</Link>
                  <Link to="/admin/events" style={styles.adminDropdownItem} className="admin-dropdown-item">📅 الفعاليات</Link>
                  <Link to="/admin/contributions" style={styles.adminDropdownItem} className="admin-dropdown-item">🤝 المبادرات</Link>
                  <Link to="/admin/services" style={styles.adminDropdownItem} className="admin-dropdown-item">🩺 الخدمات</Link>
                  <div style={styles.dropdownDivider} />
                  <Link to="/categories" style={styles.adminDropdownItem} className="admin-dropdown-item">📂 التصنيفات</Link>
                  <Link to="/users" style={styles.adminDropdownItem} className="admin-dropdown-item">👥 المستخدمين</Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* الجهة اليمنى: الصور + النص */}
        <div style={styles.logo}>
                      <span style={styles.logoText}>مجمع صحم الصحي</span>

          <Link to="/" style={styles.logoLink}>
            <img src={img1} alt="مجمع صحم الصحي" style={styles.logoImage} />
            <img src={img2} alt="مجمع صحم الصحي" style={styles.logoImage} />
          </Link>
        </div>
      </div>
    </header>
  );
};

// ===== الأنماط =====
const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    fontFamily: '"Amiri", serif',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '140px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  // الجهة اليسرى
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '0 12px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    height: '44px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    padding: '8px 0',
    color: '#0F172A',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    width: '120px',
  },
  searchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748B',
    padding: '4px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
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
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#2563EB',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '15px',
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
    top: '50px',
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
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
  },
  adminLoginLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 18px',
    borderRadius: '10px',
    border: '1px solid #2563EB',
    background: 'transparent',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: 'inherit',
  },
  // المنتصف: الروابط
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '8px',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: 'inherit',
  },
  // زر الإدارة
  adminSection: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  adminButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: '#475569',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: 'inherit',
  },
  adminDropdown: {
    position: 'absolute',
    top: '45px',
    right: 0,
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '6px 0',
    minWidth: '180px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 100,
    border: '1px solid #E2E8F0',
  },
  adminDropdownItem: {
    display: 'block',
    padding: '8px 16px',
    color: '#0F172A',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background 0.2s',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '0 6px',
    fontFamily: 'inherit',
  },
  // الجهة اليمنى: اللوجو
  logo: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#0F172A',
    gap: '10px',
    flexDirection: 'row',
  },
  logoImage: {
    height: '130px',
    width: '130px',
    maxWidth: '220px',
    objectFit: 'contain',
    display: 'block',
  },
  logoText: {
    fontSize: '34px',
    fontWeight: '800',
    color: '#000000',
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  },
};

// ===== CSS إضافي =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

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
  .header-dropdown .dropdown-item:hover,
  .header-admin-dropdown .admin-dropdown-item:hover {
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
  .header-admin-btn:hover {
    background: #F1F5F9;
    color: #0F172A;
  }
  @media (max-width: 768px) {
    .top-row {
      flex-direction: column;
      height: auto;
      padding: 12px 16px;
    }
    .nav {
      order: 3;
      flex: 1 1 100%;
      justify-content: center;
    }
    .left-group {
      order: 2;
    }
    .logo {
      order: 1;
    }
    .search-input {
      width: 100px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Header;