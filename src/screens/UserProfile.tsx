import { useState } from 'react';
import { User, Mail, Phone, Shield, Cpu, LogOut, Edit3, ChevronRight, Check, X, Link2, Pencil } from 'lucide-react';
import { useIrisUser } from '../hooks/useIrisUser';
import { useAuth } from '../context/AuthContext';
import type { Screen } from '../components/Sidebar';

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

function EditableRow({ icon: Icon, label, value, last = false, onSave, inputType = 'text' }: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
  onSave: (val: string) => Promise<string | null>;
  inputType?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    setErr(null);
    const error = await onSave(draft);
    setSaving(false);
    if (error) { setErr(error); } else { setEditing(false); }
  };

  const handleCancel = () => { setDraft(value); setEditing(false); setErr(null); };

  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      {!editing ? (
        <div
          className="flex items-center gap-3"
          onClick={() => { setDraft(value); setEditing(true); }}
          style={{
            padding: '13px 16px', cursor: 'pointer', transition: 'background 0.1s',
            borderRadius: last ? '0 0 12px 12px' : undefined,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>{value || '—'}</span>
          <Pencil size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0, opacity: 0.5 }} />
        </div>
      ) : (
        <div style={{ padding: '12px 16px', borderRadius: last ? '0 0 12px 12px' : undefined }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <Icon size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
          </div>
          <input
            type={inputType}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: `1.5px solid ${err ? '#ef4444' : '#c084fc'}`,
              background: 'var(--bg)', color: 'var(--text)', fontSize: 14,
              outline: 'none', boxSizing: 'border-box', marginBottom: 8,
            }}
          />
          {err && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#c084fc', color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              }}
            >
              <Check size={13} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordRow({ last = false }: { last?: boolean }) {
  const { updatePassword } = useIrisUser();
  const [editing, setEditing] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSave = async () => {
    if (newPass.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    if (newPass !== confirm) { setErr('Passwords do not match.'); return; }
    setSaving(true); setErr(null);
    const { error } = await updatePassword(newPass);
    setSaving(false);
    if (error) { setErr(error); } else { setEditing(false); setNewPass(''); setConfirm(''); }
  };

  const handleCancel = () => { setEditing(false); setNewPass(''); setConfirm(''); setErr(null); };

  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      {!editing ? (
        <div
          className="flex items-center gap-3"
          onClick={() => setEditing(true)}
          style={{
            padding: '13px 16px', cursor: 'pointer', transition: 'background 0.1s',
            borderRadius: last ? '0 0 12px 12px' : undefined,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Shield size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Password</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>••••••••</span>
          <Pencil size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0, opacity: 0.5 }} />
        </div>
      ) : (
        <div style={{ padding: '12px 16px', borderRadius: last ? '0 0 12px 12px' : undefined }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <Shield size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>New Password</span>
          </div>
          {(['New password', 'Confirm password'] as const).map((placeholder, i) => (
            <input
              key={i}
              type="password"
              placeholder={placeholder}
              value={i === 0 ? newPass : confirm}
              onChange={e => i === 0 ? setNewPass(e.target.value) : setConfirm(e.target.value)}
              autoFocus={i === 0}
              onKeyDown={e => { if (e.key === 'Escape') handleCancel(); }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: `1.5px solid ${err ? '#ef4444' : 'var(--border)'}`,
                background: 'var(--bg)', color: 'var(--text)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box', marginBottom: 8,
              }}
              onFocus={e => (e.target.style.borderColor = err ? '#ef4444' : '#c084fc')}
              onBlur={e => (e.target.style.borderColor = err ? '#ef4444' : 'var(--border)')}
            />
          ))}
          {err && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#c084fc', color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              }}
            >
              <Check size={13} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StaticRow({ icon: Icon, label, value, last = false, onClick }: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3"
      onClick={onClick}
      style={{
        padding: '13px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.1s',
        borderRadius: last ? '0 0 12px 12px' : undefined,
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'rgba(192,132,252,0.04)'; }}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>{value}</span>
      {onClick && <ChevronRight size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />}
    </div>
  );
}

export default function UserProfile({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { user } = useAuth();
  const { irisUser, updateUser } = useIrisUser();

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
            {irisUser?.name ?? 'Phantom'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{authEmail}</p>
          <span style={{
            display: 'inline-block', marginTop: 8,
            fontSize: 11, fontWeight: 700,
            color: '#22c55e', background: 'rgba(34,197,94,0.10)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 6, padding: '2px 8px',
          }}>Active</span>
        </div>
      </div>

      {/* Account */}
      <SectionTitle title="Account" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <EditableRow icon={User}  label="Name"  value={irisUser?.name ?? ''} onSave={v => updateUser({ name: v }).then(r => r.error)} />
        <EditableRow icon={Mail}  label="Email" value={irisUser?.email ?? ''} onSave={v => updateUser({ email: v }).then(r => r.error)} inputType="email" />
        <EditableRow icon={Phone} label="Phone" value={irisUser?.phone ?? ''} onSave={v => updateUser({ phone: v }).then(r => r.error)} inputType="tel" />
        <PasswordRow last />
      </div>

      {/* Instance */}
      <SectionTitle title="IRIS Instance" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <StaticRow icon={Cpu}   label="Emulator"      value="user_01" />
        <StaticRow icon={Link2} label="Hinge Account" value="Connected" last onClick={() => onNavigate('setup')} />
      </div>

      {/* Persona */}
      <SectionTitle title="Persona" />
      <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
        <StaticRow icon={User} label="Style"  value="—" />
        <StaticRow icon={User} label="Voice"  value="—" />
        <StaticRow icon={User} label="Typing" value="—" last />
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
