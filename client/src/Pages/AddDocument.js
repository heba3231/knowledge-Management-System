// client/src/Pages/AddDocument.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddDocument = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Protocol',
    department: 'General',
    description: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // التحقق من الحقول المطلوبة
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.file) {
      setError('Please select a file to upload');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('file', formData.file);

      const response = await axios.post(
        'http://localhost:5000/api/documents',
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
          navigate('/documents');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add document');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to upload document. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📄 Add New Document</h1>
        <p style={styles.pageSubtitle}>Upload a new protocol, policy, or form.</p>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={styles.successAlert}>
          ✅ Document uploaded successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter document title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            className="add-doc-input"
            disabled={loading || success}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
              className="add-doc-select"
              disabled={loading || success}
            >
              <option value="Protocol">Protocol</option>
              <option value="Policy">Policy</option>
              <option value="Guide">Guide</option>
              <option value="SOP">SOP</option>
              <option value="Form">Form</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={styles.select}
              className="add-doc-select"
              disabled={loading || success}
            >
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
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the document"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            className="add-doc-textarea"
            disabled={loading || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>File (PDF, Word, Excel, etc.) *</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            style={styles.fileInput}
            className="add-doc-file"
            disabled={loading || success}
            required
          />
          {formData.file && (
            <div style={styles.fileName}>
              📎 {formData.file.name} ({(formData.file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={loading || success}
            style={styles.submitBtn}
            className="add-doc-submit"
          >
            {loading ? 'Uploading...' : '📤 Upload Document'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            style={styles.cancelBtn}
            className="add-doc-cancel"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    background: '#f7fafc',
    minHeight: '80vh',
  },
  header: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#2d3748',
    marginBottom: '4px',
  },
  pageSubtitle: {
    color: '#718096',
    fontSize: '16px',
  },
  errorAlert: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #FECACA',
  },
  successAlert: {
    background: '#ECFDF5',
    color: '#0F766E',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #A7F3D0',
  },
  form: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  field: {
    marginBottom: '18px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    color: '#1F2937',
    fontSize: '14px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    background: 'white',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    fontFamily: 'inherit',
  },
  fileInput: {
    padding: '8px 0',
    width: '100%',
  },
  fileName: {
    marginTop: '6px',
    fontSize: '14px',
    color: '#4B5563',
    background: '#F3F4F6',
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  submitBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.2s',
  },
  cancelBtn: {
    padding: '12px 28px',
    background: 'transparent',
    color: '#4B5563',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

// إضافة CSS إضافية للتفاعلات
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .add-doc-input:focus,
  .add-doc-select:focus,
  .add-doc-textarea:focus {
    border-color: #14B8A6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  }
  .add-doc-submit:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .add-doc-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  .add-doc-cancel:hover {
    background: #F9FAFB;
  }
  .add-doc-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    .add-doc-row {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AddDocument;