import type { GameConfig, ImageColorMode, ImageSet } from './types';

export const TETRIS_PIECES = ['i', 'j', 'l', 'o', 's', 't', 'z'] as const;
export const SHAPE_PIECES = [
  'circle',
  'diamond',
  'pentagon',
  'square',
  'triangle',
] as const;
export const COLOR_NAMES = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow',
] as const;

const buildColourPaths = (baseFolder: string, items: readonly string[]) =>
  items.flatMap((name) =>
    COLOR_NAMES.map(
      (color) => `/images/${baseFolder}/colour/${name}-${color}.svg`,
    ),
  );

const buildMonoPaths = (baseFolder: string, items: readonly string[]) =>
  items.map((name) => `/images/${baseFolder}/no-colour/${name}.svg`);

export const IMAGE_SETS: Record<
  ImageSet,
  Record<ImageColorMode, string[]>
> = {
  tetris: {
    'colour': buildColourPaths('tetris', TETRIS_PIECES),
    'no-colour': buildMonoPaths('tetris', TETRIS_PIECES),
  },
  shapes: {
    'colour': buildColourPaths('shapes', SHAPE_PIECES),
    'no-colour': buildMonoPaths('shapes', SHAPE_PIECES),
  },
};

export const COLOR_PALETTE = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#a855f7',
  '#ec4899',
];

export const DEFAULT_CONFIG: GameConfig = {
  n: 2,
  tickMs: 1200,
  totalTrials: 24,
  gridSize: 3,
  matchProbability: 0.3,
  imageSet: 'tetris',
  imageColorMode: 'colour',
  colors: COLOR_PALETTE,
  modalities: {
    position: { enabled: true, matchKey: 'a' },
    color: { enabled: false, matchKey: 's' },
    picture: { enabled: true, matchKey: 'd' },
    sound: { enabled: false, matchKey: 'f' },
  },
};

