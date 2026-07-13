// client/src/components/pages/AddEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('location', formData.location);
      if (formData.image) data.append('image', formData.image);

      const response = await axios.post('http://localhost:5000/api/events', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل الإضافة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>إضافة فعالية جديدة</h1>
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
          <label>الموقع</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} placeholder="مثلاً: قاعة المؤتمرات" />
        </div>
        <div style={styles.field}>
          <label>الصورة</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} style={styles.fileInput} />
        </div>
        <div style={styles.buttons}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>{loading ? 'جاري الإضافة...' : 'إضافة'}</button>
          <button type="button" onClick={() => navigate('/admin/events')} style={styles.cancelBtn}>إلغاء</button>
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

export default AddEvent;