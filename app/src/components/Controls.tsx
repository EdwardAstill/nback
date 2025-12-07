interface ControlsProps {
  status: 'idle' | 'running' | 'paused' | 'finished';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Controls({ status, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="controls">
      <button
        className="primary"
        onClick={onStart}
        disabled={status === 'running'}
      >
        Start
      </button>
      <button onClick={onPause} disabled={status === 'idle'}>
        {status === 'paused' ? 'Resume' : 'Pause'}
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}

