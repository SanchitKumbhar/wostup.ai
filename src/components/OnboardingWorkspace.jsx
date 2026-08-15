import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingWorkspace({ onGenerate }) {
  const navigate = useNavigate();
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

    if (onGenerate) {
      onGenerate({
        name: workspaceName,
        color: selectedColor,
        membersCount: invites ? invites.split(',').length + 1 : 1,
      });
    }
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={styles.authWrapper}>
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      <div style={styles.authCard}>
        <div style={styles.brandHeader}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
              <circle cx="12" cy="12" r="4" fill="url(#logoGrad)" />
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5B5FFB" />
                  <stop offset="100%" stopColor="#B24DFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span style={styles.brandName}>Wostup</span>
        </div>
        
        <div style={styles.formContainer}>
          <h2 style={styles.headerTitle}>Create your first Workspace</h2>
          <p style={styles.subtitle}>This is where your team's projects, tasks, and sprints will live.</p>
          
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '24px' }}>
            {error && <div style={{ color: '#FF3B47', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Workspace Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                style={styles.formInput}
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Theme Color</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: color.value, border: 'none', cursor: 'pointer',
                      outline: selectedColor === color.value ? '2px solid #1A1D20' : 'none',
                      outlineOffset: '2px',
                      color: '#fff', fontSize: '14px', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    W
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Invite Team (Emails, comma separated)</label>
              <input
                type="text"
                placeholder="colleague@example.com, ..."
                style={styles.formInput}
                value={invites}
                onChange={(e) => setInvites(e.target.value)}
              />
            </div>
            
            <button type="submit" style={styles.formButtonPrimary}>
              Create Workspace & Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F8F9FD',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingTop: 'max(40px, 6vh)',
    paddingBottom: '60px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  },
  bgGlow1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(91,95,251,0.06) 0%, rgba(255,255,255,0) 70%)',
    top: '-10%',
    left: '-10%',
    zIndex: 1,
  },
  bgGlow2: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(178,77,255,0.05) 0%, rgba(255,255,255,0) 70%)',
    bottom: '-10%',
    right: '-10%',
    zIndex: 1,
  },
  authCard: {
    width: '100%',
    maxWidth: '460px',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#1A1D20',
    letterSpacing: '-0.02em',
  },
  formContainer: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.01)',
    boxSizing: 'border-box',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    color: '#1A1D20',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6C7A87',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.5',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
    width: '100%',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4B5563',
  },
  formInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  },
  formButtonPrimary: {
    width: '100%',
    background: 'linear-gradient(135deg, #5B5FFB, #B24DFF)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 16px rgba(91, 95, 251, 0.2)',
    fontSize: '15px',
    fontWeight: '600',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'filter 0.2s',
  }
};
