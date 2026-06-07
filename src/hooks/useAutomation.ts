import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type AutomationStatus = 'idle' | 'pending' | 'running' | 'stopped';

export type Duration = '15mins' | '3hours' | '8hours' | '1day' | '3days' | '1week';

export function useAutomation() {
  const { user } = useAuth();
  const [status, setStatus] = useState<AutomationStatus>('idle');
  const [commandId, setCommandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Poll for status updates every 5 seconds when pending or running
  useEffect(() => {
    if (!user || status === 'idle' || status === 'stopped') return;

    const interval = setInterval(async () => {
      if (!commandId) return;
      const { data } = await supabase
        .from('automation_commands')
        .select('status')
        .eq('id', commandId)
        .single();

      if (data?.status) setStatus(data.status as AutomationStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, [user, status, commandId]);

  // On mount — check if there's already a running command for this user
  useEffect(() => {
    if (!user) return;
    async function checkExisting() {
      const { data } = await supabase
        .from('automation_commands')
        .select('id, status')
        .eq('user_id', user!.id)
        .in('status', ['pending', 'running'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCommandId(data.id);
        setStatus(data.status as AutomationStatus);
      }
    }
    checkExisting();
  }, [user]);

  const activate = useCallback(async (duration: Duration) => {
    console.log('[IRIS] activate() called, duration:', duration, 'user:', user?.id ?? 'NULL');
    if (!user) { console.warn('[IRIS] No user — aborting'); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('automation_commands')
      .insert({ user_id: user.id, action: 'start', duration, status: 'pending' })
      .select('id')
      .single();

    console.log('[IRIS] insert result — data:', data, 'error:', error);
    if (!error && data) {
      setCommandId(data.id);
      setStatus('pending');
    }
    setLoading(false);
  }, [user]);

  const stop = useCallback(async () => {
    console.log('[IRIS] stop() called, user:', user?.id ?? 'NULL', 'commandId:', commandId);
    if (!user || !commandId) { console.warn('[IRIS] stop() aborted — missing user or commandId'); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('automation_commands')
      .insert({ user_id: user.id, action: 'stop', status: 'pending' })
      .select('id')
      .single();

    console.log('[IRIS] stop insert result — data:', data, 'error:', error);
    setStatus('stopped');
    setCommandId(null);
    setLoading(false);
  }, [user, commandId]);

  return { status, loading, activate, stop };
}
