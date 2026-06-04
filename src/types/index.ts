export type ProspectiveLevel = 'HIGH' | 'MODERATE' | 'LOW';

export const levelColor: Record<ProspectiveLevel, string> = {
  HIGH: '#22c55e',
  MODERATE: '#3b82f6',
  LOW: '#eab308',
};

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DetailRow {
  icon: string;
  label: string;
  value: string;
}

export interface PersonalityTag {
  label: string;
  color: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  location: string;
  bio: string;
  allureScore: number;
  prospectiveScore: number | null;
  prospectiveLevel: ProspectiveLevel | null;
  tags: PersonalityTag[];
  // detail fields
  gender?: string;
  sexuality?: string;
  height?: string;
  hometown?: string;
  ethnicity?: string;
  religion?: string;
  job?: string;
  datingIntentions?: string;
  relationshipType?: string;
  children?: string;
  familyPlans?: string;
  // derived for ProfileDetail
  vitals: DetailRow[];
  life: DetailRow[];
  relationshipGoals: DetailRow[];
  conversation: ConversationMessage[];
}

// Raw row shape returned directly from Supabase
export interface ProfileRow {
  id: string;
  name: string;
  age: number;
  photo: string | null;
  location: string;
  bio: string | null;
  allure_score: number;
  prospective_score: number | null;
  prospective_level: ProspectiveLevel | null;
  personality_tags: string[];
  gender: string | null;
  sexuality: string | null;
  height: string | null;
  hometown: string | null;
  ethnicity: string | null;
  religion: string | null;
  job: string | null;
  dating_intentions: string | null;
  relationship_type: string | null;
  children: string | null;
  family_plans: string | null;
}

export interface ConversationRow {
  id: string;
  profile_id: string;
  messages: ConversationMessage[];
  updated_at: string;
}
