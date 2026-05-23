import React from 'react';
import { ArrowRight } from 'lucide-react';
import dashboardPreview from '../assets/dashboard-preview.png';

export default function HeroSection() {
  return (
    <section className="hero-gradient pt-32 pb-16 px-6 md:px-8 text-center max-w-7xl mx-auto flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#1a1b22] border border-border px-4 py-1.5 rounded-full mb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
        <span className="text-xs font-medium text-secondary">
          Free · No login required · 2 min audit
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight mb-6 max-w-4xl leading-tight">
        See exactly where your AI stack leaks money
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-secondary mb-10 max-w-2xl leading-relaxed">
        Free audit for startup founders and engineering managers. Enter your tools, get instant savings breakdown.
      </p>

      {/* CTA Button and Sub-text */}
      <div className="flex flex-col items-center gap-4 mb-16">
        <button className="bg-accent hover:bg-accent/90 text-black px-8 py-4 rounded-lg text-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/10 active:scale-95">
          Audit My Stack
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-secondary">
          2,000+ audits completed · No credit card needed
        </p>
      </div>

      {/* Dashboard Preview */}
      <div className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-2xl relative group max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
        <img
          src={dashboardPreview}
          alt="BurnCheck AI Spend Dashboard"
          className="w-full aspect-[21/9] object-cover opacity-70 grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </section>
  );
}
