// client/src/components/pages/EditService.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const item = response.data.data;
          setFormData({
            title: item.title,
            description: item.description || '',
            order: item.order || 0,
          });
        }
      } catch (err) {
        setError('فشل في تحميل الخدمة');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/services/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) navigate('/admin/services');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل التحديث');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>تعديل الخدمة</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>العنوان *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>الوصف</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textarea} rows="4" />
        </div>
        <div style={styles.field}>
          <label>ترتيب العرض</label>
          <input type="number" name="order" value={formData.order} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.buttons}>
          <button type="submit" disabled={submitting} style={styles.submitBtn}>{submitting ? 'جاري التحديث...' : 'تحديث'}</button>
          <button type="button" onClick={() => navigate('/admin/services')} style={styles.cancelBtn}>إلغاء</button>
        </div>
      </form>
    </div>
  );
};

// الأنماط مشابهة
const styles = {
  container: { padding: '30px', maxWidth: '700px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  pageTitle: { fontSize: '32px', color: '#2d3748', marginBottom: '24px' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  form: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' },
  buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' },
  cancelBtn: { padding: '12px 28px', background: 'transparent', color: '#4B5563', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer' },
};

export default EditService;