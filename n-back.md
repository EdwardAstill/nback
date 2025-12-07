Quad N-Back – Product & Tech Spec

Concept & Goals
- Quad modalities: position (3x3 grid), color, picture set, sound.
- User controls: enable/disable each modality; custom key bindings.
- Adjustable N and speed; difficulty presets.
- Feedback: hit/miss indicators, per-modality accuracy, streaks.
- Session-based: timed or fixed-trial runs; summary stats; optional daily goal.
- Accessibility: keyboard-first, optional audio cues, high-contrast mode.

Core Game Rules
- At tick t, show stimuli for all enabled modalities.
- User answers during the response window; can overlap with next stimulus at high speed.
- A correct is per modality: current stimulus matches stimulus at t−N for that modality.
- Scoring: track hits/misses per modality; compute accuracy and reaction times.
- Difficulty ramps via speed, N, and modality count; optional adaptive N after sustained accuracy.

UX Flow
- Home: Start game, Settings, How to play.
- Settings:
  - Speed (ms per tick), N, session length (trials or time).
  - Toggles: color, picture set, sound, position.
  - Grid size (default 3x3; allow configurable side length, e.g., 1–5).
  - Position disabled rule: if position is off, still vary cells but never repeat the same cell on consecutive ticks.
  - Key bindings per modality (match key; optional no-match key).
  - Visual: high contrast, sound volume, highlight style.
- Game screen:
  - 3x3 grid highlight for position.
  - Color overlay or badge.
  - Picture/icon display.
  - Sound cue playback.
  - HUD: N, tick counter, time left, accuracy per modality, streaks, pause.
  - Feedback flash/outline for hit/miss on keypress.
- Results:
  - Per-modality accuracy, hits/misses, avg reaction time, streak max.
  - Optional breakdown by early/late responses.

Data & State (TypeScript sketches)
- Modality = 'position' | 'color' | 'picture' | 'sound'.
- ModalityConfig: enabled, matchKey, optional noMatchKey.
- GameConfig: n, tickMs, totalTrials (or time), modalities map, audioVolume, highContrast.
- Stimulus: position (0-8), color token, picture id, sound id.
- Trial: t, stimulus, responses per modality.
- ResponseEvent: key, timeMs from onset, isMatch, correct.
- SessionState: config, trials[], startedAt, status (idle/running/paused/finished).

Game Loop (high level)
- Generate stimuli per modality with controlled match probability (~30%).
- On interval tickMs:
  - Emit stimulus for enabled modalities.
  - Open response window (tick duration + optional grace).
  - Compare current stimulus to t−N per modality for ground truth.
  - Capture keypresses; first valid per modality per tick counts.
- End after totalTrials or time budget; compute stats.

Stimulus Generation
- Position: random cell within chosen grid size; if enabled, allow matches per N-back logic with optional no-consecutive-repeat; if disabled, still cycle cells with no consecutive repeats.
- Color: small palette (4–6).
- Picture: lightweight SVG icon set.
- Sound: short clips; preload.
- Control match ratio: with p, reuse stimulus from t−N when t ≥ N; otherwise sample new.

Scoring & Feedback
- Per modality: hits, misses, false positives, RT avg/median.
- Streaks per modality or combined.
- Optional skill rating if adaptive difficulty is added.

Performance & Timing
- Use requestAnimationFrame for visuals; setInterval/setTimeout with drift correction (performance.now()).
- Preload assets; Web Audio API with unlocked context on first user gesture.
- Debounce input per tick per modality.

Architecture (TS/React-style)
- Components: GameController (state machine/loop), GridDisplay, ColorBadge, PictureDisplay, SoundPlayer, HUD, SettingsForm, ResultsView.
- Services: stimulusGenerator, scoreEngine, keymapService, audioService, persistence (localStorage).
- State management: lightweight (React state + reducer or Zustand); keep loop timing outside React renders.

Validation & Safety
- Prevent overlapping key bindings across enabled modalities.
- Clamp N to history; do not start until t ≥ N.
- Clean pause/resume; handle missing audio gracefully.

Testing Ideas
- Seeded RNG for deterministic tests.
- Unit: match detection, scoring, key routing, adaptive N stepper.
- Integration: scripted session with simulated keypresses, assert scores.

Roadmap (suggested)
- Prototype single-modality position N-back with fixed N/speed.
- Add modality toggles and key bindings; wire HUD.
- Add color/picture/sound streams; stabilize timing.
- Add settings persistence and results view.
- Polish accessibility/high-contrast; add adaptive difficulty (optional).