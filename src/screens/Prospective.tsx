import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import type { ProspectiveLevel, Profile } from '../types';
import { levelColor } from '../types';
import PersonalityTag from '../components/PersonalityTag';
import TakeOverModal from '../components/TakeOverModal';
import ScoreBadge from '../components/ScoreBadge';

interface ProspectiveProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
}

const LEVELS: ProspectiveLevel[] = ['HIGH', 'MODERATE', 'LOW'];

export default function Prospective({ profiles, onSelectProfile }: ProspectiveProps) {
  const [takeOverProfile, setTakeOverProfile] = useState<Profile | null>(null);

  const grouped = LEVELS.reduce<Record<ProspectiveLevel, Profile[]>>((acc, lvl) => {
    acc[lvl] = profiles
      .filter(p => p.prospectiveLevel === lvl)
      .sort((a, b) => (b.prospectiveScore ?? 0) - (a.prospectiveScore ?? 0));
    return acc;
  }, { HIGH: [], MODERATE: [], LOW: [] });

  const pieData = LEVELS.map(lvl => ({ name: lvl, value: grouped[lvl].length, color: levelColor[lvl] }));

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>Prospective</h1>

      {LEVELS.map(lvl => {
        const color = levelColor[lvl];
        const profiles = grouped[lvl];
        if (!profiles.length) return null;

        return (
          <div key={lvl} style={{ marginBottom: 32 }}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: `${color}1f`,
              borderLeft: `4px solid ${color}`,
              borderRadius: 12,
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: '1px' }}>{lvl}</span>
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>
                {profiles.length}
              </span>
            </div>

            {/* Profile card grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  style={{
                    background: 'var(--card)',
                    borderRadius: 16,
                    border: `2px solid ${color}`,
                    overflow: 'hidden',
                    boxShadow: `0 4px 8px ${color}26`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px ${color}33`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 8px ${color}26`;
                  }}
                >
                  {/* Photo */}
                  <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onSelectProfile(profile)}>
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                    />
                    {/* Level badge */}
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: `${color}38`,
                      border: `1.5px solid ${color}`,
                      borderRadius: 20,
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 5,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase' }}>{lvl}</span>
                      <span style={{ fontSize: 17, fontWeight: 700, color }}>{profile.prospectiveScore}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 16 }}>
                    <div className="flex items-center justify-between mb-1" style={{ cursor: 'pointer' }} onClick={() => onSelectProfile(profile)}>
                      <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</span>
                      <ScoreBadge score={profile.allureScore} size="sm" />
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {profile.age} &bull; {profile.location}
                    </p>
                    <div className="flex flex-wrap" style={{ marginBottom: 8 }}>
                      {profile.tags.slice(0, 3).map(t => (
                        <PersonalityTag key={t.label} label={t.label} color={t.color} small />
                      ))}
                    </div>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 14,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {profile.bio}
                    </p>

                    {/* Take Over button */}
                    <button
                      onClick={() => setTakeOverProfile(profile)}
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: 8,
                        background: '#22c55e',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#16a34a')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#22c55e')}
                    >
                      Take Over
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Distribution Analysis */}
      <div style={{
        background: 'var(--card)',
        borderRadius: 16,
        padding: 24,
        marginTop: 8,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Distribution Analysis</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }}
              formatter={(val: number) => [`${val} profiles`, '']}
            />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {takeOverProfile && (
        <TakeOverModal profile={takeOverProfile} onClose={() => setTakeOverProfile(null)} />
      )}
    </div>
  );
}
