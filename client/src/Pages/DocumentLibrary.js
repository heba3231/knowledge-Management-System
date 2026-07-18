// client/src/components/pages/DocumentLibrary.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          // ✅ استبعاد المستندات من نوع Policy و Protocol
          const filtered = response.data.data.filter(
            doc => doc.category !== 'Policy' && doc.category !== 'Protocol'
          );
          setDocuments(filtered);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileUrl.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) {
      alert('Failed to delete document.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h1 style={styles.pageTitle}>Document Library</h1>
            <p style={styles.pageSubtitle}>Browse all protocols, policies, and forms.</p>
          </div>
        </div>
        {isAdmin && (
          <Link to="/documents/add" style={styles.addBtn} className="doc-add-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Document
          </Link>
        )}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading documents...</div>
      ) : documents.length === 0 ? (
        <div style={styles.empty}>No documents available.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={doc._id} style={{ animationDelay: `${index * 0.05}s` }} className="doc-row">
                  <td>
                    <Link to={`/documents/${doc._id}`} style={styles.docLink}>
                      {doc.title}
                    </Link>
                  </td>
                  <td><span style={styles.badge}>{doc.category || 'Protocol'}</span></td>
                  <td>{doc.department || 'General'}</td>
                  <td>
                    <span style={{
                      ...styles.statusBadge,
                      background: doc.status === 'Published' ? '#D1FAE5' :
                                  doc.status === 'Archived' ? '#FEE2E2' : '#FEF3C7',
                      color: doc.status === 'Published' ? '#065F46' :
                             doc.status === 'Archived' ? '#991B1B' : '#92400E'
                    }}>
                      {doc.status || 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(doc.updatedAt).toLocaleDateString()}</td>
                  <td>v{doc.version || '1.0'}</td>
                  <td>
                    <Link to={`/documents/${doc._id}`} style={styles.actionIcon} title="View">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                    <button onClick={() => handleDownload(doc.fileUrl)} style={styles.actionIcon} title="Download">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    {isAdmin && (
                      <>
                        <Link to={`/documents/edit/${doc._id}`} style={styles.actionIcon} title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button onClick={() => handleDelete(doc._id)} style={{ ...styles.actionIcon, color: '#DC2626' }} title="Delete">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

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
    marginBottom: '24px',
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
    textDecoration: 'none',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748B',
    fontSize: '16px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#94A3B8',
    fontSize: '16px',
  },
  tableWrapper: {
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  badge: {
    background: '#E2E8F0',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  docLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  actionIcon: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '8px',
    color: '#475569',
    textDecoration: 'none',
    transition: 'color 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px',
  },
};

// CSS إضافية للأنيميشن
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInRow {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .doc-row {
    animation: fadeInRow 0.4s ease-out forwards;
    opacity: 0;
  }
  .doc-add-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .doc-add-btn:active { transform: scale(0.98); }
  .doc-link:hover { color: #1D4ED8; }
  .action-icon:hover { color: #2563EB; }
  table th { text-align: left; padding: 12px 16px; background: #F8FAFC; color: #475569; font-weight: 600; border-bottom: 1px solid #E2E8F0; }
  table td { padding: 12px 16px; border-bottom: 1px solid #F1F5F9; }
  table tr:hover { background: #F8FAFC; }
`;
document.head.appendChild(styleSheet);

export default DocumentLibrary;