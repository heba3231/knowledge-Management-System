// client/src/components/pages/Categories.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📂 Categories</h1>
        <p style={styles.pageSubtitle}>Manage document categories.</p>
        <Link to="/categories/add" style={styles.addBtn}>+ Add New Category</Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {categories.map((category) => (
          <div key={category._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{category.categoryName}</h3>
            <p style={styles.cardDesc}>{category.description || 'No description'}</p>
            <div style={styles.cardActions}>
              <button style={styles.editBtn}>✏️ Edit</button>
              <button onClick={() => handleDelete(category._id)} style={styles.deleteBtn}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', background: '#f7fafc', minHeight: '80vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' },
  pageTitle: { fontSize: '32px', color: '#2d3748', marginBottom: '4px' },
  pageSubtitle: { color: '#718096', fontSize: '16px' },
  addBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '18px', color: '#2d3748', marginBottom: '8px' },
  cardDesc: { fontSize: '14px', color: '#718096', marginBottom: '12px' },
  cardActions: { display: 'flex', gap: '8px' },
  editBtn: { padding: '4px 12px', background: '#0F766E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '4px 12px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default Categories;