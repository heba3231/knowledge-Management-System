// client/src/components/pages/DocumentDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setDocument(response.data.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Document not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/documents');
    } catch (error) {
      alert('Failed to delete document.');
    }
  };

  // دالة تحميل الملف
  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;
    // تأكد من أن الرابط كامل
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
    // إنشاء رابط مؤقت وتحفيز التحميل
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileUrl.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>{error}</div>;
  if (!document) return <div style={styles.container}>Document not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => navigate('/documents')} style={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Library
          </button>
          {isAdmin && (
            <div style={styles.actions}>
              <Link to={`/documents/edit/${document._id}`} style={styles.editBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
              <button onClick={handleDelete} style={styles.deleteBtn}>
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
        <h1 style={styles.title}>{document.title}</h1>
        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {document.category || 'Protocol'}
          </span>
          <span style={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {document.department || 'General'}
          </span>
          <span style={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Updated: {new Date(document.updatedAt).toLocaleDateString()}
          </span>
          <span style={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Version: {document.version || '1.0'}
          </span>
          <span>
            <span style={{
              ...styles.statusBadge,
              background: document.status === 'Published' ? '#D1FAE5' :
                          document.status === 'Archived' ? '#FEE2E2' : '#FEF3C7',
              color: document.status === 'Published' ? '#065F46' :
                     document.status === 'Archived' ? '#991B1B' : '#92400E'
            }}>
              {document.status || 'Draft'}
            </span>
          </span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.description}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.descriptionText}>{document.description || 'No description available.'}</p>
        </div>

        <div style={styles.fileSection}>
          <h3 style={styles.sectionTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            File
          </h3>
          {document.fileUrl ? (
            <div style={styles.fileWrapper}>
              <button onClick={() => handleDownload(document.fileUrl)} style={styles.downloadBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Document
              </button>
              {document.fileSize && (
                <span style={styles.fileSize}> ({(document.fileSize / 1024).toFixed(1)} KB)</span>
              )}
            </div>
          ) : (
            <p style={styles.noFile}>No file attached.</p>
          )}
        </div>

        {document.versions && document.versions.length > 1 && (
          <div style={styles.versions}>
            <h3 style={styles.sectionTitle}>Version History</h3>
            <ul style={styles.versionList}>
              {document.versions.map((v, idx) => (
                <li key={idx} style={styles.versionItem}>
                  <span style={styles.versionNumber}>v{v.versionNumber}</span>
                  <span style={styles.versionDate}> - {new Date(v.uploadedAt).toLocaleDateString()}</span>
                  {v.comment && <span style={styles.versionComment}> ({v.comment})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  header: {
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    marginBottom: '24px',
    animation: 'fadeInUp 0.5s ease-out',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#2563EB',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '12px',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#64748B',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  editBtn: {
    padding: '8px 16px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'background 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
  },
  deleteBtn: {
    padding: '8px 16px',
    background: '#EF4444',
    color: '#FFFFFF',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
  },
  content: {
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    animation: 'fadeInUp 0.6s ease-out',
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
  description: {
    marginBottom: '24px',
  },
  descriptionText: {
    fontSize: '16px',
    color: '#475569',
    lineHeight: 1.7,
  },
  fileSection: {
    marginBottom: '24px',
  },
  fileWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  downloadBtn: {
    padding: '10px 20px',
    background: '#0F766E',
    color: '#FFFFFF',
    border: '1px solid #0F766E',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  fileSize: {
    color: '#64748B',
    fontSize: '14px',
  },
  noFile: {
    color: '#94A3B8',
    fontSize: '14px',
  },
  versions: {
    marginTop: '16px',
    borderTop: '1px solid #E2E8F0',
    paddingTop: '16px',
  },
  versionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  versionItem: {
    padding: '6px 0',
    fontSize: '14px',
    color: '#475569',
  },
  versionNumber: {
    fontWeight: '600',
    color: '#0F172A',
  },
  versionDate: {
    color: '#64748B',
  },
  versionComment: {
    color: '#64748B',
    fontSize: '13px',
  },
};

// CSS إضافية للأنيميشن
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .back-btn:hover { color: #1D4ED8; }
  .edit-btn:hover { background: #1D4ED8; }
  .delete-btn:hover { background: #DC2626; }
  .download-btn:hover { background: #0D9488; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3); }
`;
document.head.appendChild(styleSheet);

export default DocumentDetails;