import { useState } from 'react';
import { Sparkles, Monitor } from 'lucide-react';

interface Props {
  onSelect: () => void;
}

const MACHINES = [
  { id: 1, label: 'Emulator 1', active: true,  subtitle: 'Virtual Android Device' },
  { id: 2, label: 'Emulator 2', active: false, subtitle: 'Not available'           },
  { id: 3, label: 'Emulator 3', active: false, subtitle: 'Not available'           },
];

export default function MachineSelect({ onSelect }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Sparkles size={40} style={{ color: '#c084fc', marginBottom: 12 }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: 2, marginBottom: 8 }}>
            IRIS
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Select a machine to continue
          </p>
        </div>

        {/* Machine list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MACHINES.map(machine => {
            const isHovered = hovered === machine.id && machine.active;
            return (
              <div
                key={machine.id}
                onClick={machine.active ? onSelect : undefined}
                onMouseEnter={() => machine.active && setHovered(machine.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: 'var(--card)',
                  borderRadius: 14,
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: machine.active
                    ? `1px solid ${isHovered ? '#d8b4fe' : '#c084fc'}`
                    : '1px solid var(--border)',
                  cursor: machine.active ? 'pointer' : 'not-allowed',
                  opacity: machine.active ? 1 : 0.4,
                  transition: 'border-color 0.15s, transform 0.1s',
                  transform: isHovered ? 'translateY(-1px)' : 'none',
                  boxShadow: machine.active ? '0 4px 20px rgba(192,132,252,0.10)' : 'none',
                }}
              >
                {/* Left — icon + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: machine.active ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Monitor size={20} style={{ color: machine.active ? '#c084fc' : 'var(--text-secondary)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                      {machine.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {machine.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right — status */}
                {machine.active ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px #22c55e99',
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>Active</span>
                  </div>
                ) : (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    flexShrink: 0,
                  }}>
                    Coming Soon
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
