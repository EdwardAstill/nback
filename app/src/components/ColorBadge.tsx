interface ColorBadgeProps {
  color?: string;
}

export function ColorBadge({ color }: ColorBadgeProps) {
  if (!color) {
    return <div className="color-badge empty">Color off</div>;
  }

  return (
    <div className="color-badge" style={{ backgroundColor: color }}>
      <span>{color}</span>
    </div>
  );
}

