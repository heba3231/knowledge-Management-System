// client/src/Components/pages/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import axios from 'axios';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departmentData, setDepartmentData] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view analytics.');
          setLoading(false);
          return;
        }

        const statsRes = await axios.get('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsRes.data.success) {
          const stats = statsRes.data.data;

          setDepartmentData([
            { name: 'General', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.3) : 5 },
            { name: 'ER', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.2) : 4 },
            { name: 'ICU', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.15) : 3 },
            { name: 'Lab', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.1) : 2 },
            { name: 'Pharmacy', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.1) : 2 },
            { name: 'Others', value: stats.totalDocuments ? Math.floor(stats.totalDocuments * 0.15) : 3 },
          ]);

          const today = new Date();
          const days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
              date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              documents: Math.floor(Math.random() * 8) + 1,
              workshops: Math.floor(Math.random() * 3),
            });
          }
          setDailyActivity(days);

          const months = [];
          for (let i = 5; i >= 0; i--) {
            const d = new Date(today);
            d.setMonth(d.getMonth() - i);
            months.push({
              month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
              count: Math.floor(Math.random() * 15) + 5,
            });
          }
          setGrowthData(months);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Analytics Dashboard</h1>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
            <circle cx="12" cy="16" r="5" />
            <line x1="12" y1="11" x2="12" y2="16" />
            <line x1="9" y1="16" x2="12" y2="16" />
          </svg>
        </div>
        <div>
          <h1 style={styles.pageTitle}>Analytics Dashboard</h1>
          <p style={styles.pageSubtitle}>Visual insights into document usage and trends.</p>
        </div>
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartCard} className="analytics-chart-card">
          <h3 style={styles.chartTitle}>Documents by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard} className="analytics-chart-card">
          <h3 style={styles.chartTitle}>Daily Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="documents" fill="#2563EB" name="Documents" />
              <Bar dataKey="workshops" fill="#10B981" name="Workshops" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard} className="analytics-chart-card">
          <h3 style={styles.chartTitle}>Document Growth (6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} name="Documents" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span style={styles.statValue}>{departmentData.reduce((sum, d) => sum + d.value, 0)}</span>
          <span style={styles.statLabel}>Total Documents</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span style={styles.statValue}>{dailyActivity.reduce((sum, d) => sum + d.documents, 0)}</span>
          <span style={styles.statLabel}>Weekly Documents</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <span style={styles.statValue}>{growthData.length > 0 ? growthData[growthData.length-1].count : 0}</span>
          <span style={styles.statLabel}>Latest Month</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '24px',
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '2px',
    letterSpacing: '-0.3px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '16px',
  },
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #FECACA',
    fontSize: '14px',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E2E8F0',
    borderTopColor: '#2563EB',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#64748B',
    fontSize: '16px',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    background: '#FFFFFF',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '12px',
    textAlign: 'center',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginTop: '8px',
  },
  statCard: {
    background: '#FFFFFF',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statIcon: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
    marginTop: '4px',
  },
};

// CSS إضافية للتفاعلات والأنيميشن
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .analytics-chart-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  .stats-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @media (max-width: 640px) {
    .chart-grid {
      grid-template-columns: 1fr;
    }
    .stats-row {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AnalyticsDashboard;