import { IMAGE_SETS } from '../game/constants';
import type { GameConfig, Modality } from '../game/types';

interface SettingsPanelProps {
  config: GameConfig;
  disabled: boolean;
  onChange: (next: GameConfig) => void;
}

const modalityOrder: Modality[] = ['position', 'color', 'picture', 'sound'];

export function SettingsPanel({
  config,
  disabled,
  onChange,
}: SettingsPanelProps) {
  const updateNumber = (field: keyof GameConfig, value: number) => {
    const next = { ...config, [field]: value };
    onChange(next);
  };

  const updateModality = (
    modality: Modality,
    field: 'enabled' | 'matchKey',
    value: string | boolean,
  ) => {
    const nextModalities = {
      ...config.modalities,
      [modality]: {
        ...config.modalities[modality],
        [field]: value,
      },
    };

    const next: GameConfig =
      modality === 'color' && field === 'enabled'
        ? {
            ...config,
            imageColorMode: value ? 'colour' : 'no-colour',
            modalities: nextModalities,
          }
        : { ...config, modalities: nextModalities };

    onChange(next);
  };

  const handleImageSetChange = (value: string) => {
    if (value === 'tetris' || value === 'shapes') {
      onChange({ ...config, imageSet: value });
    }
  };

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Session setup</h2>
        </div>
      </header>

      <div className="grid two">
        <label className="field">
          <span>N-back</span>
          <input
            type="number"
            min={1}
            max={6}
            value={config.n}
            disabled={disabled}
            onChange={(e) =>
              updateNumber('n', Math.max(1, Number(e.target.value) || 1))
            }
          />
        </label>

        <label className="field">
          <span>Tick speed (ms)</span>
          <input
            type="number"
            min={400}
            max={4000}
            step={50}
            value={config.tickMs}
            disabled={disabled}
            onChange={(e) =>
              updateNumber('tickMs', Math.max(200, Number(e.target.value) || 0))
            }
          />
        </label>

        <label className="field">
          <span>Total trials</span>
          <input
            type="number"
            min={4}
            max={200}
            value={config.totalTrials}
            disabled={disabled}
            onChange={(e) =>
              updateNumber(
                'totalTrials',
                Math.max(1, Number(e.target.value) || config.totalTrials),
              )
            }
          />
        </label>

        <label className="field">
          <span>Grid size</span>
          <input
            type="number"
            min={1}
            max={5}
            value={config.gridSize}
            disabled={disabled}
            onChange={(e) =>
              updateNumber(
                'gridSize',
                Math.min(5, Math.max(1, Number(e.target.value) || 3)),
              )
            }
          />
        </label>

        <label className="field">
          <span>Match probability</span>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={config.matchProbability}
            disabled={disabled}
            onChange={(e) =>
              updateNumber(
                'matchProbability',
                Math.min(1, Math.max(0, Number(e.target.value))),
              )
            }
          />
        </label>

        <label className="field">
          <span>Image set</span>
          <select
            value={config.imageSet}
            disabled={disabled}
            onChange={(e) => handleImageSetChange(e.target.value)}
          >
            <option value="tetris">Tetris</option>
            <option value="shapes">Shapes</option>
          </select>
        </label>
      </div>

      <div className="modality-table">
        <div className="modality-row header">
          <span>Modality</span>
          <span>Enabled</span>
          <span>Match key</span>
        </div>
        {modalityOrder.map((modality) => (
          <div className="modality-row" key={modality}>
            <span className="modality-name">{modality}</span>
            <input
              type="checkbox"
              checked={config.modalities[modality].enabled}
              disabled={disabled}
              onChange={(e) =>
                updateModality(modality, 'enabled', e.target.checked)
              }
            />
            <input
              type="text"
              maxLength={1}
              value={config.modalities[modality].matchKey}
              disabled={disabled}
              onChange={(e) =>
                updateModality(modality, 'matchKey', e.target.value || '')
              }
            />
          </div>
        ))}
      </div>

      <p className="muted small">
        Available images: {IMAGE_SETS[config.imageSet][config.imageColorMode].length}{' '}
        items from {config.imageSet}
      </p>
    </section>
  );
}

