// client/src/Pages/EditProtocol.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

const EditProtocol = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    title: '',
    subCategory: 'ER',
    department: 'General',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subCategoryOptions = [
    { value: 'ER', label: 'الطوارئ' },
    { value: 'ICU', label: 'العناية المركزة' },
    { value: 'Pharmacy', label: 'الصيدلية' },
    { value: 'Lab', label: 'المختبر' },
  ];

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const doc = response.data.data;
          setFormData({
            title: doc.title,
            subCategory: doc.subCategory || 'ER',
            department: doc.department || 'General',
            description: doc.description || '',
          });
        } else {
          setError('فشل في تحميل بيانات البروتوكول');
        }
      } catch (err) {
        setError('تعذر تحميل البروتوكول. حاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('العنوان مطلوب');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('غير مصادق. يرجى تسجيل الدخول مجدداً.');
        setSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title.trim(),
        subCategory: formData.subCategory,
        department: formData.department,
        description: formData.description.trim(),
      };

      const response = await axios.put(
        `${BASE_URL}/api/documents/${id}`,
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
          navigate('/admin/protocol');
        }, 1500);
      } else {
        setError(response.data.message || 'فشل في تحديث البروتوكول');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('فشل تحديث البروتوكول. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>✏️ تعديل البروتوكول</h1>
        <p style={styles.pageSubtitle}>قم بتحديث بيانات البروتوكول</p>
      </div>

      {error && <div style={styles.errorAlert}>❌ {error}</div>}
      {success && <div style={styles.successAlert}>✅ تم التحديث بنجاح! جاري التحويل...</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>العنوان *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>القسم *</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            style={styles.select}
            disabled={submitting || success}
          >
            {subCategoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>القسم التابع</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={styles.select}
            disabled={submitting || success}
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
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            disabled={submitting || success}
          />
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={submitting || success}
            style={styles.submitBtn}
          >
            {submitting ? 'جاري التحديث...' : '💾 تحديث البروتوكول'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/protocol')}
            style={styles.cancelBtn}
            disabled={submitting}
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

export default EditProtocol;