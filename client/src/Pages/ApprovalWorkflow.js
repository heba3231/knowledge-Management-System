// client/src/Components/pages/ApprovalWorkflow.jsx
import React, { useState } from 'react';

const ApprovalWorkflow = () => {
  const [tasks] = useState([
    { id: 1, title: 'ICU Protocol v3', dept: 'ICU', submitted: '2026-06-14', status: 'Pending' },
    { id: 2, title: 'Lab Safety Policy', dept: 'Lab', submitted: '2026-06-13', status: 'Review' },
  ]);

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>✅ Approval Workflow</h1>
      <p style={styles.pageSubtitle}>Manage document approvals and track progress.</p>

      {/* Workflow Status Bar */}
      <div style={styles.workflowBar}>
        <div style={styles.step}>Draft</div>
        <div style={styles.stepActive}>Department Review</div>
        <div style={styles.step}>Quality Review</div>
        <div style={styles.step}>Approved</div>
      </div>

      {/* Task Table */}
      <div style={styles.tableWrapper}>
        <h3 style={styles.tableTitle}>Pending Approvals</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Department</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.dept}</td>
                <td>{task.submitted}</td>
                <td><span style={styles.statusBadge}>{task.status}</span></td>
                <td>
                  <button style={styles.approveBtn}>✅ Approve</button>
                  <button style={styles.rejectBtn}>✏️ Request Changes</button>
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
  pageTitle: {
    fontSize: '32px',
    color: '#2d3748',
    marginBottom: '4px',
  },
  pageSubtitle: {
    color: '#718096',
    fontSize: '16px',
    marginBottom: '24px',
  },
  workflowBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  step: {
    color: '#a0aec0',
    fontWeight: '600',
    fontSize: '14px',
    position: 'relative',
  },
  stepActive: {
    color: '#667eea',
    fontWeight: '700',
    fontSize: '14px',
    borderBottom: '3px solid #667eea',
    paddingBottom: '4px',
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '20px',
  },
  tableTitle: {
    fontSize: '18px',
    color: '#2d3748',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  statusBadge: {
    background: '#fefcbf',
    color: '#975a16',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  approveBtn: {
    padding: '6px 12px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  rejectBtn: {
    padding: '6px 12px',
    background: '#fc8181',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ApprovalWorkflow;