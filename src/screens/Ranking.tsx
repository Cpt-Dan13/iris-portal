import { Crown, Medal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { MOCK_PROFILES } from '../data/mockData';
import PersonalityTag from '../components/PersonalityTag';
import type { Profile } from '../data/mockData';

interface RankingProps {
  onSelectProfile: (profile: Profile) => void;
}

function scoreDisplayColor(score: number): string {
  if (score >= 80) return '#fbbf24';
  if (score >= 60) return '#c084fc';
  return 'var(--text-secondary)';
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={20} style={{ color: '#fbbf24' }} />;
  if (rank === 2) return <Medal size={20} style={{ color: '#c0c0c0' }} />;
  if (rank === 3) return <Medal size={20} style={{ color: '#cd7f32' }} />;
  return <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 20, textAlign: 'center' }}>{rank}</span>;
}

function rankBorderColor(rank: number): string {
  if (rank === 1) return '#fbbf24';
  if (rank === 2) return '#c0c0c0';
  if (rank === 3) return '#cd7f32';
  return 'var(--border)';
}

type SortKey = 'score' | 'name';

export default function Ranking({ onSelectProfile }: RankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...MOCK_PROFILES].sort((a, b) => {
    const valA = sortKey === 'score' ? a.allureScore : a.name;
    const valB = sortKey === 'score' ? b.allureScore : b.name;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const hero = sorted[0];
  const rest = sorted.slice(1);

  const cycleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(a => !a);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Ranking</h1>
        <div className="flex gap-2">
          {(['score', 'name'] as SortKey[]).map(k => (
            <button
              key={k}
              onClick={() => cycleSort(k)}
              className="flex items-center gap-1"
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: sortKey === k ? '1px solid #c084fc' : '1px solid var(--border)',
                background: sortKey === k ? '#c084fc' : 'var(--card)',
                color: sortKey === k ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {k === 'score' ? 'Score' : 'Name'}
              {sortKey === k && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero card */}
      {hero && (
        <div
          onClick={() => onSelectProfile(hero)}
          style={{
            borderRadius: 20,
            border: '3px solid #fbbf24',
            overflow: 'hidden',
            marginBottom: 32,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(251,191,36,0.30)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', height: 320 }}>
            <img
              src={hero.photo}
              alt={hero.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.85) 100%)',
            }} />
            {/* Score top-right */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 20,
              fontSize: 48,
              fontWeight: 700,
              color: '#fbbf24',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              {hero.allureScore}
            </div>
            {/* Info bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 16px' }}>
              <div className="flex items-center gap-2 mb-1">
                <Crown size={24} style={{ color: '#fbbf24' }} />
                <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{hero.name}</span>
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 10 }}>
                {hero.age} &bull; {hero.location}
              </p>
              <div className="flex flex-wrap">
                {hero.tags.slice(0, 4).map(t => (
                  <PersonalityTag key={t.label} label={t.label} color={t.color} small />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All rankings list */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>All Rankings</h2>
      <div className="flex flex-col gap-2">
        {sorted.map((profile, i) => {
          const rank = i + 1;
          const borderColor = rankBorderColor(rank);
          return (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="flex items-center gap-3"
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'var(--card)',
                border: `1px solid var(--border)`,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
            >
              {/* Rank */}
              <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RankIcon rank={rank} />
              </div>

              {/* Avatar */}
              <img
                src={profile.photo}
                alt={profile.name}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${borderColor}`,
                  flexShrink: 0,
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{profile.name}, {profile.age}</p>
                <div className="flex flex-wrap" style={{ gap: 0 }}>
                  {profile.tags.slice(0, 3).map(t => (
                    <PersonalityTag key={t.label} label={t.label} color={t.color} small />
                  ))}
                </div>
              </div>

              {/* Score */}
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: scoreDisplayColor(profile.allureScore),
                flexShrink: 0,
                minWidth: 44,
                textAlign: 'right',
              }}>
                {profile.allureScore}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
