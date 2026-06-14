export const AVATARS: { key: string; url: string; label: string }[] = [
  { key: 'avatar-001', label: 'Phantom', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=phantom' },
  { key: 'avatar-002', label: 'Spectre', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=spectre' },
  { key: 'avatar-003', label: 'Nexus',   url: 'https://api.dicebear.com/9.x/bottts/svg?seed=nexus'   },
];

export function resolveAvatar(photo: string | null | undefined, fallbackName: string): string {
  if (!photo) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=c084fc&color=fff&size=100`;
  const match = AVATARS.find(a => a.key === photo);
  return match ? match.url : photo;
}
