import React, { useState } from 'react';

export default function Settings({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Alex');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'Rivers');
  const [email, setEmail] = useState(user?.email || 'alex.rivers@wostup.com');
  const [bio, setBio] = useState('Design-focused project manager based in London...');
  const [timezone, setTimezone] = useState('GMT+0 (London, UK)');
  const [language, setLanguage] = useState('English (UK)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Workspace state
  const [wsName, setWsName] = useState('Engineering Workspace');
  const [wsDesc, setWsDesc] = useState('Primary engineering and product development hub.');
  const [wsVisibility, setWsVisibility] = useState('Private');
  const [wsTimezone, setWsTimezone] = useState('GMT+0 (London, UK)');

  // Notifications state
  const [notifs, setNotifs] = useState({
    taskAssigned: true,
    taskCompleted: true,
    milestoneReached: true,
    commentMentions: true,
    weeklyDigest: false,
    inAppAll: true,
    inAppUrgent: true,
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: '💻', name: 'MacBook Pro — Chrome 126', location: 'London, UK', time: 'Active now', current: true },
    { id: 2, device: '📱', name: 'iPhone 15 — Safari', location: 'London, UK', time: '3 hours ago', current: false },
    { id: 3, device: '🖥️', name: 'Windows PC — Edge', location: 'Manchester, UK', time: '2 days ago', current: false },
  ]);

  // Integrations state
  const [integrations, setIntegrations] = useState({
    github: false,
    slack: true,
    jira: false,
    googledrive: true,
    notion: false,
    figma: false,
  });

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onUpdateUser({ name: `${firstName} ${lastName}`, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleWsSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword) { alert('Please enter your current password.'); return; }
    if (newPassword !== confirmNewPassword) { alert('New passwords do not match.'); return; }
    if (newPassword.length < 8) { alert('Password must be at least 8 characters.'); return; }
    alert('Password updated successfully!');
    setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
  };

  const toggleIntegration = (key) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'workspace', label: 'Workspace', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  const integrationList = [
    { key: 'github', icon: '🐙', name: 'GitHub', desc: 'Sync repositories and link commits to tasks.' },
    { key: 'slack', icon: '💬', name: 'Slack', desc: 'Send workspace notifications to Slack channels.' },
    { key: 'jira', icon: '🎯', name: 'Jira', desc: 'Import and sync issues with Jira projects.' },
    { key: 'googledrive', icon: '📁', name: 'Google Drive', desc: 'Attach Drive files directly to tasks.' },
    { key: 'notion', icon: '📝', name: 'Notion', desc: 'Embed Notion pages in project descriptions.' },
    { key: 'figma', icon: '🎨', name: 'Figma', desc: 'Preview Figma frames inside task detail view.' },
  ];

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Settings</h1>
          <p>Manage your personal account and workspace preferences.</p>
        </div>
        <div className="page-header-actions" style={styles.headerActions}>
          {saveSuccess && (
            <span style={styles.savedBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved!
            </span>
          )}
          <button style={styles.discardBtn} onClick={() => window.location.reload()}>
            Discard Changes
          </button>
          <button className="btn-gradient" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="settings-split" style={styles.settingsGrid}>

        {/* Left tabs selector */}
        <div className="premium-card settings-menu" style={styles.tabsPanel}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="settings-menu-btn"
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

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              <p style={styles.sectionSubtitle}>Update your photo and personal details here.</p>

              <div style={styles.avatarRow}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Avatar"
                  style={styles.avatarLarge}
                />
                <div>
                  <button type="button" style={styles.avatarBtn} onClick={() => alert('Simulating image upload...')}>
                    Upload New Photo
                  </button>
                  <p style={{ fontSize: '11px', color: '#9AA6B2', marginTop: '6px' }}>PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="split-row" style={styles.inputRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Bio &amp; Localization</h3>
              <p style={styles.sectionSubtitle}>How you appear to your team across different timezones.</p>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <div className="split-row" style={styles.inputRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Timezone</label>
                  <select className="form-input form-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option>GMT+0 (London, UK)</option>
                    <option>GMT-5 (New York, US)</option>
                    <option>GMT+5:30 (Mumbai, IN)</option>
                    <option>GMT+8 (Singapore)</option>
                    <option>GMT-8 (Los Angeles, US)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Display Language</label>
                  <select className="form-input form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English (UK)</option>
                    <option>English (US)</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {/* ── WORKSPACE TAB ── */}
          {activeTab === 'workspace' && (
            <form onSubmit={handleWsSave}>
              <h3 style={styles.sectionTitle}>Workspace Settings</h3>
              <p style={styles.sectionSubtitle}>Configure your workspace identity and default settings.</p>

              <div className="form-group">
                <label className="form-label">Workspace Name</label>
                <input type="text" className="form-input" value={wsName} onChange={(e) => setWsName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} />
              </div>

              <div className="split-row" style={styles.inputRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Visibility</label>
                  <select className="form-input form-select" value={wsVisibility} onChange={(e) => setWsVisibility(e.target.value)}>
                    <option>Private</option>
                    <option>Public</option>
                    <option>Invite Only</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Default Timezone</label>
                  <select className="form-input form-select" value={wsTimezone} onChange={(e) => setWsTimezone(e.target.value)}>
                    <option>GMT+0 (London, UK)</option>
                    <option>GMT-5 (New York, US)</option>
                    <option>GMT+5:30 (Mumbai, IN)</option>
                  </select>
                </div>
              </div>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Workspace Logo</h3>
              <p style={styles.sectionSubtitle}>Displayed in navigation and email notifications.</p>

              <div style={styles.avatarRow}>
                <div style={{ ...styles.avatarLarge, borderRadius: '12px', background: 'linear-gradient(135deg, #5B5FFB, #B24DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '24px', fontWeight: '700', width: '64px', height: '64px' }}>W</div>
                <div>
                  <button type="button" style={styles.avatarBtn} onClick={() => alert('Upload workspace logo...')}>
                    Upload Logo
                  </button>
                  <p style={{ fontSize: '11px', color: '#9AA6B2', marginTop: '6px' }}>PNG, SVG up to 2MB</p>
                </div>
              </div>

              <button type="submit" className="btn-gradient" style={{ marginTop: '8px' }}>Save Workspace Settings</button>
            </form>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={styles.sectionTitle}>Email Notifications</h3>
              <p style={styles.sectionSubtitle}>Choose which events trigger email updates.</p>

              <div style={{ marginBottom: '28px' }}>
                {[
                  { key: 'taskAssigned', title: 'Task Assigned', desc: 'When a task is assigned to you' },
                  { key: 'taskCompleted', title: 'Task Completed', desc: 'When a task you own is marked done' },
                  { key: 'milestoneReached', title: 'Milestone Reached', desc: 'When a project milestone is completed' },
                  { key: 'commentMentions', title: 'Comment Mentions', desc: 'When someone @mentions you in a comment' },
                  { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'Weekly summary of workspace activity' },
                ].map(item => (
                  <div key={item.key} className="toggle-row">
                    <div className="toggle-label">
                      <span className="toggle-label-title">{item.title}</span>
                      <span className="toggle-label-desc">{item.desc}</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifs[item.key]}
                        onChange={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>In-App Notifications</h3>
              <p style={styles.sectionSubtitle}>Control what appears in your notification bell.</p>

              {[
                { key: 'inAppAll', title: 'All Activity', desc: 'Show all workspace activity notifications' },
                { key: 'inAppUrgent', title: 'Urgent Only', desc: 'Only high-priority alerts and blockers' },
              ].map(item => (
                <div key={item.key} className="toggle-row">
                  <div className="toggle-label">
                    <span className="toggle-label-title">{item.title}</span>
                    <span className="toggle-label-desc">{item.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifs[item.key]}
                      onChange={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* ── BILLING TAB ── */}
          {activeTab === 'billing' && (
            <div>
              <h3 style={styles.sectionTitle}>Plan &amp; Billing</h3>
              <p style={styles.sectionSubtitle}>Manage your subscription and payment details.</p>

              <div className="billing-plan-card">
                <div className="billing-plan-badge">✦ FREE PLAN</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A1D20', marginBottom: '8px' }}>$0 / month</div>
                <p style={{ fontSize: '13px', color: '#6C7A87', marginBottom: '20px', lineHeight: '1.5' }}>
                  Up to 3 workspaces · 5 team members · 10GB storage · Basic AI insights
                </p>
                <button className="btn-gradient" style={{ padding: '12px 28px' }} onClick={() => alert('Redirecting to Pro upgrade...')}>
                  ✦ Upgrade to Pro — $19/month
                </button>
              </div>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Payment Method</h3>
              <p style={styles.sectionSubtitle}>No payment method on file for the free plan.</p>

              <button style={{ ...styles.avatarBtn, marginBottom: '24px' }} onClick={() => alert('Add payment method...')}>
                + Add Payment Method
              </button>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Billing History</h3>
              <p style={styles.sectionSubtitle}>Your past invoices and payment records.</p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ECEEF4', backgroundColor: '#FAFCFF' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#9AA6B2', fontSize: '11px', letterSpacing: '0.05em' }}>DATE</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#9AA6B2', fontSize: '11px', letterSpacing: '0.05em' }}>DESCRIPTION</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#9AA6B2', fontSize: '11px', letterSpacing: '0.05em' }}>AMOUNT</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#9AA6B2', fontSize: '11px', letterSpacing: '0.05em' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Jul 1, 2026', desc: 'Free Plan', amount: '$0.00', status: 'Active' },
                      { date: 'Jun 1, 2026', desc: 'Free Plan', amount: '$0.00', status: 'Paid' },
                      { date: 'May 1, 2026', desc: 'Free Plan', amount: '$0.00', status: 'Paid' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #ECEEF4' }}>
                        <td style={{ padding: '12px', color: '#6C7A87' }}>{row.date}</td>
                        <td style={{ padding: '12px', color: '#1A1D20', fontWeight: '500' }}>{row.desc}</td>
                        <td style={{ padding: '12px', color: '#1A1D20', fontWeight: '600' }}>{row.amount}</td>
                        <td style={{ padding: '12px' }}>
                          <span className="badge badge-completed" style={{ fontSize: '10px' }}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── INTEGRATIONS TAB ── */}
          {activeTab === 'integrations' && (
            <div>
              <h3 style={styles.sectionTitle}>Connected Apps</h3>
              <p style={styles.sectionSubtitle}>Connect your favourite tools to enhance your workspace workflow.</p>

              <div className="integration-grid" style={{ marginTop: '20px' }}>
                {integrationList.map(item => (
                  <div key={item.key} className="integration-card">
                    <div className="integration-icon">{item.icon}</div>
                    <div>
                      <div className="integration-name">{item.name}</div>
                      <div className="integration-desc">{item.desc}</div>
                    </div>
                    <button
                      className={`integration-connect-btn ${integrations[item.key] ? 'connected' : ''}`}
                      onClick={() => toggleIntegration(item.key)}
                    >
                      {integrations[item.key] ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div>
              <h3 style={styles.sectionTitle}>Change Password</h3>
              <p style={styles.sectionSubtitle}>Use a strong password that you haven't used before.</p>

              <form onSubmit={handlePasswordChange} style={{ maxWidth: '420px' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-gradient">Update Password</button>
              </form>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Two-Factor Authentication</h3>
              <p style={styles.sectionSubtitle}>Add an extra layer of security to your account.</p>

              <div className="toggle-row" style={{ maxWidth: '480px', border: '1px solid #ECEEF4', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div className="toggle-label">
                  <span className="toggle-label-title">Authenticator App (TOTP)</span>
                  <span className="toggle-label-desc">Use Google Authenticator or Authy</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={twoFAEnabled} onChange={() => { setTwoFAEnabled(!twoFAEnabled); if (!twoFAEnabled) alert('2FA setup flow simulated. In production, a QR code would appear here.'); }} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div style={styles.divider} />
              <h3 style={styles.sectionTitle}>Active Sessions</h3>
              <p style={styles.sectionSubtitle}>Manage and revoke access to your account from other devices.</p>

              <div style={{ marginTop: '16px' }}>
                {sessions.map(session => (
                  <div key={session.id} className="session-item">
                    <div className="session-device">
                      <div className="session-icon">{session.device}</div>
                      <div>
                        <div className="session-info-name">
                          {session.name}
                          {session.current && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#E6FFFA', color: '#10B981', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>Current</span>}
                        </div>
                        <div className="session-info-meta">{session.location} · {session.time}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="session-revoke-btn" onClick={() => revokeSession(session.id)}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  savedBadge: {
    display: 'inline-flex', alignItems: 'center', fontSize: '13px',
    fontWeight: '600', color: '#10B981', background: '#E6FFFA',
    padding: '6px 12px', borderRadius: '8px', border: '1px solid #B2F5EA',
  },
  discardBtn: {
    backgroundColor: '#FFFFFF', border: '1px solid #ECEEF4', color: '#6C7A87',
    padding: '10px 16px', borderRadius: '8px', fontSize: '14px',
    fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease',
  },
  settingsGrid: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'flex-start' },
  tabsPanel: { padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  tabLink: {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
    background: 'none', border: 'none', padding: '12px 16px', borderRadius: '8px',
    textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6C7A87',
    cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-sans)',
  },
  tabLinkActive: { backgroundColor: '#F0F2FF', color: '#5B5FFB', fontWeight: '600' },
  tabIcon: { fontSize: '16px' },
  contentPanel: { padding: '32px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1A1D20', marginBottom: '4px' },
  sectionSubtitle: { fontSize: '12.5px', color: '#6C7A87', marginBottom: '20px' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  avatarLarge: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #5B5FFB' },
  avatarBtn: {
    backgroundColor: '#FFFFFF', border: '1px solid #ECEEF4', borderRadius: '8px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#1A1D20',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  inputRow: { display: 'flex', gap: '16px' },
  divider: { height: '1px', backgroundColor: '#ECEEF4', margin: '24px 0' },
};
