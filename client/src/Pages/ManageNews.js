// client/src/components/pages/ManageNews.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ✅ إضافة BASE_URL
const BASE_URL = 'http://localhost:5000';

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/news`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) setNews(response.data.data);
      } catch (err) {
        setError('فشل في تحميل الأخبار');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(news.filter(item => item._id !== id));
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📰 إدارة الأخبار</h1>
        <Link to="/admin/news/add" style={styles.addBtn}>+ إضافة خبر جديد</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>جاري التحميل...</div>
      ) : news.length === 0 ? (
        <div style={styles.empty}>لا توجد أخبار</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>الصورة</th>
                <th>العنوان</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.image ? (
                      // ✅ إضافة BASE_URL أمام مسار الصورة
                      <img 
                        src={`${BASE_URL}${item.image}`} 
                        alt="" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} 
                      />
                    ) : '-'}
                  </td>
                  <td>{item.title}</td>
                  <td>{new Date(item.date).toLocaleDateString('ar-EG')}</td>
                  <td><span style={{ ...styles.statusBadge, background: item.isActive ? '#D1FAE5' : '#FEE2E2' }}>{item.isActive ? 'نشط' : 'غير نشط'}</span></td>
                  <td>
                    <Link to={`/admin/news/edit/${item._id}`} style={styles.editBtn}>✏️</Link>
                    <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>🗑️</button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' },
  pageTitle: { fontSize: '32px', color: '#2d3748' },
  addBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  loading: { textAlign: 'center', color: '#718096' },
  empty: { textAlign: 'center', color: '#a0aec0' },
  tableWrapper: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  editBtn: { padding: '4px 10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', marginRight: '6px', cursor: 'pointer', textDecoration: 'none' },
  deleteBtn: { padding: '4px 10px', background: '#fc8181', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default ManageNews;