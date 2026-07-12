// client/src/Components/pages/HelpCenter.jsx
import React from 'react';

const HelpCenter = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>🆘 Help Center</h1>
      <p style={styles.pageSubtitle}>How can we assist you?</p>

      <div style={styles.searchWrapper}>
        <input type="text" placeholder="Search for help articles..." style={styles.searchInput} />
        <button style={styles.searchBtn}>Search</button>
      </div>

      <div style={styles.articlesGrid}>
        <div style={styles.articleCard}>
          <h3>📖 User Guide</h3>
          <p>Learn how to navigate and use the system.</p>
          <button style={styles.readBtn}>Read More</button>
        </div>
        <div style={styles.articleCard}>
          <h3>❓ FAQ</h3>
          <p>Frequently asked questions and answers.</p>
          <button style={styles.readBtn}>Read More</button>
        </div>
        <div style={styles.articleCard}>
          <h3>🎥 Video Tutorials</h3>
          <p>Watch step-by-step video guides.</p>
          <button style={styles.readBtn}>Watch Now</button>
        </div>
      </div>

      <div style={styles.supportSection}>
        <h3>Still need help?</h3>
        <button style={styles.ticketBtn}>📩 Submit Support Ticket</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f7fafc',
    minHeight: '80vh',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#2d3748',
    marginBottom: '4px',
  },
  pageSubtitle: {
    color: '#718096',
    fontSize: '16px',
    marginBottom: '24px',
  },
  searchWrapper: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  searchBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '30px',
  },
  articleCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  readBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  supportSection: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  ticketBtn: {
    marginTop: '12px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default HelpCenter;