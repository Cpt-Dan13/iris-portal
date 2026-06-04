interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#3b82f6';
  return '#eab308';
}

const SIZE_MAP = {
  sm: { dim: 40, font: 14 },
  md: { dim: 60, font: 20 },
  lg: { dim: 80, font: 28 },
};

export default function ScoreBadge({ score, size = 'md', label }: ScoreBadgeProps) {
  const color = scoreColor(score);
  const { dim, font } = SIZE_MAP[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          background: `${color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: font,
          color,
        }}
      >
        {score}
      </div>
      {label && (
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
          {label}
        </span>
      )}
    </div>
  );
}
