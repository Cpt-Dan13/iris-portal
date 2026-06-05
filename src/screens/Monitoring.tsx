import { useEffect, useState } from 'react';
import { Monitor, Cpu, Wifi, Activity, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAutomation } from '../hooks/useAutomation';

interface ActivityEntry {
  id: string;
  name: string;
  allure_score: number;
  created_at: string;
}

function StatusCard({ label, value, color, icon: Icon }: {
  label: string;
  value: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 16, padding: '20px 24px', flex: 1 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        <Icon size={16} style={{ color }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{value}</span>
      </div>
    </div>
  );
}

export default function Monitoring() {
  const { status } = useAutomation();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchActivity() {
    setRefreshing(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, name, allure_score, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setActivity(data);
    setLastSync(new Date().toLocaleTimeString());
    setRefreshing(false);
  }

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30_000);
    return () => clearInterval(interval);
  }, []);

  const automationColor = status === 'running' ? '#22c55e' : status === 'pending' ? '#eab308' : '#a1a1a1';
  const automationLabel = status === 'running' ? 'Running' : status === 'pending' ? 'Pending' : 'Idle';

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Monitoring</h1>
        <button
          onClick={fetchActivity}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: 'var(--card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Status cards */}
      <div className="flex gap-4" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <StatusCard label="VM" value="Online" color="#22c55e" icon={Wifi} />
        <StatusCard label="Emulator" value="user_01" color="#3b82f6" icon={Cpu} />
        <StatusCard label="Automation" value={automationLabel} color={automationColor} icon={Activity} />
        <StatusCard
          label="Last Sync"
          value={lastSync ?? '—'}
          color="#c084fc"
          icon={Clock}
        />
      </div>

      {/* NoVNC stream placeholder */}
      <div style={{
        background: 'var(--card)',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        border: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Monitor size={16} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Live Stream</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: 11, fontWeight: 600,
            color: '#eab308',
            background: 'rgba(234,179,8,0.12)',
            border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: 6, padding: '2px 8px',
          }}>
            Coming Soon
          </span>
        </div>
        <div style={{
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#0a0a0a',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(192,132,252,0.08)',
            border: '1px solid rgba(192,132,252,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Monitor size={32} style={{ color: '#c084fc', opacity: 0.6 }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              NoVNC Stream
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
              Live emulator screen will be embedded here via NoVNC. Connect your VM's VNC server to enable remote viewing.
            </p>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(192,132,252,0.08)',
            border: '1px solid rgba(192,132,252,0.2)',
            fontSize: 12,
            color: '#c084fc',
            fontFamily: 'monospace',
          }}>
            ws://iris-vm:6080/websockify
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          Recent Activity
        </h2>
        {activity.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
            No activity yet
          </p>
        ) : (
          <div>
            {activity.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-3"
                style={{
                  padding: '10px 0',
                  borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: entry.allure_score >= 80 ? '#fbbf24' : entry.allure_score >= 60 ? '#c084fc' : '#a1a1a1',
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {entry.name} liked
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#c084fc' }}>
                  {entry.allure_score}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 140, textAlign: 'right' }}>
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
