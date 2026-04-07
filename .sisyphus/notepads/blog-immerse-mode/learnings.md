# Learnings — blog-immerse-mode

## [2026-04-06] Session ses_29dbf7f23ffeRsGpfgM0TnQjgb — Plan Start

### Tech Stack
- Next.js 16.2.1, React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first, no config file), MDX blog, static export (`output: 'export'`), Playwright E2E
- Package manager: bun (`bun run build`, `bun run lint`, `bunx playwright test`)

### Key File Locations
- `app/blog/layout.tsx` — blog layout, currently passthrough `<>{children}</>`; insertion point for BlogImmerse
- `app/blog/page.tsx` — blog index (server component, renders BlogContent client component)
- `app/blog/[slug]/page.tsx` — blog post (server component, dynamic MDX import)
- `components/blog-content.tsx` — 'use client', uses useSearchParams, renders post list
- `components/Navigation.tsx` — 'use client', fixed floating glass nav (z-50)
- `app/globals.css` — Tailwind v4, `@theme` CSS variables, `@layer components` with .glass/.ambient-shadow/.ghost-border
- `e2e/` — Playwright E2E tests with `data-testid` convention

### CSS Variables (from `app/globals.css`)
```
--color-background: #fbf9f4
--color-primary: #456375
--color-primary-container: #bfdef4
--color-primary-dim: #395769
--color-on-surface: #31332e
--color-on-surface-variant: #5e6059
--color-surface-container: #efeee7
--color-surface-container-low: #f5f4ed
--color-surface-container-lowest: #ffffff
--color-on-primary: #f4f9ff
--color-outline-variant: #c4c7be
--font-manrope: 'Manrope', sans-serif
--blur-glass: 12px
```

### Design Patterns
- Glass nav uses `z-50` — overlay must be `z-30`, button must be `z-60`
- Tailwind classes used inline, no `@apply` in components layer
- `prefers-reduced-motion` already handled in globals.css — new transitions must be added to same block
- `data-testid` on all testable elements (kebab-case: `blog-post-card`, `nav-blog`, etc.)

### Critical Technical Constraints
- `display:none` / `visibility:hidden` on YouTube iframe PAUSES playback — use `position:absolute; left:-9999px`
- `loop=1` alone does NOT loop single videos — must also add `playlist=sWcLccMuCA8`
- YouTube IFrame API has race condition — need dual-path init: `window.onYouTubeIframeAPIReady` + fallback `window.YT?.Player` check in useEffect
- localStorage stores immerse *preference* (on/off), not active playing state
- `bun run build` for static export — no Node.js server needed, all client-side

### CSS Utilities Added
- Added `.immerse-spotlight-overlay`, `.immerse-dark-shift`, `.immerse-button`, and `.immerse-iframe-hidden` inside `@layer components` in `app/globals.css`
- Added reduced-motion transition overrides for the new immerse classes inside the existing `prefers-reduced-motion` block
- Kept existing `.glass`, `.ambient-shadow`, and `.ghost-border` rules unchanged

## [2026-04-06] Task 2 — BlogImmerse Component Created

### Component: `components/blog-immerse.tsx`
- Created as `'use client'` with no external npm deps
- `declare global` used for `window.YT` and `window.onYouTubeIframeAPIReady` — no @types/youtube needed
- Dual-path YouTube IFrame API init: `window.YT?.Player` check first (cached), then `window.onYouTubeIframeAPIReady` callback
- `pendingUnmuteRef` correctly queues unmute before player ready
- All player calls wrapped in try/catch for graceful degradation
- localStorage preference key: `blog-immerse`, shape: `{ active: boolean, mode: string }`
- iframe uses `className="immerse-iframe-hidden"` (off-screen absolute), NOT display:none
- `frameBorder="0"` on iframe is a React deprecated prop but ESLint/TypeScript accepted it cleanly
- Build: ✅ Exit 0 — TypeScript strict, 12 static pages generated
- Lint: ✅ Exit 0 — no ESLint errors

## [2026-04-07] Task 3 — Dark-shift verification
- Verified `mode === 'dark-shift' && isImmersed` gates the wrapper class in `components/blog-immerse.tsx`.
- Verified the spotlight overlay is explicitly `mode === 'spotlight'` only.
- Verified `.immerse-dark-shift` in `app/globals.css` overrides `--color-background` and related color vars.
- Playwright confirmed `--color-background` changed from `#fbf9f4` to `#1a1a2e` after manually adding the class.
- Spotlight verification passed: overlay visible, dark-shift class absent in spotlight mode.
- Verification surfaced a separate runtime regression: `VIDEO_ID` was undefined and prevented `/blog` from loading.
