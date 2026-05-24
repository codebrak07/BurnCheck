import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: 'rgba(255,255,255,.05)', background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
          <span className="font-bold text-primary">Burn<span className="text-accent">Check</span></span>
          <span className="text-border hidden md:inline">·</span>
          <span>Free forever</span>
          <span className="text-border hidden md:inline">·</span>
          <span>Built by Aalekh</span>
          <span className="text-border hidden md:inline">·</span>
          <span className="italic opacity-70">Not affiliated with any AI vendor</span>
        </div>
        <span className="opacity-40">© 2025 BurnCheck</span>
      </div>
    </footer>
  );
}
