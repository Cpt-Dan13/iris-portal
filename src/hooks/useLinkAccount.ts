import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export type LinkStep =
  | 'idle'
  | 'pending'
  | 'signing_out'
  | 'running'
  | 'awaiting_phone_otp'
  | 'awaiting_email_otp'
  | 'completed'
  | 'stopped';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8000';

export function useLinkAccount() {
  const { user, instanceId } = useAuth();
  const [step, setStep] = useState<LinkStep>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [didSignOut, setDidSignOut] = useState(false);

  // Poll link-status from iris-api while a flow is active
  useEffect(() => {
    if (!user || !instanceId || step === 'idle' || step === 'completed' || step === 'stopped') return;

    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${API_URL}/instances/${instanceId}/link-status`);
        if (!r.ok) return;
        const data = await r.json();
        const s = data.status as LinkStep;
        if (s === 'signing_out') setDidSignOut(true);
        setStep(s);
        if (s === 'stopped') {
          setError('The link process stopped unexpectedly. Please try again.');
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [user, instanceId, step]);

  const startLinking = useCallback(async (phoneNumber: string) => {
    if (!user || !instanceId) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `${API_URL}/instances/${instanceId}/link?user_id=${encodeURIComponent(user.id)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );
      if (r.ok) {
        setStep('pending');
      } else {
        setError('Failed to send link request. Please try again.');
      }
    } catch {
      setError('Failed to send link request. Please try again.');
    }
    setLoading(false);
  }, [user, instanceId]);

  const submitOtp = useCallback(async (type: 'phone' | 'email', code: string) => {
    if (!user || !instanceId) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `${API_URL}/instances/${instanceId}/otp?user_id=${encodeURIComponent(user.id)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, code }),
        }
      );
      if (!r.ok) {
        setError('Failed to submit code. Please try again.');
      }
    } catch {
      setError('Failed to submit code. Please try again.');
    }
    setLoading(false);
  }, [user, instanceId]);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setLoading(false);
    setDidSignOut(false);
  }, []);

  return { step, loading, error, didSignOut, startLinking, submitOtp, reset };
}
