import React from 'react';

export default function Footer() {
  return (
    <footer className="py-10 px-6" style={{ borderTop: '1px solid #23252a' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-xs" style={{ color: 'var(--color-subtle)' }}>
          <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--color-secondary)' }}>
            <img src="/BurnCheck.png" alt="BurnCheck Logo" className="h-4 w-4 rounded-full object-contain" />
            <span>BurnCheck</span>
          </div>
          <span>·</span>
          <span>Free forever</span>
          <span>·</span>
          <span>Built by Aalekh</span>
          <span>·</span>
          <span className="italic">Not affiliated with any AI vendor</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>© 2025</span>
      </div>
    </footer>
  );
}
