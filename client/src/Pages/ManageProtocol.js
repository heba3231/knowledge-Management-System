// client/src/components/pages/ManageProtocol.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

const ManageProtocol = () => {
  const { token } = useSelector((state) => state.staff);
  const [activeTab, setActiveTab] = useState('all');
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = [
    { key: 'all', label: 'الكل' },
    { key: 'ER', label: 'الطوارئ' },
    { key: 'ICU', label: 'العناية المركزة' },
    { key: 'Pharmacy', label: 'الصيدلية' },
    { key: 'Lab', label: 'المختبر' },
  ];

  useEffect(() => {
    const fetchProtocols = async () => {
      setLoading(true);
      try {
        const url = activeTab === 'all'
          ? `${BASE_URL}/api/documents?category=Protocol`
          : `${BASE_URL}/api/documents?category=Protocol&subCategory=${activeTab}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setProtocols(response.data.data);
        } else {
          setError('فشل في تحميل البروتوكولات');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البروتوكولات');
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, [activeTab, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا البروتوكول؟')) return;
    try {
      await axios.delete(`${BASE_URL}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProtocols(protocols.filter(p => p._id !== id));
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  // الحصول على اسم القسم الفرعي
  const getSubCategoryLabel = (key) => {
    const found = tabs.find(t => t.key === key);
    return found ? found.label : key || 'عام';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📜 إدارة البروتوكولات</h1>
        <Link to="/admin/protocol/add" style={styles.addBtn}>+ إضافة بروتوكول جديد</Link>
      </div>

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>جاري التحميل...</div>
      ) : protocols.length === 0 ? (
        <div style={styles.empty}>لا توجد بروتوكولات في هذا القسم.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>القسم الفرعي</th>
                <th>المحتوى</th>
                <th>تاريخ التحديث</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map(p => (
                <tr key={p._id}>
                  <td>
                    <Link to={`/documents/${p._id}`} style={styles.docLink}>
                      {p.title}
                    </Link>
                  </td>
                  <td>{getSubCategoryLabel(p.subCategory)}</td>
                  <td style={styles.contentCell}>
                    {p.description?.slice(0, 80)}
                    {p.description?.length > 80 && '...'}
                  </td>
                  <td>{new Date(p.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <Link to={`/admin/protocol/edit/${p._id}`} style={styles.actionIcon} title="تعديل المحتوى">
                      ✏️
                    </Link>
                    <button onClick={() => handleDelete(p._id)} style={{ ...styles.actionIcon, color: '#DC2626' }} title="حذف">
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
  addBtn: { padding: '10px 20px', background: '#2563EB', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '10px 24px', background: '#E2E8F0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '15px' },
  tabActive: { background: '#2563EB', color: 'white' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  loading: { textAlign: 'center', color: '#718096' },
  empty: { textAlign: 'center', color: '#a0aec0' },
  tableWrapper: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  docLink: { color: '#2563EB', textDecoration: 'none' },
  actionIcon: { background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '8px', fontSize: '18px', color: '#475569' },
  contentCell: { maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#4B5563' },
};

export default ManageProtocol;