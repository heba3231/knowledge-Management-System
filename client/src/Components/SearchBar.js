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
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search documents..."
        style={styles.input}
        disabled={loading}
      />
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? '...' : '🔍'}
      </button>
    </form>
  );
};

const styles = {
  form: { display: 'flex', gap: '8px', width: '100%', maxWidth: '500px' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '16px', outline: 'none' },
  button: { padding: '10px 20px', background: '#0F766E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default SearchBar;