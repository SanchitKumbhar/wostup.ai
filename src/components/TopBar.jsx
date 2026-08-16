import React, { useState, useEffect, useRef } from 'react';
import { UserButton } from '@clerk/clerk-react';

export default function TopBar({
  user,
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  onOpenNewWorkspaceModal,
  notificationCount = 3,
  onToggleSidebar,
  onNavigateToSettings,
  notifications = [],
  onMarkNotificationAsRead,
  onlineCount = 0,
}) {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const topBarRef = useRef(null);

  // Click-outside-to-dismiss for all dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target)) {
        setShowWorkspaceDropdown(false);
        setShowNotificationDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <header ref={topBarRef} className="topbar-container" style={styles.topBar}>
      <button onClick={onToggleSidebar} className="hamburger-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Workspace Switcher */}
      <div style={styles.switcherContainer}>
        <button
          onClick={() => {
            setShowWorkspaceDropdown(!showWorkspaceDropdown);
            setShowNotificationDropdown(false);
            setShowProfileDropdown(false);
          }}
          className="topbar-switcher-btn"
          style={styles.switcherBtn}
        >
          <div style={{ ...styles.switcherColorIcon, backgroundColor: activeWorkspace?.color || '#5B5FFB' }}>
            {activeWorkspace?.name?.charAt(0) || 'W'}
          </div>
          <span className="topbar-switcher-text" style={styles.switcherText}>{activeWorkspace?.name || 'Loading...'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', color: '#6C7A87' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showWorkspaceDropdown && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>Switch Workspace</div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  onWorkspaceSelect(ws.id);
                  setShowWorkspaceDropdown(false);
                }}
                className="topbar-dropdown-item"
                style={{
                  ...styles.dropdownItem,
                  fontWeight: ws.id === activeWorkspaceId ? '600' : '400',
                  color: ws.id === activeWorkspaceId ? '#5B5FFB' : '#1A1D20',
                }}
              >
                <div style={{ ...styles.switcherColorIconSmall, backgroundColor: ws.color }}>
                  {ws.name.charAt(0)}
                </div>
                {ws.name}
              </button>
            ))}
            <div style={styles.dropdownDivider} />
            <button
              onClick={() => {
                if (onNavigateToSettings) onNavigateToSettings();
                setShowWorkspaceDropdown(false);
              }}
              className="topbar-dropdown-action"
              style={{ ...styles.dropdownActionItem, color: '#1A1D20', marginBottom: '4px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Manage Workspace
            </button>
            <button
              onClick={() => {
                onOpenNewWorkspaceModal();
                setShowWorkspaceDropdown(false);
              }}
              className="topbar-dropdown-action"
              style={styles.dropdownActionItem}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Launch New Workspace
            </button>
          </div>
        )}
      </div>

      {/* Global Search */}
      <div className="topbar-search-container" style={styles.searchContainer}>
        <svg style={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="topbar-search-input"
          style={styles.searchInput}
        />
      </div>

      {/* Right Tools */}
      <div className="topbar-tools-container" style={styles.toolsContainer}>
        {/* AI status indicator & Team Online */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="topbar-ai-status" style={styles.aiStatus}>
            <span className="pulse-dot" />
            <span style={styles.aiStatusText}>AI: ACTIVE</span>
          </div>
          {onlineCount > 0 && (
            <div className="topbar-team-status" style={{...styles.aiStatus, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE'}}>
              <span className="pulse-dot" style={{ backgroundColor: '#3B82F6' }} />
              <span style={{...styles.aiStatusText, color: '#1E40AF'}}>TEAM: {onlineCount} ONLINE</span>
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div style={styles.badgeWrapper}>
          <button
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              setShowWorkspaceDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="topbar-icon-btn"
            style={styles.iconBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 && <span style={styles.bellBadge}>{notificationCount}</span>}
          </button>

          {showNotificationDropdown && (
            <div className="notification-dropdown-responsive" style={styles.notificationDropdown}>
              <div style={styles.dropdownHeader}>Workspace Notifications</div>
              {notifications.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#9AA6B2', fontSize: '12px' }}>No new notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className="topbar-notif-item" 
                    style={{...styles.notificationItem, opacity: notif.read ? 0.6 : 1}}
                    onClick={() => {
                      if (onMarkNotificationAsRead && !notif.read) {
                        onMarkNotificationAsRead(notif._id);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{
                        ...styles.notifDot,
                        backgroundColor: notif.type === 'overload_alert' ? '#EF4444' : notif.type === 'conflict_alert' ? '#F59E0B' : '#10B981'
                      }} />
                      <div style={styles.notifContent}>
                        <div style={{...styles.notifText, fontWeight: notif.read ? '400' : '600'}}>{notif.message}</div>
                        <div style={styles.notifTime}>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile menu via Clerk */}
        <div style={styles.profileContainer}>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: '32px',
                  height: '32px',
                  border: '1.5px solid #5B5FFB',
                }
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}

const styles = {
  topBar: {
    height: '64px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #ECEEF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    zIndex: 10,
    position: 'relative',
  },
  switcherContainer: {
    position: 'relative',
  },
  switcherBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '8px',
  },
  switcherColorIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  switcherColorIconSmall: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  switcherText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  dropdown: {
    position: 'absolute',
    top: '44px',
    left: '0',
    width: '220px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    padding: '8px 0',
    zIndex: 50,
  },
  dropdownHeader: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    padding: '8px 16px',
    textTransform: 'uppercase',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#1A1D20',
    cursor: 'pointer',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#ECEEF4',
    margin: '6px 0',
  },
  dropdownActionItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: '#5B5FFB',
    fontWeight: '600',
    cursor: 'pointer',
  },
  searchContainer: {
    position: 'relative',
    width: '360px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#9AA6B2',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    borderRadius: '8px',
    border: '1px solid #ECEEF4',
    fontSize: '13px',
    color: '#1A1D20',
    backgroundColor: '#F8F9FD',
  },
  toolsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  aiStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#E6FFFA',
    border: '1px solid #B2F5EA',
    borderRadius: '16px',
    padding: '4px 10px',
  },
  aiStatusText: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#234E52',
    letterSpacing: '0.05em',
  },
  badgeWrapper: {
    position: 'relative',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6C7A87',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '50%',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: '1px',
    right: '1px',
    backgroundColor: '#FF4D4D',
    color: '#FFFFFF',
    fontSize: '9px',
    fontWeight: '700',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '36px',
    right: '-10px',
    width: '320px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    padding: '12px 0',
    zIndex: 50,
  },
  notificationItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #FAFCFF',
    cursor: 'pointer',
  },
  notifDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '5px',
    flexShrink: 0,
  },
  notifContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  notifText: {
    fontSize: '12.5px',
    color: '#1A1D20',
    lineHeight: '1.4',
  },
  notifTime: {
    fontSize: '10px',
    color: '#9AA6B2',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid #5B5FFB',
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  userRole: {
    fontSize: '10px',
    color: '#9AA6B2',
  },
};
