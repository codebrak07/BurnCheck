import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingDown } from 'lucide-react';

// Mock spend data — directly on-brand
const TOOLS = [
  { name: 'OpenAI API',       cost: 847, seats: null, color: 'over', pct: 92 },
  { name: 'ChatGPT Team',     cost: 300, seats: 12,   color: 'warn', pct: 65 },
  { name: 'Claude Team',      cost: 240, seats: 8,    color: 'warn', pct: 52 },
  { name: 'GitHub Copilot',   cost: 228, seats: 12,   color: 'ok',   pct: 49 },
  { name: 'Cursor Pro',       cost: 160, seats: 8,    color: 'ok',   pct: 35 },
  { name: 'Windsurf Pro',     cost:  60, seats: 4,    color: 'ok',   pct: 13 },
];

const TOTAL   = 1835;
const SAVINGS =  833;

// Animated counter hook
function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

export default function HeroSection({ onStartAudit }) {
  const [active, setActive] = useState(false);
  const dashRef = useRef(null);

  // Trigger animations when dashboard comes into view
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (dashRef.current) obs.observe(dashRef.current);
    return () => obs.disconnect();
  }, []);

  const totalVal   = useCountUp(TOTAL,   1400, active);
  const savingsVal = useCountUp(SAVINGS, 1600, active);

  return (
    <section className="hero-gradient relative pt-36 pb-28 px-6 md:px-8 max-w-6xl mx-auto flex flex-col items-center">

      {/* Badge */}
      <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-9 anim-fade-up">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-xs font-medium tracking-wide" style={{ color: '#6b6b6b' }}>
          Free · No login required · 2 min audit
        </span>
      </div>

      {/* Headline */}
      <h1
        className="gradient-text text-5xl md:text-[4.5rem] font-black tracking-tight mb-5 text-center leading-[1.05] anim-fade-up anim-fade-up-1"
        style={{ letterSpacing: '-0.04em', maxWidth: '18ch' }}
      >
        Know exactly what your AI stack costs
      </h1>

      {/* Sub */}
      <p className="text-base text-center mb-10 max-w-sm leading-relaxed anim-fade-up anim-fade-up-2" style={{ color: '#bdbdbd' }}>
        Paste your tools. Get an instant, line-by-line breakdown of where you're overspending.
      </p>

      {/* CTA group */}
      <div className="flex flex-col items-center gap-3 mb-20 anim-fade-up anim-fade-up-3">
        <button
          onClick={onStartAudit}
          data-cursor-hover
          className="btn-primary px-8 py-3.5 text-[15px]"
        >
          Start Free Audit
          <ArrowRight className="w-4 h-4 btn-icon" />
        </button>
        <p className="text-xs" style={{ color: '#8b949e' }}>
          2,000+ audits run · No credit card
        </p>
      </div>

      {/* ── Live Spend Dashboard ───────────────────────── */}
      <div ref={dashRef} className="spend-dashboard w-full max-w-3xl anim-fade-up anim-fade-up-4">

        {/* Dashboard header */}
        <div className="dashboard-header">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" style={{ animation: 'pulseGreen 2s ease-in-out infinite' }} />
            <span className="text-xs font-mono" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
              BurnCheck · live audit
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>
            6 tools detected
          </span>
        </div>

        {/* Total spend row */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #23252a' }}>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6b6b6b', fontFamily: 'JetBrains Mono, monospace' }}>monthly ai spend</p>
            <p className="text-3xl font-black" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e0e0e0', letterSpacing: '-0.03em' }}>
              ${totalVal.toLocaleString()}
              <span className="text-base font-normal ml-1" style={{ color: '#666' }}>/mo</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: '#6b6b6b', fontFamily: 'JetBrains Mono, monospace' }}>potential savings</p>
            <p className="text-2xl font-black accent-text" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}>
              −${savingsVal.toLocaleString()}
              <span className="text-sm font-normal ml-1" style={{ color: '#22c55ecc' }}>/mo</span>
            </p>
          </div>
        </div>

        {/* Tool rows */}
        <div className="px-5 py-3 space-y-3">
          {TOOLS.map((t, i) => (
            <div key={t.name} className="flex items-center gap-3" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <div className="w-36 shrink-0">
                <p className="text-[11px] truncate" style={{ color: '#b0b0b0', fontFamily: 'JetBrains Mono, monospace' }}>
                  {t.name}{t.seats ? ` ×${t.seats}` : ''}
                </p>
              </div>
              <div className="flex-1 spend-bar-track">
                <div
                  className={`spend-bar-fill ${t.color}`}
                  style={{ width: active ? `${t.pct}%` : '0%', transitionDelay: `${0.5 + i * 0.1}s` }}
                />
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-[11px] font-mono" style={{ color: '#d0d0d0', fontFamily: 'JetBrains Mono, monospace' }}>
                  ${t.cost.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderTop: '1px solid #23252a', background: '#141516' }}>
          <TrendingDown className="w-3.5 h-3.5 accent-text shrink-0" />
          <span className="text-[11px] font-mono" style={{ color: '#22c55e99', fontFamily: 'JetBrains Mono, monospace' }}>
            Estimated annual savings: <span className="accent-text font-bold">${(SAVINGS * 12).toLocaleString()}</span> if you act on all recommendations
          </span>
        </div>
      </div>

      {/* Scroll hint */}
      <p className="mt-8 text-xs anim-fade-up anim-fade-up-5" style={{ color: '#272727' }}>
        ↓ see how it works
      </p>
    </section>
  );
}
