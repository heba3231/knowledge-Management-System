// client/src/Pages/AddDocument.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddDocument = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'Protocol';
  const subCategoryParam = searchParams.get('subCategory') || '';

  // خيارات subCategory حسب الفئة
  const subCategoryOptions = {
    Protocol: [
      { value: 'ER', label: 'الطوارئ' },
      { value: 'ICU', label: 'العناية المركزة' },
      { value: 'Pharmacy', label: 'الصيدلية' },
      { value: 'Lab', label: 'المختبر' },
    ],
    Policy: [
      { value: 'HR', label: 'دليل سياسات الموارد البشرية' },
      { value: 'InfectionControl', label: 'دليل مكافحة العدوى' },
      { value: 'SOP', label: 'أدلة التشغيل القياسي (SOPs)' },
    ],
  };

  const [formData, setFormData] = useState({
    title: '',
    category: categoryParam,
    subCategory: subCategoryParam || (subCategoryOptions[categoryParam]?.[0]?.value || ''),
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

    if (!formData.title.trim()) {
      setError('العنوان مطلوب');
      setLoading(false);
      return;
    }
    if (!formData.file) {
      setError('يرجى اختيار ملف للرفع');
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

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subCategory', formData.subCategory);
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
          navigate(`/documents`);
        }, 1500);
      } else {
        setError(response.data.message || 'فشل في إضافة المستند');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('فشل رفع المستند. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📄 إضافة مستند جديد</h1>
        <p style={styles.pageSubtitle}>
          {formData.category === 'Protocol' ? 'بروتوكول' : 'سياسة'} جديدة
        </p>
      </div>

      {error && <div style={styles.errorAlert}>❌ {error}</div>}
      {success && <div style={styles.successAlert}>✅ تم الرفع بنجاح! جاري التحويل...</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>العنوان *</label>
          <input
            type="text"
            name="title"
            placeholder="أدخل عنوان المستند"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={loading || success}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>الفئة</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const newCategory = e.target.value;
                const newSub = subCategoryOptions[newCategory]?.[0]?.value || '';
                setFormData({ ...formData, category: newCategory, subCategory: newSub });
              }}
              style={styles.select}
              disabled={loading || success}
            >
              <option value="Protocol">بروتوكول</option>
              <option value="Policy">سياسة</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>التصنيف الفرعي</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              style={styles.select}
              disabled={loading || success}
            >
              {subCategoryOptions[formData.category]?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
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
            placeholder="وصف مختصر للمستند"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            disabled={loading || success}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الملف (PDF, Word, Excel, ...) *</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            style={styles.fileInput}
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
          >
            {loading ? 'جاري الرفع...' : '📤 رفع المستند'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
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
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', background: 'white' },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'border-color 0.3s, box-shadow 0.3s', fontFamily: 'inherit' },
  fileInput: { padding: '8px 0', width: '100%' },
  fileName: { marginTop: '6px', fontSize: '14px', color: '#4B5563', background: '#F3F4F6', padding: '6px 12px', borderRadius: '6px', display: 'inline-block' },
  buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' },
  cancelBtn: { padding: '12px 28px', background: 'transparent', color: '#4B5563', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s' },
};

export default AddDocument;