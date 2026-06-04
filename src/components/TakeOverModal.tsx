import { X, Lightbulb, Dot } from 'lucide-react';
import { useState } from 'react';
import type { Profile } from '../data/mockData';

interface TakeOverModalProps {
  profile: Profile;
  onClose: () => void;
}

export default function TakeOverModal({ profile, onClose }: TakeOverModalProps) {
  const [insightsMode, setInsightsMode] = useState(false);

  const summaryBullets = [
    `${profile.name} initiated with a direct, confident opener about ${profile.tags[0]?.label.toLowerCase() ?? 'her interests'}.`,
    'Conversation has strong mutual energy — response times under 5 minutes on both sides.',
    `She referenced future plans, signaling openness to meeting.`,
    'Tone is warm, playful, and intellectually engaged.',
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 480,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
              {insightsMode ? 'Profile Insights' : 'Take Over'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{profile.name}, {profile.age}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Insights toggle */}
            <button
              onClick={() => setInsightsMode(m => !m)}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: insightsMode ? '#c084fc' : 'rgba(192,132,252,0.09)',
                color: insightsMode ? '#fff' : '#c084fc',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Lightbulb size={17} />
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(161,161,161,0.1)',
                color: 'var(--text-secondary)', border: 'none', cursor: 'pointer',
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {insightsMode ? (
            <div style={{ paddingBottom: 8 }}>
              {/* Conversation Summary */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Conversation Summary</h3>
              <ul style={{ marginBottom: 20, paddingLeft: 0, listStyle: 'none' }}>
                {summaryBullets.map((b, i) => (
                  <li key={i} className="flex gap-2" style={{ marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: '#c084fc', marginTop: 2, flexShrink: 0 }}><Dot size={16} /></span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Personality Read */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Personality Read</h3>
              <div className="flex flex-col gap-2" style={{ marginBottom: 20 }}>
                {profile.tags.map(tag => (
                  <div key={tag.label} style={{
                    background: 'rgba(192,132,252,0.07)',
                    borderRadius: 10,
                    padding: '10px 12px',
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#c084fc', marginBottom: 3 }}>{tag.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Strong signals of {tag.label.toLowerCase()} personality — shows up in word choice, response pace, and topic selection.
                    </p>
                  </div>
                ))}
              </div>

              {/* Engagement Note */}
              <div style={{
                border: '1px solid rgba(192,132,252,0.4)',
                background: 'rgba(192,132,252,0.05)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 8,
              }}>
                <span style={{ color: '#c084fc', flexShrink: 0, marginTop: 2 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Engagement score trending upward. {profile.name} is showing increasing investment. High likelihood of meeting conversion if momentum maintained.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ paddingBottom: 8 }}>
              {/* Chat bubbles */}
              <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                {profile.conversation.map((msg, i) => {
                  const isHer = msg.role === 'her';
                  const prevRole = i > 0 ? profile.conversation[i - 1].role : null;
                  const showLabel = prevRole !== msg.role;
                  return (
                    <div key={i} style={{ marginBottom: 8 }}>
                      {showLabel && (
                        <p style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 4,
                          marginLeft: isHer ? 0 : 'auto',
                          textAlign: isHer ? 'left' : 'right',
                        }}>
                          {isHer ? 'Her' : 'You'}
                        </p>
                      )}
                      <div style={{ display: 'flex', justifyContent: isHer ? 'flex-start' : 'flex-end' }}>
                        <div style={{
                          maxWidth: '78%',
                          padding: '9px 14px',
                          borderRadius: 18,
                          borderBottomLeftRadius: isHer ? 4 : 18,
                          borderBottomRightRadius: isHer ? 18 : 4,
                          background: isHer ? 'var(--bubble-her, #3a3a3a)' : '#c084fc',
                          color: isHer ? 'var(--text)' : '#fff',
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ padding: '16px 20px 20px', display: 'flex', gap: 12, flexShrink: 0, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px 0',
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              border: '2px solid #c084fc', background: 'transparent',
              color: '#c084fc', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            style={{
              flex: 1, padding: '14px 0',
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              border: '2px solid #c084fc', background: '#c084fc',
              color: '#fff', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#d4a0ff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#c084fc')}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
