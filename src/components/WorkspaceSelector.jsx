import React, { useState } from 'react';

export default function WorkspaceSelector({ isOpen, onClose, onGenerate }) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#5B5FFB'); // Blue/Purple default
  const [invites, setInvites] = useState('');
  const [error, setError] = useState('');

  const colors = [
    { value: '#5B5FFB', label: 'Blue/Purple' },
    { value: '#B24DFF', label: 'Purple' },
    { value: '#FF7A00', label: 'Orange' },
    { value: '#00C292', label: 'Teal' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setError('Workspace name is required');
      return;
    }

    onGenerate({
      name: workspaceName,
      color: selectedColor,
      membersCount: invites ? invites.split(',').length + 1 : 1,
    });
    
    // Reset form
    setWorkspaceName('');
    setSelectedColor('#5B5FFB');
    setInvites('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={styles.modalWidth}>
        {/* Banner with gradient */}
        <div style={styles.banner}>
          <button onClick={onClose} style={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div style={styles.iconCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B5FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={styles.formContent}>
          <h2 style={styles.title}>Launch a New Workspace</h2>
          <p style={styles.subtitle}>Set the foundation for your next collaboration. Invite your team later.</p>

          {error && <div style={styles.errorText}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Workspace Name</label>
            <input
              type="text"
              placeholder="e.g. Project Phoenix"
              className="form-input"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Icon Style</label>
            <div style={styles.colorRow}>
              {colors.map((color) => (
                <button
                  type="button"
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  style={{
                    ...styles.colorBadge,
                    backgroundColor: color.value,
                    border: selectedColor === color.value ? '3px solid #1A1D20' : '3px solid transparent',
                  }}
                >
                  W
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const custom = prompt('Enter a hex color code (e.g. #FF00FF):');
                  if (custom && /^#[0-9A-F]{6}$/i.test(custom)) {
                    setSelectedColor(custom);
                  }
                }}
                style={styles.customColorBadge}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Invite Members (emails separated by comma)</label>
            <input
              type="text"
              placeholder="sarah@wostup.com, marcus@wostup.com"
              className="form-input"
              value={invites}
              onChange={(e) => setInvites(e.target.value)}
            />
          </div>

          <div style={styles.actionRow}>
            <button type="submit" className="btn-gradient" style={styles.ctaBtn}>
              Generate Workspace
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Maybe Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalWidth: {
    maxWidth: '460px',
  },
  banner: {
    background: 'linear-gradient(135deg, #5B5FFB 0%, #B24DFF 100%)',
    height: '110px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    bottom: '-32px',
  },
  formContent: {
    padding: '48px 32px 32px 32px',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1A1D20',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6C7A87',
    textAlign: 'center',
    marginBottom: '28px',
    lineHeight: '1.4',
  },
  errorText: {
    backgroundColor: '#FFE5E5',
    color: '#C53030',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  colorRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  colorBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  customColorBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '2px dashed #9AA6B2',
    color: '#6C7A87',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '28px',
    gap: '12px',
  },
  ctaBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelBtn: {
    background: 'none',
    border: 'none',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px',
    '&:hover': {
      color: '#1A1D20',
    },
  },
};
