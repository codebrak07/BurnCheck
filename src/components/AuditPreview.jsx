import React, { useEffect, useRef, useState } from 'react';

const ROWS = [
  { tool: 'OpenAI API',     current: '$847/mo', recommended: 'Cap + alerts',    save: '−$423/mo', action: 'cut',    note: 'Usage spike detected' },
  { tool: 'ChatGPT Team',  current: '$300/mo', recommended: 'Remove 4 seats',  save: '−$120/mo', action: 'switch', note: '4 seats unused 30d'   },
  { tool: 'Claude Team',   current: '$240/mo', recommended: 'Downgrade 4→Pro', save: '−$96/mo',  action: 'switch', note: 'Pro covers use case'   },
  { tool: 'GitHub Copilot',current: '$228/mo', recommended: 'Keep as-is',      save: '$0/mo',        action: 'ok',     note: '94% utilisation'      },
  { tool: 'Cursor Pro',    current: '$160/mo', recommended: 'Keep as-is',      save: '$0/mo',        action: 'ok',     note: '98% utilisation'      },
  { tool: 'Windsurf Pro',  current: '$60/mo',  recommended: 'Downgrade → Free',save: '−$40/mo',  action: 'save',   note: 'Free tier sufficient'  },
];

const COLS = ['Tool', 'Current spend', 'Recommendation', 'Monthly save', 'Action'];

const tagMap = {
  cut:    'tag-cut',
  switch: 'tag-switch',
  save:   'tag-save',
  ok:     'tag-ok',
};
const labelMap = {
  cut: 'Cut spend', switch: 'Switch plan', save: 'Downgrade', ok: 'Optimized',
};

export default function AuditPreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 md:px-8 max-w-6xl mx-auto" ref={ref}>
      <div className="divider mb-16" />

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] accent-text mb-3">Sample output</p>
        <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight" style={{ letterSpacing: '-0.03em' }}>
          Here's what your audit<br />actually looks like
        </h2>
      </div>

      <div
        className={`audit-table transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* Header row */}
        <div className="audit-row" style={{ background: '#070707' }}>
          {COLS.map(col => (
            <div key={col} className="audit-cell text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6b6b6b' }}>
              {col}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="audit-row"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity .4s ease ${0.1 + i * 0.07}s, transform .4s ease ${0.1 + i * 0.07}s`,
            }}
          >
            <div className="audit-cell">
              <div>
                <p className="text-[12px] font-semibold" style={{ color: '#d0d0d0' }}>{row.tool}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#52525b' }}>{row.note}</p>
              </div>
            </div>
            <div className="audit-cell">
              <span className="text-[12px] font-mono" style={{ color: '#5a5a5a' }}>{row.current}</span>
            </div>
            <div className="audit-cell">
              <span className="text-[12px]" style={{ color: '#4a4a4a' }}>{row.recommended}</span>
            </div>
            <div className="audit-cell">
              <span className={`text-[12px] font-mono font-bold ${row.save === '$0/mo' ? '' : 'accent-text'}`} style={row.save === '$0/mo' ? { color: '#6b6b6b' } : {}}>
                {row.save}
              </span>
            </div>
            <div className="audit-cell">
              <span className={tagMap[row.action]}>{labelMap[row.action]}</span>
            </div>
          </div>
        ))}

        {/* Total savings row */}
        <div className="audit-row" style={{ background: '#070707', borderTop: '1px solid #1a1a1a' }}>
          <div className="audit-cell">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b6b6b' }}>Total</span>
          </div>
          <div className="audit-cell">
            <span className="text-[12px] font-mono font-bold" style={{ color: '#4a4a4a' }}>$1,835/mo</span>
          </div>
          <div className="audit-cell" />
          <div className="audit-cell">
            <span className="text-[13px] font-mono font-black accent-text">−$679/mo</span>
          </div>
          <div className="audit-cell">
            <span className="text-[10px] font-semibold" style={{ color: '#22c55e99' }}>37% reduction</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-center" style={{ color: '#252525' }}>
        ↑ Sample output based on a 12-person engineering team
      </p>
    </section>
  );
}
