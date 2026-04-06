# Blog Immerse Mode — Hidden YouTube Background Music

## TL;DR

> **Quick Summary**: Add an "Immerse" reading mode to all blog pages that, on user click, darkens the page and plays background music from a hidden YouTube embed (video ID: `sWcLccMuCA8`). Two visual modes built for comparison: Spotlight/Vignette and Full Dark Mode Shift.
> 
> **Deliverables**:
> - `components/blog-immerse.tsx` — Client component with immerse state, hidden YouTube iframe, floating toggle button, visual overlay logic, localStorage persistence
> - `app/globals.css` additions — CSS utilities for immerse visual modes (spotlight + dark-shift)
> - `app/blog/layout.tsx` modification — Mount `<BlogImmerse />` wrapping blog children
> - `e2e/blog-immerse.spec.ts` — Playwright E2E tests for all acceptance criteria
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 2 waves + final verification
> **Critical Path**: Task 1 (CSS) → Task 2 (Component) → Task 3 (Integration) → Task 4 (E2E) → Final Verification

---

## Context

### Original Request
User wants background music to play automatically when landing on the blog page for an immersive reading experience. A YouTube video (`https://youtu.be/sWcLccMuCA8`) should be embedded but hidden, with audio starting without interrupting page layout. Must work across Chrome, Firefox, Safari, and Edge.

### Interview Summary
**Key Discussions**:
- **Autoplay restriction**: Modern browsers block autoplay with sound. Solution: an "Immerse" button serves as the required user gesture — elegant and intentional rather than a workaround.
- **Visual transformation**: Two modes to build for comparison — (1) Spotlight/Vignette (dark overlay dims surroundings, content stays bright), (2) Full Dark Mode Shift (entire page goes dark).
- **Music behavior**: Loops continuously, persists uninterrupted across blog page navigations (blog layout stays mounted), preference saved via localStorage.
- **Button design**: Floating bottom-right toggle using existing `.glass` aesthetic. Same button enters and exits immerse mode.
- **Scope**: Blog pages only (`/blog` and `/blog/[slug]`), both index and individual posts.

**Research Findings**:
- `app/blog/layout.tsx` is a passthrough layout — perfect insertion point, stays mounted across blog navigations
- Muted autoplay (`autoplay=1&mute=1`) is universally supported across all browsers — iframe preloads muted so music starts instantly on Immerse click
- `display:none` and `visibility:hidden` PAUSE iframe playback — must use off-screen positioning (`position:absolute; left:-9999px`)
- YouTube `loop=1` alone doesn't loop single videos — must also include `playlist=VIDEO_ID`
- `enablejsapi=1` + `origin` param required for programmatic mute/unmute via YT IFrame API
- YT API has race condition risk: `onYouTubeIframeAPIReady` may fire before React effect — need dual-path initialization
- `prefers-reduced-motion` is already respected in globals.css — immerse transitions must also respect this
- Existing components use `data-testid` attributes for Playwright testing (e.g., `blog-post-card`, `nav-blog`)
- No existing media code, audio/video elements, or YouTube integrations in the project
- No npm dependencies needed — YouTube API loads via script tag

### Metis Review
**Identified Gaps** (addressed):
- **iframe hiding method**: Must NOT use `display:none` — browser suspends playback. Using off-screen absolute positioning instead.
- **Loop param**: `loop=1` alone doesn't loop single videos — adding `playlist=sWcLccMuCA8` param.
- **YT API race condition**: Dual-path init — set `window.onYouTubeIframeAPIReady` callback AND check `window.YT?.Player` in useEffect.
- **localStorage semantics**: Store immerse *preference* (on/off + mode), NOT active playing state. On load with preference "on", auto-enter immerse after iframe ready.
- **prefers-reduced-motion**: Transitions must skip/minimize when reduced motion is preferred. Apply visual changes instantly.
- **Mobile graceful degradation**: If audio fails on mobile, visual-only immerse mode should still work (degrade gracefully).
- **Empty blog state**: No actual blog posts exist yet — immerse button must work on empty `/blog` page too.
- **CSP**: Verify no Content Security Policy blocking YouTube iframe in next.config.
- **Volume on first unmute**: Start at moderate volume (25-30%) to avoid jarring the user.

---

## Work Objectives

### Core Objective
Add a self-contained "Immerse" mode to the blog section that combines visual atmosphere (dark overlay or full dark mode) with hidden YouTube background music, activated by a floating toggle button.

