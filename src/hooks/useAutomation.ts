import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export type AutomationStatus = 'idle' | 'pending' | 'running' | 'stopping' | 'stopped';

export type Duration = '15mins' | '3hours' | '8hours' | '1day' | '3days' | '1week';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8000';
const INSTANCE_ID = 'user_01';

async function fetchInstanceStatus(): Promise<'running' | 'idle' | 'error' | null> {
  try {
    const r = await fetch(`${API_URL}/instances/${INSTANCE_ID}/status`);
    if (r.status === 404) return null;
    if (!r.ok) return null;
    const data = await r.json();
    return data.status ?? null;
  } catch {
    return null;
  }
}

export function useAutomation() {
  const { user } = useAuth();
  const [status, setStatus] = useState<AutomationStatus>('idle');
  const [loading, setLoading] = useState(false);

  // On mount — sync status from last known heartbeat
  useEffect(() => {
    if (!user) return;
    fetchInstanceStatus().then(s => {
      if (s === 'running') setStatus('running');
    });
  }, [user]);

  // Poll status while active or stopping
  useEffect(() => {
    if (!user || status === 'idle' || status === 'stopped') return;

    const interval = setInterval(async () => {
      const s = await fetchInstanceStatus();
      if (s === 'running') {
        setStatus('running');
      } else if (s === 'idle') {
        setStatus('idle');
      }
      // null / 404 → no heartbeat yet — keep current state (pending/stopping)
    }, 5000);

    return () => clearInterval(interval);
  }, [user, status]);

  const activate = useCallback(async (duration: Duration) => {
    if (!user) return;
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/instances/${INSTANCE_ID}/start?user_id=${encodeURIComponent(user.id)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration }),
        }
      );
      if (r.ok) {
        setStatus('pending');
      } else {
        console.error('[IRIS] activate failed', r.status, await r.text());
      }
    } catch (e) {
      console.error('[IRIS] activate error', e);
    }
    setLoading(false);
  }, [user]);

  const stop = useCallback(async () => {
    if (!user) return;
    setStatus('stopping');
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/instances/${INSTANCE_ID}/stop?user_id=${encodeURIComponent(user.id)}`,
        { method: 'POST' }
      );
      if (!r.ok) {
        console.error('[IRIS] stop failed', r.status, await r.text());
      }
    } catch (e) {
      console.error('[IRIS] stop error', e);
    }
    setLoading(false);
  }, [user]);

  return { status, loading, activate, stop };
}
