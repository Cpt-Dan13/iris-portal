import { User, Mail, Phone, Shield, Cpu, LogOut, Edit3, ChevronRight } from 'lucide-react';
import { useIrisUser } from '../hooks/useIrisUser';
import { useAuth } from '../context/AuthContext';

function SectionTitle({ title }: { title: string }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      marginBottom: 12, marginTop: 24,
    }}>
      {title}
    </p>
  );
}

function SettingRow({ icon: Icon, label, value, last = false }: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '13px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'background 0.1s',
        borderRadius: last ? '0 0 12px 12px' : undefined,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>{value}</span>
      <ChevronRight size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
    </div>
  );
}

export default function UserProfile() {
  const { user } = useAuth();
  const { irisUser } = useIrisUser();

  const avatarSrc = irisUser?.primary_photo ?? 'https://ui-avatars.com/api/?name=IRIS&background=c084fc&color=fff&size=100';
  const authEmail = user?.email ?? '—';

  return (
    <div style={{ padding: '32px 24px', maxWidth: 620, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>Profile</h1>

      {/* Avatar + identity */}
      <div style={{
        background: 'var(--card)', borderRadius: 16, padding: 24,
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={avatarSrc}
            alt="avatar"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #c084fc' }}
          />
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 26, height: 26, borderRadius: '50%',
            background: '#c084fc', border: '2px solid var(--card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Edit3 size={12} style={{ color: '#fff' }} />
          </button>
        </div>
        <div>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Phantom
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {authEmail}
          </p>
          <span style={{
            display: 'inline-block', marginTop: 8,
            fontSize: 11, fontWeight: 700,
            color: '#22c55e', background: 'rgba(34,197,94,0.10)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 6, padding: '2px 8px',
          }}>
            Active
          </span>
        </div>
      </div>

      {/* Account */}
      <SectionTitle title="Account" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <SettingRow icon={User}  label="Full Name"  value="Phantom Menace" />
        <SettingRow icon={Mail}  label="Email"      value={authEmail} />
        <SettingRow icon={Phone} label="Phone"      value={irisUser?.phone ?? '—'} />
        <SettingRow icon={Shield} label="Password"  value="••••••••" last />
      </div>

      {/* Instance */}
      <SectionTitle title="IRIS Instance" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <SettingRow icon={Cpu} label="Emulator"      value="user_01" />
        <SettingRow icon={Cpu} label="Hinge Account" value="Connected" last />
      </div>

      {/* Persona */}
      <SectionTitle title="Persona" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <SettingRow icon={User} label="Style"  value="—" />
        <SettingRow icon={User} label="Voice"  value="—" />
        <SettingRow icon={User} label="Typing" value="—" last />
      </div>

      {/* Sign out */}
      <div style={{ marginTop: 32 }}>
        <button
          style={{
            width: '100%', padding: '14px',
            borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.06)',
            color: '#ef4444', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
