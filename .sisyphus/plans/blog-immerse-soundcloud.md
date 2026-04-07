# Blog Immerse: Replace YouTube with SoundCloud Widget API

## TL;DR

> **Quick Summary**: Replace the YouTube IFrame API with the SoundCloud Widget API in the blog's Immerse feature to fix audio breakage on SPA navigation (Blog→Home→Blog), and ensure both visual focus modes (spotlight + dark-shift) are properly wired and tested.
> 
> **Deliverables**:
> - Rewritten `components/blog-immerse.tsx` using SoundCloud Widget API
> - Both visual modes (spotlight overlay, dark-shift theme) working via config prop
> - Proper error handling replacing all silent `/* noop */` catch blocks
> - Updated E2E tests covering SoundCloud integration, navigation persistence, and both visual modes
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (types + helpers) → Task 2 (component rewrite) → Task 4 (E2E tests) → Task 5 (final verification)

---

## Context

### Original Request
The blog section's "Immerse" feature has a bug where audio behavior breaks when navigating from `/blog` to another page (e.g., homepage) and then returning to `/blog`. The user also wants to investigate whether the issue is in the YouTube IFrame API itself or in our handling, and explore alternative audio providers since the song can't be hosted locally (licensing).

### Interview Summary
**Key Discussions**:
- **Navigation bug**: BlogImmerse component lives in `app/blog/layout.tsx` — unmounts on non-blog navigation, causing YouTube player lifecycle to break on remount (global `onYouTubeIframeAPIReady` doesn't re-fire)
- **Licensing**: Cannot host audio file locally — must stream from a licensed source
- **Song availability**: The track (Aphex Twin - Xtal, YouTube ID `sWcLccMuCA8`) is also on SoundCloud: `https://soundcloud.com/richarddjames/xtal`
- **Visual modes**: Two CSS modes exist (spotlight overlay + dark-shift theme) but only spotlight is connected. User wants both available via config prop, not runtime toggle
- **Persistence**: Resume from saved position if toggle was ON, restart from beginning if OFF
- **Scope**: Blog-only (no site-wide audio). Proper pause+save on unmount, resume on remount

**Research Findings**:
- **SoundCloud Widget API** is the best replacement: free, no auth, iframe-based (SPA-safe), full programmatic control via `SC.Widget()`
- YouTube IFrame API is known to be SPA-hostile (global callbacks, orphaned instances)
- Spotify requires Premium subscription, Apple Music requires subscription, Deezer has no programmatic control
- SoundCloud Widget API methods: `.play()`, `.pause()`, `.seekTo(ms)`, `.getPosition(callback)`, `.setVolume(0-100)`
- SoundCloud uses **milliseconds** (YouTube used seconds) — time unit conversion needed
- `SC.Widget(iframe)` creates a widget instance for the given iframe — each new iframe gets a fresh widget, and READY fires per instance (unlike YouTube's broken global callback)

### Metis Review
**Identified Gaps** (addressed):
- **READY event fires once per widget instance**: Each new `SC.Widget(iframe)` call on a fresh iframe WILL fire READY again. The fix is NOT module-level widget persistence (the iframe unmounts with the component), but rather: recreate the widget on each remount, use localStorage to restore state, and treat the widget as ephemeral per mount cycle
- **getPosition() is callback-based**: Not sync like YouTube's getCurrentTime(). Fix: use last known position from PLAY_PROGRESS event for unmount saves
- **seekTo() timing**: Unreliable before first PLAY_PROGRESS. Fix: queue seek after play starts
- **localStorage migration**: Old YouTube data (seconds) would be misinterpreted as milliseconds. Fix: add version field, clear stale data
- **Missing navigation E2E test**: The primary bug (Blog→Home→Blog) has zero test coverage
- **Missing dark-shift test**: Zero E2E coverage for the dark-shift visual mode
- **Autoplay policy on resume**: Resume-on-remount may be blocked since original user gesture was in different navigation context
- **Widget cleanup**: Must unbind SC Widget events before nulling reference to prevent orphaned postMessage listeners

---

## Work Objectives

### Core Objective
Replace YouTube IFrame API with SoundCloud Widget API in `components/blog-immerse.tsx` to fix SPA navigation audio bugs, and ensure both visual focus modes work correctly.

### Concrete Deliverables
- `components/blog-immerse.tsx` — rewritten to use SoundCloud Widget API with ephemeral widget per mount cycle
- `e2e/blog-immerse.spec.ts` — updated tests for SoundCloud + new navigation and dark-shift tests
- Both `mode='spotlight'` and `mode='dark-shift'` working correctly

### Definition of Done
- [ ] `pnpm exec playwright test e2e/blog-immerse.spec.ts` — all tests pass
- [ ] `pnpm exec tsc --noEmit` — zero TypeScript errors
- [ ] Blog→Home→Blog navigation: audio resumes from saved position
- [ ] Toggle on/off works with SoundCloud audio + visual overlay
- [ ] Both spotlight and dark-shift modes render correctly
- [ ] No silent `/* noop */` catch blocks remain — all errors logged
- [ ] No console errors during normal operation

### Must Have
- SoundCloud Widget API replaces YouTube IFrame API entirely
- **Ephemeral widget per mount cycle** — On each mount, create fresh `SC.Widget(iframe)`, bind READY, and restore state from localStorage. On unmount, pause + save position + unbind events. No module-level persistence needed because SoundCloud's iframe approach naturally fires READY on each new widget instance, unlike YouTube's broken global callback.
- localStorage persistence with `{ version: 2, active: boolean, position: number }` (milliseconds)
- Resume from position when toggle was left ON and user returns to blog
- Restart from beginning when toggle was OFF
- Both visual modes (spotlight + dark-shift) functional via `mode` prop
- Proper error handling with `console.warn('[BlogImmerse]', error)` in all catch blocks
- All existing `data-testid` attributes preserved (except `immerse-youtube-iframe` → `immerse-audio-iframe`)
- Accessibility attributes preserved (aria-label, aria-pressed)
- E2E test for Blog→Home→Blog navigation persistence
- E2E test for dark-shift mode

### Must NOT Have (Guardrails)
- ❌ No new npm dependencies — SoundCloud Widget API loads via script tag
- ❌ No music picker, playlist UI, or multi-track support — single hardcoded track
- ❌ No volume controls UI — volume hardcoded at 30
- ❌ No track progress indicator — position is for resume only
- ❌ No runtime mode switching — mode is config-level (prop) only
- ❌ No CSS changes to `app/globals.css` — existing styles already work for both modes
- ❌ No changes to `app/blog/layout.tsx` — keep default spotlight mode
- ❌ No loading spinners or skeleton states
- ❌ No keyboard shortcuts
- ❌ No service worker or background audio
- ❌ No changes to localStorage key name — keep `'blog-immerse'`
- ❌ No over-abstraction — keep it a single component, no context providers or hooks extraction

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E)
- **Automated tests**: YES (Tests-after — update existing suite)
- **Framework**: Playwright (`pnpm exec playwright test`)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Component logic**: Use Bash (`pnpm exec tsc --noEmit`) — TypeScript compilation check
- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Error handling**: Use `ast_grep_search` — verify no silent catch blocks remain

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
├── Task 1: SoundCloud Widget type definitions + helper utilities [quick]
└── Task 3: Wire dark-shift mode verification [quick]

Wave 2 (After Wave 1 — core rewrite + tests):
├── Task 2: Rewrite blog-immerse.tsx with SoundCloud Widget API (depends: 1) [deep]
└── Task 4: Update E2E tests for SoundCloud integration (depends: 2) [unspecified-high]

Wave FINAL (After ALL tasks):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 2 → Task 4 → F1-F4 → user okay
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 2 (Waves 1 & 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2 | 1 |
| 2 | 1 | 4 | 2 |
| 3 | — | 4 | 1 |
| 4 | 2, 3 | F1-F4 | 2 |

### Agent Dispatch Summary

- **Wave 1**: **2 tasks** — T1 → `quick`, T3 → `quick`
- **Wave 2**: **2 tasks** — T2 → `deep`, T4 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. SoundCloud Widget type definitions + helper utilities

  **What to do**:
  - Add TypeScript type declarations for the SoundCloud Widget API at the top of `components/blog-immerse.tsx` (replacing the YouTube `YTPlayer` interface and `window.YT` global declaration):
    - `SCWidget` interface with methods: `play()`, `pause()`, `toggle()`, `seekTo(ms: number)`, `setVolume(vol: number)`, `getVolume(callback: (vol: number) => void)`, `getPosition(callback: (pos: number) => void)`, `getDuration(callback: (dur: number) => void)`, `isPaused(callback: (paused: boolean) => void)`, `bind(event: string, callback: (...args: unknown[]) => void)`, `unbind(event: string)`
    - `SCWidgetEvents` enum/const with: `READY`, `PLAY`, `PAUSE`, `FINISH`, `PLAY_PROGRESS`, `SEEK`, `ERROR`
    - Extend `Window` global: `SC?: { Widget: (iframe: HTMLIFrameElement | string) => SCWidget; Widget: { Events: SCWidgetEvents } }`
  - Update `BlogImmersePreference` interface: `{ version: 2, active: boolean, position: number }` (position in milliseconds)
  - Update `readPref()` to check for `version` field — if missing or < 2, return `null` (invalidates old YouTube-era data)
  - Update `writePref()` to always include `version: 2`
  - Update constants: replace `VIDEO_ID` with `SOUNDCLOUD_TRACK_URL = 'https://soundcloud.com/richarddjames/xtal'`
  - Keep `STORAGE_KEY = 'blog-immerse'` and `SAVE_INTERVAL_MS = 3000` unchanged

  **Must NOT do**:
  - Do not install any npm packages
  - Do not create separate files for types — keep inline in blog-immerse.tsx (matches existing pattern)
  - Do not change `STORAGE_KEY` name

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, well-defined changes to type definitions and two small utility functions. Single file, <50 lines of changes.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - None needed — this is straightforward TypeScript interface and function updates

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 3)
  - **Blocks**: Task 2
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `components/blog-immerse.tsx:5-20` — Current `window.YT` global type declaration pattern. Replace this block entirely with SoundCloud equivalent.
  - `components/blog-immerse.tsx:22-33` — Current `YTPlayer` interface. Replace with `SCWidget` interface following same structure.
  - `components/blog-immerse.tsx:35-38` — Current `BlogImmersePreference` interface. Add `version` field.
  - `components/blog-immerse.tsx:44-60` — Current `readPref()`/`writePref()` functions. Update to handle version check and millisecond position.

  **API/Type References** (contracts to implement against):
  - SoundCloud Widget API docs: `https://developers.soundcloud.com/docs/api/html5-widget` — Official reference for Widget methods and events
  - Widget script: `https://w.soundcloud.com/player/api.js` — Loaded via script tag, provides `window.SC.Widget`

  **WHY Each Reference Matters**:
  - Lines 5-20: Shows how to extend `Window` interface in this codebase — follow same `declare global` pattern
  - Lines 22-33: Shows interface naming and method signature style — SC methods are similar but callback-based for getters
  - Lines 35-38: The preference shape is the persistence contract — must be updated carefully
  - Lines 44-60: These functions are used throughout the component — the version migration logic goes here

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: New type definitions and helpers are syntactically valid
    Tool: Bash (grep + ast_grep_search)
    Preconditions: Task 1 changes applied to components/blog-immerse.tsx
    Steps:
      1. Run: grep -c 'SCWidget' components/blog-immerse.tsx — assert count >= 3 (interface + usage + Window declaration)
      2. Run: grep -c 'SCWidgetEvents' components/blog-immerse.tsx — assert count >= 1
      3. Run: grep -c "version: 2" components/blog-immerse.tsx — assert count >= 1 (in writePref or type)
      4. Run: grep -c "SOUNDCLOUD_TRACK_URL" components/blog-immerse.tsx — assert count >= 1
      5. Run: grep "VIDEO_ID" components/blog-immerse.tsx — assert count == 0 (YouTube constant removed)
    Expected Result: All SoundCloud types/constants present, all YouTube constants removed
    Failure Indicators: Missing SCWidget/SCWidgetEvents definitions, VIDEO_ID still present
    Evidence: .sisyphus/evidence/task-1-type-defs-check.txt
    Note: Full tsc --noEmit will FAIL at this stage because component body still references YouTube APIs (fixed in Task 2). Type-level correctness is verified by grep presence checks here; full compilation is verified after Task 2.

  Scenario: readPref version migration logic is correct
    Tool: Bash (grep + code inspection)
    Preconditions: Task 1 readPref function updated
    Steps:
      1. Run: grep -A 10 'function readPref' components/blog-immerse.tsx > .sisyphus/evidence/task-1-pref-migration.txt
      2. Verify the output contains a check for `version` field (e.g., `parsed.version !== 2` or `!parsed.version`)
      3. Verify the function returns null when version is missing or != 2
      4. Run: grep -A 5 'function writePref' components/blog-immerse.tsx >> .sisyphus/evidence/task-1-pref-migration.txt
      5. Verify writePref includes `version: 2` in the stored object
    Expected Result: readPref rejects versionless data (returns null), writePref always writes version: 2
    Failure Indicators: No version check in readPref, or writePref missing version field
    Evidence: .sisyphus/evidence/task-1-pref-migration.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `fix(blog): replace YouTube IFrame API with SoundCloud Widget API`
  - Files: `components/blog-immerse.tsx`
  - Pre-commit: `pnpm exec tsc --noEmit`

- [ ] 2. Rewrite blog-immerse.tsx core logic with SoundCloud Widget API

  **What to do**:
  - **Remove all YouTube-specific code**: Delete `window.YT` usage, `onYouTubeIframeAPIReady` callback, YouTube iframe_api script injection, all `playerRef.current.playVideo()` / `pauseVideo()` / `getCurrentTime()` / `seekTo()` / `mute()` / `unMute()` calls
  - **Use ephemeral widget with localStorage-based state restoration** (CRITICAL — this fixes the navigation bug):
    - The iframe lives inside BlogImmerse JSX, so it unmounts/remounts with the component. This is fine — unlike YouTube, SoundCloud's `SC.Widget(iframe)` fires READY on each new widget instance.
    - Use `useRef` for widget reference (`widgetRef`), NOT module-level variables. The widget is ephemeral — created on mount, destroyed on unmount.
    - Keep a `useRef` for `lastKnownPosition` to track the latest playback position from PLAY_PROGRESS events (avoids async `getPosition()` callback on teardown).
    - **The fix**: On mount, read localStorage. If `active && version === 2`, set `isImmersed(true)` and queue a resume to `pref.position`. When READY fires on the new widget, seekTo + play. This is the fundamental difference from YouTube — SC's READY reliably fires per widget instance, so the resume-on-remount flow is simple and reliable.
  - **Load SoundCloud Widget API script**:
    - In a useEffect, check if `window.SC?.Widget` exists. If not, inject `<script src="https://w.soundcloud.com/player/api.js" async>` into document.head (same pattern as current YouTube script injection)
    - Once loaded, initialize widget: `widgetRef.current = window.SC.Widget(iframeRef.current)`
  - **Bind widget events** (on each mount — events are per-widget-instance):
    - `READY`: Call `setIsPlayerReady(true)`, set volume to 30, handle pending resume (seekTo saved position + play)
    - `PLAY_PROGRESS`: Update `lastKnownPosition` from event data (provides `currentPosition` in ms) — this is used for save interval and unmount cleanup instead of async `getPosition()`
    - `ERROR`: Log `console.warn('[BlogImmerse] SoundCloud widget error:', data)`
  - **Update handleToggle()**:
    - When activating (next=true): if widget ready, call `widget.play()` then seekTo if resuming. If not ready, set `pendingResumeRef.current = 0`. Write pref `{ version: 2, active: true, position: 0 }`.
    - When deactivating (next=false): call `widget.pause()`, use `lastKnownPosition` for save (sync, no callback needed). Write pref `{ version: 2, active: false, position: lastKnownPosition }`.
  - **Update save interval**: Instead of `playerRef.current.getCurrentTime()`, use `lastKnownPosition` (updated by PLAY_PROGRESS event). Write `{ version: 2, active: true, position: lastKnownPosition }`.
  - **Update resume-on-remount logic**:
    - On mount useEffect: read pref. If `active && version === 2`, set `isImmersed(true)` and `pendingResumeRef.current = pref.position`.
    - When player becomes ready AND pending resume exists: call `widget.play()`, then on first PLAY_PROGRESS event, call `widget.seekTo(pendingResumeRef.current)`. Clear pending.
    - Handle autoplay policy: wrap play() in try/catch. If blocked, log warning and leave visual state active (user can re-click to retry).
  - **Update cleanup effect**: On unmount, call `widgetRef.current.pause()` if playing, save `lastKnownPosition` to localStorage via writePref, stop save interval, unbind all widget events via `widget.unbind(eventName)` for each bound event, then null the widgetRef. The widget is ephemeral — a new one is created on next mount.
  - **Update iframe src**: Replace YouTube embed URL with SoundCloud widget URL:
    ```
    https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_TRACK_URL)}&auto_play=false&show_artwork=false&show_comments=false&show_user=false&show_reposts=false&visual=false
    ```
  - **Update iframe attributes**: Change `data-testid="immerse-youtube-iframe"` to `data-testid="immerse-audio-iframe"`. Keep `allow="autoplay"`, `aria-hidden="true"`, `tabIndex={-1}`, class `immerse-iframe-hidden`.
  - **Replace ALL silent error handlers**: Every `catch { /* noop */ }` becomes `catch (error) { console.warn('[BlogImmerse]', error); }` — provide context in the message about what operation failed.
  - **Remove `origin` state**: The `useState('')` + `useEffect` for `window.location.origin` (lines 220-223) was YouTube-specific. SoundCloud widget URL doesn't need an origin param. Remove this.

  **Must NOT do**:
  - Do not add volume slider, progress bar, or any new UI elements
  - Do not extract hooks to separate files — keep everything in blog-immerse.tsx
  - Do not create React Context providers
  - Do not change the toggle button appearance, emoji icons (🎧 / ✕), or accessibility attributes
  - Do not change `app/globals.css` — CSS already works
  - Do not change `app/blog/layout.tsx`
  - Do not add playlist support — single track only
  - Do not add any npm dependencies

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: This is the core task — rewriting a 263-line component's audio lifecycle with a different API while preserving behavior. Requires careful understanding of React lifecycle, async widget initialization, module-level state persistence, and browser autoplay policies. Multiple interacting useEffect hooks need to be coordinated correctly.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for implementation — QA is separate
    - `frontend-ui-ux`: No visual changes — this is purely logic

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Task 1)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:

  **Pattern References** (existing code to follow):
  - `components/blog-immerse.tsx:67-73` — Component state and refs setup. Keep same pattern: `useState` for isImmersed/isPlayerReady, `useRef` for iframeRef/saveIntervalRef/pendingResumeRef. Replace `playerRef` with `widgetRef` (useRef for ephemeral widget instance) and add `lastKnownPositionRef` (useRef for sync position tracking from PLAY_PROGRESS).
  - `components/blog-immerse.tsx:75-94` — `stopSaveInterval` and `startSaveInterval` callbacks. Update `startSaveInterval` to use `lastKnownPosition` instead of `playerRef.current.getCurrentTime()`.
  - `components/blog-immerse.tsx:96-157` — YouTube player init + cleanup effect. **Replace entirely** with SoundCloud widget init. Keep the same effect structure (init on mount, cleanup on unmount) but swap YouTube API calls for SC.Widget calls.
  - `components/blog-immerse.tsx:159-165` — Preference read on mount. Update to check `version === 2` and use `position` (ms) instead of `time` (s).
  - `components/blog-immerse.tsx:167-179` — Resume effect (fires when player ready + pending resume). Update to use SC widget `.play()` + `.seekTo(ms)` with PLAY_PROGRESS queue pattern.
  - `components/blog-immerse.tsx:187-218` — `handleToggle()` function. Update all player calls from YouTube to SoundCloud equivalents. Use `lastKnownPosition` for sync position access.
  - `components/blog-immerse.tsx:225` — iframe src. Replace YouTube embed URL with SoundCloud widget URL.
  - `components/blog-immerse.tsx:227-262` — JSX render. Only change: iframe `data-testid` and `src`. Everything else stays identical.

  **API/Type References** (contracts to implement against):
  - SoundCloud Widget API: `SC.Widget(iframe)` → returns widget instance. Methods: `.play()`, `.pause()`, `.seekTo(ms)`, `.setVolume(0-100)`, `.bind(event, callback)`, `.unbind(event)`.
  - Events: `SC.Widget.Events.READY`, `SC.Widget.Events.PLAY_PROGRESS` (provides `{ currentPosition, relativePosition, loadedProgress }`), `SC.Widget.Events.ERROR`
  - Widget iframe URL format: `https://w.soundcloud.com/player/?url=ENCODED_TRACK_URL&params`

  **External References**:
  - SoundCloud Widget API docs: `https://developers.soundcloud.com/docs/api/html5-widget`
  - PLAY_PROGRESS event data shape: `{ soundId, currentPosition (ms), relativePosition (0-1), loadedProgress (0-1) }`

  **WHY Each Reference Matters**:
  - Lines 96-157 are THE critical section — the YouTube init/cleanup effect is what causes the navigation bug. The SoundCloud replacement with ephemeral widget per mount cycle is the architectural fix.
  - Lines 167-179 handle resume and MUST use the seekTo-after-PLAY_PROGRESS pattern since SoundCloud seekTo is unreliable before playback starts.
  - Lines 187-218 handleToggle must use sync `lastKnownPosition` (from PLAY_PROGRESS) instead of async `getPosition()` for reliable save on toggle-off.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: SoundCloud audio plays on toggle activation
    Tool: Playwright (playwright skill)
    Preconditions: Blog page loaded at /blog, SoundCloud mock injected via addInitScript
    Steps:
      1. Navigate to /blog
      2. Inject SoundCloud Widget mock via page.addInitScript (mock SC.Widget constructor + prototype methods: play, pause, seekTo, setVolume, getPosition, bind, unbind)
      3. Block real SoundCloud requests: page.route('**soundcloud.com/**', route.abort())
      4. Click [data-testid="immerse-toggle"]
      5. Assert [data-testid="immerse-wrapper"] has attribute data-immerse-active="true"
      6. Assert mock widget.play() was called (verify via window.__scMock.playCalled flag in mock)
    Expected Result: Toggle activates immerse mode, widget.play() is invoked
    Failure Indicators: data-immerse-active is not "true", or play() was not called
    Evidence: .sisyphus/evidence/task-2-toggle-activation.png

  Scenario: Audio resumes after Blog→Home→Blog navigation
    Tool: Playwright (playwright skill)
    Preconditions: SoundCloud mock injected, localStorage cleared
    Steps:
      1. Navigate to /blog
      2. Click [data-testid="immerse-toggle"] to activate immerse
      3. Wait 500ms for state to persist
      4. Navigate to / (homepage)
      5. Wait 500ms
      6. Navigate back to /blog
      7. Assert [data-testid="immerse-wrapper"] has attribute data-immerse-active="true"
      8. Read localStorage 'blog-immerse' and assert: active === true, version === 2, position is a number >= 0
    Expected Result: Visual state restores, localStorage has correct shape with active=true
    Failure Indicators: Wrapper missing data-immerse-active, or localStorage has wrong shape/values
    Evidence: .sisyphus/evidence/task-2-navigation-resume.png

  Scenario: Toggle off saves position and pauses
    Tool: Playwright (playwright skill)
    Preconditions: SoundCloud mock injected, immerse is currently active
    Steps:
      1. Navigate to /blog
      2. Click [data-testid="immerse-toggle"] to activate
      3. Click [data-testid="immerse-toggle"] again to deactivate
      4. Assert [data-testid="immerse-wrapper"] does NOT have data-immerse-active attribute
      5. Read localStorage 'blog-immerse': assert active === false, version === 2, position is a number
      6. Assert mock widget.pause() was called
    Expected Result: Immerse deactivates, position saved, audio paused
    Failure Indicators: data-immerse-active still present, or localStorage active is not false
    Evidence: .sisyphus/evidence/task-2-toggle-off.png

  Scenario: Graceful degradation when SoundCloud is blocked
    Tool: Playwright (playwright skill)
    Preconditions: SoundCloud requests blocked, NO SC mock injected
    Steps:
      1. page.route('**soundcloud.com/**', route.abort()) — block all SoundCloud requests
      2. Add page.on('pageerror') listener to capture any uncaught errors
      3. Navigate to /blog
      4. Click [data-testid="immerse-toggle"]
      5. Assert [data-testid="immerse-wrapper"] has data-immerse-active="true" (visual mode works)
      6. Assert no uncaught page errors were captured
    Expected Result: Visual immerse activates even without audio, no crashes
    Failure Indicators: Page error captured, or visual state doesn't activate
    Evidence: .sisyphus/evidence/task-2-soundcloud-blocked.png

  Scenario: No silent error handlers remain
    Tool: Bash (ast_grep_search)
    Preconditions: Task 2 complete
    Steps:
      1. Search components/blog-immerse.tsx for pattern: catch { /* noop */ } or catch { }
      2. Search for any empty catch block
      3. Grep for "noop" in the file
    Expected Result: Zero matches — all catch blocks contain console.warn or console.error
    Failure Indicators: Any match found for empty catch or "noop"
    Evidence: .sisyphus/evidence/task-2-no-noop.txt
  ```

  **Commit**: YES
  - Message: `fix(blog): replace YouTube IFrame API with SoundCloud Widget API`
  - Files: `components/blog-immerse.tsx`
  - Pre-commit: `pnpm exec tsc --noEmit`

- [x] 3. Verify dark-shift visual mode works via config prop

  **What to do**:
  - Verify that `components/blog-immerse.tsx` correctly handles `mode='dark-shift'`:
    - When `mode='dark-shift'` AND `isImmersed=true`: wrapper div gets class `immerse-dark-shift`, and spotlight overlay does NOT render
    - When `mode='spotlight'` (default) AND `isImmersed=true`: spotlight overlay renders, no `immerse-dark-shift` class
  - Read the existing JSX in blog-immerse.tsx lines 227-262 — the mode logic is already implemented:
    - Line 231: `className={mode === 'dark-shift' && isImmersed ? 'immerse-dark-shift' : undefined}`
    - Line 247: `{isImmersed && mode === 'spotlight' && (<div data-testid="immerse-overlay" ... />)}`
  - Verify the CSS exists in `app/globals.css`:
    - `.immerse-dark-shift` (lines 58-71): Redefines CSS variables for dark palette
    - `.immerse-dark-shift .glass` (lines 73-76): Updates glass effect for dark theme
  - **This task is verification-only if the mode logic already works**. If any issue is found, fix it. The expectation is that the code already handles both modes correctly — this task confirms it and ensures the E2E test (Task 4) has a known-good baseline.
  - **No changes to `app/blog/layout.tsx`** — the layout keeps the default (spotlight). Dark-shift is available if the developer changes the prop.

  **Must NOT do**:
  - Do not add runtime mode switching UI
  - Do not change the layout to use dark-shift
  - Do not modify globals.css

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: This is a verification task — reading existing code to confirm both mode paths work. May require zero code changes if the logic is already correct.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 4 (tests need to know both modes work)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/blog-immerse.tsx:231` — Dark-shift class application: `className={mode === 'dark-shift' && isImmersed ? 'immerse-dark-shift' : undefined}`. Verify this conditional is correct.
  - `components/blog-immerse.tsx:247-249` — Spotlight overlay render: `{isImmersed && mode === 'spotlight' && ...}`. Verify spotlight does NOT render in dark-shift mode.
  - `app/globals.css:58-76` — Dark-shift CSS definitions. Verify these exist and define the correct CSS variables.
  - `app/globals.css:42-56` — Spotlight overlay CSS. Verify z-index layering works for both modes.
  - `components/blog-immerse.tsx:62-65` — `BlogImmerseProps` interface. Verify `mode?: 'spotlight' | 'dark-shift'` is the type.

  **WHY Each Reference Matters**:
  - Line 231 is the dark-shift activation logic — needs to work for both modes
  - Lines 247-249 ensure spotlight overlay only appears in spotlight mode, not dark-shift
  - CSS lines confirm the visual styling exists and transitions work

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  **Dark-shift test harness approach**: Since `app/blog/layout.tsx` renders `<BlogImmerse>` with the default `mode='spotlight'`, there is no route that renders `mode='dark-shift'`. Testing dark-shift requires a two-pronged approach:
  1. **Static verification** (code inspection): Verify via grep/ast_grep that the component conditionally applies `immerse-dark-shift` class when `mode === 'dark-shift' && isImmersed` and that the spotlight overlay only renders when `mode === 'spotlight'`.
  2. **CSS verification** (Playwright): Use `page.evaluate` to manually add the `immerse-dark-shift` class to the wrapper element and verify the CSS custom properties change correctly. This proves the CSS is correct even though no route passes the prop.

  ```
  Scenario: Component code correctly branches on mode='dark-shift'
    Tool: Bash (grep)
    Preconditions: Task 2 rewrite complete (or existing code if mode logic is unchanged)
    Steps:
      1. Run: grep "mode === 'dark-shift'" components/blog-immerse.tsx — assert count >= 1
      2. Run: grep "immerse-dark-shift" components/blog-immerse.tsx — assert count >= 1
      3. Run: grep "mode === 'spotlight'" components/blog-immerse.tsx — assert count >= 1 (overlay guard)
      4. Verify the class application line: grep -n "dark-shift.*isImmersed\|isImmersed.*dark-shift" components/blog-immerse.tsx — assert count >= 1 (both conditions required)
    Expected Result: Component has correct conditional: dark-shift class applied when mode='dark-shift' AND isImmersed, spotlight overlay only renders when mode='spotlight'
    Failure Indicators: Missing mode checks, or unconditional class application
    Evidence: .sisyphus/evidence/task-3-dark-shift-code-verification.txt

  Scenario: Dark-shift CSS custom properties are defined and change visual appearance
    Tool: Playwright (playwright skill)
    Preconditions: Blog page loaded at /blog
    Steps:
      1. Navigate to /blog
      2. Read initial CSS custom property: page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-surface'))
      3. Use page.evaluate to add class 'immerse-dark-shift' to [data-testid="immerse-wrapper"]:
         page.evaluate(() => document.querySelector('[data-testid="immerse-wrapper"]').classList.add('immerse-dark-shift'))
      4. Read CSS custom property again: page.evaluate(() => getComputedStyle(document.querySelector('.immerse-dark-shift')).getPropertyValue('--color-surface'))
      5. Assert the value changed (dark-shift redefines --color-surface to a darker value)
      6. Take screenshot showing dark-shift visual state
    Expected Result: --color-surface value changes when .immerse-dark-shift class is applied, proving CSS is functional
    Failure Indicators: CSS property unchanged, or .immerse-dark-shift class has no effect
    Evidence: .sisyphus/evidence/task-3-dark-shift-css.png

  Scenario: Spotlight mode (default) renders overlay, no dark-shift class
    Tool: Playwright (playwright skill)
    Preconditions: Blog page with default mode (spotlight)
    Steps:
      1. Navigate to /blog
      2. Click [data-testid="immerse-toggle"]
      3. Assert [data-testid="immerse-overlay"] is visible
      4. Assert [data-testid="immerse-wrapper"] does NOT have class 'immerse-dark-shift'
    Expected Result: Overlay visible, no dark-shift class
    Failure Indicators: Overlay missing, or dark-shift class present
    Evidence: .sisyphus/evidence/task-3-spotlight-verification.png
  ```

  **Commit**: NO (verification task — no code changes expected)

