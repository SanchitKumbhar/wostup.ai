import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LandingIntro.css';

const PROBLEMS = [
  'Missed Deadlines', 'Scope Creep', 'Budget Overruns', 'Team Burnout',
  'Poor Communication', 'Resource Conflicts', 'Unclear Goals', 'Task Overload',
  'No Visibility', 'Status Chaos', 'Manual Tracking', 'Lost Priorities',
  'Bottlenecks', 'Rework Cycles', 'Siloed Teams', 'Delayed Feedback',
  'Approval Delays', 'Dependency Hell'
];

export default function LandingIntro({ onComplete }) {
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const canvasRef = useRef(null);
  const chipFieldRef = useRef(null);
  const coreWrapRef = useRef(null);
  const shockwaveRef = useRef(null);
  const brandRef = useRef(null);
  const ctaRef = useRef(null);
  const skipBtnRef = useRef(null);
  
  const tlRef = useRef(null);
  const particlesRef = useRef([]);
  const rafIdRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    let resize, handleMouseMove;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let ctxGsap = gsap.context(() => {
      // Setup Canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctxRef.current = ctx;
      
      resize = () => {
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      };
      resize();
      window.addEventListener('resize', resize);

      // Parallax
      handleMouseMove = (e) => {
        if (reduced || !gridRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        gsap.to(gridRef.current, { x, y, duration: 1.1, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Chips
      const chipEls = [];
      const GOLDEN = 137.508 * (Math.PI / 180);
      // Use Math.max with a balanced multiplier to utilize full screen safely
      const spread = Math.max(window.innerWidth, window.innerHeight) * 0.50;
      
      // Clear field
      if (chipFieldRef.current) {
        chipFieldRef.current.innerHTML = '';
        PROBLEMS.forEach((text, i) => {
          const el = document.createElement('div');
          el.className = 'chip';
          el.innerHTML = `<span class="mark">!</span>${text}`;
          chipFieldRef.current.appendChild(el);

          const angle = i * GOLDEN;
          // Start radius at 120 to completely clear the center and push them out
          const radius = spread * Math.sqrt((i + 0.5) / PROBLEMS.length) + 120;
          
          // Add subtle random scatter to X and Y
          const scatterX = (Math.random() - 0.5) * 50;
          const scatterY = (Math.random() - 0.5) * 50;
          
          const x = Math.cos(angle) * radius + scatterX;
          // Less flattening on Y to use more vertical screen space
          const y = Math.sin(angle) * radius * 0.75 + scatterY;
          const rot = (Math.sin(i * 12.9) * 12) + (Math.random() * 15 - 7.5);
          
          // Randomize scale for depth
          const targetScale = 0.75 + Math.random() * 0.45;

          chipEls.push({ el, x, y, rot, targetScale, delay: i * 0.045 });
        });
        
        chipEls.forEach((c) => {
          c.el.style.transform = `translate(calc(-50% + ${c.x*2}px), calc(-50% + ${c.y*2}px)) rotate(${c.rot*2}deg) scale(0.1)`;
        });
      }

      // Particles
      const spawnBurst = (cx, cy) => {
        const colors = ['#5B5FFB', '#B24DFF', '#00D9A3', '#ffffff'];
        particlesRef.current = [];
        for (let i = 0; i < 90; i++) {
          const a = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          particlesRef.current.push({
            x: cx, y: cy,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            life: 1,
            size: 1.5 + Math.random() * 2,
            color: colors[i % colors.length],
          });
        }
      };

      const tickParticles = () => {
        if (!ctxRef.current) return;
        ctxRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particlesRef.current.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.97; p.vy *= 0.97;
          p.life -= 0.012;
          if (p.life > 0) {
            ctxRef.current.globalAlpha = Math.max(p.life, 0);
            ctxRef.current.fillStyle = p.color;
            ctxRef.current.beginPath();
            ctxRef.current.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctxRef.current.fill();
          }
        });
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        ctxRef.current.globalAlpha = 1;
        if (particlesRef.current.length) {
          rafIdRef.current = requestAnimationFrame(tickParticles);
        }
      };

      let completed = false;
      const finish = () => {
        if (completed) return;
        completed = true;
        if (skipBtnRef.current) skipBtnRef.current.style.display = 'none';
        
        // Fade out the entire stage smoothly before firing onComplete
        gsap.to(stageRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      };

      const tl = gsap.timeline({ onComplete: finish, paused: reduced });
      tlRef.current = tl;

      chipEls.forEach((c) => {
        const proxy = { s: 0.1, x: c.x * 2, y: c.y * 2, r: c.rot * 2 };
        c.proxy = proxy;
        tl.to(c.el, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 0.15 + c.delay);
        tl.to(proxy, {
          s: c.targetScale, x: c.x, y: c.y, r: c.rot,
          duration: 0.8,
          ease: 'back.out(1.2)',
          onUpdate: () => {
            c.el.style.transform = `translate(calc(-50% + ${proxy.x}px), calc(-50% + ${proxy.y}px)) rotate(${proxy.r}deg) scale(${proxy.s})`;
          }
        }, 0.15 + c.delay);
      });

      chipEls.forEach((c, i) => {
        const jitter = (i % 3 - 1) * 3;
        tl.to(c.el, {
          x: `+=${jitter}`,
          duration: 0.06,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 5,
        }, 1.55);
      });

      tl.to(coreWrapRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.9);
      tl.fromTo(coreWrapRef.current, { scale: 0.4 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.55)' }, 1.9);

      chipEls.forEach((c, i) => {
        tl.to(c.proxy, {
          x: 0, y: 0, s: 0, r: c.rot + (i % 2 ? 40 : -40),
          duration: 0.55,
          ease: 'power2.in',
          onUpdate: () => {
            c.el.style.transform = `translate(calc(-50% + ${c.proxy.x}px), calc(-50% + ${c.proxy.y}px)) rotate(${c.proxy.r}deg) scale(${c.proxy.s})`;
          }
        }, 2.65 + i * 0.02);
        tl.to(c.el, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 2.85 + i * 0.02);
      });

      tl.to(coreWrapRef.current, { scale: 1.35, duration: 0.16, ease: 'power2.out' }, 3.55);
      tl.to(coreWrapRef.current, { scale: 1, duration: 0.22, ease: 'power2.out' }, 3.71);

      tl.set(shockwaveRef.current, { opacity: 1, scale: 0.3 }, 3.55);
      tl.to(shockwaveRef.current, { scale: 22, duration: 0.75, ease: 'power2.out' }, 3.55);
      tl.to(shockwaveRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 3.6);

      tl.call(() => {
        spawnBurst(window.innerWidth / 2, window.innerHeight / 2);
        cancelAnimationFrame(rafIdRef.current);
        tickParticles();
      }, [], 3.55);

      tl.to(coreWrapRef.current, { opacity: 0, duration: 0.4, ease: 'power1.in' }, 3.9);

      tl.to(brandRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 4.05);
      tl.to(brandRef.current, { scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.6)' }, 4.05);
      tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 4.65);

      tl.to({}, { duration: 1.4 }, 5.0);

      if (reduced) {
        tl.progress(1);
        if (coreWrapRef.current) coreWrapRef.current.style.opacity = 0;
        if (brandRef.current) {
          brandRef.current.style.opacity = 1;
          brandRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
        }
        if (ctaRef.current) {
          ctaRef.current.style.opacity = 1;
          ctaRef.current.style.transform = 'translateY(0)';
        }
        finish();
      }
    }, stageRef);

    return () => {
      if (resize) window.removeEventListener('resize', resize);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafIdRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (ctxGsap) ctxGsap.revert();
    };
  }, [onComplete]);

  return (
    <div className="stage" ref={stageRef}>
      <div className="grid" ref={gridRef}></div>
      <canvas id="fx" ref={canvasRef}></canvas>

      <div className="chip-field" ref={chipFieldRef}></div>

      <div className="core-wrap" ref={coreWrapRef}>
        <div className="core-glow"></div>
        <div className="core-ring r2"></div>
        <div className="core-ring r1"></div>
        <div className="core-node">
          <svg viewBox="0 0 46 46" fill="none">
            <defs>
              <linearGradient id="coreGrad" x1="0" y1="0" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#5B5FFB"/>
                <stop offset="1" stopColor="#B24DFF"/>
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="44" height="44" rx="13" stroke="url(#coreGrad)" strokeWidth="1.4" fill="rgba(91,95,251,0.10)"/>
            <path d="M14 27L20 15L26 24L32 17" stroke="url(#coreGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="17" r="2.4" fill="#B24DFF"/>
          </svg>
        </div>
      </div>

      <div className="shockwave" ref={shockwaveRef}></div>

      <div className="brand" ref={brandRef}>
        <svg className="mark" viewBox="0 0 52 52" fill="none">
          <defs>
            <linearGradient id="brandGrad" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5B5FFB"/>
              <stop offset="1" stopColor="#B24DFF"/>
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="50" height="50" rx="15" stroke="url(#brandGrad)" strokeWidth="1.6" fill="rgba(91,95,251,0.08)"/>
          <path d="M15 30L23 16L30 27L37 18" stroke="url(#brandGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="37" cy="18" r="2.8" fill="#B24DFF"/>
        </svg>
        <h1>WOSTUP<span className="ai">AI</span></h1>
        <p className="tagline">Every problem, one intelligent solution.</p>
        <button 
          className="cta" 
          ref={ctaRef} 
          onClick={() => {
            gsap.to(ctaRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
            
            // Fast forward timeline and smoothly fade out
            if (tlRef.current) tlRef.current.progress(1);
            gsap.to(stageRef.current, {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => {
                if (onComplete) onComplete();
              }
            });
          }}
        >
          Enter Workspace →
        </button>
      </div>

      <button 
        className="skip-btn" 
        ref={skipBtnRef} 
        onClick={() => {
          if (tlRef.current) tlRef.current.progress(1);
          gsap.to(stageRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }}
      >
        Skip
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
    </div>
  );
}