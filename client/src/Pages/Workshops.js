// client/src/components/pages/Workshops.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const Workshops = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // قراءة المستخدم من localStorage (قد يكون null)
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        // طلب عام بدون توكن
        const response = await axios.get('http://localhost:5000/api/workshops');
        if (response.data.success) {
          setWorkshops(response.data.data);
        } else {
          setError('Failed to load workshops.');
        }
      } catch (err) {
        console.error('Error fetching workshops:', err);
        setError('Could not load workshops. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const filteredWorkshops = workshops.filter(w =>
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.description && w.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h1 style={styles.pageTitle}>Workshops & Courses</h1>
            <p style={styles.pageSubtitle}>Training sessions, workshops, and educational courses.</p>
          </div>
        </div>
        {isAdmin && (
          <Link to="/workshops/add" style={styles.addBtn} className="workshops-add-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Workshop
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search workshops by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          className="workshop-search-input"
        />
        <button type="submit" style={styles.searchBtn} className="workshop-search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading workshops...</div>
      ) : filteredWorkshops.length === 0 ? (
        <div style={styles.empty}>No workshops available.</div>
      ) : (
        <div style={styles.grid}>
          {filteredWorkshops.map((workshop) => (
            <div key={workshop._id} style={styles.card} className="workshop-card">
              <div style={styles.cardImage}>
                {workshop.images && workshop.images.length > 0 ? (
                  <img src={BASE_URL + workshop.images[0]} alt={workshop.title} style={styles.image} />
                ) : (
                  <div style={styles.imagePlaceholder}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                )}
                <div style={styles.mediaBadge}>
                  {workshop.images?.length > 0 && <span>📷 {workshop.images.length}</span>}
                  {workshop.videos?.length > 0 && <span>🎬 {workshop.videos.length}</span>}
                </div>
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{workshop.title}</h3>
                <p style={styles.cardDesc}>
                  {workshop.description?.slice(0, 100)}
                  {workshop.description?.length > 100 && '...'}
                </p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {new Date(workshop.createdAt).toLocaleDateString()}
                  </span>
                  <Link to={`/workshops/${workshop._id}`} style={styles.cardLink} className="workshop-card-link">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// الأنماط (نفسها كما هي، فقط أضفنا style.error)
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    gap: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '2px',
    letterSpacing: '-0.3px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '16px',
  },
  addBtn: {
    padding: '10px 20px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  searchForm: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#FFFFFF',
    minWidth: '200px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    border: '1px solid #FECACA',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    color: '#64748B',
    padding: '40px 0',
    fontSize: '16px',
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    padding: '40px 0',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardImage: {
    height: '180px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    background: '#F1F5F9',
  },
  mediaBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    color: '#FFFFFF',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'flex',
    gap: '8px',
    backdropFilter: 'blur(4px)',
  },
  cardContent: {
    padding: '16px 20px 20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '8px',
    letterSpacing: '-0.2px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '12px',
    lineHeight: 1.5,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardDate: {
    fontSize: '13px',
    color: '#94A3B8',
    display: 'flex',
    alignItems: 'center',
  },
  cardLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
};

// CSS إضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .workshop-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  .workshop-card-link:hover {
    color: #1D4ED8;
  }
  .workshop-card-link:hover svg {
    transform: translateX(2px);
  }
  .workshop-card-link svg {
    transition: transform 0.2s;
  }
  .workshops-add-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .workshops-add-btn:active {
    transform: scale(0.98);
  }
  .workshop-search-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .workshop-search-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;
document.head.appendChild(styleSheet);

export default Workshops;