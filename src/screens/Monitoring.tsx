import { useEffect, useState, useRef } from 'react';
import { Monitor, Cpu, Wifi, Activity, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAutomation } from '../hooks/useAutomation';

const LOG_WS_URL = 'ws://100.74.133.102:8765';

interface ActivityEntry {
  id: string;
  name: string;
  allure_score: number;
  created_at: string;
}

interface LogEntry {
  id: number;
  raw: string;
  level: 'D' | 'W' | 'E' | 'I';
  message: string;
  time: string;
}

function parseLogLine(raw: string, id: number): LogEntry {
  // Format: "MM-DD HH:MM:SS.mmm D/IRIS( pid): message"
  const match = raw.match(/(\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)\s+\d+\s+\d+\s+([DWIE])\s+IRIS\s*:\s*(.*)/);
  if (match) return { id, raw, time: match[1], level: match[2] as LogEntry['level'], message: match[3] };
  return { id, raw, time: '', level: 'D', message: raw };
}

function logColor(level: LogEntry['level']): string {
  if (level === 'E') return '#ef4444';
  if (level === 'W') return '#eab308';
  if (level === 'I') return '#3b82f6';
  return '#a1a1a1';
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  // WebSocket log stream
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      setWsStatus('connecting');
      ws = new WebSocket(LOG_WS_URL);

      ws.onopen = () => setWsStatus('connected');

      ws.onmessage = (e) => {
        const entry = parseLogLine(e.data, logIdRef.current++);
        setLogs(prev => [...prev.slice(-199), entry]);
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();
    return () => { ws?.close(); clearTimeout(reconnectTimer); };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

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

      {/* Live Stream + Activity Logs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'stretch' }}>

        {/* NoVNC Live Stream */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Monitor size={16} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Live Stream</span>
          </div>
          <iframe
            title="IRIS Emulator Live Stream"
            src="http://100.74.133.102:6080/vnc_lite.html?autoconnect=true&resize=scale"
            style={{ flex: 1, width: '100%', minHeight: 800, border: 'none', background: '#0a0a0a', display: 'block' }}
            allow="clipboard-read; clipboard-write"
          />
        </div>

        {/* Activity Logs */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Activity size={16} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Activity Logs</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: wsStatus === 'connected' ? '#22c55e' : wsStatus === 'connecting' ? '#eab308' : '#ef4444',
              background: wsStatus === 'connected' ? 'rgba(34,197,94,0.1)' : wsStatus === 'connecting' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${wsStatus === 'connected' ? 'rgba(34,197,94,0.3)' : wsStatus === 'connecting' ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 6, padding: '2px 8px', marginLeft: 4,
            }}>
              {wsStatus === 'connected' ? '● LIVE' : wsStatus === 'connecting' ? '● Connecting...' : '● Disconnected'}
            </span>
            <button
              type="button"
              onClick={() => setLogs([])}
              style={{
                marginLeft: 'auto', fontSize: 12, fontWeight: 600,
                color: 'var(--text-secondary)', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 6,
                padding: '3px 10px', cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            background: '#0d0d0d', fontFamily: 'monospace', fontSize: 12,
            display: 'flex', flexDirection: 'column', gap: 3, minHeight: 800,
          }}>
            {logs.length === 0 ? (
              <span style={{ color: '#555', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                {wsStatus === 'connected' ? 'Waiting for IRIS logs...' : 'Connecting to log server...'}
              </span>
            ) : (
              logs.map(entry => (
                <div key={entry.id} style={{ display: 'flex', gap: 8, lineHeight: 1.5 }}>
                  {entry.time && <span style={{ color: '#555', flexShrink: 0 }}>{entry.time}</span>}
                  <span style={{ color: logColor(entry.level), flexShrink: 0, fontWeight: 700 }}>{entry.level}</span>
                  <span style={{ color: '#e2e2e2', wordBreak: 'break-all' }}>{entry.message}</span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
