import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTASection({ onStartAudit }) {
  return (
    <section className="py-16 px-6 md:px-8 max-w-6xl mx-auto">
      <div className="callout-card px-8 md:px-14 py-14 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] accent-text mb-4">Get started</p>
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Ready to stop burning money on AI tools?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#bdbdbd' }}>
            Takes 2 minutes. No account needed. We show you every dollar you're wasting — and exactly what to do about it.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-3 shrink-0">
          <button
            onClick={onStartAudit}
            data-cursor-hover
            className="btn-primary px-8 py-3.5 text-[15px] whitespace-nowrap"
          >
            Run Free Audit
            <ArrowRight className="w-4 h-4 btn-icon" />
          </button>
          <p className="text-xs" style={{ color: '#8b949e' }}>No credit card · Free forever</p>
        </div>
      </div>
    </section>
  );
}
