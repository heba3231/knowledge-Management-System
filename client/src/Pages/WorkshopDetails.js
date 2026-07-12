// client/src/Pages/WorkshopDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

const WorkshopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.staff) || {};
  const isAdmin = user?.role === 'Admin';

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        // طلب عام بدون توكن
        const response = await axios.get(`http://localhost:5000/api/workshops/${id}`);
        if (response.data.success) {
          setWorkshop(response.data.data);
        } else {
          setError('Failed to load workshop data.');
        }
      } catch (err) {
        console.error('Error fetching workshop:', err);
        setError(err.response?.data?.message || 'Could not load workshop. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in as admin to delete.');
        return;
      }
      await axios.delete(`http://localhost:5000/api/workshops/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/workshops');
    } catch (err) {
      alert('Failed to delete workshop. Please try again.');
    }
  };

  const openImage = (imgUrl) => {
    setSelectedImage(BASE_URL + imgUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading workshop details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorAlert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
        <button onClick={() => navigate('/workshops')} style={styles.backBtn} className="workshop-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Workshops
        </button>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div style={styles.container}>
        <div style={styles.errorAlert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Workshop not found.
        </div>
        <button onClick={() => navigate('/workshops')} style={styles.backBtn} className="workshop-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Workshops
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => navigate('/workshops')} style={styles.backBtn} className="workshop-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Workshops
          </button>
          {isAdmin && (
            <div style={styles.adminActions}>
              <Link to={`/workshops/edit/${workshop._id}`} style={styles.editBtn} className="workshop-edit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
              <button onClick={handleDelete} style={styles.deleteBtn} className="workshop-delete-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
        <div style={styles.titleWrapper}>
          <div style={styles.titleIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 style={styles.pageTitle}>{workshop.title}</h1>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.description}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.descriptionText}>
            {workshop.description || 'No description available.'}
          </p>
        </div>

        {workshop.images && workshop.images.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Images ({workshop.images.length})
            </h3>
            <div style={styles.mediaGrid}>
              {workshop.images.map((img, idx) => (
                <div key={idx} style={styles.imageWrapper} onClick={() => openImage(img)}>
                  <img src={BASE_URL + img} alt={`workshop-${idx}`} style={styles.image} />
                  <div style={styles.imageOverlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {workshop.videos && workshop.videos.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Videos ({workshop.videos.length})
            </h3>
            <div style={styles.mediaGrid}>
              {workshop.videos.map((video, idx) => (
                <div key={idx} style={styles.videoWrapper}>
                  <video src={BASE_URL + video} controls style={styles.video} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Created: {new Date(workshop.createdAt).toLocaleDateString()}
          </span>
          {workshop.updatedAt && (
            <span style={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Updated: {new Date(workshop.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Modal لتكبير الصورة */}
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={closeImage}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={closeImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img src={selectedImage} alt="Enlarged" style={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
};

// ===== الأنماط =====
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#2563EB',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 0',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  adminActions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '8px 16px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  deleteBtn: {
    padding: '8px 16px',
    background: '#EF4444',
    color: '#FFFFFF',
    border: '1px solid #EF4444',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#64748B',
  },
  errorAlert: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    background: '#FFFFFF',
    padding: '32px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  description: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '12px',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: '16px',
    color: '#475569',
    lineHeight: 1.7,
    margin: 0,
  },
  section: {
    marginBottom: '28px',
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  imageWrapper: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  videoWrapper: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  video: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  },
  meta: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    paddingTop: '16px',
    borderTop: '1px solid #E2E8F0',
    marginTop: '8px',
  },
  metaItem: {
    fontSize: '14px',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  modalClose: {
    position: 'absolute',
    top: '-40px',
    right: '0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#FFFFFF',
  },
  modalImage: {
    maxWidth: '90vw',
    maxHeight: '85vh',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  },
};

// ===== CSS إضافية =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .workshop-back-btn:hover {
    color: #1D4ED8;
  }
  .workshop-edit-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .workshop-edit-btn:active,
  .workshop-delete-btn:active {
    transform: scale(0.98);
  }
  .workshop-delete-btn:hover {
    background: #DC2626;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
  }
  .image-wrapper:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .image-wrapper:hover .image-overlay {
    opacity: 1;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

export default WorkshopDetails;