import { ArrowLeft, Ruler, Star, GraduationCap, Briefcase, Wine, Cigarette, Dumbbell, Dog, Heart, Baby, Home, MessageSquare } from 'lucide-react';
import type { Profile } from '../data/mockData';
import { levelColor } from '../data/mockData';
import PersonalityTag from '../components/PersonalityTag';
import ScoreBadge from '../components/ScoreBadge';

interface ProfileDetailProps {
  profile: Profile;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ruler: Ruler,
  star: Star,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
  wine: Wine,
  'cigarette-off': Cigarette,
  dumbbell: Dumbbell,
  dog: Dog,
  cat: Dog,
  heart: Heart,
  baby: Baby,
  home: Home,
};

function DetailRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  const Icon = ICON_MAP[icon] ?? Star;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 0',
        borderBottom: last ? 'none' : '1px solid var(--border)',
      }}
    >
      <Icon size={17} style={{ color: '#c084fc', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 20, marginBottom: 4 }}>{title}</p>
  );
}

export default function ProfileDetail({ profile, onBack }: ProfileDetailProps) {
  const color = levelColor[profile.prospectiveLevel];

  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 20,
          padding: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c084fc')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Two-column layout */}
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 24 }}>
        {/* Photo */}
        <div style={{ position: 'relative' }}>
          <img
            src={profile.photo}
            alt={profile.name}
            style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 16, display: 'block' }}
          />
        </div>

        {/* Identity card */}
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20 }}>
          {/* Name + level */}
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</span>
            <span style={{
              background: `${color}38`,
              border: `1.5px solid ${color}`,
              borderRadius: 9999,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {profile.prospectiveLevel} &nbsp; {profile.prospectiveScore}
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            {profile.age} &bull; {profile.location}
          </p>

          {/* Score row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div style={{ background: 'rgba(251,191,36,0.08)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24', marginBottom: 2 }}>{profile.allureScore}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allure</p>
            </div>
            <div style={{ background: 'rgba(192,132,252,0.08)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#c084fc', marginBottom: 2 }}>{profile.prospectiveScore}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prospective</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap" style={{ marginBottom: 16 }}>
            {profile.tags.map(t => (
              <PersonalityTag key={t.label} label={t.label} color={t.color} />
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 4 }} />

          {/* About */}
          <SectionTitle title="About" />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>{profile.about}</p>

          {/* Vitals */}
          <SectionTitle title="Vitals" />
          {profile.vitals.map((v, i) => (
            <DetailRow key={v.label} icon={v.icon} label={v.label} value={v.value} last={i === profile.vitals.length - 1} />
          ))}

          {/* Life */}
          <SectionTitle title="Life" />
          {profile.life.map((v, i) => (
            <DetailRow key={v.label} icon={v.icon} label={v.label} value={v.value} last={i === profile.life.length - 1} />
          ))}

          {/* Relationship Goals */}
          <SectionTitle title="Relationship Goals" />
          {profile.relationshipGoals.map((v, i) => (
            <DetailRow key={v.label} icon={v.icon} label={v.label} value={v.value} last={i === profile.relationshipGoals.length - 1} />
          ))}
        </div>
      </div>

      {/* Conversation history */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
        <div className="flex items-center gap-3 mb-20" style={{ marginBottom: 20 }}>
          <MessageSquare size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Conversation</h2>
          <span style={{
            background: 'rgba(192,132,252,0.15)',
            color: '#c084fc',
            borderRadius: 9999,
            padding: '2px 10px',
            fontSize: 12,
            fontWeight: 700,
          }}>
            {profile.conversation.length}
          </span>
        </div>

        <div style={{ maxWidth: 680 }}>
          {profile.conversation.map((msg, i) => {
            const isHer = msg.role === 'her';
            const prevRole = i > 0 ? profile.conversation[i - 1].role : null;
            const showLabel = prevRole !== msg.role;
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                {showLabel && (
                  <p style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 5,
                    textAlign: isHer ? 'left' : 'right',
                  }}>
                    {isHer ? `Her — ${msg.timestamp}` : `You — ${msg.timestamp}`}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: isHer ? 'flex-start' : 'flex-end' }}>
                  <div style={{
                    maxWidth: '78%',
                    padding: '10px 15px',
                    borderRadius: 18,
                    borderBottomLeftRadius: isHer ? 4 : 18,
                    borderBottomRightRadius: isHer ? 18 : 4,
                    background: isHer ? 'var(--border)' : '#c084fc',
                    color: isHer ? 'var(--text)' : '#fff',
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
