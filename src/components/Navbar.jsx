import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <header
      className="fixed top-0 w-full z-50 glass-panel border-b border-border anim-fade-in"
      style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate('landing')}
          data-cursor-hover
          className="text-xl font-extrabold text-primary tracking-tight hover:opacity-80 transition-opacity duration-200"
          style={{ letterSpacing: '-0.03em' }}
        >
          Burn<span className="text-accent">Check</span>
        </button>

        <button
          onClick={() => onNavigate('form')}
          data-cursor-hover
          className="btn-glow bg-accent text-black px-5 py-2 rounded-lg text-sm font-bold transition-all"
        >
          Run Free Audit
        </button>
      </div>
    </header>
  );
}
