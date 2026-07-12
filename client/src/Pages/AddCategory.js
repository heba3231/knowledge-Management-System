// client/src/Pages/AddCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddCategory = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.categoryName.trim()) {
      setError('Category name is required');
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

      const response = await axios.post(
        'http://localhost:5000/api/categories',
        {
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/categories');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Add category error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to add category. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📂 Add New Category</h1>
        <p style={styles.pageSubtitle}>Create a new category for organizing documents.</p>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={styles.successAlert}>
          ✅ Category added successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Category Name *</label>
          <input
            type="text"
            name="categoryName"
            placeholder="e.g., Emergency Protocols"
            value={formData.categoryName}
            onChange={handleChange}
            required
            style={styles.input}
            className="add-category-input"
            disabled={loading || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the category"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="3"
            className="add-category-textarea"
            disabled={loading || success}
          />
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={loading || success}
            style={styles.submitBtn}
            className="add-category-submit"
          >
            {loading ? 'Adding...' : '➕ Add Category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            style={styles.cancelBtn}
            className="add-category-cancel"
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
    maxWidth: '700px',
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

// CSS إضافية للتفاعلات
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .add-category-input:focus,
  .add-category-textarea:focus {
    border-color: #14B8A6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  }
  .add-category-submit:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .add-category-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  .add-category-cancel:hover {
    background: #F9FAFB;
  }
  .add-category-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default AddCategory;