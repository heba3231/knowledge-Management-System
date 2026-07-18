// client/src/Pages/AddPolicy.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddPolicy = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    title: '',
    subCategory: 'HR',
    department: 'General',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subCategoryOptions = [
    { value: 'HR', label: 'دليل سياسات الموارد البشرية' },
    { value: 'InfectionControl', label: 'دليل مكافحة العدوى' },
    { value: 'SOP', label: 'أدلة التشغيل القياسي (SOPs)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('العنوان مطلوب');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('غير مصادق. يرجى تسجيل الدخول مجدداً.');
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title.trim(),
        category: 'Policy',
        subCategory: formData.subCategory,
        department: formData.department,
        description: formData.description.trim(),
      };

      const response = await axios.post(
        'http://localhost:5000/api/documents',
        payload,
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
          navigate('/admin/policy');
        }, 1500);
      } else {
        setError(response.data.message || 'فشل في إضافة السياسة');
      }
    } catch (err) {
      console.error('Add policy error:', err);
      setError('فشل إضافة السياسة. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📋 إضافة سياسة جديدة</h1>
        <p style={styles.pageSubtitle}>أضف سياسة جديدة إلى أحد الأدلة</p>
      </div>

      {error && <div style={styles.errorAlert}>❌ {error}</div>}
      {success && <div style={styles.successAlert}>✅ تم الإضافة بنجاح! جاري التحويل...</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>العنوان *</label>
          <input
            type="text"
            name="title"
            placeholder="أدخل عنوان السياسة"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={loading || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الدليل *</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            style={styles.select}
            disabled={loading || success}
          >
            {subCategoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>القسم</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={styles.select}
            disabled={loading || success}
          >
            <option value="General">عام</option>
            <option value="ER">الطوارئ</option>
            <option value="ICU">العناية المركزة</option>
            <option value="Lab">المختبر</option>
            <option value="Pharmacy">الصيدلية</option>
            <option value="Radiology">الأشعة</option>
            <option value="Nursing">التمريض</option>
            <option value="HR">الموارد البشرية</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الوصف</label>
          <textarea
            name="description"
            placeholder="وصف مختصر للسياسة"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            disabled={loading || success}
          />
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={loading || success}
            style={styles.submitBtn}
          >
            {loading ? 'جاري الإضافة...' : '📤 إضافة السياسة'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/policy')}
            style={styles.cancelBtn}
            disabled={loading}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '800px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  header: { marginBottom: '24px' },
  pageTitle: { fontSize: '32px', color: '#2d3748', marginBottom: '4px' },
  pageSubtitle: { color: '#718096', fontSize: '16px' },
  errorAlert: { background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #FECACA' },
  successAlert: { background: '#ECFDF5', color: '#0F766E', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #A7F3D0' },
  form: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white' },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
  buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' },
  cancelBtn: { padding: '12px 28px', background: 'transparent', color: '#4B5563', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer' },
};

export default AddPolicy;