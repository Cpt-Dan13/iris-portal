import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import type { ProspectiveLevel } from '../types';
import { levelColor } from '../types';
import ScoreBadge from '../components/ScoreBadge';
import { useMatchedProfiles } from '../hooks/useMatchedProfiles';
import type { MatchedProfile } from '../hooks/useMatchedProfiles';
import MatchedProfileDetail from './MatchedProfileDetail';
import MatchedInsightsModal from '../components/MatchedInsightsModal';
import { Lightbulb } from 'lucide-react';

type Tab = 'prospective' | 'matches';
type ConversationStatus = 'active' | 'ghosted' | 'archived';

const LEVELS: ProspectiveLevel[] = ['HIGH', 'MODERATE', 'LOW'];
const STATUS_GROUPS: ConversationStatus[] = ['active', 'ghosted', 'archived'];

const STATUS_COLOR: Record<ConversationStatus, string> = {
  active: '#22c55e',
  ghosted: '#a1a1a1',
  archived: '#f97316',
};

const STATUS_LABEL: Record<ConversationStatus, string> = {
  active: 'Active',
  ghosted: 'Ghosted',
  archived: 'Archived',
};

function ProspectiveCard({
  profile,
  borderColor,
  onSelect,
  onInsights,
}: {
  profile: MatchedProfile;
  borderColor: string;
  onSelect: () => void;
  onInsights: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--card)', borderRadius: 16,
        border: `2px solid ${borderColor}`, overflow: 'hidden',
        boxShadow: `0 4px 8px ${borderColor}26`,
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px ${borderColor}33`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 8px ${borderColor}26`;
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onSelect}>
        {profile.photo ? (
          <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: 200, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 40, color: '#444' }}>?</span>
          </div>
        )}
        {profile.prospectiveLevel && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: `${borderColor}38`, border: `1.5px solid ${borderColor}`,
            borderRadius: 20, padding: '4px 10px',
            display: 'flex', alignItems: 'baseline', gap: 5,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: borderColor, textTransform: 'uppercase' }}>{profile.prospectiveLevel}</span>
            {profile.prospectiveScore != null && (
              <span style={{ fontSize: 17, fontWeight: 700, color: borderColor }}>{profile.prospectiveScore}</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div className="flex items-center justify-between mb-1" style={{ cursor: 'pointer' }} onClick={onSelect}>
          <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</span>
          <ScoreBadge score={profile.allureScore} size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          {[profile.age, profile.location].filter(Boolean).join(' • ')}
        </p>
        {profile.personalityTags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 4, marginBottom: 8 }}>
            {profile.personalityTags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                background: 'rgba(192,132,252,0.12)', color: '#c084fc',
                border: '1px solid rgba(192,132,252,0.3)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {profile.bio && (
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {profile.bio}
          </p>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onInsights(); }}
            title="Insights"
            style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: 8,
              background: 'rgba(192,132,252,0.09)', color: '#c084fc',
              border: '1px solid rgba(192,132,252,0.3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.09)')}
          >
            <Lightbulb size={17} />
          </button>
          <button
            type="button"
            onClick={onSelect}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              background: '#22c55e', color: '#fff',
              fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#16a34a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#22c55e')}
          >
            Take Over
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  profile,
  borderColor,
  onSelect,
}: {
  profile: MatchedProfile;
  borderColor: string;
  onSelect: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--card)', borderRadius: 16,
        border: `2px solid ${borderColor}`, overflow: 'hidden',
        boxShadow: `0 4px 8px ${borderColor}26`,
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
      onClick={onSelect}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px ${borderColor}33`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 8px ${borderColor}26`;
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative' }}>
        {profile.photo ? (
          <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: 200, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 40, color: '#444' }}>?</span>
          </div>
        )}
        {/* Matched date gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 12px 8px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            Matched {new Date(profile.matchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
          {[profile.age, profile.location].filter(Boolean).join(' • ')}
        </p>
        {profile.bio && (
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            marginBottom: 14,
          }}>
            {profile.bio}
          </p>
        )}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${borderColor}18`, border: `1px solid ${borderColor}55`,
          borderRadius: 20, padding: '5px 12px',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: borderColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: borderColor }}>
            {STATUS_LABEL[profile.conversationStatus]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Prospective() {
  const [tab, setTab] = useState<Tab>('prospective');
  const [selectedProfile, setSelectedProfile] = useState<MatchedProfile | null>(null);
  const [insightsProfile, setInsightsProfile] = useState<MatchedProfile | null>(null);
  const { profiles, loading } = useMatchedProfiles();

  if (selectedProfile) {
    return <MatchedProfileDetail profile={selectedProfile} onBack={() => setSelectedProfile(null)} />;
  }

  const grouped = LEVELS.reduce<Record<ProspectiveLevel, MatchedProfile[]>>((acc, lvl) => {
    acc[lvl] = profiles
      .filter(p => p.prospectiveLevel === lvl)
      .sort((a, b) => (b.prospectiveScore ?? 0) - (a.prospectiveScore ?? 0));
    return acc;
  }, { HIGH: [], MODERATE: [], LOW: [] });

  const pieData = LEVELS.map(lvl => ({ name: lvl, value: grouped[lvl].length, color: levelColor[lvl] }));

  const matchesByStatus = STATUS_GROUPS.reduce<Record<ConversationStatus, MatchedProfile[]>>((acc, s) => {
    acc[s] = profiles.filter(p => p.conversationStatus === s);
    return acc;
  }, { active: [], ghosted: [], archived: [] });

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Prospective</h1>

      {/* Tab switcher */}
      <div style={{
        display: 'inline-flex', background: 'var(--card)',
        borderRadius: 12, padding: 4, marginBottom: 28,
        border: '1px solid var(--border)',
      }}>
        {(['prospective', 'matches'] as Tab[]).map(t => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 22px', borderRadius: 9, border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
              background: tab === t ? '#c084fc' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-secondary)',
              textTransform: 'capitalize',
            }}
          >
            {t === 'matches'
              ? `Matches${profiles.length > 0 ? ` (${profiles.length})` : ''}`
              : 'Prospective'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '60px 0', fontSize: 14 }}>
          Loading...
        </div>
      ) : (
        <>
          {/* ── Prospective Tab ── */}
          {tab === 'prospective' && (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 560, lineHeight: 1.6 }}>
                Matched profiles ranked by prospective score across HIGH, MODERATE, and LOW tiers.
              </p>

              {profiles.length === 0 ? (
                <div style={{ background: 'var(--card)', borderRadius: 16, padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                  No matched profiles yet.
                </div>
              ) : (
                <>
                  {LEVELS.map(lvl => {
                    const color = levelColor[lvl];
                    const group = grouped[lvl];
                    if (!group.length) return null;

                    return (
                      <div key={lvl} style={{ marginBottom: 32 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 16px', background: `${color}1f`,
                          borderLeft: `4px solid ${color}`, borderRadius: 12, marginBottom: 16,
                        }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: '1px' }}>{lvl}</span>
                          <span style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700,
                          }}>
                            {group.length}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                          {group.map(profile => (
                            <ProspectiveCard
                              key={profile.id}
                              profile={profile}
                              borderColor={color}
                              onSelect={() => setSelectedProfile(profile)}
                              onInsights={() => setInsightsProfile(profile)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Distribution Analysis */}
                  <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginTop: 8 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Distribution Analysis</h2>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }}
                          formatter={(val: number) => [`${val} profiles`, '']}
                        />
                        <Legend formatter={(value) => (
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{value}</span>
                        )} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Matches Tab ── */}
          {tab === 'matches' && (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 560, lineHeight: 1.6 }}>
                Track conversation status across active, ghosted, and archived matches.
              </p>

              {profiles.length === 0 ? (
                <div style={{ background: 'var(--card)', borderRadius: 16, padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                  No matches yet. Keep the automation running!
                </div>
              ) : (
                STATUS_GROUPS.map(status => {
                  const group = matchesByStatus[status];
                  if (!group.length) return null;
                  const color = STATUS_COLOR[status];

                  return (
                    <div key={status} style={{ marginBottom: 32 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', background: `${color}1f`,
                        borderLeft: `4px solid ${color}`, borderRadius: 12, marginBottom: 16,
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: '1px' }}>
                          {STATUS_LABEL[status].toUpperCase()}
                        </span>
                        <span style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: color, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700,
                        }}>
                          {group.length}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                        {group.map(profile => (
                          <MatchCard
                            key={profile.id}
                            profile={profile}
                            borderColor={color}
                            onSelect={() => setSelectedProfile(profile)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </>
      )}

      {insightsProfile && (
        <MatchedInsightsModal
          profile={insightsProfile}
          onClose={() => setInsightsProfile(null)}
        />
      )}
    </div>
  );
}
