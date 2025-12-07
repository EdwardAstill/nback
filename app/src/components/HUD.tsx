import type { SessionStats } from '../game/types';

interface HUDProps {
  status: string;
  currentTick: number;
  totalTrials: number;
  n: number;
  tickMs: number;
  stats: SessionStats;
}

export function HUD({
  status,
  currentTick,
  totalTrials,
  n,
  tickMs,
  stats,
}: HUDProps) {
  const accuracy =
    stats.attempts === 0 ? 0 : Math.round((stats.correct / stats.attempts) * 100);

  return (
    <section className="panel compact">
      <div className="hud">
        <div>
          <p className="eyebrow">Status</p>
          <strong className="value">{status}</strong>
        </div>
        <div>
          <p className="eyebrow">Trial</p>
          <strong className="value">
            {currentTick}/{totalTrials}
          </strong>
        </div>
        <div>
          <p className="eyebrow">N</p>
          <strong className="value">{n}</strong>
        </div>
        <div>
          <p className="eyebrow">Speed</p>
          <strong className="value">{tickMs} ms</strong>
        </div>
        <div>
          <p className="eyebrow">Accuracy</p>
          <strong className="value">{accuracy}%</strong>
        </div>
      </div>
    </section>
  );
}

