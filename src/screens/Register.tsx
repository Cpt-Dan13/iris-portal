import { useState } from 'react';
import { Sparkles, ChevronLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Props {
  onBack: () => void;
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

function Field({ label, type = 'text', value, onChange, placeholder, required = false }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        color: 'var(--text-secondary)', textTransform: 'uppercase',
        letterSpacing: '0.5px', marginBottom: 8,
      }}>
        {label}{!required && <span style={{ fontWeight: 400, marginLeft: 6, opacity: 0.6 }}>optional</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={INPUT_STYLE}
        onFocus={e => (e.currentTarget.style.borderColor = '#c084fc')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  );
}

export default function Register({ onBack }: Props) {
  const { signOut } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [field]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpErr) { setError(signUpErr.message); setLoading(false); return; }

    const userId = data.user?.id;
    if (userId) {
      const { error: insertErr } = await supabase.from('users').insert({
        user_id: userId,
        name: form.name || null,
        email: form.email,
        phone: form.phone || null,
      });
      if (insertErr) { setError(insertErr.message); setLoading(false); return; }
    }

    setCreated(form.email);
    setLoading(false);
  }

  const backBtn = (
    <button
      type="button"
      onClick={onBack}
      aria-label="Go back"
      style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 44, height: 44, borderRadius: '50%',
        background: 'none', border: 'none',
        cursor: 'pointer', transition: 'color 0.15s',
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#c084fc'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      <ChevronLeft size={24} />
    </button>
  );

  if (created) {
    return (
      <div style={{
        position: 'relative', minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        {backBtn}
        <div style={{
          background: 'var(--card)', borderRadius: 20, padding: '48px 36px',
          width: '100%', maxWidth: 400, textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}>
          <CheckCircle size={52} style={{ color: '#22c55e', marginBottom: 20 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            Account Created
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>{created}</strong> is ready to log in.
            <br />You'll be signed back out to the login screen.
          </p>
          <button
            onClick={() => signOut()}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: '#c084fc', color: '#fff', fontSize: 15,
              fontWeight: 700, cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {backBtn}
      <div style={{
        background: 'var(--card)', borderRadius: 20, padding: '40px 36px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <Sparkles size={22} style={{ color: '#c084fc' }} />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
              Register New User
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Creates a new IRIS account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Name"     value={form.name}     onChange={set('name')}     placeholder="John Doe" />
          <Field label="Email"    value={form.email}    onChange={set('email')}    placeholder="user@email.com" type="email"    required />
          <Field label="Password" value={form.password} onChange={set('password')} placeholder="••••••••"      type="password" required />
          <Field label="Confirm Password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" type="password" required />
          <Field label="Phone"    value={form.phone}    onChange={set('phone')}    placeholder="+1 555 000 0000"  type="tel" />

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13,
              color: '#ef4444', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? '#a855f7' : '#c084fc', color: '#fff',
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
              marginTop: 8,
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
