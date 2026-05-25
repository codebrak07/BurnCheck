import React from 'react';

export default function Footer() {
  return (
    <footer className="py-10 px-6" style={{ borderTop: '1px solid #23252a' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 w-full text-xs" style={{ color: 'var(--color-subtle)' }}>
        <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-secondary)' }}>
          <img src="/BurnCheck.png" alt="BurnCheck Logo" className="h-4 w-4 rounded-full object-contain" />
          <span>© 2026 <span className="logo-text-gradient">BurnCheck</span>. All rights reserved.</span>
        </div>
        <span className="italic">Not affiliated with any AI vendor</span>
      </div>
    </footer>
  );
}