### Concrete Deliverables
- `components/blog-immerse.tsx` — Complete client component
- Updated `app/globals.css` — Immerse CSS utilities
- Updated `app/blog/layout.tsx` — Mount immerse component
- `e2e/blog-immerse.spec.ts` — Full E2E test coverage

### Definition of Done
- [ ] Floating "Immerse" toggle button visible on `/blog` and `/blog/[slug]` pages
- [ ] Clicking toggle activates visual overlay + unmutes background music
- [ ] Clicking again deactivates overlay + mutes music
- [ ] YouTube iframe present in DOM but invisible on screen (no layout gaps)
- [ ] Music loops continuously without interruption across blog page navigations
- [ ] User preference (on/off) persisted via localStorage across sessions
- [ ] Both visual modes (spotlight + dark-shift) implemented and switchable via prop
- [ ] Works on Chrome, Firefox, Safari, Edge (muted preload + unmute on click)
- [ ] Mobile: graceful degradation if audio fails (visual-only immerse still works)
- [ ] `prefers-reduced-motion` respected — transitions skipped when enabled
- [ ] `bun run build` succeeds, all existing E2E tests pass, new E2E tests pass
- [ ] Page load speed not significantly impacted (lazy YouTube script loading)

### Must Have
- Hidden YouTube iframe that preloads muted on page mount
- Floating bottom-right toggle button with `.glass` aesthetic
- Programmatic mute/unmute via YouTube IFrame API on toggle click
- Spotlight/Vignette visual mode (dark overlay, content stays bright)
- Full Dark Mode Shift visual mode (entire page dark scheme)
- localStorage persistence of immerse preference
- Continuous looping music across blog navigations
- `data-testid` attributes on all interactive/testable elements
- Playwright E2E tests covering all acceptance criteria

### Must NOT Have (Guardrails)
- Do NOT use `display:none` or `visibility:hidden` on YouTube iframe — browser will suspend playback
- Do NOT add any npm dependencies — YouTube API loads via `<script>` tag
- Do NOT modify `components/Navigation.tsx`, `components/blog-content.tsx`, or `app/layout.tsx`
- Do NOT create React Context providers — feature is self-contained in blog layout
- Do NOT build volume slider, keyboard shortcuts, or settings UI — out of scope
- Do NOT attempt to persist music across non-blog routes — blog layout unmounts on nav away, this is expected
- Do NOT add JSDoc comments to every function — this is a clean, focused component
- Do NOT create abstract factory patterns for visual modes — simple conditional CSS classes
- Do NOT use `next/dynamic` with `ssr: false` — `useEffect` in a `'use client'` component is sufficient
- Do NOT test actual audio playback in Playwright — verify iframe presence and params instead
- Do NOT add screenshot comparison tests for overlays — use DOM assertions only

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES — Playwright E2E in `e2e/` directory
- **Automated tests**: YES (Tests-after) — Write E2E tests after component implementation
- **Framework**: Playwright (existing), `bun run build` for static build verification

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — Run `bun run build`, verify exit code
- **Static output**: Use Bash — Check built files contain expected iframe/script references

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — CSS + Component in parallel):
├── Task 1: Immerse CSS utilities in globals.css [quick]
├── Task 2: BlogImmerse component with YouTube embed [deep]

