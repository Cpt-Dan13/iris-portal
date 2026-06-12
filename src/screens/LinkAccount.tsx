import { useState, useRef, useCallback } from 'react';
import { Phone, Mail, CheckCircle, XCircle, Link2, RefreshCw, ArrowRight } from 'lucide-react';
import { useLinkAccount, type LinkStep } from '../hooks/useLinkAccount';

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({ onComplete }: { onComplete: (code: string) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every(d => d !== '')) onComplete(next.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? '';
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
    if (pasted.length === 6) onComplete(pasted);
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            borderRadius: 12,
            border: `2px solid ${d ? '#c084fc' : 'var(--border)'}`,
            background: 'var(--card)',
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.15s',
            caretColor: '#c084fc',
          }}
          onFocus={e => (e.target.style.borderColor = '#c084fc')}
          onBlur={e => { if (!d) e.target.style.borderColor = 'var(--border)'; }}
        />
      ))}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2.5px solid var(--border)',
        borderTopColor: '#c084fc',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ─── Step Labels ──────────────────────────────────────────────────────────────

function stepLabel(step: LinkStep): string {
  switch (step) {
    case 'pending': return 'Sending request to IRIS...';
    case 'running': return 'IRIS is navigating Hinge login...';
    case 'awaiting_phone_otp': return 'Waiting for SMS code...';
    case 'awaiting_email_otp': return 'Waiting for email code...';
    default: return '';
  }
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function LinkAccount() {
  const { step, loading, error, startLinking, submitOtp, reset } = useLinkAccount();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpSubmitted, setOtpSubmitted] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setPhoneError('Enter a valid 10-digit US phone number.');
      return;
    }
    setPhoneError('');
    await startLinking(digits);
  };

  const handleOtpComplete = useCallback(async (code: string) => {
    if (otpSubmitted) return;
    setOtpSubmitted(true);
    const type = step === 'awaiting_phone_otp' ? 'phone' : 'email';
    await submitOtp(type, code);
    // Reset flag after brief delay so user can re-enter if needed
    setTimeout(() => setOtpSubmitted(false), 3000);
  }, [step, otpSubmitted, submitOtp]);

  const handleReset = () => {
    reset();
    setPhone('');
    setPhoneError('');
    setOtpSubmitted(false);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  };

  const iconCircle = (color: string, bg: string, Icon: React.ElementType) => (
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: bg,
      border: `2px solid ${color}40`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    }}>
      <Icon size={32} style={{ color }} />
    </div>
  );

  // ── Idle: phone entry form ───────────────────────────────────────────────
  if (step === 'idle') {
    return (
      <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={cardStyle}>
          {iconCircle('#c084fc', 'rgba(192,132,252,0.12)', Link2)}

          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
            Link Hinge Account
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28, maxWidth: 320 }}>
            Enter the phone number on your Hinge account. IRIS will log in and send you verification codes to confirm.
          </p>

          <form onSubmit={handlePhoneSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hinge Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}>+1</span>
              <input
                type="tel"
                placeholder="(272) 375-1569"
                value={phone}
                onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 40px',
                  borderRadius: 12,
                  border: `1.5px solid ${phoneError ? '#ef4444' : 'var(--border)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { if (!phoneError) e.target.style.borderColor = '#c084fc'; }}
                onBlur={e => { if (!phoneError) e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            {phoneError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: -4 }}>{phoneError}</p>
            )}
            {error && (
              <p style={{ fontSize: 12, color: '#ef4444', padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              style={{
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 24px',
                borderRadius: 12,
                background: loading || !phone ? 'rgba(192,132,252,0.3)' : '#c084fc',
                border: 'none',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading || !phone ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => { if (!loading && phone) e.currentTarget.style.background = '#d4a0ff'; }}
              onMouseLeave={e => { if (!loading && phone) e.currentTarget.style.background = '#c084fc'; }}
            >
              {loading ? <Spinner size={18} /> : <ArrowRight size={18} />}
              {loading ? 'Connecting...' : 'Link Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Navigating: pending / running ────────────────────────────────────────
  if (step === 'pending' || step === 'running') {
    return (
      <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={cardStyle}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(192,132,252,0.12)',
            border: '2px solid rgba(192,132,252,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Spinner size={32} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
            Connecting to Hinge
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28, maxWidth: 300 }}>
            {stepLabel(step)}
          </p>

          {/* Progress steps */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Launching Hinge app',           done: true },
              { label: 'Navigating to sign-in screen',  done: step === 'running' },
              { label: 'Entering phone number',          done: false },
              { label: 'Waiting for your verification code', done: false },
            ].map(({ label, done }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'rgba(34,197,94,0.15)' : 'rgba(161,161,161,0.1)',
                  border: `1.5px solid ${done ? '#22c55e' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />}
                </div>
                <span style={{ fontSize: 13, color: done ? 'var(--text)' : 'var(--text-secondary)', fontWeight: done ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
            Keep this window open. You'll be prompted for codes shortly.
          </p>
        </div>
      </div>
    );
  }

  // ── OTP Entry: phone or email ─────────────────────────────────────────────
  if (step === 'awaiting_phone_otp' || step === 'awaiting_email_otp') {
    const isPhone = step === 'awaiting_phone_otp';
    const Icon = isPhone ? Phone : Mail;
    const iconColor = isPhone ? '#c084fc' : '#60a5fa';
    const iconBg = isPhone ? 'rgba(192,132,252,0.12)' : 'rgba(96,165,250,0.12)';

    return (
      <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={cardStyle}>
          {iconCircle(iconColor, iconBg, Icon)}

          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
            {isPhone ? 'Enter SMS Code' : 'Enter Email Code'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 8, maxWidth: 320 }}>
            {isPhone
              ? `Hinge sent a 6-digit code to +1 ${phone || '(your number)'}. Enter it below.`
              : 'Hinge sent a verification code to your email. Enter it below.'}
          </p>
          <p style={{ fontSize: 12, color: '#eab308', marginBottom: 28, textAlign: 'center' }}>
            Code expires in ~5 minutes. Enter it quickly.
          </p>

          {otpSubmitted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <Spinner size={16} />
              <span style={{ fontSize: 14, color: '#22c55e', fontWeight: 600 }}>Submitting code to IRIS...</span>
            </div>
          ) : (
            <OtpInput onComplete={handleOtpComplete} />
          )}

          {error && (
            <p style={{ marginTop: 16, fontSize: 13, color: '#ef4444', padding: '8px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
            Once you enter the code it's sent automatically — no need to press any button.
          </p>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (step === 'completed') {
    return (
      <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={cardStyle}>
          {iconCircle('#22c55e', 'rgba(34,197,94,0.12)', CheckCircle)}

          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
            Account Linked!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28, maxWidth: 300 }}>
            Your Hinge account is now connected to IRIS. You can activate automation from the Activate screen.
          </p>

          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c084fc'; e.currentTarget.style.color = '#c084fc'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <RefreshCw size={15} />
            Link Another Account
          </button>
        </div>
      </div>
    );
  }

  // ── Failed / stopped ──────────────────────────────────────────────────────
  return (
    <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={cardStyle}>
        {iconCircle('#ef4444', 'rgba(239,68,68,0.12)', XCircle)}

        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
          Link Failed
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 8, maxWidth: 320 }}>
          {error || 'Something went wrong during the Hinge link process.'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 28 }}>
          Make sure the IRIS emulator is running and try again.
        </p>

        <button
          onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 12,
            background: '#c084fc', border: 'none',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#d4a0ff')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c084fc')}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
