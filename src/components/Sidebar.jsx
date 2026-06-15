import React from 'react';

export default function Sidebar({ isOpen, onClose, currentScreen, onNavigate, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    )},
    { id: 'projects', label: 'Projects', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )},
    { id: 'my-tasks', label: 'My Tasks', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )},
    { id: 'milestones', label: 'Milestones', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 4 15 9 5 14 5 20" />
        <line x1="5" y1="4" x2="5" y2="20" />
      </svg>
    )},
    { id: 'team-load', label: 'Team Load', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { id: 'task-health', label: 'Task Health', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )},
    { id: 'ai-assistant', label: 'AI Assistant', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="10" r="1.5" />
        <circle cx="8" cy="10" r="1.5" />
        <circle cx="16" cy="10" r="1.5" />
      </svg>
    )},
    { id: 'autonomous-monitoring', label: 'AI Engine Ops', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="12" />
        <line x1="18" y1="12" x2="18" y2="21" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <line x1="6" y1="15" x2="18" y2="9" />
      </svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )},
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`} style={styles.sidebar}>
      {/* Brand logo */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="url(#sidebarLogoGrad)" strokeWidth="2.5" fill="none" />
            <circle cx="12" cy="12" r="4" fill="url(#sidebarLogoGrad)" />
            <defs>
              <linearGradient id="sidebarLogoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5B5FFB" />
                <stop offset="100%" stopColor="#B24DFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span style={styles.brandName}>Wostup</span>
        <button onClick={onClose} className="sidebar-close-btn" style={styles.closeBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={styles.navItem}
            >
              <span style={{
                ...styles.navIcon,
                color: isActive ? '#5B5FFB' : '#6C7A87'
              }}>
                {item.icon}
              </span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.id === 'task-health' && (
                <span style={styles.pulseIndicator}>
                  <span className="pulse-dot warning" style={{ width: '6px', height: '6px' }} />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pro upgrade card */}
      <div className="sidebar-upgrade-card" style={styles.upgradeCard}>
        <div style={styles.upgradeHeader}>PRO PLAN</div>
        <div style={styles.upgradeBody}>Upgrade for advanced health analytics.</div>
        <button className="sidebar-upgrade-btn" style={styles.upgradeBtn} onClick={() => alert('Billing module simulated.')}>Upgrade Now</button>
      </div>

      {/* Logout */}
      <button onClick={onLogout} className="sidebar-logout-btn" style={styles.logoutBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #ECEEF4',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '24px 16px',
    flexShrink: 0,
    zIndex: 20,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '12px',
    marginBottom: '32px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6C7A87',
    padding: '4px',
    marginLeft: 'auto',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A1D20',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '12px 14px',
    borderRadius: '10px',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    color: '#6C7A87',
  },
  navIcon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  navLabel: {
    flex: 1,
  },
  pulseIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeCard: {
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '16px',
    marginTop: '20px',
    position: 'relative',
    zIndex: 1,
  },
  upgradeHeader: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#5B5FFB',
    letterSpacing: '0.08em',
    marginBottom: '4px',
    position: 'relative',
    zIndex: 2,
  },
  upgradeBody: {
    fontSize: '12px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '12px',
    position: 'relative',
    zIndex: 2,
  },
  upgradeBtn: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1A1D20',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 2,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '12px 14px',
    borderRadius: '10px',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    color: '#6C7A87',
  },
};
