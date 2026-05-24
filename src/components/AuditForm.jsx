import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';

const toolPlans = {
  'Cursor':               ['Hobby', 'Pro', 'Business', 'Enterprise'],
  'GitHub Copilot':       ['Individual', 'Business', 'Enterprise'],
  'Claude':               ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API Direct'],
  'ChatGPT':              ['Plus', 'Team', 'Enterprise', 'API Direct'],
  'Anthropic API Direct': ['Pay-as-you-go', 'Enterprise'],
  'OpenAI API Direct':    ['Pay-as-you-go', 'Enterprise'],
  'Gemini':               ['Pro', 'Ultra', 'API'],
  'Windsurf':             ['Free', 'Pro', 'Teams'],
};

const useCases = ['Coding', 'Writing', 'Data Analysis', 'Research', 'Mixed'];

const defaultTool = () => ({ toolName: 'Cursor', plan: 'Pro', spend: 20, seats: 1 });

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

export default function AuditForm({ onBack }) {
  const [teamSize, setTeamSize] = useState(() => load('bc_teamSize', 1));
  const [useCase,  setUseCase]  = useState(() => load('bc_useCase',  'Coding'));
  const [tools,    setTools]    = useState(() => load('bc_tools',    [defaultTool()]));

  useEffect(() => { localStorage.setItem('bc_teamSize', JSON.stringify(teamSize)); }, [teamSize]);
  useEffect(() => { localStorage.setItem('bc_useCase',  JSON.stringify(useCase));  }, [useCase]);
  useEffect(() => { localStorage.setItem('bc_tools',    JSON.stringify(tools));    }, [tools]);

  const totalSpend = tools.reduce((sum, t) => sum + (parseFloat(t.spend) || 0) * (parseInt(t.seats) || 1), 0);

  const handleToolChange = (i, field, value) => {
    const updated = tools.map((t, idx) => {
      if (idx !== i) return t;
      const next = { ...t, [field]: value };
      if (field === 'toolName') next.plan = toolPlans[value][0];
      return next;
    });
    setTools(updated);
  };

  const addTool    = () => setTools(prev => [...prev, defaultTool()]);
  const removeTool = i  => setTools(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Audit submitted! Results view coming soon.');
  };

  const inputClass = "input-field w-full bg-[#0e0e0e] border border-border rounded-lg px-4 py-3 text-primary text-sm focus:outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider";

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-8 max-w-4xl mx-auto anim-fade-in">

      {/* Back */}
      <button
        onClick={onBack}
        data-cursor-hover
        className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary mb-10 transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Home
      </button>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 tracking-tight">
          Configure Your{' '}
          <span className="gradient-text">Stack Audit</span>
        </h2>
        <p className="text-secondary text-sm leading-relaxed max-w-xl">
          Fill in your team details and the AI tools you're actively paying for. We'll compute your optimized spend instantly.
        </p>
      </div>

      {/* Live spend ticker */}
      <div
        className="glow-card glass-panel rounded-2xl px-6 py-4 mb-8 flex items-center justify-between border border-border"
      >
        <div>
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-0.5">Declared Monthly Spend</p>
          <p className="text-3xl font-black text-primary">
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)' }}>
          <DollarSign className="w-6 h-6 text-accent" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team meta */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="team-size" className={labelClass}>Team Size</label>
            <input
              id="team-size"
              type="number" min="1"
              value={teamSize}
              onChange={e => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
              data-cursor-hover
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="use-case" className={labelClass}>Primary Use Case</label>
            <select
              id="use-case"
              value={useCase}
              onChange={e => setUseCase(e.target.value)}
              data-cursor-hover
              className={inputClass + ' appearance-none'}
            >
              {useCases.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Tools */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-primary">AI Tool Allocations</h3>
            <span className="text-xs text-secondary font-mono bg-card border border-border px-2 py-1 rounded-md">
              {tools.length} tool{tools.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {tools.map((item, idx) => (
              <div
                key={idx}
                className="glow-card bg-card border border-border p-5 rounded-2xl flex flex-col md:flex-row md:items-end gap-4"
              >
                {/* Tool */}
                <div className="flex-1">
                  <label className={labelClass}>Tool</label>
                  <select
                    value={item.toolName}
                    onChange={e => handleToolChange(idx, 'toolName', e.target.value)}
                    data-cursor-hover
                    className={inputClass + ' appearance-none'}
                  >
                    {Object.keys(toolPlans).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div className="flex-1">
                  <label className={labelClass}>Plan</label>
                  <select
                    value={item.plan}
                    onChange={e => handleToolChange(idx, 'plan', e.target.value)}
                    data-cursor-hover
                    className={inputClass + ' appearance-none'}
                  >
                    {toolPlans[item.toolName].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Spend */}
                <div className="flex-1">
                  <label className={labelClass}>Monthly Spend (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">$</span>
                    <input
                      type="number" min="0" step="0.01"
                      value={item.spend}
                      onChange={e => handleToolChange(idx, 'spend', Math.max(0, parseFloat(e.target.value) || 0))}
                      data-cursor-hover
                      className={inputClass + ' pl-7'}
                    />
                  </div>
                </div>

                {/* Seats */}
                <div className="w-28">
                  <label className={labelClass}>Seats</label>
                  <input
                    type="number" min="1"
                    value={item.seats}
                    onChange={e => handleToolChange(idx, 'seats', Math.max(1, parseInt(e.target.value) || 1))}
                    data-cursor-hover
                    className={inputClass}
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeTool(idx)}
                  disabled={tools.length === 1}
                  data-cursor-hover
                  className="self-end p-2.5 rounded-xl border border-border text-secondary hover:text-red-400 hover:border-red-500/30 disabled:opacity-25 disabled:hover:text-secondary disabled:hover:border-border transition-all duration-200 bg-background shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add row */}
          <button
            type="button"
            onClick={addTool}
            data-cursor-hover
            className="mt-3 w-full border border-dashed border-border hover:border-accent/40 bg-transparent hover:bg-accent/5 text-secondary hover:text-accent py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Another Tool
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            data-cursor-hover
            className="btn-glow bg-accent text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 text-base"
          >
            Run My Audit
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </section>
  );
}
