# Quad N-Back (React + TypeScript + Vite)

Quad-modality N-back prototype with configurable grid size, image sets, colour modes, and per-modality toggles.

## Run
```bash
npm install
npm run dev
# Desktop build run
npm run build
npm run electron
```

## Build and checks
```bash
npm run lint
npm run format
npm run build
```

## Controls
- Modalities: position, color, picture, sound (sound is stubbed for now).
- Default keys: A (position), S (color), D (picture), F (sound).
- Settings: N, tick speed, total trials, grid size (1–5), match probability, image set (tetris|shapes), colour mode (colour|no-colour), per-modality enable + key binding.
- Position disabled rule: grid still moves but never repeats the same cell consecutively.

## Assets
- Image sets live in `public/images/{tetris,shapes}/{colour,no-colour}` (copied from workspace `images/`).

## Notes
- Config persists in `localStorage` under `quad-n-back-config`.
- Stats show overall and per-modality accuracy; results appear after the session finishes.
