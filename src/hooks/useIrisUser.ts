import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface IrisUser {
  id: string;
  hinge_name: string | null;
  email: string | null;
  phone: string | null;
  primary_photo: string | null;
  created_at: string;
}

export function useIrisUser() {
  const [irisUser, setIrisUser] = useState<IrisUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setIrisUser(data as IrisUser);
      setLoading(false);
    }
    fetch();
  }, []);

  return { irisUser, loading };
}
