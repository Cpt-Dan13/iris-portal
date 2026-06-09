import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MatchedProfile } from '../hooks/useMatchedProfiles';
import { levelColor } from '../types';
import { supabase } from '../lib/supabase';

interface ConversationMessage {
  role: string;
  content: string;
}

const STATUS_COLOR: Record<string, string> = {
  active: '#22c55e',
  ghosted: '#a1a1a1',
  archived: '#f97316',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  ghosted: 'Ghosted',
  archived: 'Archived',
};

interface Props {
  profile: MatchedProfile;
  onBack: () => void;
}

export default function MatchedProfileDetail({ profile, onBack }: Props) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);

  useEffect(() => {
    async function fetchConversation() {
      const { data } = await supabase
        .from('conversations')
        .select('messages')
        .eq('matched_profile_id', profile.id)
        .single();
      setMessages(data?.messages ?? []);
      setLoadingConv(false);
    }
    fetchConversation();
  }, [profile.id]);

  const levelCol = profile.prospectiveLevel ? levelColor[profile.prospectiveLevel] : '#c084fc';
  const statusColor = STATUS_COLOR[profile.conversationStatus];

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600,
          marginBottom: 20, padding: 0, transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c084fc')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero card */}
      <div style={{
        background: 'var(--card)', borderRadius: 16,
        overflow: 'hidden', display: 'flex', marginBottom: 20, minHeight: 400,
      }}>
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.name}
            style={{ width: '40%', minWidth: 220, objectFit: 'cover', display: 'block', flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: '40%', minWidth: 220, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 60, color: '#444' }}>?</span>
          </div>
        )}

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {/* Name + prospective level */}
          <div className="flex items-start justify-between" style={{ marginBottom: 4, gap: 12 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</span>
            {profile.prospectiveLevel && (
              <span style={{
                background: `${levelCol}38`, border: `1.5px solid ${levelCol}`,
                borderRadius: 9999, padding: '4px 12px',
                fontSize: 11, fontWeight: 700, color: levelCol,
                textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
              }}>
                {profile.prospectiveLevel} &nbsp; {profile.prospectiveScore}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            {[profile.age, profile.location].filter(Boolean).join(' • ')}
          </p>

          {/* Score row */}
          <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 16 }}>
            <div style={{ background: 'rgba(251,191,36,0.08)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24', marginBottom: 2 }}>{profile.allureScore ?? '—'}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allure</p>
            </div>
            <div style={{ background: 'rgba(192,132,252,0.08)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#c084fc', marginBottom: 2 }}>{profile.prospectiveScore ?? '—'}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prospective</p>
            </div>
          </div>

          {/* Personality tags */}
          {profile.personalityTags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 16 }}>
              {profile.personalityTags.map(tag => (
                <span key={tag} style={{
                  fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(192,132,252,0.12)', color: '#c084fc',
                  border: '1px solid rgba(192,132,252,0.3)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

          {/* Status + matched date */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Status</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `${statusColor}18`, border: `1px solid ${statusColor}55`,
                borderRadius: 20, padding: '5px 12px',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{STATUS_LABEL[profile.conversationStatus]}</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Matched</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {new Date(profile.matchedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>About</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.bio ?? '—'}</p>
        </div>
      </div>

      {/* Conversation history */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <MessageSquare size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Conversation</h2>
          <span style={{
            background: 'rgba(192,132,252,0.15)', color: '#c084fc',
            borderRadius: 9999, padding: '2px 10px', fontSize: 12, fontWeight: 700,
          }}>
            {messages.length}
          </span>
        </div>

        {loadingConv ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No conversation recorded yet.</p>
        ) : (
          <div style={{ maxWidth: 680 }}>
            {messages.map((msg, i) => {
              const isHer = msg.role === 'user';
              const prevRole = i > 0 ? messages[i - 1].role : null;
              const showLabel = prevRole !== msg.role;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  {showLabel && (
                    <p style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      marginBottom: 5, textAlign: isHer ? 'left' : 'right',
                    }}>
                      {isHer ? 'Her' : 'You'}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: isHer ? 'flex-start' : 'flex-end' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 15px', borderRadius: 18,
                      borderBottomLeftRadius: isHer ? 4 : 18,
                      borderBottomRightRadius: isHer ? 18 : 4,
                      background: isHer ? 'var(--border)' : '#c084fc',
                      color: isHer ? 'var(--text)' : '#fff',
                      fontSize: 14, lineHeight: 1.55,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
