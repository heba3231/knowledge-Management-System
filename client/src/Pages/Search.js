// client/src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, initialValue = '', loading }) => {
  const [term, setTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputWrapper}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search documents, workshops, updates..."
          style={styles.input}
          className="search-bar-input"
          disabled={loading}
        />
      </div>
      <button type="submit" style={styles.button} className="search-bar-btn" disabled={loading}>
        {loading ? (
          <span style={styles.spinner}>⏳</span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '600px',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    background: '#FFFFFF',
    color: '#0F172A',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  button: {
    padding: '12px 24px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    fontWeight: '500',
    fontSize: '14px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  spinner: {
    fontSize: '20px',
    animation: 'spin 1s linear infinite',
  },
};

// CSS إضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .search-bar-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .search-bar-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .search-bar-btn:active {
    transform: scale(0.98);
  }
  .search-bar-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default SearchBar;