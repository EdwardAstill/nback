import type { Modality, SessionStats } from '../game/types';

interface ResultsPanelProps {
  stats: SessionStats;
  onRestart: () => void;
}

const label: Record<Modality, string> = {
  position: 'Position',
  color: 'Color',
  picture: 'Picture',
  sound: 'Sound',
};

export function ResultsPanel({ stats, onRestart }: ResultsPanelProps) {
  const accuracy =
    stats.attempts === 0 ? 0 : Math.round((stats.correct / stats.attempts) * 100);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <p className="eyebrow">Results</p>
          <h2>Session summary</h2>
        </div>
        <button onClick={onRestart}>Play again</button>
      </header>
      <p className="lead">Overall accuracy: {accuracy}%</p>
      <div className="grid two">
        {(Object.keys(label) as Modality[]).map((modality) => {
          const data = stats.perModality[modality];
          const modAccuracy =
            data.attempts === 0
              ? 0
              : Math.round((data.correct / data.attempts) * 100);
          return (
            <div className="stat" key={modality}>
              <p className="eyebrow">{label[modality]}</p>
              <strong className="value">
                {data.correct}/{data.attempts} ({modAccuracy}%)
              </strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

