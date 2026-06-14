import React, { useState } from 'react';

export default function Settings({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Alex');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'Rivers');
  const [email, setEmail] = useState(user?.email || 'alex.rivers@wostup.com');
  const [bio, setBio] = useState('Design-focused project manager based in London...');
  const [timezone, setTimezone] = useState('GMT+0 (London, UK)');
  const [language, setLanguage] = useState('English (UK)');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      name: `${firstName} ${lastName}`,
      email: email,
    });
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'workspace', label: 'Workspace', icon: '📁' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Settings</h1>
          <p>Manage your personal account and workspace preferences.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.discardBtn} onClick={() => alert('Changes discarded')}>
            Discard Changes
          </button>
          <button className="btn-gradient" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={styles.settingsGrid}>
        
        {/* Left tabs selector */}
        <div className="premium-card" style={styles.tabsPanel}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabLink,
                ...(activeTab === tab.id ? styles.tabLinkActive : {}),
              }}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right content panel */}
        <div className="premium-card" style={styles.contentPanel}>
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              <p style={styles.sectionSubtitle}>Update your photo and personal details here.</p>

              {/* Avatar Editor Row */}
              <div style={styles.avatarRow}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Avatar"
                  style={styles.avatarLarge}
                />
                <button
                  type="button"
                  style={styles.avatarBtn}
                  onClick={() => alert('Simulating image upload...')}
                >
                  Upload New Photo
                </button>
              </div>

              {/* Names row */}
              <div style={styles.inputRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={styles.divider} />

              <h3 style={styles.sectionTitle}>Bio & Localization</h3>
              <p style={styles.sectionSubtitle}>How you appear to your team across different timezones.</p>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {/* Timezone and Language */}
              <div style={styles.inputRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Timezone</label>
                  <select
                    className="form-input"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="GMT+0 (London, UK)">GMT+0 (London, UK)</option>
                    <option value="GMT-5 (New York, US)">GMT-5 (New York, US)</option>
                    <option value="GMT+5:30 (Mumbai, IN)">GMT+5:30 (Mumbai, IN)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Display Language</label>
                  <select
                    className="form-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English (UK)">English (UK)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

            </form>
          )}

          {activeTab !== 'profile' && (
            <div style={styles.emptyState}>
              <span>⚙️</span>
              <h4>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h4>
              <p>WorkWise workspace configuration parameters are automatically managed by Wostup AI operations.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  discardBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    color: '#6C7A87',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gap: '24px',
    alignItems: 'flex-start',
  },
  tabsPanel: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tabLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6C7A87',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabLinkActive: {
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: '16px',
  },
  contentPanel: {
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '12.5px',
    color: '#6C7A87',
    marginBottom: '20px',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #5B5FFB',
  },
  avatarBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  inputRow: {
    display: 'flex',
    gap: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ECEEF4',
    margin: '24px 0',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
    textAlign: 'center',
    gap: '12px',
    color: '#6C7A87',
    span: {
      fontSize: '32px',
    },
    h4: {
      color: '#1A1D20',
    },
    p: {
      fontSize: '13px',
      maxWidth: '320px',
    },
  },
};
