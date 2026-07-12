// client/src/components/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalWorkshops: 0,
    totalUpdates: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:5000/api/stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        const updatesRes = await axios.get('http://localhost:5000/api/updates/recent');
        if (updatesRes.data.success) {
          setRecentUpdates(updatesRes.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            🏥 Hospital Knowledge <br />Management System
          </h1>
          <p style={styles.heroSubtitle}>
            Centralized platform for managing hospital policies, protocols, workshops, and documents.
            Empower your staff with easy access to critical information.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/admin-login" style={styles.btnPrimary}>
              Admin Login
            </Link>
            <Link to="/documents" style={styles.btnSecondary}>
              Browse Documents
            </Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <path d="M4 12v5c0 3 3 5 8 5s8-2 8-5v-5" />
            <rect x="3" y="3" width="18" height="12" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <circle cx="7" cy="6" r="0.5" fill="#2563EB" />
            <circle cx="17" cy="6" r="0.5" fill="#2563EB" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{loading ? '...' : stats.totalDocuments}</span>
            <span style={styles.statLabel}>📄 Documents</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{loading ? '...' : stats.totalWorkshops}</span>
            <span style={styles.statLabel}>🎓 Workshops</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{loading ? '...' : stats.totalUpdates}</span>
            <span style={styles.statLabel}>📢 Updates</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{loading ? '...' : stats.totalUsers}</span>
            <span style={styles.statLabel}>👥 Users</span>
          </div>
        </div>
      </section>

      {/* Features Section with Animation and SVG Icons */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose HKMS?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard} className="home-feature-card">
            <div style={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>Document Library</h3>
            <p>Access all protocols, policies, and forms in one place with version control.</p>
          </div>

          <div style={styles.featureCard} className="home-feature-card">
            <div style={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3>Workshops & Courses</h3>
            <p>View training workshops, courses, and educational videos with multimedia.</p>
          </div>

          <div style={styles.featureCard} className="home-feature-card">
            <div style={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>Updates & News</h3>
            <p>Stay updated with the latest announcements and changes in your hospital.</p>
          </div>

          <div style={styles.featureCard} className="home-feature-card">
            <div style={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>Secure & Role-Based</h3>
            <p>Admin-only content management with secure authentication and authorization.</p>
          </div>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section style={styles.updatesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Latest Updates</h2>
          <Link to="/updates" style={styles.viewAllLink}>View All →</Link>
        </div>
        {loading ? (
          <p style={styles.loadingText}>Loading updates...</p>
        ) : recentUpdates.length === 0 ? (
          <p style={styles.emptyText}>No recent updates.</p>
        ) : (
          <div style={styles.updatesList}>
            {recentUpdates.map((update) => (
              <div key={update._id} style={styles.updateItem}>
                <span style={styles.updateDate}>
                  {new Date(update.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <div style={styles.updateContent}>
                  <h4 style={styles.updateTitle}>{update.title}</h4>
                  <p style={styles.updateDesc}>{update.description}</p>
                  <span style={styles.updateType}>{update.type || 'General'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
    </div>
  );
};

// ===== الأنماط =====
const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    background: '#F8FAFC',
    padding: '0 24px 48px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 0 20px',
    gap: '40px',
    flexWrap: 'wrap',
  },
  heroContent: {
    flex: 1,
    minWidth: '280px',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 1.2,
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#475569',
    lineHeight: 1.7,
    maxWidth: '560px',
    marginBottom: '24px',
  },
  heroButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '12px 28px',
    background: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    textDecoration: 'none',
    border: '1px solid #2563EB',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    display: 'inline-block',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  btnSecondary: {
    padding: '12px 28px',
    background: 'transparent',
    color: '#475569',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    textDecoration: 'none',
    border: '1px solid #E2E8F0',
    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
    display: 'inline-block',
  },
  heroImage: {
    flex: 0.8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '200px',
  },
  statsSection: {
    maxWidth: '1200px',
    margin: '20px auto 40px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  statCard: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto 48px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '24px',
    textAlign: 'center',
    letterSpacing: '-0.3px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    background: '#FFFFFF',
    padding: '24px 20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0, // تبدأ مخفية ثم تظهر عبر الأنيميشن
    transform: 'translateY(20px)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  featureIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
  },
  updatesSection: {
    maxWidth: '1200px',
    margin: '0 auto 48px',
    background: '#FFFFFF',
    padding: '24px 28px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  viewAllLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
    transition: 'color 0.2s',
  },
  updatesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  updateItem: {
    display: 'flex',
    gap: '20px',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '16px',
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: '0',
    },
  },
  updateDate: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '500',
    minWidth: '110px',
    flexShrink: 0,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '4px',
  },
  updateDesc: {
    fontSize: '15px',
    color: '#475569',
    marginBottom: '6px',
  },
  updateType: {
    display: 'inline-block',
    background: '#DBEAFE',
    color: '#2563EB',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  loadingText: {
    color: '#94A3B8',
    textAlign: 'center',
    padding: '20px 0',
  },
  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    padding: '20px 0',
  },
  cta: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    background: '#2563EB',
    color: '#FFFFFF',
    padding: '40px 24px',
    borderRadius: '14px',
    border: '1px solid #2563EB',
  },
  ctaTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  ctaDesc: {
    fontSize: '18px',
    marginBottom: '24px',
    opacity: 0.9,
  },
  ctaButton: {
    padding: '12px 32px',
    background: '#FFFFFF',
    color: '#2563EB',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

// ===== CSS إضافي للتفاعلات والأنيميشن =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  /* أنيميشن ظهور البطاقات من الأسفل */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* تأخير ظهور كل بطاقة على حدة */
  .home-feature-card:nth-child(1) { animation-delay: 0.1s; }
  .home-feature-card:nth-child(2) { animation-delay: 0.2s; }
  .home-feature-card:nth-child(3) { animation-delay: 0.3s; }
  .home-feature-card:nth-child(4) { animation-delay: 0.4s; }

  /* تأثير hover للبطاقات */
  .home-feature-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #2563EB;
  }

  /* أزرار الهيرو */
  .home-btn-primary:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-2px);
  }
  .home-btn-secondary:hover {
    background: #F1F5F9;
    color: #0F172A;
    border-color: #CBD5E1;
  }

  /* رابط View All */
  .home-view-all-link:hover {
    color: #1D4ED8;
    text-decoration: underline;
  }

  /* زر CTA */
  .home-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  .home-cta-button:active {
    transform: scale(0.98);
  }

  /* استجابة للشاشات الصغيرة */
  @media (max-width: 640px) {
    .home-hero-title { font-size: 32px; }
    .home-hero-subtitle { font-size: 16px; }
    .home-stats-grid { grid-template-columns: 1fr 1fr; }
    .home-features-grid { grid-template-columns: 1fr; }
    .home-update-item { flex-direction: column; gap: 4px; }
  }
`;
document.head.appendChild(styleSheet);

export default Home;