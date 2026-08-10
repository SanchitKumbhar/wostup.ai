import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
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
        <div style={styles.tagline}>V2.0 Workspace Engine</div>

        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" appearance={{
          elements: {
            rootBox: {
              width: '100%',
            },
            card: {
              width: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.01)',
              boxSizing: 'border-box',
            },
            headerTitle: {
              fontFamily: "'Outfit', sans-serif",
              fontSize: '24px',
              color: '#1A1D20',
            },
            formButtonPrimary: {
              background: 'linear-gradient(135deg, #5B5FFB 0%, #B24DFF 100%)',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(91, 95, 251, 0.2)',
              fontSize: '15px',
              fontWeight: '600',
              padding: '14px',
              borderRadius: '10px',
            }
          }
        }} />
      </div>
      
      <div style={styles.footerLinks}>
        <a href="#privacy" style={styles.footerLink}>Privacy Policy</a>
        <span style={styles.footerDot}>•</span>
        <a href="#terms" style={styles.footerLink}>Terms of Service</a>
        <span style={styles.footerDot}>•</span>
        <span style={styles.serverStatus}>Server Status: <span style={styles.statusOptimal}>Optimal</span></span>
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
    marginBottom: '6px',
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
  tagline: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#5B5FFB',
    backgroundColor: '#E6ECFF',
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '32px',
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#9AA6B2',
    marginTop: '28px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: '8px',
  },
  footerLink: {
    color: '#9AA6B2',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  footerDot: {
    color: '#ECEEF4',
  },
  serverStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusOptimal: {
    color: '#10B981',
    fontWeight: '600',
  },
};
