import React, { useState } from 'react';
import { Paintbrush, X, ChevronDown } from 'lucide-react';

const COLORS = [
  { id: 'green',  label: 'Emerald', hex: '#22c55e' },
  { id: 'purple', label: 'Violet',  hex: '#a855f7' },
  { id: 'cyan',   label: 'Cyan',    hex: '#06b6d4' },
  { id: 'pink',   label: 'Pink',    hex: '#ec4899' },
];

const STYLES = [
  { id: 'dual',    label: 'Dual Glow',   desc: 'Dot + ring trail' },
  { id: 'glow',    label: 'Core Glow',   desc: 'Blurred blob' },
  { id: 'minimal', label: 'Minimalist',  desc: 'Dot only' },
  { id: 'default', label: 'Default',     desc: 'System cursor' },
];

export default function CursorWidget({ cursorColor, setCursorColor, cursorStyle, setCursorStyle }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3"
      style={{ userSelect: 'none' }}
    >
      {/* Panel */}
      {open && (
        <div
          className="glass-panel rounded-2xl p-5 w-64 shadow-2xl anim-fade-in"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-primary tracking-wide">Cursor Style</span>
            <button
              onClick={() => setOpen(false)}
              data-cursor-hover
              className="text-secondary hover:text-primary transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color picker */}
          <p className="text-xs text-secondary uppercase tracking-widest mb-2 font-semibold">Color</p>
          <div className="flex gap-2 mb-4">
            {COLORS.map(c => (
              <button
                key={c.id}
                data-cursor-hover
                onClick={() => setCursorColor(c.id)}
                title={c.label}
                className="relative w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: c.hex,
                  boxShadow: cursorColor === c.id
                    ? `0 0 0 2px #0a0a0a, 0 0 0 4px ${c.hex}, 0 0 14px ${c.hex}88`
                    : '0 0 0 2px #27272a',
                }}
              />
            ))}
          </div>

          {/* Style picker */}
          <p className="text-xs text-secondary uppercase tracking-widest mb-2 font-semibold">Type</p>
          <div className="flex flex-col gap-1.5">
            {STYLES.map(s => (
              <button
                key={s.id}
                data-cursor-hover
                onClick={() => setCursorStyle(s.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                  cursorStyle === s.id
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-secondary hover:text-primary hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="font-medium">{s.label}</span>
                <span className="text-xs opacity-60">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor-hover
        className="btn-glow w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-xl"
        style={{
          boxShadow: open
            ? '0 0 0 2px #22c55e66, 0 8px 32px rgba(0,0,0,.5)'
            : '0 0 0 1px rgba(255,255,255,.08), 0 8px 32px rgba(0,0,0,.5)',
        }}
        title="Customize cursor"
      >
        <Paintbrush className="w-5 h-5 text-accent" />
      </button>
    </div>
  );
}
