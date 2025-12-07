export type Modality = 'position' | 'color' | 'picture' | 'sound';

export type ImageSet = 'tetris' | 'shapes';
export type ImageColorMode = 'colour' | 'no-colour';

export interface ModalityConfig {
  enabled: boolean;
  matchKey: string;
  noMatchKey?: string;
}

export interface GameConfig {
  n: number;
  tickMs: number;
  totalTrials: number;
  gridSize: number;
  matchProbability: number;
  imageSet: ImageSet;
  imageColorMode: ImageColorMode;
  colors: string[];
  modalities: Record<Modality, ModalityConfig>;
}

export interface Stimulus {
  position?: number;
  color?: string;
  picture?: string;
  sound?: string;
}

export type TruthMap = Partial<Record<Modality, boolean>>;
export type ResponseMap = Partial<Record<Modality, ResponseEvent>>;

export interface ResponseEvent {
  key: string;
  timeMs: number;
  isMatch: boolean;
  correct: boolean;
  createdAt: number;
}

export interface Trial {
  t: number;
  startedAt: number;
  stimulus: Stimulus;
  truth: TruthMap;
  responses: ResponseMap;
}

export interface SessionStats {
  attempts: number;
  correct: number;
  perModality: Record<Modality, { attempts: number; correct: number }>;
}

