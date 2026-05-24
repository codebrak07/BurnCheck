import React from 'react';

const teams = ['YC W24', 'Buildspace', 'Vercel', 'Linear', 'Indie Hackers'];

export default function SocialProof() {
  return (
    <section className="py-12 border-y border-border" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-secondary uppercase tracking-[0.2em] font-semibold mb-6">
          Used by founders at early-stage startups across YC, Buildspace, and indie teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {teams.map(name => (
            <span
              key={name}
              className="text-sm font-bold text-secondary/40 hover:text-secondary/70 transition-colors duration-300 tracking-widest uppercase"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
