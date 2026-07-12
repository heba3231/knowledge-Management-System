// client/src/components/pages/AddWorkshop.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeVideo = (index) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' || name === 'videos') {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formData.images.forEach((file) => formDataToSend.append('images', file));
      formData.videos.forEach((file) => formDataToSend.append('videos', file));

      const response = await axios.post('http://localhost:5000/api/workshops', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        navigate('/workshops');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add workshop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <h1 style={styles.pageTitle}>Add New Workshop</h1>
          <p style={styles.pageSubtitle}>Create a new training workshop or course.</p>
        </div>
      </div>

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
            className="add-workshop-input"
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
            className="add-workshop-textarea"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            style={styles.fileInput}
            className="add-workshop-file"
          />
          {formData.images.length > 0 && (
            <div style={styles.previewGrid}>
              {formData.images.map((file, idx) => (
                <div key={idx} style={styles.previewItem}>
                  <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} style={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={styles.removePreviewBtn}
                    className="add-workshop-remove-preview"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Videos</label>
          <input
            type="file"
            name="videos"
            accept="video/*"
            multiple
            onChange={handleChange}
            style={styles.fileInput}
            className="add-workshop-file"
          />
          {formData.videos.length > 0 && (
            <div style={styles.fileList}>
              {formData.videos.map((file, idx) => (
                <div key={idx} style={styles.fileItem}>
                  <span style={styles.fileName}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    style={styles.removeFileBtn}
                    className="add-workshop-remove-file"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.buttons}>
          <button type="submit" disabled={loading} style={styles.submitBtn} className="add-workshop-submit">
            {loading ? 'Creating...' : 'Create Workshop'}
          </button>
          <button type="button" onClick={() => navigate('/workshops')} style={styles.cancelBtn} className="add-workshop-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
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
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    border: '1px solid #FECACA',
    fontSize: '14px',
  },
  form: {
    background: '#FFFFFF',
    padding: '32px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    color: '#0F172A',
    fontSize: '14px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#FFFFFF',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#FFFFFF',
    color: '#0F172A',
    fontFamily: 'Inter, Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  fileInput: {
    padding: '8px 0',
    width: '100%',
    fontFamily: 'Inter, Roboto, sans-serif',
    fontSize: '14px',
    color: '#0F172A',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  },
  previewItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    aspectRatio: '1',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  removePreviewBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    padding: 0,
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '8px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F1F5F9',
    padding: '6px 12px',
    borderRadius: '8px',
  },
  fileName: {
    fontSize: '13px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
  },
  removeFileBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#EF4444',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  submitBtn: {
    padding: '10px 24px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  cancelBtn: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#475569',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
};

// CSS إضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .add-workshop-input:focus,
  .add-workshop-textarea:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .add-workshop-submit:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .add-workshop-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .add-workshop-cancel:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
  }
  .add-workshop-remove-preview:hover,
  .add-workshop-remove-file:hover {
    background: rgba(220, 38, 38, 0.9);
  }
`;
document.head.appendChild(styleSheet);

export default AddWorkshop;