import { useState } from 'react';
import { User, Mail, Phone, Shield, Cpu, LogOut, Edit3, ChevronRight, Check, X, Link2, Pencil, UserPlus, CheckCircle } from 'lucide-react';

const AVATARS: { key: string; url: string; label: string }[] = [
  { key: 'avatar-001', label: 'Phantom', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=phantom' },
  { key: 'avatar-002', label: 'Spectre', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=spectre' },
  { key: 'avatar-003', label: 'Nexus',   url: 'https://api.dicebear.com/9.x/bottts/svg?seed=nexus'   },
];

function resolveAvatar(photo: string | null | undefined, fallbackName: string): string {
  if (!photo) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=c084fc&color=fff&size=100`;
  const match = AVATARS.find(a => a.key === photo);
  return match ? match.url : photo;
}
import { useIrisUser } from '../hooks/useIrisUser';
import { useAuth } from '../context/AuthContext';
import type { Screen } from '../components/Sidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldModal = {
  kind: 'field';
  label: string;
  inputType: string;
  currentValue: string;
  onSave: (v: string) => Promise<string | null>;
};

type PasswordModal = { kind: 'password' };

type ModalState = FieldModal | PasswordModal | null;

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ state, onClose, updatePassword }: {
  state: ModalState;
  onClose: () => void;
  updatePassword: (p: string) => Promise<{ error: string | null }>;
}) {
  const [value, setValue] = useState(state?.kind === 'field' ? state.currentValue : '');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!state) return null;

  const handleSave = async () => {
    setErr(null);
    if (state.kind === 'field') {
      if (value === state.currentValue) { onClose(); return; }
      setSaving(true);
      const error = await state.onSave(value);
      setSaving(false);
      if (error) setErr(error);
      else onClose();
    } else {
      if (value.length < 6) { setErr('Password must be at least 6 characters.'); return; }
      if (value !== confirm) { setErr('Passwords do not match.'); return; }
      setSaving(true);
      const { error } = await updatePassword(value);
      setSaving(false);
      if (error) setErr(error);
      else onClose();
    }
  };

  const title = state.kind === 'field' ? `Edit ${state.label}` : 'Change Password';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
        style={{
          background: 'var(--card)', borderRadius: 20,
          padding: '32px 28px', width: '100%', maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: 4, borderRadius: 8,
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Field input */}
        {state.kind === 'field' && (
          <input
            type={state.inputType}
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
            placeholder={state.label}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: `1.5px solid ${err ? '#ef4444' : '#c084fc'}`,
              background: 'var(--bg)', color: 'var(--text)', fontSize: 15,
              outline: 'none', boxSizing: 'border-box', marginBottom: 16,
            }}
          />
        )}

        {/* Password inputs */}
        {state.kind === 'password' && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
              onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${err ? '#ef4444' : 'var(--border)'}`,
                background: 'var(--bg)', color: 'var(--text)', fontSize: 15,
                outline: 'none', boxSizing: 'border-box', marginBottom: 12,
              }}
              onFocus={e => (e.target.style.borderColor = err ? '#ef4444' : '#c084fc')}
              onBlur={e => (e.target.style.borderColor = err ? '#ef4444' : 'var(--border)')}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${err ? '#ef4444' : 'var(--border)'}`,
                background: 'var(--bg)', color: 'var(--text)', fontSize: 15,
                outline: 'none', boxSizing: 'border-box', marginBottom: 16,
              }}
              onFocus={e => (e.target.style.borderColor = err ? '#ef4444' : '#c084fc')}
              onBlur={e => (e.target.style.borderColor = err ? '#ef4444' : 'var(--border)')}
            />
          </>
        )}

        {err && (
          <p style={{ fontSize: 13, color: '#ef4444', marginBottom: 16, marginTop: -8 }}>{err}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px', borderRadius: 12, border: 'none',
              background: '#c084fc', color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <Check size={15} /> {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: 12,
              border: '1.5px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Avatar Picker Modal ──────────────────────────────────────────────────────

function AvatarPickerModal({ current, onSelect, onClose }: {
  current: string | null;
  onSelect: (key: string) => Promise<void>;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);

  const handleSelect = async (key: string) => {
    if (key === current) { onClose(); return; }
    setSaving(key);
    await onSelect(key);
    setSaving(null);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', borderRadius: 20,
          padding: '28px 28px 24px', width: '100%', maxWidth: 380,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Choose Avatar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {AVATARS.map(({ key, url, label }) => {
            const isSelected = current === key;
            const isSaving  = saving === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(key)}
                disabled={saving !== null}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: saving ? 'wait' : 'pointer',
                  padding: 0, opacity: saving && !isSaving ? 0.5 : 1,
                }}
              >
                <div style={{
                  position: 'relative',
                  width: 80, height: 80, borderRadius: '50%',
                  border: `3px solid ${isSelected ? '#c084fc' : 'var(--border)'}`,
                  padding: 3, transition: 'border-color 0.15s',
                  boxShadow: isSelected ? '0 0 0 2px rgba(192,132,252,0.3)' : 'none',
                }}>
                  <img
                    src={url}
                    alt={label}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', background: 'var(--bg)' }}
                  />
                  {isSelected && (
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      background: '#c084fc', borderRadius: '50%',
                      width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--card)',
                    }}>
                      <CheckCircle size={12} style={{ color: '#fff' }} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#c084fc' : 'var(--text-secondary)' }}>
                  {isSaving ? '…' : label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Row components ───────────────────────────────────────────────────────────

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

function EditableRow({ icon: Icon, label, value, last = false, onClick }: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3"
      onClick={onClick}
      style={{
        padding: '13px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.1s',
        borderRadius: last ? '0 0 12px 12px' : undefined,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>{value || '—'}</span>
      <Pencil size={13} style={{ color: 'var(--text-secondary)', opacity: 0.5, flexShrink: 0 }} />
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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function UserProfile({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { user, signOut } = useAuth();
  const { irisUser, updateUser, updatePassword } = useIrisUser();
  const [modal, setModal] = useState<ModalState>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const displayName = irisUser?.name ?? 'IRIS';
  const avatarSrc = resolveAvatar(irisUser?.primary_photo, displayName);

  const openField = (label: string, inputType: string, currentValue: string, field: 'name' | 'email' | 'phone') =>
    setModal({
      kind: 'field', label, inputType, currentValue,
      onSave: async (v) => {
        const { error } = await updateUser({ [field]: v });
        return error;
      },
    });

  return (
    <>
      <EditModal state={modal} onClose={() => setModal(null)} updatePassword={updatePassword} />
      {avatarPickerOpen && (
        <AvatarPickerModal
          current={irisUser?.primary_photo ?? null}
          onSelect={async (key) => { await updateUser({ primary_photo: key }); }}
          onClose={() => setAvatarPickerOpen(false)}
        />
      )}

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
            <button
              type="button"
              aria-label="Change avatar"
              onClick={() => setAvatarPickerOpen(true)}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: '50%',
                background: '#c084fc', border: '2px solid var(--card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Edit3 size={12} style={{ color: '#fff' }} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {displayName}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email ?? '—'}</p>
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
          <EditableRow icon={User}   label="Name"     value={irisUser?.name ?? ''}  onClick={() => openField('Name',  'text',  irisUser?.name  ?? '', 'name')} />
          <EditableRow icon={Mail}   label="Email"    value={irisUser?.email ?? ''} onClick={() => openField('Email', 'email', irisUser?.email ?? '', 'email')} />
          <EditableRow icon={Phone}  label="Phone"    value={irisUser?.phone ?? ''} onClick={() => openField('Phone', 'tel',   irisUser?.phone ?? '', 'phone')} />
          <EditableRow icon={Shield} label="Password" value="••••••••" last onClick={() => setModal({ kind: 'password' })} />
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

        {/* Admin */}
        <SectionTitle title="Admin" />
        <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden' }}>
          <StaticRow icon={UserPlus} label="Register New User" value="" last onClick={() => onNavigate('register')} />
        </div>

        {/* Sign out */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => signOut()}
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
    </>
  );
}
