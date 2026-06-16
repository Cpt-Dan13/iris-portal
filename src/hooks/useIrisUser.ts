import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface IrisUser {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  primary_photo: string | null;
  instance_id: string | null;
  created_at: string;
}

export function useIrisUser() {
  const { user } = useAuth();
  const [irisUser, setIrisUser] = useState<IrisUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const userId = user.id;
    async function fetch() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) setIrisUser(data as IrisUser);
      setLoading(false);
    }
    fetch();
  }, [user?.id]);

  const updateUser = useCallback(async (fields: Partial<Pick<IrisUser, 'name' | 'email' | 'phone' | 'primary_photo'>>) => {
    if (!irisUser) return { error: 'No user loaded' };
    const { error } = await supabase
      .from('users')
      .update(fields)
      .eq('id', irisUser.id);
    if (!error) setIrisUser(prev => prev ? { ...prev, ...fields } : prev);
    return { error: error?.message ?? null };
  }, [irisUser]);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  }, []);

  return { irisUser, loading, updateUser, updatePassword };
}
