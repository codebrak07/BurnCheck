import React from 'react';

const names = ['YC W24', 'Buildspace', 'Vercel', 'Linear', 'Indie Hackers'];

export default function SocialProof() {
  return (
    <section className="py-16 px-6 md:px-8 max-w-6xl mx-auto">
      <div className="divider mb-12" />
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-center mb-7" style={{ color: 'var(--color-subtle)' }}>
        Used by teams at
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {names.map(name => (
          <span
            key={name}
            className="text-xs font-bold uppercase tracking-widest transition-colors duration-300"
            style={{ color: '#555' }}
            onMouseEnter={e => e.target.style.color = '#a1a1aa'}
            onMouseLeave={e => e.target.style.color = '#555'}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
