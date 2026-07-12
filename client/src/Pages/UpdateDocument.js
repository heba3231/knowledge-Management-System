// client/src/Pages/UpdateWorkshop.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

const UpdateWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    videos: [],
    existingImages: [],
    existingVideos: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // جلب بيانات الورشة الحالية
  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not authenticated. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/workshops/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const workshop = response.data.data;
          setFormData({
            title: workshop.title || '',
            description: workshop.description || '',
            images: [],
            videos: [],
            existingImages: workshop.images || [],
            existingVideos: workshop.videos || [],
          });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' || name === 'videos') {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // حذف صورة موجودة
  const handleRemoveExistingImage = (index) => {
    const updated = formData.existingImages.filter((_, i) => i !== index);
    setFormData({ ...formData, existingImages: updated });
  };

  // حذف فيديو موجود
  const handleRemoveExistingVideo = (index) => {
    const updated = formData.existingVideos.filter((_, i) => i !== index);
    setFormData({ ...formData, existingVideos: updated });
  };

  // إزالة صورة جديدة من المعاينة قبل الرفع
  const removeNewImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // إزالة فيديو جديد من المعاينة قبل الرفع
  const removeNewVideo = (index) => {
    const updated = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('Title is required');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please login again.');
        setSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      
      formData.images.forEach((file) => formDataToSend.append('images', file));
      formData.videos.forEach((file) => formDataToSend.append('videos', file));

      formDataToSend.append('existingImages', JSON.stringify(formData.existingImages));
      formDataToSend.append('existingVideos', JSON.stringify(formData.existingVideos));

      const response = await axios.put(
        `http://localhost:5000/api/workshops/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/workshops/${id}`);
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update workshop');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update workshop. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading workshop data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <div>
          <h1 style={styles.pageTitle}>Update Workshop</h1>
          <p style={styles.pageSubtitle}>Edit the workshop details.</p>
        </div>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div style={styles.successAlert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Workshop updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter workshop title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            className="update-workshop-input"
            disabled={submitting || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the workshop"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            className="update-workshop-textarea"
            disabled={submitting || success}
          />
        </div>

        {/* عرض الصور الحالية */}
        {formData.existingImages.length > 0 && (
          <div style={styles.mediaSection}>
            <label style={styles.label}>Current Images</label>
            <div style={styles.mediaGrid}>
              {formData.existingImages.map((img, idx) => (
                <div key={idx} style={styles.mediaItem}>
                  <img src={BASE_URL + img} alt={`workshop-${idx}`} style={styles.mediaPreview} />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    style={styles.removeBtn}
                    className="update-workshop-remove-btn"
                    disabled={submitting || success}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* عرض الفيديوهات الحالية */}
        {formData.existingVideos.length > 0 && (
          <div style={styles.mediaSection}>
            <label style={styles.label}>Current Videos</label>
            <div style={styles.mediaGrid}>
              {formData.existingVideos.map((video, idx) => (
                <div key={idx} style={styles.mediaItem}>
                  <video src={BASE_URL + video} style={styles.mediaPreview} controls />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingVideo(idx)}
                    style={styles.removeBtn}
                    className="update-workshop-remove-btn"
                    disabled={submitting || success}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Add New Images (optional)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            style={styles.fileInput}
            className="update-workshop-file"
            disabled={submitting || success}
          />
          {formData.images.length > 0 && (
            <div style={styles.previewGrid}>
              {formData.images.map((file, idx) => (
                <div key={idx} style={styles.previewItem}>
                  <img src={URL.createObjectURL(file)} alt={`new-${idx}`} style={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    style={styles.removePreviewBtn}
                    className="update-workshop-remove-preview"
                    disabled={submitting || success}
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
          <label style={styles.label}>Add New Videos (optional)</label>
          <input
            type="file"
            name="videos"
            accept="video/*"
            multiple
            onChange={handleChange}
            style={styles.fileInput}
            className="update-workshop-file"
            disabled={submitting || success}
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
                    onClick={() => removeNewVideo(idx)}
                    style={styles.removeFileBtn}
                    className="update-workshop-remove-file"
                    disabled={submitting || success}
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
          <button
            type="submit"
            disabled={submitting || success}
            style={styles.submitBtn}
            className="update-workshop-submit"
          >
            {submitting ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}>
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Update Workshop
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/workshops/${id}`)}
            style={styles.cancelBtn}
            className="update-workshop-cancel"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ===== الأنماط =====
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
  successAlert: {
    background: '#ECFDF5',
    color: '#22C55E',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    border: '1px solid #BBF7D0',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
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
  mediaSection: {
    marginBottom: '20px',
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
    marginTop: '8px',
  },
  mediaItem: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  mediaPreview: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    display: 'block',
  },
  removeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    padding: 0,
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
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, Roboto, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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

// ===== CSS إضافي =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .update-workshop-input:focus,
  .update-workshop-textarea:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .update-workshop-submit:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .update-workshop-submit:active {
    transform: scale(0.98);
  }
  .update-workshop-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .update-workshop-cancel:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
  }
  .update-workshop-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .update-workshop-remove-btn:hover,
  .update-workshop-remove-preview:hover,
  .update-workshop-remove-file:hover {
    background: rgba(220, 38, 38, 0.9);
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default UpdateWorkshop;