# Learnings

## [2026-04-07] Session start

### Codebase state
- `components/blog-immerse.tsx` (263 lines): YouTube-based component. Uses `window.YT.Player`, `playerRef`, silent `/* noop */` catch blocks, `origin` state for YouTube origin param. NEEDS FULL REWRITE.
- `e2e/blog-immerse.spec.ts` (252 lines): YouTube-based tests. Uses `mockYTScript`. NEEDS UPDATE.
- `app/globals.css` (131 lines): CSS already correct for both modes — `.immerse-dark-shift`, `.immerse-spotlight-overlay`, `.immerse-iframe-hidden`, `.immerse-button`. NO CHANGES NEEDED.
- `app/blog/layout.tsx`: Already imports and mounts `<BlogImmerse>`. NO CHANGES NEEDED.

### Key architecture decision: EPHEMERAL widget per mount
The iframe lives inside BlogImmerse JSX → unmounts/remounts with component on navigation.
SoundCloud READY fires on each new `SC.Widget(iframe)` call → unlike YouTube's broken global callback.
Widget is ephemeral: create on mount, null on unmount. Use `widgetRef = useRef<SCWidget | null>(null)`.
Position tracking via `lastKnownPositionRef` (sync, updated by PLAY_PROGRESS event) instead of async `getPosition()`.

### localStorage shape change
Old (version 1, YouTube): `{ active: boolean, time?: number }` (seconds)
New (version 2, SoundCloud): `{ version: 2, active: boolean, position: number }` (milliseconds)
Migration: if `version` field missing or != 2, `readPref()` returns null (invalidates old data).

### SoundCloud Widget API
- Script: `https://w.soundcloud.com/player/api.js`
- Track URL: `https://soundcloud.com/richarddjames/xtal`
- iframe src: `https://w.soundcloud.com/player/?url=ENCODED_URL&auto_play=false&show_artwork=false&show_comments=false&show_user=false&show_reposts=false&visual=false`
- `SC.Widget(iframe)` → methods: `.play()`, `.pause()`, `.seekTo(ms)`, `.setVolume(0-100)`, `.bind(event, cb)`, `.unbind(event)`
- PLAY_PROGRESS event data: `{ currentPosition (ms), relativePosition (0-1), loadedProgress (0-1) }`
- data-testid rename: `immerse-youtube-iframe` → `immerse-audio-iframe`

### CSS variable note
The CSS variable for dark-shift is `--color-background` (NOT `--color-surface`). Momus noted this — Task 3 QA scenario references `--color-surface` but the actual variable is `--color-background`. The agent doing Task 3 must check `getComputedStyle` on the element using the correct variable name.
