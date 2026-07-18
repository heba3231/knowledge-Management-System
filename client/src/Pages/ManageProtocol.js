// client/src/Pages/ManageProtocol.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

const ManageProtocol = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.staff);
  
  // التبويب النشط (القسم)
  const [activeTab, setActiveTab] = useState('ER');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // أقسام البروتوكولات
  const tabs = [
    { key: 'ER', label: 'الطوارئ' },
    { key: 'ICU', label: 'العناية المركزة' },
    { key: 'Pharmacy', label: 'الصيدلية' },
    { key: 'Lab', label: 'المختبر' },
  ];

  // جلب المستندات حسب الفئة والقسم الفرعي
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/documents?category=Protocol&subCategory=${activeTab}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setDocuments(response.data.data);
        } else {
          setError('فشل في تحميل البروتوكولات.');
        }
      } catch (err) {
        setError('تعذر تحميل البروتوكولات. حاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [activeTab, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا البروتوكول؟')) return;
    try {
      await axios.delete(`${BASE_URL}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (err) {
      alert('فشل الحذف.');
    }
  };

  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : BASE_URL + fileUrl;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileUrl.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📜 البروتوكولات</h1>
        <Link 
          to={`/documents/add?category=Protocol&subCategory=${activeTab}`} 
          style={styles.addBtn}
        >
          + إضافة بروتوكول جديد
        </Link>
      </div>

      {/* التبويبات */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab(tab.key)}
            className="protocol-tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>جاري التحميل...</div>
      ) : documents.length === 0 ? (
        <div style={styles.empty}>لا توجد بروتوكولات في هذا القسم.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>القسم</th>
                <th>الحالة</th>
                <th>تاريخ التحديث</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>
                    <Link to={`/documents/${doc._id}`} style={styles.docLink}>
                      {doc.title}
                    </Link>
                  </td>
                  <td>{doc.department || 'عام'}</td>
                  <td>
                    <span style={{
                      ...styles.statusBadge,
                      background: doc.status === 'Published' ? '#D1FAE5' : '#FEF3C7'
                    }}>
                      {doc.status === 'Published' ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td>{new Date(doc.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <Link to={`/documents/edit/${doc._id}`} style={styles.actionIcon}>✏️</Link>
                    <button onClick={() => handleDownload(doc.fileUrl)} style={styles.actionIcon}>⬇️</button>
                    <button 
                      onClick={() => handleDelete(doc._id)} 
                      style={{ ...styles.actionIcon, color: '#DC2626' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' },
  pageTitle: { fontSize: '32px', color: '#2d3748' },
  addBtn: { padding: '10px 20px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '10px 24px', background: '#E2E8F0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '15px', transition: '0.2s' },
  tabActive: { background: '#2563EB', color: 'white' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  loading: { textAlign: 'center', color: '#718096' },
  empty: { textAlign: 'center', color: '#a0aec0' },
  tableWrapper: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  docLink: { color: '#2563EB', textDecoration: 'none' },
  actionIcon: { background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '8px', color: '#475569', fontSize: '16px' },
};

export default ManageProtocol;