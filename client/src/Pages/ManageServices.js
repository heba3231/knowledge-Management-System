// client/src/components/pages/ManageServices.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/services', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) setServices(response.data.data);
      } catch (err) {
        setError('فشل في تحميل الخدمات');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(item => item._id !== id));
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>🩺 إدارة الخدمات</h1>
        <Link to="/admin/services/add" style={styles.addBtn}>+ إضافة خدمة جديدة</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>جاري التحميل...</div>
      ) : services.length === 0 ? (
        <div style={styles.empty}>لا توجد خدمات</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>الوصف</th>
                <th>الترتيب</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.order || 0}</td>
                  <td>
                    <Link to={`/admin/services/edit/${item._id}`} style={styles.editBtn}>✏️</Link>
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

// الأنماط مشابهة
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
  editBtn: { padding: '4px 10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', marginRight: '6px', cursor: 'pointer', textDecoration: 'none' },
  deleteBtn: { padding: '4px 10px', background: '#fc8181', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default ManageServices;