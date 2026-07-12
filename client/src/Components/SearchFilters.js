// client/src/components/SearchFilters.js
import React from 'react';

const SearchFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  const handleReset = () => {
    onFilterChange('reset');
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Type</label>
        <select
          name="type"
          value={filters.type || 'all'}
          onChange={handleChange}
          style={styles.select}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="documents">Documents</option>
          <option value="workshops">Workshops</option>
          <option value="updates">Updates</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          style={styles.select}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Protocol">Protocol</option>
          <option value="Policy">Policy</option>
          <option value="Guide">Guide</option>
          <option value="SOP">SOP</option>
          <option value="Form">Form</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Department</label>
        <select
          name="department"
          value={filters.department || ''}
          onChange={handleChange}
          style={styles.select}
          className="filter-select"
        >
          <option value="">All Departments</option>
          <option value="General">General</option>
          <option value="ER">ER</option>
          <option value="ICU">ICU</option>
          <option value="Lab">Lab</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Radiology">Radiology</option>
          <option value="Nursing">Nursing</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          style={styles.select}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <button onClick={handleReset} style={styles.resetBtn} className="filter-reset-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Reset
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    margin: '16px 0 20px',
    padding: '16px',
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    alignItems: 'flex-end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: '1 1 140px',
    minWidth: '120px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    background: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    color: '#0F172A',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  resetBtn: {
    padding: '8px 16px',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
    height: '38px',
    alignSelf: 'flex-end',
  },
};

// CSS إضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .filter-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .filter-reset-btn:hover {
    background: #E2E8F0;
    color: #0F172A;
  }
  .filter-reset-btn:active {
    transform: scale(0.97);
  }
`;
document.head.appendChild(styleSheet);

export default SearchFilters;