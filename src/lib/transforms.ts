import type { Profile, ProfileRow, ConversationMessage, DetailRow, PersonalityTag } from '../types';

const TAG_COLORS: Record<string, string> = {
  playful: '#ec4899',
  adventurous: '#f59e0b',
  'open-minded': '#3b82f6',
  sensual: '#ef4444',
  rebellious: '#8b5cf6',
  authentic: '#22c55e',
};

function toTag(label: string): PersonalityTag {
  return { label, color: TAG_COLORS[label.toLowerCase()] ?? '#c084fc' };
}

function row(icon: string, label: string, value: string | null | undefined): DetailRow | null {
  if (!value) return null;
  return { icon, label, value };
}

export function transformProfile(
  p: ProfileRow,
  conversation: ConversationMessage[] = []
): Profile {
  const vitals: DetailRow[] = [
    row('ruler', 'Height', p.height),
    row('star', 'Ethnicity', p.ethnicity),
    row('heart', 'Sexuality', p.sexuality),
    row('star', 'Gender', p.gender),
  ].filter(Boolean) as DetailRow[];

  const life: DetailRow[] = [
    row('briefcase', 'Job', p.job),
    row('graduation-cap', 'Religion', p.religion),
    row('home', 'Hometown', p.hometown),
  ].filter(Boolean) as DetailRow[];

  const relationshipGoals: DetailRow[] = [
    row('heart', 'Looking For', p.dating_intentions),
    row('heart', 'Relationship', p.relationship_type),
    row('baby', 'Children', p.children),
    row('baby', 'Family Plans', p.family_plans),
  ].filter(Boolean) as DetailRow[];

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    photo: p.photo ?? '',
    location: p.location,
    bio: p.bio ?? '',
    allureScore: p.allure_score,
    prospectiveScore: p.prospective_score,
    prospectiveLevel: p.prospective_level,
    tags: (p.personality_tags ?? []).map(toTag),
    gender: p.gender ?? undefined,
    sexuality: p.sexuality ?? undefined,
    height: p.height ?? undefined,
    hometown: p.hometown ?? undefined,
    ethnicity: p.ethnicity ?? undefined,
    religion: p.religion ?? undefined,
    job: p.job ?? undefined,
    datingIntentions: p.dating_intentions ?? undefined,
    relationshipType: p.relationship_type ?? undefined,
    children: p.children ?? undefined,
    familyPlans: p.family_plans ?? undefined,
    vitals,
    life,
    relationshipGoals,
    conversation,
  };
}
