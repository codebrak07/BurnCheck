import React, { useEffect, useRef, useState } from 'react';

const CURSOR_COLORS = {
  green:  { dot: '#22c55e', ring: '#22c55e66', glow: '#22c55e' },
  purple: { dot: '#a855f7', ring: '#a855f766', glow: '#a855f7' },
  cyan:   { dot: '#06b6d4', ring: '#06b6d466', glow: '#06b6d4' },
  pink:   { dot: '#ec4899', ring: '#ec489966', glow: '#ec4899' },
};

export default function CustomCursor({ color = 'green', style = 'dual' }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const c = CURSOR_COLORS[color] || CURSOR_COLORS.green;

  useEffect(() => {
    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, []);

  // Smooth raf loop for dot; ring lags slightly via CSS transition
  useEffect(() => {
    let raf;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move, { passive: true });

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top  = pos.current.y + 'px';
      }
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.x + 'px';
        ringRef.current.style.top  = pos.current.y + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hover detection on interactive elements
  useEffect(() => {
    const targets = 'button, a, input, select, [data-cursor-hover]';
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);

    const addListeners = () => {
      document.querySelectorAll(targets).forEach(el => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };

    addListeners();
    const obs = new MutationObserver(addListeners);
    obs.observe(document.body, { childList: true, subtree: true });

    const down = () => setClicking(true);
    const up   = () => setClicking(false);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);

    return () => {
      obs.disconnect();
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
    };
  }, []);

  if (style === 'default') return null;

  const dotSize   = clicking ? 6  : hovering ? 10  : 8;
  const ringSize  = clicking ? 28 : hovering ? 48  : 36;
  const ringOpacity = style === 'minimal' ? 0 : hovering ? 0.9 : 0.6;
  const glowSize  = style === 'glow' ? (hovering ? 44 : 30) : 0;

  return (
    <>
      {/* Core dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          width:  dotSize,
          height: dotSize,
          background: c.dot,
          boxShadow: `0 0 ${hovering ? 16 : 8}px ${c.glow}cc`,
          transition: `width 0.15s ease, height 0.15s ease, box-shadow 0.2s ease`,
        }}
      />

      {/* Ring trail — hidden for 'glow' and 'minimal' dot styles */}
      {(style === 'dual' || style === 'minimal') && (
        <div
          ref={ringRef}
          className="cursor-ring"
          style={{
            width:  ringSize,
            height: ringSize,
            border: `1.5px solid ${c.ring}`,
            opacity: ringOpacity,
            transition: `left 0.14s ease, top 0.14s ease, width 0.2s ease, height 0.2s ease, opacity 0.25s ease`,
          }}
        />
      )}

      {/* Glow blob for 'glow' style */}
      {style === 'glow' && (
        <div
          ref={ringRef}
          className="cursor-ring"
          style={{
            width:  glowSize,
            height: glowSize,
            background: `radial-gradient(circle, ${c.dot}55 0%, transparent 70%)`,
            filter: 'blur(6px)',
            transition: `left 0.14s ease, top 0.14s ease, width 0.22s ease, height 0.22s ease`,
          }}
        />
      )}
    </>
  );
}
