import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export type LinkStep =
  | 'idle'
  | 'pending'
  | 'running'
  | 'awaiting_phone_otp'
  | 'awaiting_email_otp'
  | 'completed'
  | 'stopped';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8000';
const INSTANCE_ID = 'user_01';

export function useLinkAccount() {
  const { user } = useAuth();
  const [step, setStep] = useState<LinkStep>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll link-status from iris-api while a flow is active
  useEffect(() => {
    if (!user || step === 'idle' || step === 'completed' || step === 'stopped') return;

    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${API_URL}/instances/${INSTANCE_ID}/link-status`);
        if (!r.ok) return;
        const data = await r.json();
        const s = data.status as LinkStep;
        setStep(s);
        if (s === 'stopped') {
          setError('The link process stopped unexpectedly. Please try again.');
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [user, step]);

  const startLinking = useCallback(async (phoneNumber: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `${API_URL}/instances/${INSTANCE_ID}/link?user_id=${encodeURIComponent(user.id)}`,
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
  }, [user]);

  const submitOtp = useCallback(async (type: 'phone' | 'email', code: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `${API_URL}/instances/${INSTANCE_ID}/otp?user_id=${encodeURIComponent(user.id)}`,
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
  }, [user]);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setLoading(false);
  }, []);

  return { step, loading, error, startLinking, submitOtp, reset };
}
