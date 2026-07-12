// client/src/Components/pages/UserManagement.jsx
import React, { useState } from 'react';

const UserManagement = () => {
  const [users] = useState([
    { id: 1, name: 'Dr. Ahmed', email: 'ahmed@hospital.com', role: 'Admin', dept: 'General', status: 'Active' },
    { id: 2, name: 'Dr. Sara', email: 'sara@hospital.com', role: 'QualityManager', dept: 'Quality', status: 'Active' },
    { id: 3, name: 'Dr. Khaled', email: 'khaled@hospital.com', role: 'Staff', dept: 'ER', status: 'Inactive' },
  ]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>👥 User Management</h1>
        <button style={styles.addBtn}>+ Add New User</button>
      </div>
      <p style={styles.pageSubtitle}>Manage users, roles, and permissions.</p>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.dept}</td>
                <td>
                  <span style={{ ...styles.statusBadge, background: user.status === 'Active' ? '#c6f6d5' : '#fed7d7' }}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button style={styles.editBtn}>✏️ Edit</button>
                  <button style={styles.deleteBtn}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f7fafc',
    minHeight: '80vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '4px',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#2d3748',
  },
  addBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pageSubtitle: {
    color: '#718096',
    fontSize: '16px',
    marginBottom: '24px',
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  editBtn: {
    padding: '4px 10px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginRight: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '4px 10px',
    background: '#fc8181',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default UserManagement;