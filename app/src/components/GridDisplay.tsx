interface GridDisplayProps {
  gridSize: number;
  activeIndex?: number;
  activePicture?: string;
}

export function GridDisplay({
  gridSize,
  activeIndex,
  activePicture,
}: GridDisplayProps) {
  const cellCount = gridSize * gridSize;
  const cells = Array.from({ length: cellCount });

  return (
    <div
      className="grid-display"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            className={`grid-cell ${isActive ? 'active' : ''}`}
          >
            {isActive && activePicture ? (
              <img className="cell-image" src={activePicture} alt="Stimulus" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

