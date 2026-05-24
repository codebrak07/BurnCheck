import React, { useState, useRef, useCallback, useEffect } from 'react';

const TOOLS = [
  { name: 'Cursor',               range: '$10–$40/seat',   plans: 4,  color: '#06b6d4' },
  { name: 'GitHub Copilot',       range: '$10–$39/seat',   plans: 3,  color: '#8b5cf6' },
  { name: 'Claude',               range: '$20–$60/seat',   plans: 6,  color: '#f97316' },
  { name: 'ChatGPT',              range: '$20–$30/seat',   plans: 4,  color: '#10b981' },
  { name: 'OpenAI API',           range: 'Usage-based',    plans: 2,  color: '#22c55e' },
  { name: 'Anthropic API',        range: 'Usage-based',    plans: 2,  color: '#ec4899' },
  { name: 'Gemini',               range: '$20–$300/seat',  plans: 3,  color: '#3b82f6' },
  { name: 'Windsurf',             range: '$0–$35/seat',    plans: 3,  color: '#a855f7' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!%&';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

// Text scramble hook
function useScramble(original) {
  const [display, setDisplay] = useState(original);
  const frame  = useRef(null);
  const active = useRef(false);

  const scramble = useCallback(() => {
    active.current = true;
    let iteration = 0;
    const total = original.length;

    clearInterval(frame.current);
    frame.current = setInterval(() => {
      setDisplay(
        original.split('').map((ch, i) => {
          if (i < iteration) return ch;              // already resolved
          if (ch === ' ') return ' ';                // preserve spaces
          return rand();
        }).join('')
      );
      iteration += 0.6;
      if (iteration >= total) {
        clearInterval(frame.current);
        setDisplay(original);
        active.current = false;
      }
    }, 28);
  }, [original]);

  const reset = useCallback(() => {
    clearInterval(frame.current);
    setDisplay(original);
    active.current = false;
  }, [original]);

  useEffect(() => () => clearInterval(frame.current), []);

  return { display, scramble, reset };
}

// Ripple
let rippleId = 0;
function useRipple() {
  const [ripples, setRipples] = useState([]);
  const spawn = (e, ref) => {
    const rect = ref.current.getBoundingClientRect();
    const id = ++rippleId;
    setRipples(p => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };
  const remove = (id) => setRipples(p => p.filter(r => r.id !== id));
  return { ripples, spawn, remove };
}

function ToolCard({ tool }) {
  const cardRef  = useRef(null);
  const [tilt, setTilt]     = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { display, scramble, reset } = useScramble(tool.name);
  const { ripples, spawn, remove }   = useRipple();

  // 3D tilt on mousemove
  const onMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);   // −1 → +1
    const dy   = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
    scramble();
  }, [scramble]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    reset();
  }, [reset]);

  const onClick = useCallback((e) => {
    spawn(e, cardRef);
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  }, [spawn]);

  const glowColor = tool.color;

  return (
    <div
      ref={cardRef}
      className="tool-card"
      data-cursor-hover
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={onClick}
      style={{
        transform: hovered
          ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${clicked ? '2px' : '-6px'}) scale(${clicked ? 0.97 : 1.02})`
          : 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform .08s linear, box-shadow .3s ease, border-color .3s ease'
          : 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .4s ease, border-color .4s ease',
        '--glow': glowColor,
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,.55), 0 0 0 1px ${glowColor}44, 0 0 30px ${glowColor}18`
          : '0 4px 16px rgba(0,0,0,.3)',
        borderColor: hovered ? `${glowColor}44` : '#1a1a1a',
      }}
    >
      {/* Ripples */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="tool-ripple"
          style={{ left: r.x, top: r.y, background: `${glowColor}30` }}
          onAnimationEnd={() => remove(r.id)}
        />
      ))}

      {/* Corner flash on hover */}
      <span className={`tool-flash ${hovered ? 'tool-flash--active' : ''}`}
        style={{ background: `radial-gradient(circle at 0% 0%, ${glowColor}22 0%, transparent 65%)` }}
      />

      {/* Dot indicator */}
      <span className="tool-dot" style={{ background: hovered ? glowColor : '#222', boxShadow: hovered ? `0 0 8px ${glowColor}` : 'none' }} />

      {/* Name — scrambled */}
      <p className="tool-name" style={{ color: hovered ? '#f5f5f5' : '#c0c0c0' }}>
        {display}
      </p>

      {/* Cost range */}
      <p className="tool-range" style={{ color: hovered ? glowColor : '#666', opacity: hovered ? 1 : 0.85 }}>
        {tool.range}
      </p>

      {/* Plans badge */}
      <span className="tool-plans" style={{
        background: hovered ? `${glowColor}14` : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? `${glowColor}30` : '#222',
        color: hovered ? glowColor : '#555',
      }}>
        {tool.plans} plan{tool.plans > 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default function ToolsGrid() {
  return (
    <section className="py-24 px-6 md:px-8 max-w-6xl mx-auto">
      <div className="divider mb-16" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] accent-text mb-3">Supported tools</p>
          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Every tool your team<br />actually pays for
          </h2>
        </div>
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#bdbdbd' }}>
          We pull current plan pricing and benchmark against your declared spend to find over-provisioned seats and unused tiers.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TOOLS.map(tool => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </section>
  );
}
