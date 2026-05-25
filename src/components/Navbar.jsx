import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <header className="fixed top-0 w-full z-50 glass-panel anim-fade-in">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate('landing')}
          data-cursor-hover
          className="flex items-center gap-2 text-lg font-black text-primary hover:opacity-75 transition-opacity"
          style={{ letterSpacing: '-0.04em' }}
        >
          <img src="/BurnCheck.png" alt="BurnCheck Logo" className="h-6 w-6 rounded-full object-contain" />
          <span className="logo-text-gradient">BurnCheck</span>
        </button>

        <button
          onClick={() => onNavigate('form')}
          data-cursor-hover
          className="btn-primary px-5 py-2 text-sm"
        >
          Run Free Audit
        </button>
      </div>
    </header>
  );
}
