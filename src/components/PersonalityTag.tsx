interface PersonalityTagProps {
  label: string;
  color: string;
  small?: boolean;
}

export default function PersonalityTag({ label, color, small }: PersonalityTagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: `${color}33`,
        border: `1px solid ${color}`,
        borderRadius: 16,
        fontSize: small ? 10 : 12,
        fontWeight: 600,
        padding: small ? '3px 8px' : '4px 10px',
        color,
        marginRight: 4,
        marginBottom: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
