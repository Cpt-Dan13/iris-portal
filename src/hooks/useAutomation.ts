import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export type AutomationStatus = 'idle' | 'pending' | 'running' | 'stopping' | 'stopped';
export type Duration = '15mins' | '3hours' | '8hours' | '1day' | '3days' | '1week';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8000';

export function useAutomation() {
  const { user, instanceId } = useAuth();

  const lsStatus   = `iris_status_${instanceId}`;
  const lsProgress = `iris_progress_${instanceId}`;
  const lsPhase    = `iris_phase_${instanceId}`;

  function clearAutomationStorage() {
    localStorage.removeItem(lsStatus);
    localStorage.removeItem(lsProgress);
    localStorage.removeItem(lsPhase);
  }

  async function fetchInstanceStatus(): Promise<'running' | 'idle' | 'error' | null> {
    if (!instanceId) return null;
    try {
      const r = await fetch(`${API_URL}/instances/${instanceId}/status`);
      if (r.status === 404) return null;
      if (!r.ok) return null;
      const data = await r.json();
      return data.status ?? null;
    } catch {
      return null;
    }
  }

  // Seed initial state from localStorage — survives navigation and page refresh
  const [status, setStatus] = useState<AutomationStatus>(() => {
    if (!instanceId) return 'idle';
    const s = localStorage.getItem(`iris_status_${instanceId}`) as AutomationStatus | null;
    return s === 'running' || s === 'pending' ? s : 'idle';
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() =>
    instanceId ? Number(localStorage.getItem(`iris_progress_${instanceId}`) ?? 0) : 0
  );
  const [phaseLabel, setPhaseLabel] = useState(() =>
    instanceId ? (localStorage.getItem(`iris_phase_${instanceId}`) ?? '') : ''
  );

  // Consecutive idle responses before we trust the automation really stopped.
  // Prevents a brief gap between cycles from wiping everything.
  const idleCountRef = useRef(0);

  // On mount — confirm running status from heartbeat
  useEffect(() => {
    if (!user || !instanceId) return;
    fetchInstanceStatus().then(s => {
      if (s === 'running') {
        setStatus('running');
        localStorage.setItem(lsStatus, 'running');
      }
    });
  }, [user, instanceId]);

  // Poll status while active — requires 3 consecutive idle reads (~15s) before resetting
  useEffect(() => {
    if (!user || !instanceId || status === 'idle' || status === 'stopped') return;
    idleCountRef.current = 0;
    const interval = setInterval(async () => {
      const s = await fetchInstanceStatus();
      if (s === 'running') {
        idleCountRef.current = 0;
        setStatus('running');
        localStorage.setItem(lsStatus, 'running');
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
  }, [user, instanceId, status]);

  // Poll phase from broker events while active — writes directly to localStorage
  useEffect(() => {
    const active = status === 'running' || status === 'pending';
    if (!user || !instanceId || !active) return;
    const fetchPhase = async () => {
      try {
        const r = await fetch(`${API_URL}/instances/${instanceId}/phase`);
        if (r.ok) {
          const data = await r.json();
          const p: number = data.progress ?? 0;
          const l: string = data.label ?? '';
          setProgress(p);
          setPhaseLabel(l);
          if (p > 0) localStorage.setItem(lsProgress, String(p));
          if (l)    localStorage.setItem(lsPhase, l);
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
  }, [user, instanceId, status]);

  const activate = useCallback(async (duration: Duration) => {
    if (!user || !instanceId) return;
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/instances/${instanceId}/start?user_id=${encodeURIComponent(user.id)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration }),
        }
      );
      if (r.ok) {
        localStorage.setItem(lsStatus, 'pending');
        localStorage.setItem(lsProgress, '0');
        localStorage.removeItem(lsPhase);
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
  }, [user, instanceId]);

  const stop = useCallback(async () => {
    if (!user || !instanceId) return;
    setStatus('stopping');
    setLoading(true);
    clearAutomationStorage(); // explicit stop always clears immediately
    try {
      const r = await fetch(
        `${API_URL}/instances/${instanceId}/stop?user_id=${encodeURIComponent(user.id)}`,
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
  }, [user, instanceId]);

  return { status, loading, activate, stop, progress, phaseLabel };
}
