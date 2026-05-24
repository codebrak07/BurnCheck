import React, { useState, useCallback, useRef } from 'react';
import { Layers, Cpu, Coins } from 'lucide-react';

const steps = [
  {
    icon: Layers,
    num: '01',
    step: '1',
    title: 'Enter your tools',
    description: 'Tell us what AI tools you pay for and your current plans. Takes under 2 minutes.',
  },
  {
    icon: Cpu,
    num: '02',
    step: '2',
    title: 'Get instant audit',
    description: 'Our engine benchmarks every tool against current pricing, seat counts, and usage patterns.',
  },
  {
    icon: Coins,
    num: '03',
    step: '3',
    title: 'See your savings',
    description: 'Get a clear breakdown of what to cut, switch, or downgrade — with exact dollar amounts.',
  },
];

// Ripple component — spawned on click
function Ripple({ x, y, onDone }) {
  return (
    <span
      className="step-ripple"
      style={{ left: x, top: y }}
      onAnimationEnd={onDone}
    />
  );
}

function StepCard({ step, icon: Icon }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2); // -1 to +1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 to +1
    setTilt({ x: dy * -10, y: dx * 10 });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  }, []);

  const removeRipple = useCallback((id) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <div
      ref={cardRef}
      className="step-card"
      data-step={step.step}
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${clicked ? '2px' : '-8px'}) scale(${clicked ? 0.98 : 1.015})`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform .06s linear, box-shadow .35s ease, border-color .35s ease'
          : 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .4s ease, border-color .4s ease',
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Ripples */}
      {ripples.map(r => (
        <Ripple key={r.id} x={r.x} y={r.y} onDone={() => removeRipple(r.id)} />
      ))}

      {/* Top row */}
      <div className="flex items-center justify-between mb-7">
        <div className="step-icon-box">
          <Icon className="step-icon w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </div>
        <span className="text-xs font-mono" style={{ color: '#8b949e', fontFamily: 'JetBrains Mono, monospace' }}>
          Step {step.num}
        </span>
      </div>

      {/* Content */}
      <h3 className="step-title text-lg font-bold mb-2.5" style={{ letterSpacing: '-0.02em' }}>
        {step.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#bdbdbd', maxWidth: '28ch' }}>
        {step.description}
      </p>

      {/* Ghost number */}
      <span className="step-num">{step.num}</span>
    </div>
  );
}

export default function StepsRow() {
  return (
    <section className="py-28 px-6 md:px-8 max-w-6xl mx-auto">
      {/* Section label */}
      <div className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] accent-text mb-3">How it works</p>
        <h2
          className="text-3xl md:text-4xl font-black text-primary leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Three steps. Done.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(step => (
          <StepCard key={step.num} step={step} icon={step.icon} />
        ))}
      </div>
    </section>
  );
}
