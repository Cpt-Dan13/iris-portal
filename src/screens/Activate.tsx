import { Rocket, Square, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAutomation } from '../hooks/useAutomation';
import type { Duration } from '../hooks/useAutomation';

const DURATION_OPTIONS: { id: Duration; label: string; description: string }[] = [
  { id: '15mins', label: '15 Minutes', description: 'Quick test — one cycle then waits 15 mins' },
  { id: '3hours', label: '3 Hours',   description: 'Runs a cycle every 3 hours' },
  { id: '8hours', label: '8 Hours',   description: 'Runs a cycle every 8 hours' },
  { id: '1day',   label: '1 Day',     description: 'Runs a cycle once per day' },
  { id: '3days',  label: '3 Days',    description: 'Balanced run with solid coverage' },
  { id: '1week',  label: '1 Week',    description: 'Full campaign for maximum reach' },
];

export default function Activate() {
  const { status, loading, activate, stop } = useAutomation();
  const active = status === 'running' || status === 'pending';
  const stopping = status === 'stopping';
  const busy = active || stopping;
  const [duration, setDuration] = useState<Duration>(
    () => (localStorage.getItem('iris_duration') as Duration) ?? '3days'
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-full" style={{ padding: '48px 24px' }}>
      {/* Icon */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(192,132,252,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          border: '2px solid rgba(192,132,252,0.25)',
        }}
      >
        <Rocket size={48} style={{ color: '#c084fc' }} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: '#c084fc',
          letterSpacing: '0.12em',
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        IRIS
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: '1.6',
          marginBottom: 24,
        }}
      >
        AI-powered Hinge automation. Activate to begin.
      </p>

      {/* Status pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 9999,
          background: stopping ? 'rgba(239,68,68,0.12)' : active ? 'rgba(34,197,94,0.12)' : 'rgba(161,161,161,0.12)',
          border: `1px solid ${stopping ? 'rgba(239,68,68,0.35)' : active ? 'rgba(34,197,94,0.35)' : 'rgba(161,161,161,0.25)'}`,
          marginBottom: 32,
          fontSize: 13,
          fontWeight: 600,
          color: stopping ? '#ef4444' : active ? '#22c55e' : 'var(--text-secondary)',
        }}
      >
        {stopping ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Stopping...
          </>
        ) : status === 'running' ? (
          <>
            <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Running
          </>
        ) : status === 'pending' ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            Pending...
          </>
        ) : (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }} />
            Idle
          </>
        )}
      </div>

      {/* Duration dropdown */}
      <div style={{ position: 'relative', marginBottom: 24, width: 280 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, textAlign: 'center' }}>
          Duration
        </p>
        <button
          onClick={() => !busy && setOpen(o => !o)}
          disabled={busy}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: busy ? 'var(--text-secondary)' : 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            opacity: busy ? 0.6 : 1,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => { if (!busy) e.currentTarget.style.borderColor = '#c084fc'; }}
          onMouseLeave={e => { if (!busy) e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <span>{DURATION_OPTIONS.find(d => d.id === duration)?.label}</span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-secondary)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              flexShrink: 0,
            }}
          />
        </button>

        {open && (
          <>
            {/* Backdrop */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpen(false)} />
            {/* Menu */}
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}>
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setDuration(opt.id); localStorage.setItem('iris_duration', opt.id); setOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: duration === opt.id ? 'rgba(192,132,252,0.10)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: opt.id !== '1week' ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (duration !== opt.id) e.currentTarget.style.background = 'rgba(192,132,252,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = duration === opt.id ? 'rgba(192,132,252,0.10)' : 'transparent'; }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: duration === opt.id ? '#c084fc' : 'var(--text)', marginBottom: 1 }}>
                      {opt.label}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{opt.description}</p>
                  </div>
                  {duration === opt.id && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c084fc', flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Button */}
      <button
        onClick={() => {
          if (stopping) return;
          console.log('[IRIS] Button clicked — active:', active, 'status:', status, 'duration:', duration);
          active ? stop() : activate(duration);
        }}
        disabled={loading || stopping}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 40px',
          borderRadius: 9999,
          fontSize: 16,
          fontWeight: 700,
          cursor: stopping ? 'not-allowed' : 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
          minWidth: 240,
          justifyContent: 'center',
          ...(stopping
            ? { background: 'transparent', border: '2px solid #ef4444', color: '#ef4444', opacity: 0.6 }
            : active
            ? { background: 'transparent', border: '2px solid #ef4444', color: '#ef4444' }
            : { background: '#c084fc', border: '2px solid #c084fc', color: '#fff', boxShadow: '0 4px 24px rgba(192,132,252,0.35)' }),
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          if (!busy) { el.style.transform = 'scale(1.02)'; el.style.background = '#d4a0ff'; }
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transform = 'scale(1)';
          if (!busy) el.style.background = '#c084fc';
        }}
      >
        {stopping ? <Square size={18} /> : active ? <Square size={18} /> : <Rocket size={18} />}
        {stopping ? 'Stopping...' : active ? 'Stop IRIS' : 'Activate IRIS'}
      </button>

      {/* Subtle footer note */}
      {busy && (
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
          {stopping ? 'Sending stop signal to IRIS...' : 'IRIS is running in the background and processing your matches.'}
        </p>
      )}
    </div>
  );
}
