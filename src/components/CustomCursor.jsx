import React, { useEffect, useRef, useState } from 'react';

const FlameSVG = ({ size = 30, intensity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 ${5 * intensity}px #f97316cc) drop-shadow(0 0 ${14 * intensity}px #f9731677) drop-shadow(0 0 ${24 * intensity}px #ef444433)`,
    }}
  >
    {/* Outer flame – deep orange */}
    <path d="M12 1C12 1 5 9 5 15C5 19.418 8.134 23 12 23C15.866 23 19 19.418 19 15C19 9 12 1 12 1Z"
      fill="url(#flameOuter)" opacity="0.95" />
    {/* Mid flame – amber */}
    <path d="M12 6C12 6 8 12 8 15.5C8 17.985 9.79 20 12 20C14.21 20 16 17.985 16 15.5C16 12 12 6 12 6Z"
      fill="url(#flameMid)" opacity="0.9" />
    {/* Inner core – near white-yellow */}
    <path d="M12 10C12 10 10 13.5 10 15.5C10 16.881 10.895 18 12 18C13.105 18 14 16.881 14 15.5C14 13.5 12 10 12 10Z"
      fill="url(#flameCore)" opacity="0.95" />
    {/* Dollar sign below flame */}
    <text x="12" y="27.5" textAnchor="middle" fontSize="7" fontWeight="900"
      fill="#fbbf24" fontFamily="Inter, monospace" opacity="0.9" style={{ letterSpacing: 0 }}>$</text>

    <defs>
      <linearGradient id="flameOuter" x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#ef4444" />
        <stop offset="50%"  stopColor="#f97316" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id="flameMid" x1="12" y1="6" x2="12" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#f97316" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      <linearGradient id="flameCore" x1="12" y1="10" x2="12" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
    </defs>
  </svg>
);

let pid = 0;

export default function CustomCursor() {
  const flameRef  = useRef(null);
  const pos       = useRef({ x: -300, y: -300 });
  const rafRef    = useRef(null);
  const lastSpawn = useRef(0);
  const [hovering,  setHovering]  = useState(false);
  const [particles, setParticles] = useState([]);

  // Hide OS cursor
  useEffect(() => {
    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, []);

  // Mouse move + particle spawn
  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastSpawn.current > 70) {
        lastSpawn.current = now;
        const symbols = ['$', '$', '$', '🔥', '💸'];
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        setParticles(prev => [
          ...prev.slice(-18),
          {
            id:  ++pid,
            x:   e.clientX + (Math.random() - 0.5) * 14,
            y:   e.clientY,
            dx:  (Math.random() - 0.5) * 2.2,
            rot: (Math.random() - 0.5) * 35,
            rotVel: (Math.random() - 0.5) * 8,
            sym,
            life: 1,
          },
        ]);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // RAF — move flame instantly
  useEffect(() => {
    const loop = () => {
      if (flameRef.current) {
        flameRef.current.style.left = pos.current.x + 'px';
        flameRef.current.style.top  = pos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Particle decay
  useEffect(() => {
    const id = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            life: p.life - 0.045,
            y: p.y - 2.6,
            x: p.x + p.dx,
            rot: p.rot + p.rotVel
          }))
          .filter(p => p.life > 0)
      );
    }, 30);
    return () => clearInterval(id);
  }, []);

  // Hover detection
  useEffect(() => {
    const sel   = 'button, a, input, select, [data-cursor-hover]';
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);
    const bind  = () => document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    bind();
    const obs = new MutationObserver(bind);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Floating $ sparks */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 9997,
          left: p.x, top: p.y,
          transform: `translate(-50%,-50%) rotate(${p.rot}deg) scale(${0.7 + p.life * 0.3})`,
          fontSize: p.sym === '$' ? '12px' : '15px',
          fontWeight: 900,
          color: p.sym === '$' ? '#fbbf24' : undefined,
          textShadow: p.sym === '$' ? '0 0 10px #f97316' : undefined,
          opacity: p.life,
          fontFamily: 'Inter, monospace',
          userSelect: 'none',
          lineHeight: 1,
          transition: 'transform 0.05s linear',
        }}>{p.sym}</div>
      ))}

      {/* Inferno flame */}
      <div ref={flameRef} style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -88%)',
        transition: 'width 0.15s ease, height 0.15s ease',
        width:  hovering ? 38 : 28,
        height: hovering ? 38 : 28,
      }}>
        <FlameSVG size={hovering ? 38 : 28} intensity={hovering ? 2.4 : 1} />
      </div>
    </>
  );
}
