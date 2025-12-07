import { COLOR_NAMES, SHAPE_PIECES, TETRIS_PIECES } from './constants';
import type {
  GameConfig,
  Modality,
  Stimulus,
  Trial,
  TruthMap,
} from './types';

const pickRandom = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const nextPosition = (gridSize: number, previous?: number, avoidRepeat?: boolean) => {
  const maxIndex = gridSize * gridSize;
  if (!avoidRepeat || previous === undefined || maxIndex <= 1) {
    return Math.floor(Math.random() * maxIndex);
  }

  let candidate = previous;
  while (candidate === previous) {
    candidate = Math.floor(Math.random() * maxIndex);
  }
  return candidate;
};

const extractColorFromPath = (path?: string): string | undefined => {
  if (!path) {
    return undefined;
  }
  return COLOR_NAMES.find((color) => path.includes(`-${color}.svg`));
};

const buildPicturePath = (
  imageSet: GameConfig['imageSet'],
  colorMode: 'colour' | 'no-colour',
  piece: string,
  colorName?: string,
) => {
  const base = import.meta.env.BASE_URL ?? '/';
  if (colorMode === 'colour' && colorName) {
    return `${base}images/${imageSet}/colour/${piece}-${colorName}.svg`;
  }
  return `${base}images/${imageSet}/no-colour/${piece}.svg`;
};

const computeTruth = (
  modality: Modality,
  t: number,
  config: GameConfig,
  history: Trial[],
  value: string | number | undefined,
): boolean => {
  if (!config.modalities[modality].enabled) {
    return false;
  }
  const matchIndex = t - config.n;
  if (matchIndex < 0) {
    return false;
  }
  const prior = history[matchIndex]?.stimulus;
  if (!prior) {
    return false;
  }
  switch (modality) {
    case 'position':
      return prior.position === value;
    case 'color':
      return prior.color === value;
    case 'picture':
      return prior.picture === value;
    case 'sound':
      return prior.sound === value;
    default:
      return false;
  }
};

export const buildTrial = (
  t: number,
  config: GameConfig,
  history: Trial[],
): Trial => {
  const prior = history[history.length - 1];
  const truth: TruthMap = {};
  const stimulus: Stimulus = {};

  // Position: when disabled, keep moving but avoid consecutive repeats.
  const positionEnabled = config.modalities.position.enabled;
  const positionMatchCandidate =
    t >= config.n && positionEnabled && Math.random() < config.matchProbability
      ? history[t - config.n]?.stimulus.position
      : undefined;
  stimulus.position = positionEnabled
    ? positionMatchCandidate ??
      nextPosition(config.gridSize, prior?.stimulus.position, false)
    : nextPosition(config.gridSize, prior?.stimulus.position, true);
  truth.position = computeTruth(
    'position',
    t,
    config,
    history,
    stimulus.position,
  );

  const pictureEnabled = config.modalities.picture.enabled;
  const colorEnabled = config.modalities.color.enabled;
  const colorMode = colorEnabled ? 'colour' : 'no-colour';

  const colorMatchCandidate =
    t >= config.n && colorEnabled && Math.random() < config.matchProbability
      ? history[t - config.n]?.stimulus.color
      : undefined;

  const pictureMatchCandidate =
    t >= config.n && pictureEnabled && Math.random() < config.matchProbability
      ? history[t - config.n]?.stimulus.picture
      : undefined;

  const pieces =
    config.imageSet === 'tetris'
      ? Array.from(TETRIS_PIECES)
      : Array.from(SHAPE_PIECES);

  if (pictureEnabled) {
    if (pictureMatchCandidate) {
      stimulus.picture = pictureMatchCandidate;
      const derivedColor = extractColorFromPath(pictureMatchCandidate);
      stimulus.color = colorEnabled ? derivedColor ?? 'black' : 'black';
    } else {
      const chosenColor = colorEnabled
        ? colorMatchCandidate ?? pickRandom(Array.from(COLOR_NAMES))
        : 'black';
      const piece = pickRandom(pieces);
      stimulus.picture = buildPicturePath(
        config.imageSet,
        colorMode,
        piece,
        colorMode === 'colour' ? chosenColor : undefined,
      );
      stimulus.color = colorEnabled ? chosenColor : 'black';
    }
  } else {
    stimulus.picture = undefined;
    stimulus.color = colorEnabled ? colorMatchCandidate ?? 'black' : 'black';
  }

  truth.picture = computeTruth('picture', t, config, history, stimulus.picture);
  truth.color = computeTruth('color', t, config, history, stimulus.color);

  // Sound stub for now.
  const soundEnabled = config.modalities.sound.enabled;
  const soundMatchCandidate =
    t >= config.n && soundEnabled && Math.random() < config.matchProbability
      ? history[t - config.n]?.stimulus.sound
      : undefined;
  stimulus.sound = soundEnabled ? soundMatchCandidate ?? 'beep' : undefined;
  truth.sound = computeTruth('sound', t, config, history, stimulus.sound);

  return {
    t,
    startedAt: performance.now(),
    stimulus,
    truth,
    responses: {},
  };
};

