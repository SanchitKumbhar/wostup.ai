import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: 'None', color: '#9AA6B2' };
    if (pwd.length < 6) return { label: 'Weak', color: '#EF4444' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', color: '#EF4444' };
    if (score === 2) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Strong', color: '#10B981' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms and Privacy Policy.');
        return;
      }
    }

    // Dynamic login mock
    onLoginSuccess({
      email,
      name: email.split('@')[0].replace('.', ' '),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
  };

  return (
    <div style={styles.authWrapper}>
      {/* Background patterns */}
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      {/* Main card */}
      <div style={styles.authCard}>
        {/* Brand logo & tagline */}
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

        {/* Auth Content */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.formSubtitle}>
            {isLogin 
              ? 'Access your futuristic workspace and stay productive.' 
              : 'Join the futuristic workspace for team collaboration.'}
          </p>

          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Social Logins */}
          {!isLogin && (
            <div style={styles.socialRow}>
              <button type="button" onClick={() => onLoginSuccess({ email: 'google.user@gmail.com', name: 'Google User', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' })} className="auth-social-btn" style={styles.socialBtn}>
                <svg style={styles.socialIcon} viewBox="0 0 24 24" width="18" height="18"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.51 14.98 1 12 1 7.35 1 3.37 3.65 1.5 7.5l3.87 3C6.3 7.7 8.94 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.87c2.26-2.09 3.56-5.17 3.56-8.71z"/><path fill="#FBBC05" d="M5.37 14.5A7.17 7.17 0 0 1 5 12c0-.88.16-1.73.43-2.52L1.57 6.48A11.94 11.94 0 0 0 0 12c0 2.02.5 3.92 1.39 5.61l3.98-3.11z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.87-2.98c-1.08.72-2.47 1.16-4.09 1.16-3.07 0-5.67-2.04-6.6-4.88L1.4 16.48C3.25 20.32 7.31 23 12 23z"/></svg>
                Google
              </button>
              <button type="button" onClick={() => onLoginSuccess({ email: 'github.user@github.com', name: 'GitHub User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' })} className="auth-social-btn" style={styles.socialBtn}>
                <svg style={styles.socialIcon} viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                GitHub
              </button>
            </div>
          )}

          {isLogin ? null : <div className="auth-divider">OR CONTINUE WITH EMAIL</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputContainer}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={styles.labelNoMargin}>Password</label>
                {isLogin && <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery simulated.'); }} style={styles.forgotLink}>Forgot password?</a>}
              </div>
              <div style={styles.inputContainer}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {!isLogin && password && (
                <div style={styles.strengthRow}>
                  <span style={styles.strengthText}>Security Strength</span>
                  <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            {isLogin ? (
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="rememberMe" style={styles.checkboxLabel}>Remember me for 30 days</label>
              </div>
            ) : (
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="agreeTerms" style={styles.checkboxLabel}>
                  I agree to the <a href="#terms" style={styles.inlineLink}>Terms of Service</a> and <a href="#privacy" style={styles.inlineLink}>Privacy Policy</a>.
                </label>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" style={styles.submitBtn}>
              {isLogin ? 'Sign In' : 'Get Started'}
              <svg style={{ marginLeft: '6px' }} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </form>

          {isLogin && (
            <>
              <div className="auth-divider">OR CONTINUE WITH</div>
              <div style={styles.socialRow}>
                <button type="button" onClick={() => onLoginSuccess({ email: 'google.user@gmail.com', name: 'Google User', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' })} className="auth-social-btn" style={styles.socialBtn}>
                  <svg style={styles.socialIcon} viewBox="0 0 24 24" width="18" height="18"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.51 14.98 1 12 1 7.35 1 3.37 3.65 1.5 7.5l3.87 3C6.3 7.7 8.94 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.87c2.26-2.09 3.56-5.17 3.56-8.71z"/><path fill="#FBBC05" d="M5.37 14.5A7.17 7.17 0 0 1 5 12c0-.88.16-1.73.43-2.52L1.57 6.48A11.94 11.94 0 0 0 0 12c0 2.02.5 3.92 1.39 5.61l3.98-3.11z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.87-2.98c-1.08.72-2.47 1.16-4.09 1.16-3.07 0-5.67-2.04-6.6-4.88L1.4 16.48C3.25 20.32 7.31 23 12 23z"/></svg>
                  Google
                </button>
                <button type="button" onClick={() => onLoginSuccess({ email: 'github.user@github.com', name: 'GitHub User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' })} className="auth-social-btn" style={styles.socialBtn}>
                  <svg style={styles.socialIcon} viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  GitHub
                </button>
              </div>
            </>
          )}

          <div style={styles.toggleText}>
            {isLogin ? "Don't have an account yet? " : "Already have an account? "}
            <a
              href="#toggle"
              onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}
              style={styles.toggleLink}
            >
              {isLogin ? 'Create an account' : 'Sign In'}
            </a>
          </div>
        </div>
      </div>

      {/* Footer Branding Links */}
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
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#F8F9FD',
    position: 'relative',
    overflow: 'hidden',
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
    padding: '0 20px',
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
  formCard: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.01)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A1D20',
    textAlign: 'center',
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#6C7A87',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '1.4',
  },
  errorMessage: {
    backgroundColor: '#FFE5E5',
    color: '#C53030',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px',
    border: '1px solid rgba(197, 48, 48, 0.15)',
  },
  socialRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginBottom: '24px',
  },
  socialBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1D20',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  socialIcon: {
    flexShrink: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#9AA6B2',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    marginBottom: '24px',
    width: '100%',
    userSelect: 'none',
    justifyContent: 'center',
    gap: '12px',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6C7A87',
    marginBottom: '8px',
  },
  labelNoMargin: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6C7A87',
  },
  forgotLink: {
    fontSize: '12px',
    color: '#5B5FFB',
    textDecoration: 'none',
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#9AA6B2',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: '10px',
    border: '1px solid #ECEEF4',
    fontSize: '14px',
    color: '#1A1D20',
    backgroundColor: '#FAFCFF',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: '#9AA6B2',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    accentColor: '#5B5FFB',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#6C7A87',
    cursor: 'pointer',
    lineHeight: '1.4',
  },
  inlineLink: {
    color: '#5B5FFB',
    textDecoration: 'none',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #5B5FFB 0%, #B24DFF 100%)',
    color: '#FFFFFF',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(91, 95, 251, 0.2)',
    transition: 'all 0.2s ease',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6C7A87',
    marginTop: '28px',
  },
  toggleLink: {
    color: '#5B5FFB',
    textDecoration: 'none',
    fontWeight: '600',
  },
  strengthRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    marginTop: '6px',
  },
  strengthText: {
    color: '#9AA6B2',
  },
  strengthLabel: {
    fontWeight: '600',
  },
  footerLinks: {
    position: 'absolute',
    bottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#9AA6B2',
    zIndex: 10,
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
