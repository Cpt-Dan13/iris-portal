import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { transformProfile } from '../lib/transforms';
import type { Profile, ProfileRow, ConversationMessage } from '../types';

export function useProfile(id: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setProfile(null); return; }

    async function fetch() {
      setLoading(true);
      const [profileRes, convRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('conversations').select('messages').eq('profile_id', id).single(),
      ]);

      if (profileRes.error) {
        setError(profileRes.error.message);
        setLoading(false);
        return;
      }

      const messages: ConversationMessage[] = convRes.data?.messages ?? [];
      setProfile(transformProfile(profileRes.data as ProfileRow, messages));
      setLoading(false);
    }
    fetch();
  }, [id]);

  return { profile, loading, error };
}
