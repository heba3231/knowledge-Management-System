// client/src/components/pages/EditNews.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image: null,
    existingImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/news/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const item = response.data.data;
          setFormData({
            title: item.title,
            description: item.description || '',
            date: item.date ? item.date.split('T')[0] : '',
            existingImage: item.image || '',
            image: null,
          });
        }
      } catch (err) {
        setError('فشل في تحميل الخبر');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      if (formData.image) data.append('image', formData.image);

      const response = await axios.put(`http://localhost:5000/api/news/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) navigate('/admin/news');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل التحديث');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>تعديل الخبر</h1>
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
          <label>التاريخ</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>الصورة الحالية</label>
          {formData.existingImage && <img src={formData.existingImage} alt="current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginBottom: '8px' }} />}
          <label>تغيير الصورة (اختياري)</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} style={styles.fileInput} />
        </div>
        <div style={styles.buttons}>
          <button type="submit" disabled={submitting} style={styles.submitBtn}>{submitting ? 'جاري التحديث...' : 'تحديث'}</button>
          <button type="button" onClick={() => navigate('/admin/news')} style={styles.cancelBtn}>إلغاء</button>
        </div>
      </form>
    </div>
  );
};

// الأنماط مشابهة لـ AddNews
const styles = {
  container: { padding: '30px', maxWidth: '700px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  pageTitle: { fontSize: '32px', color: '#2d3748', marginBottom: '24px' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  form: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' },
  fileInput: { padding: '8px 0', width: '100%' },
  buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' },
  cancelBtn: { padding: '12px 28px', background: 'transparent', color: '#4B5563', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer' },
};

export default EditNews;