import React, { useEffect, useRef, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingIntro from './LandingIntro';

// ─── Logo SVG ────────────────────────────────────────────────────────────────
function WostupLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logoG" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B5FFB" />
          <stop offset="100%" stopColor="#B24DFF" />
        </linearGradient>
      </defs>
      <path d="M16 2L4 10L16 18L28 10L16 2Z" stroke="url(#logoG)" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      <path d="M4 10L16 18L16 30L4 22L4 10Z" fill="url(#logoG)" opacity="0.18"/>
      <path d="M28 10L16 18L16 30L28 22L28 10Z" fill="url(#logoG)" opacity="0.30"/>
      <circle cx="16" cy="10" r="3.5" fill="url(#logoG)" />
    </svg>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className="lp-feature-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div className="lp-feature-icon" style={{ background: color }}>
        {icon}
      </div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className="lp-step-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div className="lp-step-num">{num}</div>
      <h3 className="lp-step-title">{title}</h3>
      <p className="lp-step-desc">{desc}</p>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ quote, name, role, company, avatar, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className="lp-testimonial-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div className="lp-testimonial-stars">{'★'.repeat(5)}</div>
      <p className="lp-testimonial-quote">"{quote}"</p>
      <div className="lp-testimonial-author">
        <img src={avatar} alt={name} className="lp-testimonial-avatar" />
        <div>
          <div className="lp-testimonial-name">{name}</div>
          <div className="lp-testimonial-role">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Component ───────────────────────────────────────────────────
export default function Landing({ onLogin }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Trigger hero animation once preloader finishes or is active
    if (!showPreloader) {
      const t = setTimeout(() => setHeroVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [showPreloader]);

  useEffect(() => {
    // Navbar scroll shadow
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const features = [
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      title: 'Smart Task Tracking',
      desc: 'Kanban boards, priorities, and status pipelines — all synced in real time across your team.',
      color: 'linear-gradient(135deg, #5B5FFB, #8B8FFF)',
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2M12 2v2M12 20v2"/></svg>,
      title: 'AI-Powered Insights',
      desc: 'Surface deadline risks, resource bottlenecks, and sprint blockers before they derail delivery.',
      color: 'linear-gradient(135deg, #B24DFF, #D580FF)',
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
      title: 'Milestone Timelines',
      desc: 'Visual phase-by-phase planning with progress tracking and owner accountability built in.',
      color: 'linear-gradient(135deg, #00C292, #34D399)',
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      title: 'Team Load Balancer',
      desc: 'See who is overloaded, who has capacity, and intelligently redistribute work across your team.',
      color: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      title: 'Project Health Monitor',
      desc: 'Real-time health scores, risk ratings, and automated alerts for every active project.',
      color: 'linear-gradient(135deg, #EF4444, #F87171)',
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fff" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
      title: 'Real-time Collaboration',
      desc: 'Comments, @mentions, file attachments, and activity feeds keep everyone aligned instantly.',
      color: 'linear-gradient(135deg, #06B6D4, #67E8F9)',
    },
  ];

  const stats = [
    { value: 12000, suffix: '+', label: 'Teams Worldwide' },
    { value: 98, suffix: '%', label: 'On-time Delivery Rate' },
    { value: 4, suffix: '.9★', label: 'Average Rating' },
  ];

  const steps = [
    { num: '01', title: 'Create your workspace', desc: 'Set up your team workspace in under 60 seconds. Invite members, configure roles, and you\'re ready.' },
    { num: '02', title: 'Plan your projects', desc: 'Add projects, break them into milestones and tasks, assign owners, and set deadlines with visual timelines.' },
    { num: '03', title: 'Ship with confidence', desc: 'Wostup\'s AI watches for risks, flags blockers, and keeps leadership informed — automatically.' },
  ];

  const testimonials = [
    {
      quote: 'Wostup completely changed how we run sprints. The AI risk alerts alone have saved us from at least 3 major delivery failures.',
      name: 'Sarah Chen', role: 'Engineering Lead', company: 'Stellar Dynamics',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    },
    {
      quote: "The load balancer is genuinely magical. We finally stopped burning out Sarah and now our team capacity is actually visible.",
      name: 'Marcus Rodriguez', role: 'CTO', company: 'Neural Systems Ltd',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    },
    {
      quote: 'Migrated from Jira and never looked back. The milestone timeline view alone is worth the switch. Clean, fast, intelligent.',
      name: 'Elena Sokolov', role: 'Product Manager', company: 'Vogue Retail Group',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
    },
  ];

  const companies = ['Stellar Dynamics', 'Neural Systems', 'Vogue Retail', 'Global Bank', 'Logistics Pro', 'Future Labs'];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="lp-root">
      {showPreloader && (
        <LandingIntro onComplete={() => setShowPreloader(false)} />
      )}


      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          {/* Logo */}
          <a href="#" className="lp-nav-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <WostupLogo size={30} />
            <span className="lp-nav-wordmark">Wostup</span>
            <span className="lp-nav-badge">V2.0</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="lp-nav-links">
            <button onClick={() => scrollTo('features')} className="lp-nav-link">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="lp-nav-link">How It Works</button>
            <button onClick={() => scrollTo('testimonials')} className="lp-nav-link">Testimonials</button>
            <button onClick={() => scrollTo('pricing')} className="lp-nav-link">Pricing</button>
          </div>

          {/* CTA */}
          <div className="lp-nav-actions">
            <SignedIn>
              <button className="lp-nav-login-btn" onClick={() => onLogin('/dashboard')}>
                Go to Dashboard
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: 5 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </SignedIn>
            <SignedOut>
              <button className="lp-nav-login-btn" onClick={() => onLogin('/sign-in')} style={{ background: 'transparent', color: '#1A1D20', border: '1px solid #ECEEF4' }}>
                Sign In
              </button>
              <button className="lp-nav-login-btn" onClick={() => onLogin('/sign-up')} style={{ marginLeft: '8px' }}>
                Sign Up
              </button>
            </SignedOut>
          </div>

          {/* Mobile hamburger */}
          <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`lp-hamburger-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`lp-hamburger-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`lp-hamburger-bar ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lp-mobile-menu">
            <button onClick={() => scrollTo('features')} className="lp-mobile-link">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="lp-mobile-link">How It Works</button>
            <button onClick={() => scrollTo('testimonials')} className="lp-mobile-link">Testimonials</button>
            <button onClick={() => scrollTo('pricing')} className="lp-mobile-link">Pricing</button>
            <SignedIn>
              <button className="lp-mobile-login" onClick={() => onLogin('/dashboard')}>Go to Dashboard →</button>
            </SignedIn>
            <SignedOut>
              <button className="lp-mobile-login" onClick={() => onLogin('/sign-in')}>Sign In →</button>
              <button className="lp-mobile-login" onClick={() => onLogin('/sign-up')} style={{ marginTop: '8px' }}>Sign Up →</button>
            </SignedOut>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        {/* Background decorations */}
        <div className="lp-hero-blob lp-hero-blob--1" />
        <div className="lp-hero-blob lp-hero-blob--2" />
        <div className="lp-hero-grid" />

        <div className="lp-hero-inner">
          {/* Text Column */}
          <div
            className="lp-hero-text"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="lp-hero-eyebrow">
              <span className="lp-hero-pulse" />
              Trusted by 12,000+ teams worldwide
            </div>

            <h1 className="lp-hero-headline">
              The Workspace Engine
              <br />
              <span className="lp-hero-gradient-text">Built for Teams That Ship.</span>
            </h1>

            <p
              className="lp-hero-sub"
              style={{ transitionDelay: '0.1s', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s' }}
            >
              Wostup combines intelligent task tracking, AI-powered risk detection, and real-time collaboration into one unified workspace — so your team delivers on time, every time.
            </p>

            <div
              className="lp-hero-actions"
              style={{ transitionDelay: '0.2s', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s' }}
            >
              <SignedIn>
                <button className="lp-btn-primary" onClick={() => onLogin('/dashboard')}>
                  Go to Dashboard
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: 6 }}>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </SignedIn>
              <SignedOut>
                <button className="lp-btn-primary" onClick={() => onLogin('/sign-up')}>
                  Get Started Free
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: 6 }}>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </SignedOut>
              <button className="lp-btn-secondary" onClick={() => scrollTo('how-it-works')}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                </svg>
                See how it works
              </button>
            </div>

            <div
              className="lp-hero-trust"
              style={{ transitionDelay: '0.3s', opacity: heroVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.3s' }}
            >
              <div className="lp-hero-avatars">
                {['photo-1494790108377-be9c29b29330','photo-1507003211169-0a1dd7228f2d','photo-1544005313-94ddf0286df2','photo-1500648767791-00dcc994a43e'].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=40&q=80`}
                    alt="user"
                    className="lp-hero-avatar-img"
                    style={{ marginLeft: i === 0 ? 0 : -10 }}
                  />
                ))}
              </div>
              <span className="lp-hero-trust-text"><strong>4.9★</strong> from 2,400+ reviews</span>
            </div>
          </div>

          {/* Visual Column — Floating UI Cards */}
          <div
            className="lp-hero-visual"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}
          >
            {/* Main dashboard preview card */}
            <div className="lp-hero-card lp-hero-card--main">
              <div className="lp-hero-card-header">
                <div className="lp-hero-card-dot" style={{ background: '#EF4444' }} />
                <div className="lp-hero-card-dot" style={{ background: '#F59E0B' }} />
                <div className="lp-hero-card-dot" style={{ background: '#10B981' }} />
                <span className="lp-hero-card-title">Skyline Cloud Migration</span>
              </div>
              <div className="lp-hero-card-progress-label">
                <span>Sprint Progress</span><span style={{ color: '#5B5FFB', fontWeight: 700 }}>74%</span>
              </div>
              <div className="lp-hero-card-progress-track">
                <div className="lp-hero-card-progress-fill" style={{ width: '74%' }} />
              </div>
              <div className="lp-hero-card-tasks">
                {['Finalize DB schema','Security audit', 'Frontend v2 integration'].map((t, i) => (
                  <div key={i} className="lp-hero-task-row">
                    <div className={`lp-hero-task-check ${i < 2 ? 'done' : ''}`}>
                      {i < 2 && <svg viewBox="0 0 24 24" width="10" height="10" stroke="#fff" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className="lp-hero-task-label" style={{ textDecoration: i < 2 ? 'line-through' : 'none', opacity: i < 2 ? 0.45 : 1 }}>{t}</span>
                    <span className={`lp-hero-task-badge ${i === 0 ? 'high' : i === 1 ? 'review' : 'todo'}`}>
                      {i === 0 ? 'Done' : i === 1 ? 'Review' : 'Todo'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating AI alert card */}
            <div className="lp-hero-card lp-hero-card--alert lp-float-a">
              <div className="lp-hero-alert-icon">⚡</div>
              <div>
                <div className="lp-hero-alert-title">AI Risk Detected</div>
                <div className="lp-hero-alert-sub">Sarah Chen overloaded by 35%</div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="lp-hero-card lp-hero-card--stat lp-float-b">
              <div className="lp-hero-stat-val">98%</div>
              <div className="lp-hero-stat-label">On-time delivery</div>
              <div className="lp-hero-stat-bar">
                <div className="lp-hero-stat-fill" />
              </div>
            </div>

            {/* Floating team card */}
            <div className="lp-hero-card lp-hero-card--team lp-float-c">
              <div className="lp-hero-team-title">Active Team</div>
              <div className="lp-hero-team-row">
                {['1494790108377-be9c29b29330','1507003211169-0a1dd7228f2d','1544005313-94ddf0286df2'].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=32&q=80`} alt="" className="lp-hero-team-avatar" style={{ marginLeft: i > 0 ? -8 : 0 }} />
                ))}
                <span className="lp-hero-team-count">+9 online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY STRIP ──────────────────────────────────────────────── */}
      <section className="lp-strip">
        <p className="lp-strip-label">Trusted by forward-thinking teams at</p>
        <div className="lp-strip-logos">
          {companies.map((c, i) => (
            <span key={i} className="lp-strip-logo">{c}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div className="lp-section-eyebrow">Everything You Need</div>
            <h2 className="lp-section-title">One Platform. Complete Visibility.</h2>
            <p className="lp-section-sub">From first task to final launch, Wostup gives your team every tool to plan, track, and deliver with confidence.</p>
          </div>
          <div className="lp-features-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={0.05 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section className="lp-stats-section">
        <div className="lp-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="lp-stat-item">
              <div className="lp-stat-value">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="lp-section lp-section--alt" id="how-it-works">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div className="lp-section-eyebrow">Simple Onboarding</div>
            <h2 className="lp-section-title">Up and running in minutes.</h2>
            <p className="lp-section-sub">No lengthy setup. No migration headaches. Wostup is designed to get your team shipping from day one.</p>
          </div>
          <div className="lp-steps-grid">
            {steps.map((s, i) => (
              <StepCard key={i} {...s} delay={0.1 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="lp-section" id="testimonials">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div className="lp-section-eyebrow">Real Teams, Real Results</div>
            <h2 className="lp-section-title">Don't take our word for it.</h2>
            <p className="lp-section-sub">Join thousands of teams that have transformed how they work with Wostup.</p>
          </div>
          <div className="lp-testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={0.08 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ─────────────────────────────────────────────── */}
      <section className="lp-section lp-section--alt" id="pricing">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div className="lp-section-eyebrow">Simple Pricing</div>
            <h2 className="lp-section-title">Transparent plans for every team.</h2>
            <p className="lp-section-sub">No hidden fees. Cancel anytime. Start free, scale when ready.</p>
          </div>
          <div className="lp-pricing-grid">
            {/* Free */}
            <div className="lp-pricing-card">
              <div className="lp-pricing-plan">Free</div>
              <div className="lp-pricing-price">$0<span>/mo</span></div>
              <div className="lp-pricing-desc">Perfect for small teams just getting started.</div>
              <ul className="lp-pricing-features">
                {['Up to 5 team members', '3 active projects', 'Basic task tracking', 'Community support'].map((f, i) => (
                  <li key={i} className="lp-pricing-feature-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="lp-pricing-btn lp-pricing-btn--outline" onClick={() => onLogin('/sign-up')}>Get Started Free</button>
            </div>
            {/* Pro — highlighted */}
            <div className="lp-pricing-card lp-pricing-card--featured">
              <div className="lp-pricing-popular">Most Popular</div>
              <div className="lp-pricing-plan">Pro</div>
              <div className="lp-pricing-price">$18<span>/mo per seat</span></div>
              <div className="lp-pricing-desc">For growing teams who need full power and AI insights.</div>
              <ul className="lp-pricing-features">
                {['Unlimited members', 'Unlimited projects', 'AI risk & load insights', 'Milestone timelines', 'Priority support', 'Advanced analytics'].map((f, i) => (
                  <li key={i} className="lp-pricing-feature-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#5B5FFB" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="lp-pricing-btn lp-pricing-btn--primary" onClick={() => onLogin('/sign-up')}>Start Pro Trial</button>
            </div>
            {/* Enterprise */}
            <div className="lp-pricing-card">
              <div className="lp-pricing-plan">Enterprise</div>
              <div className="lp-pricing-price">Custom</div>
              <div className="lp-pricing-desc">Tailored for large organizations with advanced security needs.</div>
              <ul className="lp-pricing-features">
                {['Everything in Pro', 'SSO & SAML', 'Custom integrations', 'SLA guarantee', 'Dedicated CSM', 'On-premise option'].map((f, i) => (
                  <li key={i} className="lp-pricing-feature-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="lp-pricing-btn lp-pricing-btn--outline" onClick={() => onLogin('/sign-up')}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <div className="lp-cta-blob lp-cta-blob--1" />
          <div className="lp-cta-blob lp-cta-blob--2" />
          <h2 className="lp-cta-title">Ready to ship faster?</h2>
          <p className="lp-cta-sub">Join 12,000+ teams already using Wostup to deliver projects on time.</p>
          <div className="lp-cta-actions">
            <SignedIn>
              <button className="lp-cta-btn lp-cta-btn--white" onClick={() => onLogin('/dashboard')}>
                Go to Dashboard
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: 6 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </SignedIn>
            <SignedOut>
              <button className="lp-cta-btn lp-cta-btn--white" onClick={() => onLogin('/sign-up')}>
                Get Started Free
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: 6 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </SignedOut>
            <button className="lp-cta-btn lp-cta-btn--ghost" onClick={() => scrollTo('features')}>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <WostupLogo size={24} />
              <span className="lp-footer-wordmark">Wostup</span>
            </div>
            <p className="lp-footer-tagline">The workspace engine built for teams that ship.</p>
            <div className="lp-footer-social">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" className="lp-footer-social-link">{s}</a>
              ))}
            </div>
          </div>
          <div className="lp-footer-links-group">
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Product</div>
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => <a key={l} href="#" className="lp-footer-link">{l}</a>)}
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Company</div>
              {['About', 'Blog', 'Careers', 'Press'].map(l => <a key={l} href="#" className="lp-footer-link">{l}</a>)}
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Legal</div>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(l => <a key={l} href="#" className="lp-footer-link">{l}</a>)}
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 Wostup, Inc. All rights reserved.</span>
          <span>Built with ❤️ for teams that care about delivery.</span>
        </div>
      </footer>
    </div>
  );
}
