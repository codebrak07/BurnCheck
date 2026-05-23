import React from 'react';
import { Layers, Cpu, Coins } from 'lucide-react';

export default function StepsRow() {
  const steps = [
    {
      icon: Layers,
      title: "Enter your tools",
      description: "Tell us what AI tools you pay for and your current plans",
    },
    {
      icon: Cpu,
      title: "Get instant audit",
      description: "Our engine checks every tool against current pricing benchmarks",
    },
    {
      icon: Coins,
      title: "See your savings",
      description: "Get a clear breakdown of what to cut, switch, or downgrade",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border p-8 rounded-xl flex flex-col gap-4 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#18181b] flex items-center justify-center border border-border group-hover:bg-accent/10 transition-colors duration-300">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
