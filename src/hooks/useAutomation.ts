import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export type AutomationStatus = 'idle' | 'pending' | 'running' | 'stopping' | 'stopped';
export type Duration = '15mins' | '3hours' | '8hours' | '1day' | '3days' | '1week';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8000';
const INSTANCE_ID = 'user_01';

const LS_STATUS   = 'iris_status';
const LS_PROGRESS = 'iris_progress';
const LS_PHASE    = 'iris_phase';

function clearAutomationStorage() {
  localStorage.removeItem(LS_STATUS);
  localStorage.removeItem(LS_PROGRESS);
  localStorage.removeItem(LS_PHASE);
}

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

  // Seed initial state from localStorage — survives navigation and page refresh
  const [status, setStatus] = useState<AutomationStatus>(() => {
    const s = localStorage.getItem(LS_STATUS) as AutomationStatus | null;
    return s === 'running' || s === 'pending' ? s : 'idle';
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() => Number(localStorage.getItem(LS_PROGRESS) ?? 0));
  const [phaseLabel, setPhaseLabel] = useState(() => localStorage.getItem(LS_PHASE) ?? '');

  // Consecutive idle responses before we trust the automation really stopped.
  // Prevents a brief gap between cycles from wiping everything.
  const idleCountRef = useRef(0);

  // On mount — confirm running status from heartbeat
  useEffect(() => {
    if (!user) return;
    fetchInstanceStatus().then(s => {
      if (s === 'running') {
        setStatus('running');
        localStorage.setItem(LS_STATUS, 'running');
      }
    });
  }, [user]);

  // Poll status while active — requires 3 consecutive idle reads (~15s) before resetting
  useEffect(() => {
    if (!user || status === 'idle' || status === 'stopped') return;
    idleCountRef.current = 0;
    const interval = setInterval(async () => {
      const s = await fetchInstanceStatus();
      if (s === 'running') {
        idleCountRef.current = 0;
        setStatus('running');
        localStorage.setItem(LS_STATUS, 'running');
      } else if (s === 'idle') {
        idleCountRef.current++;
        if (idleCountRef.current >= 3) {
          clearAutomationStorage();
          setStatus('idle');
          setProgress(0);
          setPhaseLabel('');
        }
      } else {
        idleCountRef.current = 0; // 404/network errors don't count toward idle
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, status]);

  // Poll phase from broker events while active — writes directly to localStorage
  useEffect(() => {
    const active = status === 'running' || status === 'pending';
    if (!user || !active) return;
    const fetchPhase = async () => {
      try {
        const r = await fetch(`${API_URL}/instances/${INSTANCE_ID}/phase`);
        if (r.ok) {
          const data = await r.json();
          const p: number = data.progress ?? 0;
          const l: string = data.label ?? '';
          setProgress(p);
          setPhaseLabel(l);
          if (p > 0) localStorage.setItem(LS_PROGRESS, String(p));
          if (l)    localStorage.setItem(LS_PHASE, l);
          // Natural completion — clear after a short delay so user sees 100%
          if (p >= 100) {
            setTimeout(() => {
              clearAutomationStorage();
              setStatus('idle');
              setProgress(0);
              setPhaseLabel('');
            }, 4000);
          }
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
        localStorage.setItem(LS_STATUS, 'pending');
        localStorage.setItem(LS_PROGRESS, '0');
        localStorage.removeItem(LS_PHASE);
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
    clearAutomationStorage(); // explicit stop always clears immediately
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
