import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Share2, Mail, Sparkles, TrendingDown, ExternalLink, X, Check, ArrowRight } from 'lucide-react';

// Ripple animation component for tactile hover feedback
function CardRipple({ x, y, onDone }) {
  return (
    <span
      className="step-ripple"
      style={{ left: x, top: y }}
      onAnimationEnd={onDone}
    />
  );
}

// Interactive result card component with 3D tilt & spotlight tracking
function ResultCard({ tool }) {
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
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
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

  // Map status string to index.css badge classes
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'overspending':
        return <span className="tag-cut">Overspending</span>;
      case 'switch':
      case 'consider switch':
        return <span className="tag-switch">Consider Switch</span>;
      case 'optimal':
      default:
        return <span className="tag-ok">Optimal</span>;
    }
  };

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-lg relative overflow-hidden flex flex-col justify-between"
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        minHeight: '180px',
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${clicked ? '2px' : '-4px'}) scale(${clicked ? 0.99 : 1.01})`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform .06s linear, border-color .3s ease'
          : 'transform .4s cubic-bezier(.22,1,.36,1), border-color .3s ease',
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Background glow following cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 217, 146, 0.04), transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* Ripple particles */}
      {ripples.map(r => (
        <CardRipple key={r.id} x={r.x} y={r.y} onDone={() => removeRipple(r.id)} />
      ))}

      {/* Top Section: Tool Info & Status Badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h4 className="text-lg font-black text-primary font-mono" style={{ letterSpacing: '-0.02em' }}>
            {tool.name}
          </h4>
          <p className="text-xs mt-1" style={{ color: 'var(--color-subtle)', fontFamily: 'JetBrains Mono, monospace' }}>
            {tool.currentPlan} plan · ${tool.currentSpend}/mo
          </p>
        </div>
        {getStatusBadge(tool.status)}
      </div>

      {/* Recommendation description */}
      <p className="text-sm leading-relaxed mb-5 relative z-10 flex-grow" style={{ color: 'var(--color-secondary)' }}>
        {tool.recommendation}
      </p>

      {/* Footer: Savings Badge */}
      <div className="flex justify-between items-center relative z-10 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <span className="text-[10px] uppercase tracking-wider font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
          POTENTIAL SAVING
        </span>
        {tool.potentialSaving > 0 ? (
          <span className="tag-save font-mono">
            Save ${tool.potentialSaving}/mo
          </span>
        ) : (
          <span className="tag-ok font-mono">$0/mo</span>
        )}
      </div>
    </div>
  );
}

export default function AuditResults({ auditData, onBack }) {
  const [copied, setCopied] = useState(false);

  // Fallback to sample data if no auditData is passed
  const data = auditData || {
    totalMonthlySavings: 340,
    totalAnnualSavings: 4080,
    tools: [
      {
        name: "Cursor",
        currentPlan: "Business",
        currentSpend: 80,
        recommendation: "Downgrade to Pro — Business plan collaboration features unused for teams under 5.",
        potentialSaving: 40,
        status: "overspending"
      },
      {
        name: "Claude",
        currentPlan: "Team",
        currentSpend: 150,
        recommendation: "Downgrade to Pro — Claude Team has a 5-seat minimum which is currently underutilized.",
        potentialSaving: 50,
        status: "consider switch"
      },
      {
        name: "ChatGPT",
        currentPlan: "Enterprise",
        currentSpend: 250,
        recommendation: "Optimal structure. Check seats monthly for inactive developers to keep clean.",
        potentialSaving: 0,
        status: "optimal"
      }
    ],
    summary: "Your stack is spending $340/month more than necessary. The biggest leak is Cursor Business for a small team, combined with underutilized Claude Team seats. Switching these to developer Pro plans maintains performance while recapturing immediately."
  };

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-8 max-w-4xl mx-auto anim-fade-in relative">
      {/* Back button */}
      <button
        onClick={onBack}
        data-cursor-hover
        className="btn-back text-sm mb-8"
        style={{ color: 'var(--color-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4 btn-icon" />
        Back to Auditor
      </button>

      {/* Header Eyebrow */}
      <div className="mb-2">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] accent-text">
          Audit Complete
        </span>
      </div>

      {/* Hero Numbers Block */}
      <div
        className="p-8 rounded-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'radial-gradient(110% 80% at 50% -10%, rgba(0, 217, 146, 0.05) 0%, transparent 80%)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div>
          <h2 className="text-xs uppercase tracking-widest mb-2 font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
            RECLAIMABLE MONTHLY SPEND
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl md:text-6xl font-black accent-text leading-none font-mono"
              style={{ letterSpacing: '-0.04em' }}
            >
              ${data.totalMonthlySavings.toLocaleString()}
            </span>
            <span className="text-lg" style={{ color: 'var(--color-secondary)' }}>/mo</span>
          </div>
        </div>

        <div className="h-px w-full md:h-12 md:w-px bg-border" style={{ background: 'var(--color-border)' }} />

        <div>
          <h2 className="text-xs uppercase tracking-widest mb-2 font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
            ANNUAL SAVINGS ACCELERATION
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl md:text-5xl font-bold leading-none font-mono"
              style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}
            >
              ${data.totalAnnualSavings.toLocaleString()}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-subtle)' }}>/yr</span>
          </div>
        </div>
      </div>

      {/* Per-Tool Breakdown */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-5 font-mono" style={{ color: 'var(--color-subtle)' }}>
          Tool Optimization Audit ({data.tools?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tools?.map((tool, idx) => (
            <ResultCard key={idx} tool={tool} />
          ))}
        </div>
      </div>

      {/* Conditionally Render Callouts */}
      {data.totalMonthlySavings >= 500 && (
        <div
          className="callout-card p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ border: '1px solid rgba(0, 217, 146, 0.2)' }}
        >
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">Credex Partner Program</span>
            <h4 className="text-lg font-black text-primary" style={{ letterSpacing: '-0.02em' }}>
              Want to capture even more savings?
            </h4>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--color-secondary)' }}>
              Credex sells discounted, secure API & platform credits for OpenAI, Anthropic, and Google Cloud, helping startups slash direct API costs by up to 25%.
            </p>
          </div>
          <a
            href="https://credex.ai"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="btn-primary px-5 py-3 text-sm shrink-0 self-start md:self-center"
          >
            Book a consultation
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {data.totalMonthlySavings < 100 && (
        <div
          className="p-6 rounded-lg mb-10"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)'
          }}
        >
          <h4 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            You're spending well!
          </h4>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-secondary)' }}>
            Your AI stack is highly optimized! We didn't find any major savings. Keep this page bookmarked and check back when your team size or AI subscription stack changes.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              data-cursor-hover
              className="btn-primary px-5 py-2.5 text-xs font-semibold"
            >
              Save PDF Report
            </button>
            <button
              onClick={handleShare}
              data-cursor-hover
              className="btn-ghost px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Share Audit
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI Summary Block */}
      <div
        className="p-6 rounded-lg mb-10 relative overflow-hidden"
        style={{
          background: 'var(--color-background)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 accent-text animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-semibold" style={{ color: 'var(--color-subtle)' }}>
            BurnCheck AI Generated Summary
          </span>
        </div>
        <p className="text-sm leading-relaxed italic" style={{ color: 'var(--color-secondary)' }}>
          "{data.summary}"
        </p>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px dashed rgba(79, 93, 117, 0.4)' }}>
        <button
          onClick={handleShare}
          data-cursor-hover
          className="btn-ghost w-full sm:w-auto px-6 py-3 text-sm flex justify-center items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-accent" />
              Link Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share Audit
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          data-cursor-hover
          className="btn-primary w-full sm:w-auto px-6 py-3.5 text-sm flex justify-center items-center gap-2"
        >
          Save PDF Report
          <ArrowRight className="w-4 h-4 btn-icon" />
        </button>
      </div>
    </section>
  );
}
