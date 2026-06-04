import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useState } from 'react';
import { Crown, Medal } from 'lucide-react';
import { MOCK_PROFILES, REPORT_DATA } from '../data/mockData';
import type { Profile } from '../data/mockData';

interface ReportsProps {
  onSelectProfile: (profile: Profile) => void;
}

type TimeRange = '3days' | 'week' | 'month';

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: '3days', label: '3 Days' },
  { id: 'week',  label: 'Week'   },
  { id: 'month', label: 'Month'  },
];

function sliceData(range: TimeRange) {
  if (range === '3days') return REPORT_DATA.slice(-3);
  if (range === 'week')  return REPORT_DATA.slice(-7);
  return REPORT_DATA;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={16} style={{ color: '#fbbf24' }} />;
  if (rank === 2) return <Medal size={16} style={{ color: '#c0c0c0' }} />;
  if (rank === 3) return <Medal size={16} style={{ color: '#cd7f32' }} />;
  return <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 16, textAlign: 'center' }}>{rank}</span>;
}

const customTooltipStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  color: 'var(--text)',
  fontSize: 13,
};

export default function Reports({ onSelectProfile }: ReportsProps) {
  const [range, setRange] = useState<TimeRange>('week');
  const data = sliceData(range);

  const byAllure = [...MOCK_PROFILES].sort((a, b) => b.allureScore - a.allureScore).slice(0, 5);
  const byProspective = [...MOCK_PROFILES].sort((a, b) => b.prospectiveScore - a.prospectiveScore).slice(0, 5);

  const avgScore = Math.round(MOCK_PROFILES.reduce((s, p) => s + p.allureScore, 0) / MOCK_PROFILES.length);
  const highRate = Math.round((MOCK_PROFILES.filter(p => p.prospectiveLevel === 'HIGH').length / MOCK_PROFILES.length) * 100);
  const topPerformer = byAllure[0];

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Reports</h1>
        <div className="flex gap-2">
          {TIME_RANGES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRange(id)}
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                border: range === id ? '1px solid #c084fc' : '1px solid var(--border)',
                background: range === id ? '#c084fc' : 'var(--card)',
                color: range === id ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 lists */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 24 }}>
        {/* Top 5 Allure */}
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Top 5 Allure Ranking</h2>
          {byAllure.map((p, i) => (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className="flex items-center gap-3"
              style={{ padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <div style={{ width: 22, display: 'flex', justifyContent: 'center' }}>
                <RankIcon rank={i + 1} />
              </div>
              <img src={p.photo} alt={p.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24' }}>{p.allureScore}</span>
            </div>
          ))}
        </div>

        {/* Top 5 Prospective */}
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Top 5 Prospective</h2>
          {byProspective.map((p, i) => (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className="flex items-center gap-3"
              style={{ padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <div style={{ width: 22, display: 'flex', justifyContent: 'center' }}>
                <RankIcon rank={i + 1} />
              </div>
              <img src={p.photo} alt={p.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#c084fc' }}>{p.prospectiveScore}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Progression Chart */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Score Progression</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="score" stroke="#c084fc" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: '#c084fc', r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Success Projection Chart */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Success Projection</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 80]} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="success" stroke="#22c55e" strokeWidth={2.5} fill="url(#successGradient)" dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Avg Allure Score</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>{avgScore}</p>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>HIGH Match Rate</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{highRate}%</p>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Top Performer</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{topPerformer?.name}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#fbbf24' }}>{topPerformer?.allureScore}</p>
        </div>
      </div>
    </div>
  );
}
