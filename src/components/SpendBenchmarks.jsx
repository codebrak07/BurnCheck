import React, { useState, useRef, useCallback } from 'react';
import { Cpu, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

function BenchmarkCard({ title, icon: Icon, items }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-lg relative overflow-hidden flex flex-col justify-between"
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 200);
      }}
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        minHeight: '260px',
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${clicked ? '2px' : '-4px'}) scale(${clicked ? 0.99 : 1.015})`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform .06s linear, border-color .3s ease'
          : 'transform .45s cubic-bezier(.22,1,.36,1), border-color .3s ease',
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Background spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(260px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 217, 146, 0.035), transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-md flex items-center justify-center border border-border" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'var(--color-border)' }}>
            <Icon className="w-4 h-4 accent-text animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
            {title}
          </h4>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold font-mono" style={{ color: '#d0d0d0' }}>
                  {item.label}
                </span>
                <span className="text-xs font-mono accent-text">
                  {item.value}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-subtle)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpendBenchmarks() {
  const tokenSpecs = [
    { label: "GPT-4o API", value: "$2.50 / $10.00", desc: "Cost per million input / output tokens. High history sizes multiply spend." },
    { label: "Claude 3.5 Sonnet", value: "$3.00 / $15.00", desc: "Standard developer agent engine. Heavy token generation costs." },
    { label: "Gemini 1.5 Pro", value: "$1.25 / $5.00", desc: "Huge 2M token context limit window. Massive cost multiplier if context expands." }
  ];

  const licensingSpecs = [
    { label: "Cursor Business", value: "$40/mo vs $20 Pro", desc: "Requires $40 per seat. Small teams under 5 waste $20/seat/mo on collaboration tools." },
    { label: "Claude Team", value: "$30/mo vs $20 Pro", desc: "Requires 5-seat minimum ($150/mo total). Wasteful for solo builders." },
    { label: "Copilot Business", value: "$19/mo vs $10 Indiv", desc: "Redundant admin oversight controls for small independent developer groups." }
  ];

  const wasteSpecs = [
    { label: "Runaway Loops", value: "Up to $300/night", desc: "Autonomous developer agents getting stuck in infinite code-generation retries." },
    { label: "Ghost Accounts", value: "Avg. 15% waste", desc: "Developer licenses kept active for departed staff or contractors." },
    { label: "Tool Overlaps", value: "Multi-vendor drag", desc: "Paying for Cursor, Windsurf, AND Copilot licenses simultaneously for the same developers." }
  ];

  return (
    <section className="py-24 px-6 md:px-8 max-w-6xl mx-auto">
      <div className="divider mb-16" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] accent-text mb-3">Audit Intel</p>
          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight" style={{ letterSpacing: '-0.03em' }}>
            AI Cost & Waste<br />Reference Benchmarks
          </h2>
        </div>
        <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
          How we identify leaks. We analyze your active subscriptions and API limits against these industry standards to highlight exact overspending.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BenchmarkCard title="Token Pricing specs" icon={Cpu} items={tokenSpecs} />
        <BenchmarkCard title="Licensing baselines" icon={Scale} items={licensingSpecs} />
        <BenchmarkCard title="Leak Vectors Audited" icon={AlertTriangle} items={wasteSpecs} />
      </div>
    </section>
  );
}
