# ETAS
Exam Timer & Alert System - ETAS

This repository now contains a lightweight Vite + React + TypeScript scaffold with a sample timer, violation simulation UI, and a small test.

Quick start:

```bash
npm ci
npm run dev
# ETAS — Exam Timer & Alert System

Lightweight Vite + React + TypeScript scaffold for a timed exam session with alerts, violation logging, and simple dev helpers.

**Quick start**

Install dependencies and run the development server:

```bash
npm ci
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

**Environment**

Copy `.env.example` to `.env` and edit values as needed. Vite exposes client-side env vars that start with `VITE_`.

- `VITE_INITIAL_MINUTES` — default timer length (45)
- `VITE_ENABLE_DEV_CONTROLS` — set to `true` to enable dev-only test controls (Jump to 5m/1m/End)
- `VITE_API_URL` — example placeholder for external integrations

After changing `.env` restart the dev server so Vite picks up the new values.

**Dev features**

- Dev-only test buttons (Jump to 5m/1m/End) are shown only when `VITE_ENABLE_DEV_CONTROLS=true`.
- A sample `src/assets/alert.mp3` can be used for the 1-minute alert; the code falls back to WebAudio if missing.
- The tab title updates with the remaining time when the page is hidden.

**Audio & permissions**

Many browsers require a user gesture before audio playback is allowed. Click `Start` (or toggle a control) to unlock audio. The app uses `Audio` playback for the packaged clip and a WebAudio oscillator fallback.

**Testing**

Tests use Vitest with a `jsdom` environment so DOM APIs are available. Run tests with:

```bash
npm test
```
# ETAS — Exam Timer & Alert System

Lightweight Vite + React + TypeScript scaffold for a timed exam session with alerts, violation logging, and simple dev helpers.

## Quick start

Install dependencies and run the development server:

```bash
npm ci
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and edit values as needed. Vite exposes client-side env vars that start with `VITE_`.

- `VITE_INITIAL_MINUTES` — default timer length (45)
- `VITE_ENABLE_DEV_CONTROLS` — set to `true` to enable dev-only test controls (Jump to 5m/1m/End)
- `VITE_API_URL` — example placeholder for external integrations

After changing `.env`, restart the dev server so Vite picks up the new values.

## Features

- Precise exam timer using end-time calculations to avoid drift
- Threshold alerts at 5 minutes and 1 minute (browser notifications + sound)
- Tab-title updates show remaining time when the page is hidden
- Violation logging UI and end-of-session summary
- Dev-only controls (configurable via `VITE_ENABLE_DEV_CONTROLS`) to jump the timer for testing

## System requirements & prerequisites

- Node.js: 18.x or newer (LTS recommended). Check with `node -v`.
- npm: 9.x or newer (or use `pnpm`/`yarn`); check with `npm -v`.
- Tested dependency versions (see `package.json`): React ^18.2.0, TypeScript ^5.5.0, Vite ^5.0.0, Vitest ^1.2.0.
- Recommended: a modern browser (Chrome/Edge/Firefox) and an editor like VS Code.

If you need to switch Node versions locally, `nvm` is handy:

```bash
nvm install --lts
nvm use --lts
```

Refer to `package.json` for exact dependency versions used in the project.

## How it works (brief)

- The timer uses an `endTime` (Date.now() + remaining) and a short interval to compute remaining seconds. This avoids interval drift and keeps thresholds accurate.
- Thresholds (`onFiveMin`, `onOneMin`) are triggered once when remaining time crosses the configured boundaries.
- Title updates while hidden are handled in the `Timer` component; the hook avoids overwriting the hidden-title so they don't conflict.

## Dev features

- Dev-only test buttons (Jump to 5m/1m/End) are shown only when `VITE_ENABLE_DEV_CONTROLS=true`.
- A sample `src/assets/alert.mp3` can be used for the 1-minute alert; the code falls back to WebAudio if missing.
- The tab title updates with the remaining time when the page is hidden.

## Audio & permissions

Many browsers require a user gesture before audio playback is allowed. Click `Start` (or toggle a control) to unlock audio. The app uses `Audio` playback for the packaged clip and a WebAudio oscillator fallback.

## Testing

Tests use Vitest with a `jsdom` environment so DOM APIs are available. Run tests with:

```bash
npm test
```

## Key files

- `src/hooks/useTimer.ts` — core timer logic, end-time based ticking, and threshold callbacks
- `src/components/Timer.tsx` — timer UI, document title updates, and audio handling
- `src/assets/alert.mp3` — optional alert audio (small clip recommended)
- `tests/useTimer.test.ts` — unit tests for the timer

## Hooks used

This project uses several React hooks across components and the timer hook:

- `useState` — local component state (seconds, running, sound toggle, violations, etc.)
- `useEffect` — side effects (intervals, document title updates, visibility handlers)
- `useRef` — stable mutable refs for end time, intervals, notification flags, and audio context
- `useCallback` — memoized callbacks passed between components and used as dependencies
- `useTimer` (custom hook) — exported from `src/hooks/useTimer.ts`, provides `seconds`, `running`, and controls (`start`, `pause`, `resume`, `reset`) and triggers threshold callbacks

See `src/hooks/useTimer.ts` and `src/components/Timer.tsx` for the primary hook usage and patterns.

---


