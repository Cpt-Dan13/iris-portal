import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type LinkStep =
  | 'idle'
  | 'pending'
  | 'running'
  | 'awaiting_phone_otp'
  | 'awaiting_email_otp'
  | 'completed'
  | 'stopped';

export function useLinkAccount() {
  const { user } = useAuth();
  const [step, setStep] = useState<LinkStep>('idle');
  const [commandId, setCommandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    if (!commandId || step === 'idle' || step === 'completed' || step === 'stopped') {
      stopPolling();
      return;
    }

    pollRef.current = setInterval(async () => {
      const { data } = await supabase
        .from('automation_commands')
        .select('status')
        .eq('id', commandId)
        .single();

      if (data?.status) {
        const s = data.status as LinkStep;
        setStep(s);
        if (s === 'completed' || s === 'stopped') {
          stopPolling();
          if (s === 'stopped') {
            setError('The link process stopped unexpectedly. Please try again.');
          }
        }
      }
    }, 3000);

    return stopPolling;
  }, [commandId, step]);

  const startLinking = useCallback(async (phoneNumber: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('automation_commands')
      .insert({
        user_id: user.id,
        action: 'link_account',
        status: 'pending',
        payload: { phone_number: phoneNumber },
      })
      .select('id')
      .single();

    if (err || !data) {
      setError('Failed to send link request. Please try again.');
      setLoading(false);
      return;
    }

    setCommandId(data.id);
    setStep('pending');
    setLoading(false);
  }, [user]);

  const submitOtp = useCallback(async (type: 'phone' | 'email', code: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const action = type === 'phone' ? 'submit_phone_otp' : 'submit_email_otp';
    const { error: err } = await supabase
      .from('automation_commands')
      .insert({
        user_id: user.id,
        action,
        status: 'pending',
        payload: { code },
      });

    if (err) {
      setError('Failed to submit code. Please try again.');
    }
    setLoading(false);
  }, [user]);

  const reset = useCallback(() => {
    stopPolling();
    setStep('idle');
    setCommandId(null);
    setError(null);
    setLoading(false);
  }, []);

  return { step, loading, error, startLinking, submitOtp, reset };
}
