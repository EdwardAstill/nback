import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { GridDisplay } from './components/GridDisplay';
import { ResultsPanel } from './components/ResultsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { TitleBar } from './components/TitleBar';
import { DEFAULT_CONFIG } from './game/constants';
import { buildTrial } from './game/stimuli';
import type {
  GameConfig,
  Modality,
  ResponseEvent,
  SessionStats,
  Trial,
} from './game/types';

type Status = 'idle' | 'running' | 'paused' | 'finished';
type View = 'settings' | 'game';

const defaultStats = (): SessionStats => ({
  attempts: 0,
  correct: 0,
  perModality: {
    position: { attempts: 0, correct: 0 },
    color: { attempts: 0, correct: 0 },
    picture: { attempts: 0, correct: 0 },
    sound: { attempts: 0, correct: 0 },
  },
});

const storageKey = 'quad-n-back-config';

const loadConfig = (): GameConfig => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameConfig>;
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        modalities: {
          ...DEFAULT_CONFIG.modalities,
          ...(parsed.modalities ?? {}),
        },
        colors: parsed.colors ?? DEFAULT_CONFIG.colors,
      };
    }
  } catch (error) {
    console.warn('Unable to load config from storage', error);
  }
  return DEFAULT_CONFIG;
};

const computeStats = (trials: Trial[], config: GameConfig): SessionStats => {
  const stats = defaultStats();
  trials.forEach((trial) => {
    (Object.keys(config.modalities) as Modality[]).forEach((modality) => {
      if (!config.modalities[modality].enabled) {
        return;
      }
      const truth = trial.truth[modality];
      if (truth === undefined) {
        return;
      }
      stats.perModality[modality].attempts += 1;
      stats.attempts += 1;
      const response = trial.responses[modality];
      if (response?.correct) {
        stats.perModality[modality].correct += 1;
        stats.correct += 1;
      }
    });
  });
  return stats;
};

function App() {
  const [config, setConfig] = useState<GameConfig>(loadConfig);
  const [status, setStatus] = useState<Status>('idle');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [view, setView] = useState<View>('settings');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (status !== 'running' || view !== 'game') {
      return;
    }

    const interval = setInterval(() => {
      setTrials((prev) => {
        if (prev.length >= config.totalTrials) {
          setStatus('finished');
          return prev;
        }
        const next = buildTrial(prev.length, config, prev);
        return [...prev, next];
      });
    }, config.tickMs);

    return () => clearInterval(interval);
  }, [status, config, view]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === ' ' && view === 'game') {
        event.preventDefault();
        setStatus((prev) => (prev === 'running' ? 'paused' : 'running'));
        return;
      }

      if (event.key === 'Escape' && view === 'game') {
        setStatus('idle');
        setView('settings');
        setTrials([]);
        return;
      }
      if (status !== 'running' || view !== 'game') {
        return;
      }
      const modality = (Object.keys(config.modalities) as Modality[]).find(
        (mod) =>
          config.modalities[mod].enabled &&
          config.modalities[mod].matchKey.toLowerCase() === key,
      );
      if (!modality) {
        return;
      }

      setTrials((prev) => {
        if (prev.length === 0) {
          return prev;
        }
        const idx = prev.length - 1;
        const trial = prev[idx];
        if (trial.responses[modality]) {
          return prev;
        }
        const truth = trial.truth[modality] ?? false;
        const response: ResponseEvent = {
          key: event.key,
          timeMs: performance.now() - trial.startedAt,
          isMatch: true,
          correct: truth,
          createdAt: performance.now(),
        };
        const nextTrial: Trial = {
          ...trial,
          responses: { ...trial.responses, [modality]: response },
        };
        const next = [...prev];
        next[idx] = nextTrial;
        return next;
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, config.modalities, view]);

  const current = trials[trials.length - 1];
  const stats = useMemo(() => computeStats(trials, config), [trials, config]);

  const startGame = () => {
    const first = buildTrial(0, config, []);
    setTrials([first]);
    setStatus('running');
    setView('game');
  };

  const pauseGame = () => {
    setStatus((prev) => (prev === 'paused' ? 'running' : 'paused'));
  };

  const resetGame = () => {
    setStatus('idle');
    setTrials([]);
    setView('settings');
  };

  const restartFromResults = () => {
    resetGame();
    startGame();
  };

  if (view === 'settings') {
    return (
      <>
        <TitleBar />
        <div className="page page--settings">
          <SettingsPanel config={config} onChange={setConfig} disabled={false} />
          <div className="action-bar">
            <button className="primary" onClick={startGame}>
              Start
            </button>
          </div>
        </div>
      </>
    );
  }

  if (view === 'game' && status === 'paused') {
    return (
      <>
        <TitleBar />
        <div className="page page--game">
          <div className="overlay overlay--solid">
            <div className="overlay__panel">
              <h3>Paused</h3>
              <p className="muted">Press Space to resume. Esc to settings.</p>
              <div className="keymap-list">
                <span>Esc: Settings</span>
                {(Object.keys(config.modalities) as Modality[])
                  .filter((modality) => config.modalities[modality].enabled)
                  .map((modality) => (
                    <span key={modality}>
                      {modality}: {config.modalities[modality].matchKey.toUpperCase()}
                    </span>
                  ))}
              </div>
              <div className="controls">
                <button onClick={pauseGame}>Resume (Space)</button>
                <button onClick={resetGame}>Settings (Esc)</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (view === 'game' && status === 'finished') {
    return (
      <>
        <TitleBar />
        <div className="page page--game">
          <div className="overlay overlay--solid">
            <div className="overlay__panel overlay__panel--wide">
              <ResultsPanel stats={stats} onRestart={restartFromResults} />
              <div className="controls">
                <button onClick={resetGame}>Settings (Esc)</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TitleBar />
      <div className="page page--game">
        <main className="main main--game">
          <GridDisplay
            gridSize={config.gridSize}
            activeIndex={current?.stimulus.position}
            activePicture={current?.stimulus.picture}
          />
        </main>
      </div>
    </>
  );
}

export default App;
