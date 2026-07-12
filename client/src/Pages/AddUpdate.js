// client/src/components/pages/AddUpdate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/updates', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        navigate('/updates');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>📢 Add New Update</h1>
      <p style={styles.pageSubtitle}>Share news or announcements with all users.</p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={styles.select}>
              <option value="announcement">Announcement</option>
              <option value="update">Update</option>
              <option value="general">General</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttons}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Adding...' : 'Add Update'}
          </button>
          <button type="button" onClick={() => navigate('/updates')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '800px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  pageTitle: { fontSize: '32px', color: '#2d3748', marginBottom: '4px' },
  pageSubtitle: { color: '#718096', fontSize: '16px', marginBottom: '24px' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  form: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  field: { marginBottom: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' },
  buttons: { display: 'flex', gap: '12px', marginTop: '20px' },
  submitBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #DC2626, #EF4444)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '12px 24px',
    background: 'transparent',
    color: '#4B5563',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AddUpdate;