Wave 2 (After Wave 1 — Integration + Tests):
├── Task 3: Mount BlogImmerse in blog layout (depends: 1, 2) [quick]
├── Task 4: Playwright E2E tests (depends: 3) [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3 | 1 |
| 2 | — (can start with 1, references CSS class names) | 3 | 1 |
| 3 | 1, 2 | 4 | 2 |
| 4 | 3 | Final | 2 |
| F1-F4 | 4 | — | Final |

### Agent Dispatch Summary

- **Wave 1**: **2 tasks** — T1 → `quick`, T2 → `deep`
- **Wave 2**: **2 tasks** — T3 → `quick`, T4 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright` skill, F4 → `deep`

---

## TODOs

- [x] 1. Immerse Mode CSS Utilities & Visual Overlay Styles

  **What to do**:
  - Add CSS utilities to `app/globals.css` inside the existing `@layer components` block
  - **Spotlight/Vignette mode** (`.immerse-spotlight-overlay`):
    - A full-viewport fixed overlay with dark semi-transparent background (`rgba(0, 0, 0, 0.75)`)
    - Uses CSS `pointer-events: none` so user can still interact with content beneath
    - The blog content area (`.max-w-3xl` container) gets `pointer-events: auto` and stays at full brightness via `position: relative; z-index: 40`
    - Overlay sits at `z-index: 30` (below nav's `z-50` so nav is still accessible but dimmed visually)
    - Smooth transition: `opacity 0` → `opacity 1` over 500ms
  - **Full Dark Mode Shift** (`.immerse-dark-shift`):
    - Applied as a class on the wrapping element, changes CSS variables:
      - `--color-background: #1a1a2e` (deep navy)
      - `--color-on-surface: #e8e6e1` (warm light text)
      - `--color-on-surface-variant: #a8a6a1` (muted light text)
      - `--color-surface-container: #252540` (dark container)
      - `--color-surface-container-low: #1f1f38` (darker container)
      - `--color-surface-container-lowest: #151528` (darkest)
      - `--color-primary: #7eb8d8` (brighter blue for dark bg)
      - `--color-primary-container: #2a4a5e` (dark blue container)
      - `--color-outline-variant: #4a4a60` (dark border)
    - Transition all color changes over 500ms
    - `.glass` effect within dark-shift context: adjust `background: rgba(26, 26, 46, 0.7)` and border color
  - **Floating button positioning** (`.immerse-button`):
    - `position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 60` (above everything including overlays)
    - Size: 48×48px, `border-radius: 9999px` (full circle)
    - Uses `.glass` and `.ambient-shadow` for consistency with nav aesthetic
    - Hover: subtle scale transform (`scale(1.05)`)
    - Active state: filled background with primary color
  - **Reduced motion override**:
    - Inside `@media (prefers-reduced-motion: reduce)`, set `transition-duration: 0.01ms !important` for all immerse classes (matching existing pattern in globals.css)
  - **YouTube iframe hiding utility** (`.immerse-iframe-hidden`):
    - `position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none;`
    - NOT `display: none` or `visibility: hidden` — these pause playback

  **Must NOT do**:
  - Do NOT use `display:none` or `visibility:hidden` in the iframe hiding class
  - Do NOT modify existing `.glass`, `.ambient-shadow`, or `.ghost-border` classes
  - Do NOT add CSS outside of `@layer components` except for the `prefers-reduced-motion` override
  - Do NOT use Tailwind `@apply` — write raw CSS in the components layer (matching existing pattern)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, additive CSS only, no complex logic — just well-structured CSS utilities
  - **Skills**: []
    - No special skills needed — straightforward CSS authoring
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — CSS utilities are prescribed, not designed from scratch

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):

  **Pattern References**:
  - `app/globals.css:27-41` — Existing `@layer components` block with `.glass`, `.ambient-shadow`, `.ghost-border` classes — follow this exact pattern for new CSS utilities
  - `app/globals.css:43-49` — Existing `prefers-reduced-motion` override — add immerse transition overrides in this same block
  - `app/globals.css:3-18` — Existing `@theme` CSS variable definitions — reference these variable names for the dark-shift mode overrides

  **API/Type References**:
  - `components/Navigation.tsx:18` — Nav uses `z-50` class — immerse overlay must be `z-30` (below nav) and button must be `z-60` (above all)

  **External References**:
  - MDN: `pointer-events: none` — https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events — for click-through overlay behavior

  **WHY Each Reference Matters**:
  - `globals.css:27-41`: The new CSS utilities MUST follow the existing `@layer components` pattern — raw CSS, no `@apply`, consistent naming
  - `globals.css:43-49`: The reduced-motion override MUST follow the existing pattern to ensure immerse transitions respect user preferences
  - `globals.css:3-18`: The dark-shift mode overrides these exact CSS variable names, so the executor needs to know what they're called and what the light-mode values are
  - `Navigation.tsx:18`: z-index layering must not break the nav — button above, overlay below

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: CSS utilities load without build errors
    Tool: Bash
    Preconditions: Working project with no prior changes
    Steps:
      1. Run `bun run build`
      2. Check exit code is 0
      3. Run `bun run lint`
      4. Check exit code is 0
    Expected Result: Build and lint both pass with zero errors
    Failure Indicators: Non-zero exit code, CSS syntax errors in build output
    Evidence: .sisyphus/evidence/task-1-build-check.txt

  Scenario: CSS classes exist in built output
    Tool: Bash
    Preconditions: Successful build from previous scenario
    Steps:
      1. Search `app/globals.css` for `.immerse-spotlight-overlay` class definition
      2. Search for `.immerse-dark-shift` class definition
      3. Search for `.immerse-button` class definition
      4. Search for `.immerse-iframe-hidden` class definition
      5. Verify each class has the prescribed properties (z-index values, position, pointer-events)
    Expected Result: All 4 CSS classes present with correct properties
    Failure Indicators: Missing class, wrong z-index, missing pointer-events
    Evidence: .sisyphus/evidence/task-1-css-classes-check.txt

  Scenario: Reduced motion override present
    Tool: Bash
    Preconditions: globals.css updated
    Steps:
      1. Search `app/globals.css` for `prefers-reduced-motion` block
      2. Verify immerse-related classes have transition-duration override within the media query
    Expected Result: All immerse transition classes are covered by reduced-motion override
    Failure Indicators: Missing override for immerse classes
    Evidence: .sisyphus/evidence/task-1-reduced-motion-check.txt
  ```

  **Commit**: YES (Commit 1)
  - Message: `feat(blog): add immerse mode CSS utilities and visual overlay styles`
  - Files: `app/globals.css`
  - Pre-commit: `bun run build && bun run lint`

- [x] 2. BlogImmerse Component with YouTube Background Music

  **What to do**:
  - Create `components/blog-immerse.tsx` as a `'use client'` component
  - **Component structure**:
    - Props: `children: React.ReactNode`, `mode?: 'spotlight' | 'dark-shift'` (default: `'spotlight'`)
    - State: `isImmersed` (boolean), `isPlayerReady` (boolean)
    - The component wraps its children and renders the iframe + button alongside them
  - **YouTube iframe setup** (renders on mount, hidden off-screen):
    - Render an `<iframe>` with `className="immerse-iframe-hidden"` (CSS from Task 1)
    - src: `https://www.youtube.com/embed/sWcLccMuCA8?autoplay=1&mute=1&enablejsapi=1&loop=1&playlist=sWcLccMuCA8&controls=0&playsinline=1&origin=${window.location.origin}`
    - Attributes: `allow="autoplay"`, `title="Background music"`, `tabIndex={-1}`, `aria-hidden="true"`
    - Add `data-testid="immerse-youtube-iframe"`
  - **YouTube IFrame API loading** (via `next/script` or manual script injection):
    - Load `https://www.youtube.com/iframe_api` script with `strategy="lazyOnload"` (or via `useEffect` appending a `<script>` tag)
    - **Dual-path initialization** to handle race condition:
      1. Set `window.onYouTubeIframeAPIReady` callback before script loads
      2. In `useEffect`, also check if `window.YT?.Player` already exists (script loaded before effect ran)
    - When API is ready, create `new window.YT.Player(iframeRef)` targeting the existing iframe element
    - Set `isPlayerReady = true` once `onReady` event fires
    - On `onReady`: set volume to 30% (`player.setVolume(30)`) — keeps it muted but at comfortable volume for when user unmutes
  - **Immerse toggle logic**:
    - On click (entering immerse):
      - Set `isImmersed = true`
      - If `isPlayerReady`: call `player.unMute()` and `player.playVideo()` (in case paused)
      - If NOT ready: queue the unmute for when player becomes ready
      - Save preference to localStorage: `localStorage.setItem('blog-immerse', JSON.stringify({ active: true, mode }))`
    - On click (exiting immerse):
      - Set `isImmersed = false`
      - Call `player.mute()`
      - Update localStorage: `localStorage.setItem('blog-immerse', JSON.stringify({ active: false, mode }))`
  - **Visual mode application**:
    - Wrap children in a `<div>` with `data-testid="immerse-wrapper"` and `data-immerse-active={isImmersed ? "true" : undefined}`
    - When `isImmersed && mode === 'spotlight'`: render a sibling `<div>` with `className="immerse-spotlight-overlay"` and `data-testid="immerse-overlay"`
    - When `isImmersed && mode === 'dark-shift'`: add `className="immerse-dark-shift"` to the wrapper div
  - **Floating toggle button**:
    - Render a `<button>` with `className="immerse-button glass ambient-shadow"` and `data-testid="immerse-toggle"`
    - `aria-label={isImmersed ? "Exit immerse mode" : "Enter immerse mode"}`
    - `aria-pressed={isImmersed}`
    - Icon: Use a simple SVG or Unicode character — headphones/music note when inactive (🎧), X or stop when active (✕)
    - When `!isPlayerReady && !isImmersed`: button still renders but shows a loading state is NOT needed (iframe preloads immediately, player ready within 1-2s)
  - **localStorage restoration on mount**:
    - In `useEffect`, check `localStorage.getItem('blog-immerse')`
    - If stored preference is `{ active: true }`, wait for `isPlayerReady` then auto-enter immerse mode
    - This means returning users who previously immersed will auto-immerse on blog visit
  - **Graceful degradation**:
    - If YouTube API fails to load (network error, blocked by extension), the button still works for visual-only immerse
    - Wrap `player.unMute()` and `player.playVideo()` calls in try/catch — if they fail, visual mode still activates
    - No error toasts or notifications — silent degradation
  - **Cleanup**:
    - On component unmount (navigating away from blog): call `player.destroy()` to clean up YT player instance
    - Remove `window.onYouTubeIframeAPIReady` callback on unmount

  **Must NOT do**:
  - Do NOT use `display:none` or `visibility:hidden` on the iframe
  - Do NOT add npm dependencies
  - Do NOT create React Context
  - Do NOT build volume slider or keyboard shortcuts
  - Do NOT use `next/dynamic` with `ssr: false`
  - Do NOT add JSDoc to every function

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex client component with YouTube IFrame API integration, race condition handling, state management, localStorage, graceful degradation — requires careful, thorough implementation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: The button design and visual overlay implementation require UI craftsmanship to match the editorial minimalism aesthetic
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for this task — testing is Task 4

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1 — references CSS class names but doesn't need the file to exist yet)
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None (can reference CSS class names from Task 1's spec)

  **References** (CRITICAL):

  **Pattern References**:
  - `components/blog-content.tsx:1` — `'use client'` directive pattern — this component is the closest parallel (client component in blog section)
  - `components/blog-content.tsx:14-87` — Component structure pattern: inner component + export wrapper with Suspense — though BlogImmerse doesn't need Suspense, follow the naming/export conventions
  - `components/Navigation.tsx:18` — Glass button styling with Tailwind classes (`glass rounded-full`, etc.) — the immerse button should feel like it belongs to the same design system
  - `components/Navigation.tsx:26-27` — Transition and hover class patterns used on interactive elements

  **API/Type References**:
  - `app/globals.css:3-18` — CSS variable names that the dark-shift mode overrides (exact variable names needed)
  - `app/blog/layout.tsx:8-9` — Layout signature `({ children }: { children: React.ReactNode })` — BlogImmerse must accept and render children from this layout

  **External References**:
  - YouTube IFrame API: `https://developers.google.com/youtube/iframe_api_reference` — `YT.Player` constructor, `onReady` event, `mute()`, `unMute()`, `setVolume()`, `playVideo()`, `destroy()` methods
  - YouTube Player Parameters: `https://developers.google.com/youtube/player_parameters` — `autoplay`, `mute`, `enablejsapi`, `loop`, `playlist`, `controls`, `playsinline`, `origin` params
  - `next/script`: `https://nextjs.org/docs/app/api-reference/components/script` — `strategy="lazyOnload"` for loading external scripts in static export

  **WHY Each Reference Matters**:
  - `blog-content.tsx`: Shows the established pattern for `'use client'` components in the blog section — follow naming, directive placement, export style
  - `Navigation.tsx:18,26-27`: The immerse button MUST match the glass nav pill aesthetic — use the same Tailwind class patterns
  - `globals.css:3-18`: The dark-shift mode overrides these specific CSS variables — executor needs to know the exact names
  - `layout.tsx:8-9`: BlogImmerse wraps children from this layout, so the prop signature must be compatible
  - YouTube API docs: Critical for correct `YT.Player` initialization, event handling, and mute/unmute control — incorrect usage will cause silent failures

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Component builds without TypeScript errors
    Tool: Bash
    Preconditions: Component file created at components/blog-immerse.tsx
    Steps:
      1. Run `bun run build`
      2. Check exit code is 0
      3. Run `bun run lint`
    Expected Result: Zero type errors, zero lint errors
    Failure Indicators: TypeScript compilation error mentioning blog-immerse.tsx
    Evidence: .sisyphus/evidence/task-2-build-check.txt

  Scenario: Component exports correctly and accepts children
    Tool: Bash
    Preconditions: Component file exists
    Steps:
      1. Read components/blog-immerse.tsx
      2. Verify it has 'use client' directive at top
      3. Verify default export function accepts { children, mode? } props
      4. Verify it renders children inside the wrapper div
    Expected Result: Component has correct directive, props, and renders children
    Failure Indicators: Missing 'use client', wrong prop types, children not rendered
    Evidence: .sisyphus/evidence/task-2-component-structure-check.txt

  Scenario: YouTube iframe has correct attributes
    Tool: Bash
    Preconditions: Component file exists
    Steps:
      1. Read components/blog-immerse.tsx
      2. Verify iframe src includes: sWcLccMuCA8, autoplay=1, mute=1, enablejsapi=1, loop=1, playlist=sWcLccMuCA8, controls=0, playsinline=1
      3. Verify iframe has allow="autoplay" attribute
      4. Verify iframe has data-testid="immerse-youtube-iframe"
      5. Verify iframe has className="immerse-iframe-hidden"
      6. Verify iframe has aria-hidden="true" and tabIndex={-1}
    Expected Result: All required attributes present with correct values
    Failure Indicators: Missing params, wrong video ID, missing allow attribute
    Evidence: .sisyphus/evidence/task-2-iframe-attributes-check.txt

  Scenario: Dual-path YT API initialization present
    Tool: Bash
    Preconditions: Component file exists
    Steps:
      1. Read components/blog-immerse.tsx
      2. Verify window.onYouTubeIframeAPIReady callback is set
      3. Verify fallback check for window.YT?.Player exists in useEffect
      4. Verify player.destroy() is called in useEffect cleanup
    Expected Result: Both initialization paths present, cleanup on unmount
    Failure Indicators: Only one init path, missing cleanup
    Evidence: .sisyphus/evidence/task-2-yt-api-init-check.txt
  ```

  **Commit**: YES (Commit 2)
  - Message: `feat(blog): add BlogImmerse component with YouTube background music`
  - Files: `components/blog-immerse.tsx`
  - Pre-commit: `bun run build && bun run lint`

- [x] 3. Mount BlogImmerse in Blog Layout

  **What to do**:
  - Modify `app/blog/layout.tsx` to import and render `<BlogImmerse />` wrapping `{children}`
  - The layout currently returns `<>{children}</>` — change to return `<BlogImmerse>{children}</BlogImmerse>`
  - Import: `import BlogImmerse from '@/components/blog-immerse';`
  - Keep the existing `metadata` export unchanged
  - The layout remains a server component — importing a client component (`BlogImmerse`) is fine in Next.js App Router (the client boundary is inside the component itself)

  **Must NOT do**:
  - Do NOT change the metadata export
  - Do NOT add `'use client'` to the layout file — it should remain a server component
  - Do NOT add any other components or wrappers
  - Do NOT modify any other layout files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Tiny file edit — add 1 import line and change 1 JSX line. Under 5 lines of change.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — this is a 2-line wiring change

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Task 4
  - **Blocked By**: Tasks 1, 2

  **References** (CRITICAL):

  **Pattern References**:
  - `app/blog/layout.tsx:1-10` — Current layout file (full content) — this is the file being modified, executor must see current state
  - `app/layout.tsx:1-30` (approx) — Root layout pattern — shows how components are imported and rendered alongside children in Next.js layouts

  **API/Type References**:
  - `components/blog-immerse.tsx` (from Task 2) — The component's default export and props signature (`{ children, mode? }`)

  **WHY Each Reference Matters**:
  - `app/blog/layout.tsx`: Executor must see the current 10-line file to make the precise edit — it's a passthrough that needs to wrap children with BlogImmerse
  - `app/layout.tsx`: Shows the established pattern for importing and using components in layouts
  - `blog-immerse.tsx`: Executor needs to know the exact import path and that it accepts children

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog layout renders BlogImmerse wrapper
    Tool: Playwright
    Preconditions: Dev server running (`bun run dev`), Tasks 1-2 completed
    Steps:
      1. Navigate to http://localhost:3000/blog
      2. Assert element with data-testid="immerse-wrapper" is present in DOM
      3. Assert element with data-testid="immerse-toggle" is visible on screen
      4. Assert element with data-testid="immerse-youtube-iframe" is present in DOM (but off-screen)
    Expected Result: All three elements present — wrapper in DOM, button visible, iframe in DOM but hidden
    Failure Indicators: Missing testid elements, component not rendering, import error in console
    Evidence: .sisyphus/evidence/task-3-blog-layout-render.png

  Scenario: BlogImmerse renders on post pages too
    Tool: Playwright
    Preconditions: Dev server running, at least one MDX post exists (create a dummy if needed)
    Steps:
      1. Navigate to http://localhost:3000/blog
      2. If posts exist, click into a blog post
      3. Assert data-testid="immerse-toggle" is still visible
      4. Assert data-testid="immerse-wrapper" is present
    Expected Result: Immerse button and wrapper present on individual post pages
    Failure Indicators: Button disappears on post pages, wrapper missing
    Evidence: .sisyphus/evidence/task-3-post-page-render.png

  Scenario: Build succeeds with layout change
    Tool: Bash
    Preconditions: app/blog/layout.tsx modified
    Steps:
      1. Run `bun run build`
      2. Check exit code is 0
    Expected Result: Static export builds successfully with no errors
    Failure Indicators: Build error referencing blog layout or BlogImmerse import
    Evidence: .sisyphus/evidence/task-3-build-check.txt

  Scenario: Existing E2E tests still pass (no regressions)
    Tool: Bash
    Preconditions: All tasks 1-3 completed, build succeeds
    Steps:
      1. Run `bunx playwright test` (full existing test suite)
      2. Check all existing tests pass
    Expected Result: Zero test failures in existing test suite
    Failure Indicators: Any previously passing test now fails
    Evidence: .sisyphus/evidence/task-3-regression-check.txt
  ```

  **Commit**: YES (Commit 3)
  - Message: `feat(blog): mount immerse mode in blog layout`
  - Files: `app/blog/layout.tsx`
  - Pre-commit: `bun run build`

- [x] 4. Playwright E2E Tests for Immerse Mode

  **What to do**:
  - Create `e2e/blog-immerse.spec.ts` with comprehensive E2E tests
  - **Test cases to implement**:
    1. **Button renders on blog index**: Navigate to `/blog` → assert `data-testid="immerse-toggle"` is visible
    2. **Button renders on blog post**: Navigate to a blog post page → assert toggle is visible (if posts exist; skip gracefully if no posts)
    3. **Toggle activates immerse**: Click `immerse-toggle` → assert `data-immerse-active="true"` on `immerse-wrapper`
    4. **Toggle deactivates immerse**: Click toggle twice → assert `data-immerse-active` is removed from wrapper
    5. **Spotlight overlay appears**: Click toggle → assert `data-testid="immerse-overlay"` is visible in DOM
    6. **Spotlight overlay disappears on exit**: Toggle on then off → assert overlay element is removed/hidden
    7. **YouTube iframe present in DOM**: Assert `iframe[src*="youtube.com/embed/sWcLccMuCA8"]` exists in page
    8. **iframe has required params**: Assert iframe src contains `enablejsapi=1`, `mute=1`, `autoplay=1`, `loop=1`, `playlist=sWcLccMuCA8`, `controls=0`, `playsinline=1`
    9. **iframe is not visible on screen**: Assert iframe has CSS that places it off-screen (bounding box check: element exists but is not in viewport)
    10. **No layout shift from hidden iframe**: Take screenshot before and after page load, measure Cumulative Layout Shift is zero — OR simpler: assert no visible gap/empty space by checking that the blog content container's bounding box starts where expected
    11. **localStorage persistence**: Toggle immerse on → reload page → assert `data-immerse-active="true"` is restored on the wrapper
    12. **localStorage exit persistence**: Toggle on → toggle off → reload → assert immerse is NOT active
    13. **Button has correct aria attributes**: Assert `aria-label` and `aria-pressed` are present and correct for both states
    14. **prefers-reduced-motion respected**: Use `page.emulateMedia({ reducedMotion: 'reduce' })` → toggle immerse → verify transitions are instant (getComputedStyle transition-duration is ~0)
    15. **Empty blog state**: Navigate to `/blog` with no posts → assert `immerse-toggle` is still present and clickable
    16. **Rapid toggle clicks**: Click toggle 5 times rapidly → assert final state is correct (odd clicks = active, even = inactive) and no errors in console
  - Follow existing test patterns in `e2e/` directory — use `test.describe`, `page.goto`, `page.getByTestId`, `expect` assertions
  - Import test utilities from `@playwright/test`

  **Must NOT do**:
  - Do NOT test actual audio playback (browser automation contexts have inconsistent audio)
  - Do NOT use screenshot comparison tests for visual overlays (fragile)
  - Do NOT modify any existing test files
  - Do NOT add test dependencies

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive test file requiring careful Playwright API usage, multiple test scenarios, edge case coverage — more than a quick task but not architecturally complex
  - **Skills**: [`playwright`]
    - `playwright`: Needed for correct Playwright API usage, selector patterns, and assertion methods
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — this is test code, not UI code

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 3)
  - **Blocks**: Final Verification
  - **Blocked By**: Task 3

  **References** (CRITICAL):

  **Pattern References**:
  - `e2e/` directory — All existing test files — follow the exact same imports, describe/test structure, assertion patterns, and `data-testid` usage
  - `components/blog-immerse.tsx` (from Task 2) — All `data-testid` values: `immerse-toggle`, `immerse-wrapper`, `immerse-overlay`, `immerse-youtube-iframe`
  - `components/blog-content.tsx:60-66` — Existing `data-testid="blog-post-card"` pattern — tests may need to interact with post cards

  **External References**:
  - Playwright docs: `https://playwright.dev/docs/api/class-page` — `page.goto()`, `page.getByTestId()`, `page.emulateMedia()`
  - Playwright assertions: `https://playwright.dev/docs/api/class-locatorassertions` — `toBeVisible()`, `toHaveAttribute()`, `toHaveCount()`

  **WHY Each Reference Matters**:
  - `e2e/` directory: Tests MUST follow established patterns — wrong imports or structure will cause test runner issues
  - `blog-immerse.tsx data-testids`: Every test assertion targets these specific testids — if they're wrong, all tests fail
  - `blog-content.tsx:60-66`: Some tests may navigate to post pages — need to know the post card testid for clicking into posts
  - Playwright docs: Correct API usage is critical — wrong assertions will produce false passes or cryptic failures

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All new E2E tests pass
    Tool: Bash
    Preconditions: All implementation tasks (1-3) completed, dev server running
    Steps:
      1. Run `bunx playwright test e2e/blog-immerse.spec.ts`
      2. Check all tests pass
      3. Check exit code is 0
    Expected Result: All 16 test cases pass with green output
    Failure Indicators: Any test failure, timeout, or error
    Evidence: .sisyphus/evidence/task-4-e2e-results.txt

  Scenario: Existing E2E tests unaffected
    Tool: Bash
    Preconditions: New test file added
    Steps:
      1. Run `bunx playwright test` (full suite)
      2. Verify all previously passing tests still pass
      3. Verify new tests also pass
    Expected Result: Full suite passes — zero regressions
    Failure Indicators: Any existing test that was passing now fails
    Evidence: .sisyphus/evidence/task-4-full-suite-results.txt

  Scenario: Test file follows project conventions
    Tool: Bash
    Preconditions: e2e/blog-immerse.spec.ts created
    Steps:
      1. Run `bun run lint` 
      2. Check no lint errors in the new test file
      3. Read file and verify it uses @playwright/test imports, test.describe blocks, and data-testid selectors
    Expected Result: Lint clean, follows established patterns
    Failure Indicators: Lint errors, non-standard imports, hardcoded selectors instead of testids
    Evidence: .sisyphus/evidence/task-4-lint-check.txt
  ```

  **Commit**: YES (Commit 4)
  - Message: `test(blog): add E2E tests for immerse mode`
  - Files: `e2e/blog-immerse.spec.ts`
  - Pre-commit: `bunx playwright test`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check DOM). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + `bun run lint`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify TypeScript strict mode compliance.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration. Test edge cases: empty blog state, rapid toggle clicks, resize browser, navigate away and back. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Commit | Message | Files | Pre-commit Check |
|--------|---------|-------|-----------------|
| 1 | `feat(blog): add immerse mode CSS utilities and visual overlay styles` | `app/globals.css` | `bun run build` |
| 2 | `feat(blog): add BlogImmerse component with YouTube background music` | `components/blog-immerse.tsx` | `bun run build` |
| 3 | `feat(blog): mount immerse mode in blog layout` | `app/blog/layout.tsx` | `bun run build` |
| 4 | `test(blog): add E2E tests for immerse mode` | `e2e/blog-immerse.spec.ts` | `bunx playwright test` |

---

## Success Criteria

### Verification Commands
```bash
bun run build                    # Expected: exits 0, no errors
bun run lint                     # Expected: no lint errors in changed files
bunx playwright test             # Expected: all tests pass (existing + new)
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build succeeds
- [ ] All Playwright tests pass (existing + new)
- [ ] Both visual modes functional
- [ ] localStorage persistence verified
- [ ] No layout shifts from hidden iframe
- [ ] Mobile graceful degradation confirmed
