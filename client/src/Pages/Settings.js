// client/src/Components/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // بيانات المستخدم من Redux
  const user = useSelector((state) => state.staff.user);
  const token = useSelector((state) => state.staff.token);

  // حالات نموذج الملف الشخصي
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
  });

  // حالات تغيير كلمة المرور
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // حالات الإعدادات العامة (للأدمن فقط)
  const [generalData, setGeneralData] = useState({
    organizationName: 'Health KMS',
    defaultLanguage: 'en',
  });

  // جلب بيانات المستخدم عند التحميل
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || 'General',
      });
    }
  }, [user]);

  // معالج تغيير حقول الملف الشخصي
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // معالج تغيير حقول كلمة المرور
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // تحديث الملف الشخصي
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user?._id}`,
        {
          name: profileData.name,
          email: profileData.email,
          department: profileData.department,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // تحديث البيانات في localStorage (اختياري)
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          name: profileData.name,
          email: profileData.email,
          department: profileData.department,
        }));
      } else {
        setMessage({ text: response.data.message || 'Update failed.', type: 'error' });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ text: response.data.message || 'Password change failed.', type: 'error' });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to change password. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // الإعدادات العامة (لأدمن فقط - وهمية حالياً)
  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: 'General settings saved (demo).', type: 'success' });
  };

  // أمان (2FA - وهمية حالياً)
  const handleEnable2FA = () => {
    alert('2FA feature coming soon!');
  };

  // تكاملات (وهمية حالياً)
  const handleConnectAD = () => {
    alert('Active Directory integration coming soon!');
  };

  const isAdmin = user?.role === 'Admin';

  // عرض محتوى التبويب النشط
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} style={styles.form}>
            <h3 style={styles.sectionTitle}>👤 Profile Settings</h3>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                style={styles.input}
                className="settings-input"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                style={styles.input}
                className="settings-input"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Department</label>
              <select
                name="department"
                value={profileData.department}
                onChange={handleProfileChange}
                style={styles.select}
                className="settings-select"
              >
                <option value="General">General</option>
                <option value="ER">ER</option>
                <option value="ICU">ICU</option>
                <option value="Lab">Lab</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology</option>
                <option value="Nursing">Nursing</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <button type="submit" style={styles.saveBtn} className="settings-save-btn" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        );

      case 'security':
        return (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>🔐 Security Settings</h3>
            <form onSubmit={handlePasswordSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  className="settings-input"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password (min 6 chars)"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  className="settings-input"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  className="settings-input"
                  required
                />
              </div>
              <button type="submit" style={styles.saveBtn} className="settings-save-btn" disabled={loading}>
                {loading ? 'Updating...' : '🔑 Change Password'}
              </button>
            </form>
            <div style={styles.divider} />
            <div style={styles.featureBox}>
              <h4>Two-Factor Authentication (2FA)</h4>
              <p style={styles.featureDesc}>Add an extra layer of security to your account.</p>
              <button onClick={handleEnable2FA} style={styles.enableBtn} className="settings-2fa-btn">
                Enable 2FA
              </button>
            </div>
          </div>
        );

      case 'general':
        return (
          <form onSubmit={handleGeneralSubmit} style={styles.form}>
            <h3 style={styles.sectionTitle}>⚙️ General Settings</h3>
            <div style={styles.field}>
              <label style={styles.label}>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={generalData.organizationName}
                onChange={(e) => setGeneralData({ ...generalData, organizationName: e.target.value })}
                style={styles.input}
                className="settings-input"
                disabled={!isAdmin}
              />
              {!isAdmin && <span style={styles.hint}>Only admins can change this.</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Default Language</label>
              <select
                name="defaultLanguage"
                value={generalData.defaultLanguage}
                onChange={(e) => setGeneralData({ ...generalData, defaultLanguage: e.target.value })}
                style={styles.select}
                className="settings-select"
                disabled={!isAdmin}
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
              {!isAdmin && <span style={styles.hint}>Only admins can change this.</span>}
            </div>
            <button type="submit" style={styles.saveBtn} className="settings-save-btn" disabled={!isAdmin || loading}>
              {loading ? 'Saving...' : '💾 Save Settings'}
            </button>
          </form>
        );

      case 'integrations':
        return (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>🔌 Integrations</h3>
            <div style={styles.featureBox}>
              <h4>Active Directory</h4>
              <p style={styles.featureDesc}>Connect with Active Directory for centralized user management.</p>
              <button onClick={handleConnectAD} style={styles.integrateBtn} className="settings-integrate-btn">
                Connect AD
              </button>
            </div>
            <div style={styles.featureBox}>
              <h4>Hospital Information System (HIS)</h4>
              <p style={styles.featureDesc}>Sync data with your hospital's main system.</p>
              <button onClick={() => alert('HIS integration coming soon!')} style={styles.integrateBtn} className="settings-integrate-btn">
                Connect HIS
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>⚙️ Settings</h1>
      <p style={styles.pageSubtitle}>Customize your system preferences.</p>

      {message.text && (
        <div style={{ ...styles.message, ...(message.type === 'success' ? styles.messageSuccess : styles.messageError) }}>
          {message.text}
        </div>
      )}

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'profile' ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab('profile'); setMessage({ text: '', type: '' }); }}
        >
          👤 Profile
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'security' ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab('security'); setMessage({ text: '', type: '' }); }}
        >
          🔐 Security
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'general' ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab('general'); setMessage({ text: '', type: '' }); }}
        >
          ⚙️ General
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'integrations' ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab('integrations'); setMessage({ text: '', type: '' }); }}
        >
          🔌 Integrations
        </button>
      </div>

      <div style={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};

// ===== الأنماط المحدثة وفق HKMS =====
const styles = {
  container: {
    padding: '30px',
    maxWidth: '900px',
    margin: '0 auto',
    background: '#F8FAFC',
    minHeight: '80vh',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '4px',
    letterSpacing: '-0.3px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '16px',
    marginBottom: '24px',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  messageSuccess: {
    background: '#ECFDF5',
    color: '#0F766E',
    border: '1px solid #A7F3D0',
  },
  messageError: {
    background: '#FEF2F2',
    color: '#EF4444',
    border: '1px solid #FECACA',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '2px solid #E2E8F0',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748B',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  tabActive: {
    color: '#2563EB',
    borderBottom: '3px solid #2563EB',
  },
  tabContent: {
    background: '#FFFFFF',
    padding: '28px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '16px',
    letterSpacing: '-0.2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    color: '#0F172A',
    fontSize: '14px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#FFFFFF',
    color: '#0F172A',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#FFFFFF',
    color: '#0F172A',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '12px 24px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: '1px solid #2563EB',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
    fontFamily: 'Inter, Roboto, sans-serif',
    alignSelf: 'flex-start',
    marginTop: '4px',
  },
  enableBtn: {
    padding: '10px 20px',
    background: '#0F766E',
    color: '#FFFFFF',
    border: '1px solid #0F766E',
    borderRadius: '10px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  integrateBtn: {
    padding: '10px 20px',
    background: '#7C3AED',
    color: '#FFFFFF',
    border: '1px solid #7C3AED',
    borderRadius: '10px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  divider: {
    height: '1px',
    background: '#E2E8F0',
    margin: '24px 0',
  },
  featureBox: {
    background: '#F8FAFC',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    marginBottom: '16px',
  },
  featureDesc: {
    color: '#64748B',
    fontSize: '14px',
    marginBottom: '12px',
  },
  hint: {
    display: 'block',
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '4px',
  },
};

// ===== CSS إضافي للتفاعلات =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .settings-input:focus,
  .settings-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .settings-save-btn:hover {
    background: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  .settings-save-btn:active {
    transform: scale(0.98);
  }
  .settings-save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .settings-2fa-btn:hover {
    background: #0D9488;
    box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
  }
  .settings-integrate-btn:hover {
    background: #6D28D9;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
  .tab:hover {
    color: #0F172A;
  }
`;
document.head.appendChild(styleSheet);

export default Settings;