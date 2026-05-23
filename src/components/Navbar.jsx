import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-extrabold text-primary tracking-tight">
          BurnCheck
        </span>
        <button className="bg-accent hover:bg-accent/90 text-black px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95">
          Run Free Audit
        </button>
      </div>
    </header>
  );
}
