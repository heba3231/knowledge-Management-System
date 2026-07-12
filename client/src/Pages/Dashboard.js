// client/src/Components/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalWorkshops: 0,
    totalUpdates: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('All');

  const user = useSelector((state) => state.staff.user);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsRes = await axios.get('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        const updatesRes = await axios.get('http://localhost:5000/api/updates/recent', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatesRes.data.success) {
          setRecentUpdates(updatesRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalUsers: 0,
          totalDocuments: 0,
          totalWorkshops: 0,
          totalUpdates: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // دالة معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // بيانات البطاقات الإحصائية مع أيقونات SVG
  const metrics = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: '#2563EB',
    },
    {
      label: 'Documents',
      value: stats.totalDocuments,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      color: '#2563EB',
    },
    {
      label: 'Workshops',
      value: stats.totalWorkshops,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      color: '#2563EB',
    },
    {
      label: 'Updates',
      value: stats.totalUpdates,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      color: '#2563EB',
    },
  ];

  // روابط الوصول السريع (مع إضافة Analytics للجميع)
  const quickAccess = [
    {
      label: 'Documents',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      path: '/documents'
    },
    {
      label: 'Workshops',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      path: '/workshops'
    },
    {
      label: 'Updates',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      path: '/updates'
    },
    // ✅ إضافة Analytics للجميع
    {
      label: 'Analytics',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
          <circle cx="12" cy="16" r="5" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="9" y1="16" x2="12" y2="16" />
        </svg>
      ),
      path: '/analytics'
    },
    ...(isAdmin ? [
      {
        label: 'Users',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
        path: '/users'
      },
      {
        label: 'Categories',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
        path: '/categories'
      }
    ] : []),
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Dashboard</h1>
        <p style={styles.pageSubtitle}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Metrics Cards */}
      <div style={styles.metricsGrid}>
        {metrics.map((metric, idx) => (
          <div key={idx} style={styles.metricCard} className="dashboard-metric-card">
            <div style={styles.metricIcon}>{metric.icon}</div>
            <div style={styles.metricContent}>
              <span style={styles.metricValue}>{loading ? '...' : metric.value}</span>
              <span style={styles.metricLabel}>{metric.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Search */}
      <div style={styles.searchSection}>
        <form onSubmit={handleSearch} style={styles.searchWrapper}>
          <div style={styles.searchInputWrapper}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search documents, workshops, updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              className="dashboard-search-input"
            />
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={styles.searchSelect}
            className="dashboard-search-select"
          >
            <option value="All">All</option>
            <option value="Documents">Documents</option>
            <option value="Workshops">Workshops</option>
            <option value="Updates">Updates</option>
          </select>
          <button type="submit" style={styles.searchBtn} className="dashboard-search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </form>
      </div>

      {/* Quick Access */}
      <div style={styles.quickAccess}>
        <h3 style={styles.sectionTitle}>Quick Access</h3>
        <div style={styles.quickGrid}>
          {quickAccess.map((item, idx) => (
            <Link to={item.path} key={idx} style={styles.quickCard} className="dashboard-quick-card">
              <div style={styles.quickIcon}>{item.icon}</div>
              <span style={styles.quickLabel}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Updates */}
      <div style={styles.updatesSection}>
        <h3 style={styles.sectionTitle}>Latest Updates</h3>
        {loading ? (
          <p style={styles.loadingText}>Loading updates...</p>
        ) : recentUpdates.length === 0 ? (
          <p style={styles.noUpdates}>No recent updates.</p>
        ) : (
          <ul style={styles.updatesList}>
            {recentUpdates.map((update) => (
              <li key={update._id} style={styles.updateItem}>
                <Link to="/updates" style={styles.updateLink}>
                  <span style={styles.updateTitle}>{update.title}</span>
                </Link>
                <span style={styles.updateMeta}>
                  {update.type || 'General'} • {new Date(update.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// ===== الأنماط (مع إضافة updateLink) =====
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '4px',
    letterSpacing: '-0.3px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  metricCard: {
    background: '#FFFFFF',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  metricIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  searchSection: {
    background: '#FFFFFF',
    padding: '16px 20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    marginBottom: '24px',
  },
  searchWrapper: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minWidth: '200px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 36px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#F8FAFC',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchSelect: {
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    background: '#F8FAFC',
    fontSize: '14px',
    outline: 'none',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  searchBtn: {
    padding: '10px 20px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  quickAccess: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '16px',
    letterSpacing: '-0.2px',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '12px',
  },
  quickCard: {
    background: '#FFFFFF',
    padding: '16px 12px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#0F172A',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  quickIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  updatesSection: {
    background: '#FFFFFF',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  updatesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  updateItem: {
    padding: '12px 0',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  updateLink: {
    textDecoration: 'none',
    color: '#0F172A',
    flex: 1,
  },
  updateTitle: {
    fontWeight: '500',
    color: '#0F172A',
    fontSize: '15px',
    transition: 'color 0.2s',
  },
  updateMeta: {
    color: '#64748B',
    fontSize: '13px',
  },
  noUpdates: {
    color: '#94A3B8',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '14px',
  },
  loadingText: {
    color: '#64748B',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '14px',
  },
};

// ===== CSS إضافي للتفاعلات =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .dashboard-metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  .dashboard-quick-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  .dashboard-search-input:focus,
  .dashboard-search-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .dashboard-search-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .dashboard-search-btn:active {
    transform: scale(0.98);
  }
  .dashboard-update-link:hover .dashboard-update-title {
    color: #2563EB;
  }
  @media (max-width: 640px) {
    .dashboard-metrics-grid {
      grid-template-columns: 1fr 1fr;
    }
    .dashboard-quick-grid {
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    }
    .dashboard-search-wrapper {
      flex-direction: column;
      align-items: stretch;
    }
    .dashboard-search-input-wrapper {
      min-width: auto;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;