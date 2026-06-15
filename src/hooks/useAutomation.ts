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
  const [status, setStatus] = useState<AutomationStatus>(() => {
    const s = localStorage.getItem('iris_status') as AutomationStatus | null;
    return s === 'running' || s === 'pending' ? s : 'idle';
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() => Number(localStorage.getItem('iris_progress') ?? 0));
  const [phaseLabel, setPhaseLabel] = useState(() => localStorage.getItem('iris_phase') ?? '');

  // Persist active state to localStorage so navigation doesn't wipe the bar
  useEffect(() => {
    if (status === 'running' || status === 'pending') {
      localStorage.setItem('iris_status', status);
    } else {
      localStorage.removeItem('iris_status');
      localStorage.removeItem('iris_progress');
      localStorage.removeItem('iris_phase');
    }
  }, [status]);

  useEffect(() => {
    if (progress > 0) localStorage.setItem('iris_progress', String(progress));
  }, [progress]);

  useEffect(() => {
    if (phaseLabel) localStorage.setItem('iris_phase', phaseLabel);
  }, [phaseLabel]);

  // On mount — sync status from last known heartbeat
  useEffect(() => {
    if (!user) return;
    fetchInstanceStatus().then(s => {
      if (s === 'running') setStatus('running');
    });
  }, [user]);

  // Poll instance status while not idle
  useEffect(() => {
    if (!user || status === 'idle' || status === 'stopped') return;
    const interval = setInterval(async () => {
      const s = await fetchInstanceStatus();
      if (s === 'running') {
        setStatus('running');
      } else if (s === 'idle') {
        setStatus('idle');
        setProgress(0);
        setPhaseLabel('');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, status]);

  // Poll phase progress from broker events while active
  useEffect(() => {
    const active = status === 'running' || status === 'pending';
    if (!user || !active) {
      if (status === 'idle' || status === 'stopped') {
        setProgress(0);
        setPhaseLabel('');
      }
      return;
    }
    const fetchPhase = async () => {
      try {
        const r = await fetch(`${API_URL}/instances/${INSTANCE_ID}/phase`);
        if (r.ok) {
          const data = await r.json();
          setProgress(data.progress ?? 0);
          setPhaseLabel(data.label ?? '');
        }
      } catch {}
    };
    fetchPhase();
    const interval = setInterval(fetchPhase, 3000);
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
        setProgress(0);
        setPhaseLabel('');
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
    setProgress(0);
    setPhaseLabel('');
    setLoading(false);
  }, [user]);

  return { status, loading, activate, stop, progress, phaseLabel };
}
