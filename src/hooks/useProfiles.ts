import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { transformProfile } from '../lib/transforms';
import type { Profile, ProfileRow } from '../types';

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase
        .from('liked_profiles')
        .select('*')
        .order('allure_score', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProfiles((data as ProfileRow[]).map(p => transformProfile(p)));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { profiles, loading, error };
}
