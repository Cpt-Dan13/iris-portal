import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface MatchedProfile {
  id: string;
  name: string;
  age: number | null;
  photo: string | null;
  allureScore: number | null;
  prospectiveScore: number | null;
  prospectiveLevel: 'HIGH' | 'MODERATE' | 'LOW' | null;
  bio: string | null;
  location: string;
  job: string | null;
  personalityTags: string[];
  matchedAt: string;
  conversationStatus: 'active' | 'ghosted' | 'archived';
  // extended details
  gender: string | null;
  sexuality: string | null;
  height: string | null;
  hometown: string | null;
  ethnicity: string | null;
  religion: string | null;
  datingIntentions: string | null;
  relationshipType: string | null;
  children: string | null;
  familyPlans: string | null;
}

export function useMatchedProfiles() {
  const [profiles, setProfiles] = useState<MatchedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase
        .from('matched_profiles')
        .select('*')
        .order('matched_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProfiles((data ?? []).map(row => ({
          id: row.id,
          name: row.name,
          age: row.age,
          photo: row.photo,
          allureScore: row.allure_score,
          prospectiveScore: row.prospective_score,
          prospectiveLevel: row.prospective_level,
          bio: row.bio,
          location: row.location,
          job: row.job,
          personalityTags: row.personality_tags ?? [],
          matchedAt: row.matched_at,
          conversationStatus: row.conversation_status,
          gender: row.gender,
          sexuality: row.sexuality,
          height: row.height,
          hometown: row.hometown,
          ethnicity: row.ethnicity,
          religion: row.religion,
          datingIntentions: row.dating_intentions,
          relationshipType: row.relationship_type,
          children: row.children,
          familyPlans: row.family_plans,
        })));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { profiles, loading, error };
}
