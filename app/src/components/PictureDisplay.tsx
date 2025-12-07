interface PictureDisplayProps {
  src?: string;
}

export function PictureDisplay({ src }: PictureDisplayProps) {
  if (!src) {
    return <div className="picture-frame empty">Picture off</div>;
  }

  return (
    <div className="picture-frame">
      <img src={src} alt="Picture stimulus" />
    </div>
  );
}

