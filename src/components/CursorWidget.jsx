import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';

const PRESETS = [
  { id: 'green',  label: 'Cash Burn',   hex: '#22c55e', sub: 'Default'     },
  { id: 'orange', label: 'Inferno',     hex: '#f97316', sub: 'Hot spend'   },
  { id: 'purple', label: 'Crypto Fire', hex: '#a855f7', sub: 'Web3 vibes'  },
  { id: 'red',    label: 'Danger Zone', hex: '#ef4444', sub: 'Burning cash' },
];

const STYLES = [
  { id: 'flame', label: '🔥 Flame + Sparks', desc: 'Full effect'   },
  { id: 'none',  label: '⬜ Off',            desc: 'System cursor' },
];

export default function CursorWidget({ cursorColor, setCursorColor, cursorStyle, setCursorStyle }) {
  const [open, setOpen] = useState(false);
  const active = PRESETS.find(p => p.id === cursorColor) || PRESETS[0];

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3" style={{ userSelect: 'none' }}>

      {open && (
        <div
          className="glass-panel rounded-2xl p-5 w-64 shadow-2xl anim-fade-in"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.06)' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-primary">Cursor Flame</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              data-cursor-hover
              className="text-secondary hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color / preset */}
          <p className="text-xs text-secondary uppercase tracking-widest mb-2.5 font-semibold">Burn Color</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map(p => (
              <button
                key={p.id}
                data-cursor-hover
                onClick={() => setCursorColor(p.id)}
                className={`relative flex flex-col items-start px-3 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                  cursorColor === p.id
                    ? 'border-opacity-60 bg-white/5'
                    : 'border-border hover:border-white/15 hover:bg-white/3'
                }`}
                style={{
                  borderColor: cursorColor === p.id ? p.hex + '99' : undefined,
                  boxShadow:   cursorColor === p.id ? `0 0 12px ${p.hex}33` : undefined,
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.hex, boxShadow: `0 0 6px ${p.hex}` }} />
                  <span className="text-xs font-bold text-primary">{p.label}</span>
                </div>
                <span className="text-[10px] text-secondary">{p.sub}</span>
              </button>
            ))}
          </div>

          {/* On/Off */}
          <p className="text-xs text-secondary uppercase tracking-widest mb-2 font-semibold">Mode</p>
          <div className="flex gap-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                data-cursor-hover
                onClick={() => setCursorStyle(s.id)}
                className={`flex-1 text-xs py-2 px-2 rounded-lg border transition-all duration-200 font-medium ${
                  cursorStyle === s.id
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border text-secondary hover:text-primary hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor-hover
        className="btn-glow w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-xl"
        style={{
          boxShadow: open
            ? `0 0 0 2px ${active.hex}66, 0 8px 32px rgba(0,0,0,.5)`
            : '0 0 0 1px rgba(255,255,255,.08), 0 8px 32px rgba(0,0,0,.5)',
        }}
        title="Customize cursor flame"
      >
        <Flame className="w-5 h-5" style={{ color: active.hex }} />
      </button>
    </div>
  );
}
