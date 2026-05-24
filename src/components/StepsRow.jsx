import React from 'react';
import { Layers, Cpu, Coins } from 'lucide-react';

const steps = [
  {
    icon: Layers,
    num: '01',
    title: 'Enter your tools',
    description: 'Tell us what AI tools you pay for and your current plans. Takes under 2 minutes.',
  },
  {
    icon: Cpu,
    num: '02',
    title: 'Get instant audit',
    description: 'Our engine benchmarks every tool against current pricing, seat counts, and usage patterns.',
  },
  {
    icon: Coins,
    num: '03',
    title: 'See your savings',
    description: 'Get a clear breakdown of what to cut, switch, or downgrade — with exact dollar amounts.',
  },
];

export default function StepsRow() {
  return (
    <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section label */}
      <div className="text-center mb-12">
        <p className="text-xs text-accent uppercase tracking-[0.2em] font-semibold mb-3">How it works</p>
        <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
          Three steps to clarity
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              data-cursor-hover
              className="glow-card bg-card border border-border p-8 rounded-2xl flex flex-col gap-5"
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              {/* Top row: icon + number */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-border"
                  style={{ background: 'rgba(34,197,94,.08)' }}
                >
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-3xl font-black text-border">{step.num}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line (not on last) */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden md:block absolute right-0 top-1/2 w-5 h-px bg-border"
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
