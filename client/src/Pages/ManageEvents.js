// client/src/components/pages/ManageEvents.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) setEvents(response.data.data);
      } catch (err) {
        setError('فشل في تحميل الفعاليات');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفعالية؟')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(item => item._id !== id));
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📅 إدارة الفعاليات</h1>
        <Link to="/admin/events/add" style={styles.addBtn}>+ إضافة فعالية جديدة</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>جاري التحميل...</div>
      ) : events.length === 0 ? (
        <div style={styles.empty}>لا توجد فعاليات</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>الصورة</th>
                <th>العنوان</th>
                <th>التاريخ</th>
                <th>الموقع</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => (
                <tr key={item._id}>
                  <td>{item.image ? <img src={item.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} /> : '-'}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.date).toLocaleDateString('ar-EG')}</td>
                  <td>{item.location || '-'}</td>
                  <td><span style={{ ...styles.statusBadge, background: item.isActive ? '#D1FAE5' : '#FEE2E2' }}>{item.isActive ? 'نشط' : 'غير نشط'}</span></td>
                  <td>
                    <Link to={`/admin/events/edit/${item._id}`} style={styles.editBtn}>✏️</Link>
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

// الأنماط مشابهة لـ ManageNews
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

export default ManageEvents;