- [x] 4. Update E2E tests for SoundCloud integration

  **What to do**:
  - **Rewrite the SoundCloud mock** (replacing the YouTube mock at lines 100-122):
    - Create `mockSCScript` string that sets up `window.SC.Widget` as a constructor function
    - Mock must track calls: `play()`, `pause()`, `seekTo(ms)`, `setVolume(vol)` — store in `window.__scMock` for test assertions
    - Mock `.bind(event, callback)` to store callbacks and fire READY immediately (via setTimeout 50ms, matching current mock pattern)
    - Mock `.getPosition(callback)` to call back with `this._position || 0`
    - Mock `.unbind()` as noop
    - Mock `SC.Widget.Events` with string constants: `{ READY: 'ready', PLAY: 'play', PAUSE: 'pause', FINISH: 'finish', PLAY_PROGRESS: 'playProgress', SEEK: 'seek', ERROR: 'error' }`
  - **Update existing tests**:
    - `YouTube iframe` describe block → rename to `SoundCloud iframe` or `Audio iframe`
    - Update iframe presence test: assert `[data-testid="immerse-audio-iframe"]` (was `immerse-youtube-iframe`)
    - Update iframe src params test: assert src contains `soundcloud.com/player`, `richarddjames/xtal` (URL-encoded), `auto_play=false`. Remove YouTube-specific assertions (sWcLccMuCA8, enablejsapi, playlist, etc.)
    - Update iframe hidden test: same logic, new testid selector
    - Update localStorage persistence tests: replace `mockYTScript` with `mockSCScript`. Assert stored shape is `{ version: 2, active: boolean, position: number }` (was `{ active, time }`)
  - **Add NEW tests**:
    - **Blog→Home→Blog navigation test** (CRITICAL — this is the primary bug regression test):
      ```
      test('audio state persists across Blog→Home→Blog navigation', async ({ page }) => {
        await page.route('**soundcloud.com/**', route => route.abort());
        await page.addInitScript({ content: mockSCScript });
        await page.goto('/blog');
        await page.evaluate(() => localStorage.removeItem('blog-immerse'));
        await page.locator('[data-testid="immerse-toggle"]').click();
        await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute('data-immerse-active', 'true');
        await page.goto('/');
        await page.goto('/blog');
        await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute('data-immerse-active', 'true', { timeout: 5000 });
      });
      ```
    - **Dark-shift mode test**: Verify dark-shift CSS works using a two-pronged approach:
      1. **Code path test**: Use `ast_grep_search` or grep to verify component source has correct `mode === 'dark-shift'` conditional that applies `immerse-dark-shift` class and suppresses overlay.
      2. **CSS test**: In Playwright, navigate to /blog, use `page.evaluate` to manually add `immerse-dark-shift` class to the wrapper, then assert CSS custom properties changed (e.g., `--color-surface` gets darker). This proves the CSS is correct without needing a route that passes `mode='dark-shift'`.
      Note: No test route is needed — the combination of code-path verification + CSS verification covers both the React logic and the visual output.
    - **SoundCloud blocked graceful degradation test**: Block all soundcloud.com requests, do NOT inject mock. Click toggle. Assert visual state activates, no page errors.
    - **localStorage version migration test**: Set old-format localStorage `{"active":true,"time":42}` (no version), reload. Assert immerse does NOT auto-activate (old data invalidated).
  - **Keep all non-YouTube-specific tests unchanged**: Toggle rendering, activation/deactivation, accessibility, rapid toggles, prefers-reduced-motion, empty blog state

  **Must NOT do**:
  - Do not create separate test utility files — keep mock inline (matches existing pattern)
  - Do not add unit tests — project uses E2E only
  - Do not test actual SoundCloud API (tests must work offline with mocks)
  - Do not remove tests for behaviors that still exist (toggle, overlay, accessibility, edge cases)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires careful understanding of Playwright patterns, SoundCloud Widget API mock design, and ensuring all existing test scenarios still pass with the new mock. Not creative work, but requires attention to detail and thorough coverage.
  - **Skills**: [`playwright`]
    - `playwright`: Needed for E2E test authoring patterns, Playwright API reference, mock injection best practices

  **Parallelization**:
  - **Can Run In Parallel**: NO (needs Task 2 component changes to test against)
  - **Parallel Group**: Wave 2 (after Task 2)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 2, Task 3

  **References**:

  **Pattern References** (existing code to follow):
  - `e2e/blog-immerse.spec.ts:4-7` — `beforeEach` pattern: navigate to /blog, clear localStorage. Keep this pattern.
  - `e2e/blog-immerse.spec.ts:100-122` — Current `mockYTScript` inline mock. **Replace** with `mockSCScript` following same inline string pattern, same setTimeout(50) for async ready callback.
  - `e2e/blog-immerse.spec.ts:124-142` — localStorage persistence test with reload. Update shape assertions from `{ active, time }` to `{ version: 2, active, position }`.
  - `e2e/blog-immerse.spec.ts:177-197` — "Visual state restores even when YouTube is blocked" test. Adapt for SoundCloud blocked scenario.
  - `e2e/blog-immerse.spec.ts:226-235` — Rapid toggle test. Keep as-is (behavior unchanged).

  **Test References**:
  - `e2e/blog-immerse.spec.ts:66-77` — iframe src param assertions. Replace YouTube params with SoundCloud params.
  - `e2e/blog-immerse.spec.ts:161-175` — localStorage stores active:false test. Update shape assertion.

  **WHY Each Reference Matters**:
  - Lines 100-122 define the mock strategy — the new SoundCloud mock must follow the same pattern (inline string, prototype methods, setTimeout for async ready)
  - Lines 124-142 test the core persistence flow — must be updated for new data shape
  - The Blog→Home→Blog test is the PRIMARY regression test for the bug being fixed — it has no equivalent in current tests

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All E2E tests pass
    Tool: Bash
    Preconditions: Task 2 component changes applied, Task 4 test changes applied
    Steps:
      1. Run: pnpm exec playwright test e2e/blog-immerse.spec.ts
      2. Check exit code and test results
    Expected Result: All tests pass, exit code 0
    Failure Indicators: Any test failure or timeout
    Evidence: .sisyphus/evidence/task-4-e2e-results.txt

  Scenario: Navigation persistence test specifically passes
    Tool: Bash
    Preconditions: Blog→Home→Blog test exists in spec file
    Steps:
      1. Run: pnpm exec playwright test e2e/blog-immerse.spec.ts -g "navigation"
      2. Check that the navigation test passes
    Expected Result: Test passes — visual state restores after Blog→Home→Blog
    Failure Indicators: Timeout waiting for data-immerse-active attribute after navigation
    Evidence: .sisyphus/evidence/task-4-navigation-test.txt

  Scenario: No YouTube references remain in test file
    Tool: Bash (grep)
    Preconditions: Task 4 complete
    Steps:
      1. Search e2e/blog-immerse.spec.ts for "youtube", "YouTube", "YT", "sWcLccMuCA8"
      2. Assert zero matches
    Expected Result: No YouTube references in test file
    Failure Indicators: Any match found
    Evidence: .sisyphus/evidence/task-4-no-youtube-refs.txt
  ```

  **Commit**: YES
  - Message: `test(blog): update E2E tests for SoundCloud widget and add navigation test`
  - Files: `e2e/blog-immerse.spec.ts`
  - Pre-commit: `pnpm exec playwright test e2e/blog-immerse.spec.ts`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check assertions). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm exec tsc --noEmit` + `pnpm lint`. Review `components/blog-immerse.tsx` for: `as any`/`@ts-ignore`, empty catches, console.log in prod (console.warn is OK for error paths), commented-out code, unused imports. Check for AI slop: excessive comments, over-abstraction, generic variable names. Verify no YouTube references remain.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: Blog→Home→Blog navigation with both modes. Test edge cases: rapid toggles, SoundCloud blocked, reload persistence. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance: no new npm deps, no CSS changes, no layout changes, no volume UI, no playlist UI. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| # | Message | Files | Pre-commit |
|---|---------|-------|------------|
| 1 | `fix(blog): replace YouTube IFrame API with SoundCloud Widget API` | `components/blog-immerse.tsx` | `pnpm exec tsc --noEmit` |
| 2 | `test(blog): update E2E tests for SoundCloud widget and add navigation test` | `e2e/blog-immerse.spec.ts` | `pnpm exec playwright test e2e/blog-immerse.spec.ts` |

---

## Success Criteria

### Verification Commands
```bash
pnpm exec tsc --noEmit          # Expected: exit 0, no errors
pnpm lint                        # Expected: exit 0, no errors
pnpm exec playwright test e2e/blog-immerse.spec.ts  # Expected: all tests pass
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items confirmed absent
- [ ] All E2E tests pass
- [ ] Zero silent error handlers (`/* noop */`) remain
- [ ] No YouTube references remain in components/blog-immerse.tsx
- [ ] Both visual modes functional
- [ ] Blog→Home→Blog navigation: audio resumes correctly
