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
  const handleSubmit = (e) => { e.preventDefault(); alert('Audit submitted! Results coming soon.'); };

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-8 max-w-4xl mx-auto anim-fade-in">

      {/* Back button — uses btn-back class */}
      <button
        onClick={onBack}
        data-cursor-hover
        className="btn-back text-sm mb-10"
        style={{ color: 'var(--color-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4 btn-icon" />
        Back to Home
      </button>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-primary mb-3" style={{ letterSpacing: '-0.03em' }}>
          Configure Your Stack Audit
        </h2>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-secondary)' }}>
          Fill in your team details and the AI tools you're actively paying for.
        </p>
      </div>

      {/* Live spend ticker */}
      <div className="rounded-xl px-6 py-4 mb-8 flex items-center justify-between"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: 'var(--color-subtle)', fontFamily: 'JetBrains Mono, monospace' }}>declared monthly spend</p>
          <p className="text-2xl font-black" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e0e0e0', letterSpacing: '-0.03em' }}>
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,217,146,.06)', border: '1px solid rgba(0,217,146,.15)' }}>
          <DollarSign className="w-5 h-5 accent-text" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Team meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-lg" style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
          <div>
            <label htmlFor="team-size" className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Team Size</label>
            <input id="team-size" type="number" min="1"
              value={teamSize}
              onChange={e => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
              data-cursor-hover className="input-field" />
          </div>
          <div>
            <label htmlFor="use-case" className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Primary Use Case</label>
            <select id="use-case" value={useCase} onChange={e => setUseCase(e.target.value)}
              data-cursor-hover className="input-field appearance-none">
              {useCases.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Tools section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold" style={{ color: '#d0d0d0' }}>AI Tool Allocations</h3>
            <span className="text-xs font-mono px-2 py-1 rounded"
              style={{ color: 'var(--color-subtle)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', fontFamily: 'JetBrains Mono, monospace' }}>
              {tools.length} tool{tools.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {tools.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-end gap-3 p-5 rounded-lg"
                style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Tool</label>
                  <select value={item.toolName} onChange={e => handleToolChange(idx, 'toolName', e.target.value)}
                    data-cursor-hover className="input-field appearance-none">
                    {Object.keys(toolPlans).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Plan</label>
                  <select value={item.plan} onChange={e => handleToolChange(idx, 'plan', e.target.value)}
                    data-cursor-hover className="input-field appearance-none">
                    {toolPlans[item.toolName].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Monthly Spend (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-subtle)' }}>$</span>
                    <input type="number" min="0" step="0.01" value={item.spend}
                      onChange={e => handleToolChange(idx, 'spend', Math.max(0, parseFloat(e.target.value) || 0))}
                      data-cursor-hover className="input-field" style={{ paddingLeft: '24px' }} />
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>Seats</label>
                  <input type="number" min="1" value={item.seats}
                    onChange={e => handleToolChange(idx, 'seats', Math.max(1, parseInt(e.target.value) || 1))}
                    data-cursor-hover className="input-field" />
                </div>
                {/* Remove — uses btn-danger class */}
                <button type="button" onClick={() => removeTool(idx)}
                  disabled={tools.length === 1} data-cursor-hover
                  className="btn-danger self-end p-2.5 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add row — uses btn-add class */}
          <button type="button" onClick={addTool} data-cursor-hover
            className="btn-add mt-3 w-full py-4 text-sm font-medium">
            <Plus className="w-4 h-4 btn-icon" />
            Add Another Tool
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end" style={{ borderTop: '1px dashed rgba(79, 93, 117, 0.4)' }}>
          <button type="submit" data-cursor-hover className="btn-primary px-8 py-3.5 text-[15px]">
            Run My Audit
            <ArrowRight className="w-4 h-4 btn-icon" />
          </button>
        </div>
      </form>
    </section>
  );
}
