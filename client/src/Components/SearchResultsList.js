// client/src/components/SearchResultsList.js
import React from 'react';

const SearchResultsList = ({ results, loading, onDocumentClick, searchTerm }) => {
  if (loading) {
    return (
      <div style={styles.loading}>
        <span style={styles.spinner}>⏳</span>
        Searching...
      </div>
    );
  }

  if (results.length === 0 && searchTerm) {
    return (
      <div style={styles.empty}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p>No results found for "{searchTerm}"</p>
        <span style={styles.emptyHint}>Try adjusting your search terms or filters.</span>
      </div>
    );
  }

  if (results.length === 0) {
    return <div style={styles.empty}>Enter a search term to begin.</div>;
  }

  // الحصول على أيقونة حسب النوع
  const getTypeIcon = (result) => {
    if (result._type === 'workshop') return '🎓';
    if (result._type === 'update') return '📢';
    return '📄';
  };

  const getTypeLabel = (result) => {
    if (result._type === 'workshop') return 'Workshop';
    if (result._type === 'update') return 'Update';
    return 'Document';
  };

  return (
    <div style={styles.list}>
      {results.map((result) => (
        <div
          key={result._id}
          style={styles.item}
          className="search-result-item"
          onClick={() => onDocumentClick(result)}
        >
          <div style={styles.itemHeader}>
            <span style={styles.typeBadge} className="result-type-badge">
              {getTypeIcon(result)} {getTypeLabel(result)}
            </span>
            <span style={styles.itemDate}>
              {new Date(result.updatedAt || result.date || result.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h4 style={styles.title}>{result.title}</h4>
          <p style={styles.desc}>
            {result.description?.slice(0, 180)}
            {result.description?.length > 180 && '...'}
          </p>
          <div style={styles.meta}>
            <span>📂 {result.category || 'General'}</span>
            <span>🏢 {result.department || 'General'}</span>
            {result.version && <span>📌 v{result.version}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748B',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  spinner: {
    fontSize: '28px',
    animation: 'spin 1s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94A3B8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#CBD5E1',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '8px',
  },
  item: {
    background: '#FFFFFF',
    padding: '20px 24px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  typeBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 12px',
    borderRadius: '999px',
    background: '#E2E8F0',
    color: '#475569',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  itemDate: {
    fontSize: '13px',
    color: '#94A3B8',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    margin: '0 0 6px 0',
    letterSpacing: '-0.2px',
  },
  desc: {
    fontSize: '15px',
    color: '#475569',
    margin: '0 0 10px 0',
    lineHeight: 1.6,
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#64748B',
    flexWrap: 'wrap',
  },
};

// CSS إضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .search-result-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #CBD5E1;
  }
  .result-type-badge.workshop { background: #FEF3C7; color: #D97706; }
  .result-type-badge.update { background: #DCFCE7; color: #22C55E; }
  .result-type-badge.document { background: #DBEAFE; color: #2563EB; }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default SearchResultsList;