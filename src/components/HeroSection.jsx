import React from 'react';
import { ArrowRight } from 'lucide-react';
import dashboardPreview from '../assets/dashboard-preview.png';

export default function HeroSection({ onStartAudit }) {
  return (
    <section className="hero-gradient pt-36 pb-20 px-6 md:px-8 text-center max-w-7xl mx-auto flex flex-col items-center">

      {/* Badge */}
      <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 anim-fade-up">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-semibold text-accent tracking-wide">
          Free · No login required · 2 min audit
        </span>
      </div>

      {/* Headline */}
      <h1
        className="gradient-text text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl leading-[1.05] anim-fade-up anim-fade-up-1"
      >
        See exactly where your AI stack leaks money
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-secondary mb-10 max-w-2xl leading-relaxed anim-fade-up anim-fade-up-2">
        Free audit for startup founders and engineering managers.
        Enter your tools, get an instant savings breakdown.
      </p>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 mb-20 anim-fade-up anim-fade-up-3">
        <button
          onClick={onStartAudit}
          data-cursor-hover
          className="btn-glow bg-accent text-black px-10 py-4 rounded-xl text-lg font-black flex items-center gap-2.5"
        >
          Audit My Stack
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-secondary">
          2,000+ audits completed · No credit card needed
        </p>
      </div>

      {/* Dashboard preview */}
      <div className="preview-frame w-full max-w-5xl rounded-2xl border border-border bg-card overflow-hidden shadow-2xl relative group anim-fade-up anim-fade-up-4">
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none z-10" />

        {/* Top bar chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-[#0e0e0e]">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-4 text-xs text-secondary font-mono opacity-50">burncheck.ai/audit</span>
        </div>

        <img
          src={dashboardPreview}
          alt="BurnCheck AI Spend Dashboard"
          className="w-full aspect-[21/9] object-cover opacity-60 grayscale group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </section>
  );
}
