# Editorial Minimalism Redesign

## TL;DR

> **Quick Summary**: Complete visual redesign from retro 90s aesthetic to "Editorial Minimalism" per DESIGN.md — replace fonts, colors, components, and content across all 5 pages. Update professional identity from frontend developer to data engineer. Add timezone clock on homepage.
>
> **Deliverables**:
>
> - New design system in globals.css (Manrope font, warm palette, tonal layering, glassmorphism tokens)
> - Redesigned root layout with editorial nav and footer (no more HitCounter/UnderConstruction)
> - Redesigned homepage with pixel-art GIF placeholder + live timezone clock (Europe/Amsterdam)
> - Redesigned blog, projects, resume, contact pages in editorial style
> - Resume content rewritten for data engineering focus
> - Content cleanup: 0 blog posts, 1 project (pixel-canvas only)
> - Updated mdx-components.tsx for editorial typography
> - Complete E2E test rewrite (all 7 spec files)
> - Updated README.md
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T1 (tokens) → T2 (layout+nav+footer) → T3-T8 (pages in parallel) → T9 (E2E) → T10 (cleanup)

---

## Context

### Original Request

User wants to completely abandon the retro 90s aesthetic and replace it with "Editorial Minimalism" — a design inspired by high-end architectural monographs and curated art galleries. The design spec is in `DESIGN.md` at the project root. User is a data engineer, not a frontend developer, and all content should reflect that. Homepage should feature a pixel art GIF (placeholder for now) and a live timezone clock.

### Interview Summary

**Key Discussions**:

- **Aesthetic**: DESIGN.md defines the full spec — Manrope font, warm off-white (#fbf9f4) palette, muted blue (#456375) accent, no borders (use background shifts), glassmorphism nav, generous spacing
- **Timezone**: Europe/Amsterdam, stored as an easily changeable constant
- **GIF placeholder**: Styled container box (not an actual image), ready for the real GIF later
- **Content**: Data engineer focus — update resume roles/skills, hero text
- **Blog**: Remove all 3 existing posts, start with empty blog
- **Projects**: Keep only pixel-canvas (has demo), remove Retro Terminal and Neon Clock
- **Contacts**: Keep GitHub/LinkedIn/Email with same URLs, just restyle
- **Tests**: All 7 E2E spec files need complete rewrite

### Metis Review

**Identified Gaps** (addressed):

- **Inline styles everywhere**: Current codebase uses extensive `style={{}}` props — redesign must systematically replace with Tailwind classes
- **DemoLoader retro fonts**: Loading state references `--font-pixel` and `--font-terminal` which won't exist — must update
- **mdx-components.tsx time bomb**: Even with 0 posts, MDX component styles persist and would render retro when posts are added — must restyle now
- **RSS empty state**: `force-static` RSS with 0 items is valid XML but tests assert `<item>` exists — tests must be updated
- **Metadata strings**: "Retro" appears in layout metadata, contact, projects, project detail, and demo page metadata — all must be updated
- **Data-testid preservation**: Tests depend on these — must be preserved in redesigned markup
- **prefers-reduced-motion**: Current CSS has accessibility section — new CSS must maintain this
- **404/Error pages**: No custom not-found.tsx or error.tsx — default Next.js pages will render unstyled (noted, not in scope for v1)

---

## Work Objectives

### Core Objective

Replace the entire visual identity from retro 90s to "Editorial Minimalism" per DESIGN.md, update professional content to data engineer, and add homepage timezone clock — while preserving all infrastructure (MDX pipeline, project data layer, routing, RSS).

### Concrete Deliverables

- `app/globals.css` — complete rewrite with editorial design tokens
- `app/layout.tsx` — Manrope font, editorial body, remove retro components
- `components/Navigation.tsx` — floating glassmorphism bar with dot indicators
- `components/Footer.tsx` — minimal editorial footer
- `components/TimezoneClock.tsx` — NEW client component
- `app/page.tsx` — GIF placeholder + clock + DE intro
- `app/blog/page.tsx` — editorial style with empty state
- `app/blog/[slug]/page.tsx` — editorial style
- `app/projects/page.tsx` — editorial style, 1 project
- `app/projects/[slug]/page.tsx` — editorial style
- `app/projects/[slug]/demo/page.tsx` — editorial style
- `app/resume/page.tsx` — editorial style, DE content
- `app/contact/page.tsx` — editorial style
- `components/DemoLoader.tsx` — updated loading state
- `mdx-components.tsx` — editorial typography
- `content/projects.ts` — pixel-canvas only
- `app/rss.xml/route.ts` — updated metadata
- All 7 E2E test files — complete rewrite
- `README.md` — updated description
- DELETE: `components/HitCounter.tsx`, `components/UnderConstruction.tsx`
- DELETE: `content/blog/hello-world.mdx`, `content/blog/building-retro-web.mdx`, `content/blog/typescript-tips.mdx`

### Definition of Done

- [ ] `pnpm build` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm format:check` exits 0
- [ ] `pnpm test:e2e` — all tests pass
- [ ] Zero references to retro hex colors (#ff00ff, #00ffff, #00ff00, #c0c0c0) in any .tsx/.css file
- [ ] Zero references to `--font-pixel` or `--font-terminal` in any .tsx/.css file
- [ ] Zero references to `Press_Start_2P` or `VT323` in any .tsx/.ts file
- [ ] `HitCounter.tsx` and `UnderConstruction.tsx` do not exist
- [ ] All 3 blog MDX files deleted from content/blog/
- [ ] `content/projects.ts` contains only pixel-canvas

### Must Have

- Manrope font loaded via `next/font/google`
- DESIGN.md color palette implemented as CSS custom properties in @theme
- No-line rule: no 1px borders for section boundaries — use background color shifts
- Glassmorphism navigation bar (surface at 70% alpha + backdrop-blur 12px + ghost border)
- Active nav indicator: primary-colored 2px dot below label
- Live timezone clock on homepage showing Europe/Amsterdam time (configurable constant)
- Styled pixel-art GIF placeholder container on homepage
- Data engineer title and content throughout
- Empty blog (0 posts) with proper empty state
- Resume with DE-focused placeholder roles and skills (Python, SQL, Spark, Airflow, dbt, BigQuery, Kafka, etc.)
- All `data-testid` attributes preserved on elements that persist
- `prefers-reduced-motion` accessibility support in new CSS
- All E2E tests passing

### Must NOT Have (Guardrails)

- NO retro visual artifacts: no neon colors, no scanlines, no CRT vignette, no beveled borders, no pixel fonts
- NO component libraries (no shadcn, MUI, Radix, Chakra)
- NO CSS-in-JS
- NO pure black `#000000` — use `#31332e` per DESIGN.md
- NO standard drop shadows — only ambient shadows (40px blur, 4% opacity) per DESIGN.md
- NO 1px solid borders for section boundaries — use background color shifts
- NO icons unless absolutely necessary — typography-driven per DESIGN.md
- NO dark mode toggle or dark theme
- NO page transitions or route animations
- NO analytics, tracking, or real hit counter
- NO new blog posts
- NO new project entries beyond pixel-canvas
- NO shared component abstractions (no Button, Card components) — keep flat
- NO dependency upgrades
- NO build config changes
- NO modifications to `lib/blog.ts`, `lib/projects.ts`, `playwright.config.ts`, `components/demos/pixel-canvas.tsx`
- NO `as any` or `@ts-ignore`

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: YES (Playwright)
- **Automated tests**: Tests-after (E2E rewrite as dedicated task after all UI changes)
- **Framework**: Playwright (existing)
- **Rationale**: Both UI and tests are being rewritten simultaneously — TDD impractical. Tests written against locked acceptance criteria after UI is complete.

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build verification**: Use Bash — `pnpm build`, `pnpm lint`, `pnpm format:check`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — must complete first):
├── T1: Design tokens + globals.css rewrite [visual-engineering]
└── T2: Root layout + Navigation + Footer rewrite [visual-engineering]
    (T2 depends on T1 — sequential within wave)

Wave 2 (Pages — MAX PARALLEL after Wave 1):
├── T3: Homepage redesign + TimezoneClock component (depends: T1, T2) [visual-engineering]
├── T4: Content cleanup — delete posts, trim projects, update RSS metadata (depends: T1) [quick]
├── T5: Blog pages redesign (depends: T1, T2, T4) [visual-engineering]
├── T6: Projects pages + DemoLoader redesign (depends: T1, T2, T4) [visual-engineering]
├── T7: Resume page redesign + DE content (depends: T1, T2) [visual-engineering]
└── T8: Contact page + mdx-components redesign (depends: T1, T2) [visual-engineering]

Wave 3 (Tests — after ALL UI changes):
└── T9: E2E test rewrite — all 7 spec files (depends: T3-T8) [unspecified-high]

Wave 4 (Cleanup):
└── T10: Delete retro components + update README (depends: T9) [quick]

Wave FINAL (Verification — 4 parallel reviews):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA via Playwright (unspecified-high)
└── F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: T1 → T2 → T3 → T9 → T10 → F1-F4 → user okay
Parallel Speedup: ~60% faster than sequential (Wave 2 runs 6 tasks in parallel)
Max Concurrent: 6 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks     | Wave |
| ---- | ---------- | ---------- | ---- |
| T1   | —          | T2-T8      | 1    |
| T2   | T1         | T3,T5-T8   | 1    |
| T3   | T1, T2     | T9         | 2    |
| T4   | T1         | T5, T6, T9 | 2    |
| T5   | T1, T2, T4 | T9         | 2    |
| T6   | T1, T2, T4 | T9         | 2    |
| T7   | T1, T2     | T9         | 2    |
| T8   | T1, T2     | T9         | 2    |
| T9   | T3-T8      | T10        | 3    |
| T10  | T9         | F1-F4      | 4    |

### Agent Dispatch Summary

- **Wave 1**: **2** — T1 → `visual-engineering`, T2 → `visual-engineering`
- **Wave 2**: **6** — T3 → `visual-engineering`, T4 → `quick`, T5 → `visual-engineering`, T6 → `visual-engineering`, T7 → `visual-engineering`, T8 → `visual-engineering`
- **Wave 3**: **1** — T9 → `unspecified-high`
- **Wave 4**: **1** — T10 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. Design Tokens + globals.css Complete Rewrite

  **What to do**:
  - Delete the ENTIRE contents of `app/globals.css` and rewrite from scratch
  - Keep the `@import 'tailwindcss';` first line
  - Add a `@theme { }` block with ALL editorial design tokens from DESIGN.md:
    - Font: `--font-manrope: 'Manrope', sans-serif;`
    - Colors: `--color-background: #fbf9f4;` `--color-primary: #456375;` `--color-primary-container: #bfdef4;` `--color-primary-dim: #395769;` `--color-on-surface: #31332e;` `--color-on-surface-variant: #5e6059;` `--color-surface-container: #efeee7;` `--color-surface-container-low: #f5f4ed;` `--color-surface-container-lowest: #ffffff;` `--color-on-primary: #f4f9ff;` `--color-outline-variant: #c4c7be;`
    - Spacing: reuse Tailwind defaults; the custom token `--spacing-24: 8.5rem;` for major section gaps
    - Blur: `--blur-glass: 12px;`
  - Set `body` base styles: `background-color: var(--color-background); color: var(--color-on-surface); font-family: var(--font-manrope, 'Manrope', sans-serif);`
  - Add `@layer components` with utility classes:
    - `.glass` — glassmorphism: `background: rgba(251,249,244,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(196,199,190,0.15);`
    - `.ambient-shadow` — `box-shadow: 0 8px 40px rgba(49,51,46,0.04);`
    - `.ghost-border` — `border: 1px solid rgba(196,199,190,0.2);`
  - Add `@media (prefers-reduced-motion: reduce)` section preserving accessibility: disable all animations/transitions
  - Remove ALL retro utilities: scanlines, CRT vignette, bevel-raised, bevel-sunken, neon-glow-\*, neon-border, neon-flicker keyframe, scanline-scroll keyframe
  - Ensure ZERO references to: `--font-pixel`, `--font-terminal`, `Press_Start_2P`, `VT323`, `#ff00ff`, `#00ffff`, `#00ff00`, `#c0c0c0`, `#0a0a0a`, `#1a1a1a`

  **Must NOT do**:
  - Do NOT add a `tailwind.config.js` file — Tailwind v4 CSS-first only
  - Do NOT add dark mode tokens
  - Do NOT use `#000000` anywhere — use `#31332e` (on-surface)
  - Do NOT add shadow utilities beyond the single ambient-shadow

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Pure CSS/design system work — visual tokens, color palette, typography foundation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Design system token implementation requires understanding of visual hierarchy and spacing systems
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task — CSS-only

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation task — everything depends on this)
  - **Parallel Group**: Wave 1 (sequential with T2)
  - **Blocks**: T2, T3, T4, T5, T6, T7, T8
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `app/globals.css:1-174` — Current file to completely replace. Shows the `@import 'tailwindcss'` + `@theme { }` + `@layer components` + `@media` structure that must be preserved (same sections, new content)
  - `DESIGN.md:12-31` — Complete color palette with all hex values, no-line rule, glassmorphism spec, ghost border spec
  - `DESIGN.md:34-41` — Typography scale: display-lg 3.5rem, headline-md 1.75rem, body-lg 1rem, label-md 0.75rem
  - `DESIGN.md:44-53` — Elevation system: tonal layering levels, ambient shadow spec (40px blur, y:8px, 4% opacity), ghost border spec (outline_variant at 20%)
  - `DESIGN.md:90-95` — Spacing scale: spacing-20 desktop / spacing-10 mobile, spacing-4 related items, spacing-3/5 component padding

  **API/Type References**: None — pure CSS file

  **External References**:
  - Tailwind v4 CSS-first theme: `@theme` block replaces `tailwind.config.js` — tokens become utility classes automatically (e.g., `--color-primary` → `text-primary`, `bg-primary`)

  **Acceptance Criteria**:
  - [ ] `app/globals.css` exists and begins with `@import 'tailwindcss';`
  - [ ] `@theme` block contains all 11+ color tokens from DESIGN.md palette
  - [ ] `@theme` block contains `--font-manrope`
  - [ ] `body` selector sets background to `var(--color-background)` and color to `var(--color-on-surface)`
  - [ ] `.glass`, `.ambient-shadow`, `.ghost-border` utility classes exist in `@layer components`
  - [ ] `@media (prefers-reduced-motion: reduce)` section exists
  - [ ] Zero occurrences of: `--font-pixel`, `--font-terminal`, `#ff00ff`, `#00ffff`, `#00ff00`, `#c0c0c0`, `#0a0a0a`, `scanlines`, `crt-vignette`, `bevel-raised`, `bevel-sunken`, `neon-glow`, `neon-border`, `neon-flicker`
  - [ ] `pnpm build` exits 0 (CSS is syntactically valid)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Design tokens are correctly defined in CSS
    Tool: Bash (grep)
    Preconditions: T1 implementation complete
    Steps:
      1. Run: grep -c "color-background" app/globals.css — expect >= 2 (declaration + body usage)
      2. Run: grep -c "color-primary" app/globals.css — expect >= 1
      3. Run: grep -c "font-manrope" app/globals.css — expect >= 1
      4. Run: grep -c "glass" app/globals.css — expect >= 1
      5. Run: grep "prefers-reduced-motion" app/globals.css — expect match
    Expected Result: All grep counts match expected values
    Failure Indicators: Any grep returns 0 when expected > 0
    Evidence: .sisyphus/evidence/task-1-tokens-defined.txt

  Scenario: Zero retro artifacts remain in CSS
    Tool: Bash (grep)
    Preconditions: T1 implementation complete
    Steps:
      1. Run: grep -cE "(neon-|scanline|crt-vignette|bevel-|#ff00ff|#00ffff|#00ff00|#c0c0c0|#0a0a0a|font-pixel|font-terminal)" app/globals.css
    Expected Result: Output is 0 (zero matches)
    Failure Indicators: Output > 0
    Evidence: .sisyphus/evidence/task-1-no-retro-artifacts.txt

  Scenario: Build succeeds with new CSS
    Tool: Bash
    Preconditions: T1 implementation complete
    Steps:
      1. Run: pnpm build
    Expected Result: Exit code 0, no CSS compilation errors
    Failure Indicators: Non-zero exit code or "error" in output
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES (groups with T2)
  - Message: `style: replace retro design system with editorial minimalism`
  - Files: `app/globals.css`
  - Pre-commit: `pnpm build`

- [x] 2. Root Layout + Navigation + Footer Rewrite

  **What to do**:
  - **`app/layout.tsx`** — Complete rewrite:
    - Replace `Press_Start_2P` and `VT323` imports with: `import { Manrope } from 'next/font/google';`
    - Configure Manrope: `weight: ['300','400','500','700','800'], subsets: ['latin'], variable: '--font-manrope', display: 'swap'`
    - Remove imports of `HitCounter` and `UnderConstruction` components
    - Update metadata description from "retro 90s web aesthetic" to "Personal portfolio of Pav Anastasiadis — Data Engineer"
    - Update `<html>` className to use `manrope.variable` (remove `pressStart2P.variable` and `vt323.variable`)
    - Update `<body>`: remove `scanlines` class, remove inline `style={{ backgroundColor, color }}`, use `className="min-h-full flex flex-col bg-background text-on-surface"`
    - Remove `<UnderConstruction />` component
    - Remove the `<footer>` wrapper that contains `<HitCounter />` — move `<Footer />` to be a direct child
    - Keep `<Navigation />` and `<Footer />` imports
    - Remove `crt-vignette` class from `<main>`
  - **`components/Navigation.tsx`** — Complete rewrite:
    - Keep `'use client'` directive, `Link`, `usePathname` imports
    - Update nav link labels from retro format `[ HOME ]` to clean editorial: `Home`, `Projects`, `Blog`, `Resume`, `Contact`
    - Keep all `data-testid` values unchanged: `nav-home`, `nav-projects`, `nav-blog`, `nav-resume`, `nav-contact`
    - Replace ALL inline `style={{}}` props with Tailwind classes
    - Implement floating glassmorphism bar: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 py-2 flex items-center gap-1`
    - Remove "PAV.EXE" title span
    - Active state: show a 2px dot (pseudo-element or small div) in `bg-primary` color below the active link label — NOT a background highlight
    - Link styling: `text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 relative flex flex-col items-center`
    - Remove ALL retro classes: `bevel-raised`, inline backgroundColor/borderColor/fontFamily
  - **`components/Footer.tsx`** — Complete rewrite:
    - Keep `data-testid="footer"` attribute
    - Replace ALL inline `style={{}}` props with Tailwind classes
    - Use editorial styling: `bg-surface-container py-12 px-4` (generous padding per DESIGN.md spacing)
    - Content: centered, minimal — `© {year} Pav Anastasiadis` in body text color
    - Remove "Built with Next.js + Tailwind v4" line — keep it minimal per editorial aesthetic
    - Remove ALL retro: Win95 border colors, `#c0c0c0` background, `--font-terminal` reference, retro silver color
    - Use `text-on-surface-variant text-sm` for muted footer text

  **Must NOT do**:
  - Do NOT remove `data-testid` attributes from any element
  - Do NOT change nav link `href` values
  - Do NOT add icons to navigation
  - Do NOT add a hamburger menu for mobile — keep all links visible
  - Do NOT add page transitions or animations beyond hover states
  - Do NOT use `#000000` — use on-surface color

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout structure + navigation + footer are core visual-structural components requiring editorial aesthetics
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Glassmorphism implementation, navigation UX patterns, spacing system application
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T1, blocks all page tasks)
  - **Parallel Group**: Wave 1 (sequential after T1)
  - **Blocks**: T3, T5, T6, T7, T8
  - **Blocked By**: T1

  **References**:

  **Pattern References** (existing code to follow):
  - `app/layout.tsx:1-70` — Current layout structure to rewrite. Shows font loading pattern (lines 11-23), metadata pattern (lines 25-36), and body structure (lines 38-69). Preserve the same structural pattern but swap all visual elements
  - `components/Navigation.tsx:1-68` — Current nav. Keep the `navLinks` array pattern (lines 6-12) with `href`, `label`, `testId` structure. Keep `usePathname()` for active detection. Replace everything visual
  - `components/Footer.tsx:1-39` — Current footer. Must keep `data-testid="footer"` (line 6). Replace all inline styles with Tailwind classes

  **API/Type References**:
  - `next/font/google` — Manrope font with `weight: ['300','400','500','700','800']`, `subsets: ['latin']`, `variable: '--font-manrope'`, `display: 'swap'`

  **External References**:
  - DESIGN.md:58-60 — Navigation spec: "Floating Bar" with glassmorphism (70% alpha + blur), active state = primary dot (2px) below label
  - DESIGN.md:27-30 — Glassmorphism spec: surface at 70% opacity, backdrop-blur 12px, ghost border (outline_variant at 15%)

  **WHY Each Reference Matters**:
  - `layout.tsx` shows font loading + body structure to preserve
  - `Navigation.tsx` shows the data-testid pattern that MUST survive for E2E tests
  - `Footer.tsx` shows the data-testid that MUST survive
  - DESIGN.md navigation section defines the exact glassmorphism + active indicator pattern

  **Acceptance Criteria**:
  - [ ] `app/layout.tsx` imports `Manrope` from `next/font/google` (not Press_Start_2P or VT323)
  - [ ] `app/layout.tsx` does NOT import HitCounter or UnderConstruction
  - [ ] `<html>` tag uses Manrope variable class
  - [ ] `<body>` has no `scanlines` class, no inline `style` prop
  - [ ] `<UnderConstruction />` and `<HitCounter />` are absent from layout JSX
  - [ ] Metadata description contains "Data Engineer" (not "retro")
  - [ ] `components/Navigation.tsx` has `data-testid` attributes: nav-home, nav-projects, nav-blog, nav-resume, nav-contact
  - [ ] Navigation uses glassmorphism classes (glass or equivalent backdrop-blur)
  - [ ] Nav links use clean labels: "Home", "Projects", "Blog", "Resume", "Contact"
  - [ ] Active nav indicator is a dot element (not background color change)
  - [ ] `components/Footer.tsx` has `data-testid="footer"`
  - [ ] Zero inline `style={{}}` props in Navigation.tsx and Footer.tsx
  - [ ] Zero references to: `--font-pixel`, `--font-terminal`, `bevel-raised`, `bevel-sunken`, `neon-`, `#ff00ff`, `#00ffff`, `#00ff00`, `#c0c0c0`, `#0a0a0a`, `Press_Start_2P`, `VT323`
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Layout renders with Manrope font and no retro elements
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert: document.querySelector('html').className contains 'manrope' (the font variable class)
      3. Assert: document.querySelector('[data-testid="under-construction"]') returns null
      4. Assert: document.querySelector('[data-testid="hit-counter"]') returns null
      5. Assert: document.querySelector('[data-testid="footer"]') is visible
      6. Take screenshot of full page
    Expected Result: Page renders with Manrope font, no retro components visible, footer present
    Failure Indicators: Under-construction or hit-counter elements found; Manrope class missing from html tag
    Evidence: .sisyphus/evidence/task-2-layout-clean.png

  Scenario: Navigation glassmorphism bar with correct links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert: [data-testid="nav-home"] is visible with href="/"
      3. Assert: [data-testid="nav-projects"] is visible with href="/projects"
      4. Assert: [data-testid="nav-blog"] is visible with href="/blog"
      5. Assert: [data-testid="nav-resume"] is visible with href="/resume"
      6. Assert: [data-testid="nav-contact"] is visible with href="/contact"
      7. Assert: nav element has backdrop-filter CSS property (glassmorphism)
      8. Click [data-testid="nav-projects"], assert URL is /projects
      9. Take screenshot showing nav bar
    Expected Result: All 5 nav links visible with correct hrefs, glassmorphism visible, navigation works
    Failure Indicators: Any nav link missing, wrong href, no backdrop-filter
    Evidence: .sisyphus/evidence/task-2-navigation-glass.png

  Scenario: No retro artifacts in layout files
    Tool: Bash (grep)
    Preconditions: T2 implementation complete
    Steps:
      1. Run: grep -cE "(Press_Start_2P|VT323|font-pixel|font-terminal|scanlines|crt-vignette|bevel-|neon-|HitCounter|UnderConstruction|#ff00ff|#00ffff|#00ff00|#c0c0c0|#0a0a0a)" app/layout.tsx components/Navigation.tsx components/Footer.tsx
    Expected Result: 0 matches for each file
    Failure Indicators: Any count > 0
    Evidence: .sisyphus/evidence/task-2-no-retro.txt
  ```

  **Commit**: YES (groups with T1)
  - Message: `style: replace retro design system with editorial minimalism`
  - Files: `app/layout.tsx`, `components/Navigation.tsx`, `components/Footer.tsx`
  - Pre-commit: `pnpm build`

- [x] 3. Homepage Redesign + TimezoneClock Component

  **What to do**:
  - **Create `components/TimezoneClock.tsx`** — NEW client component:
    - Add `'use client'` directive
    - Define `TIMEZONE = 'Europe/Amsterdam'` as an exported constant at the top of the file (easy to change on relocation)
    - Use `useState` + `useEffect` + `setInterval(1000)` pattern
    - Use `Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })` for time
    - Use `Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })` for date
    - Add `mounted` state guard: render `--:--:--` placeholder until mounted to prevent SSR hydration mismatch
    - Display format: time prominent (display-lg size), date below in label-md size, timezone label `Europe/Amsterdam` in on-surface-variant
    - Use Tailwind classes only — no inline styles
  - **Rewrite `app/page.tsx`** — Complete overhaul:
    - Remove ALL retro content: "PAV ANASTASIADIS" neon heading, "FULL-STACK DEVELOPER \_ VISUAL ENGINEER", ABOUT.EXE window, BIOS init text, CORE_SKILLS grid, retro CTA buttons
    - New structure (top to bottom):
      1. **GIF Placeholder**: A styled container ~400x300px centered. Use `bg-surface-container-low rounded-sm` with a dashed ghost-border (`border-2 border-dashed` in outline-variant at 30%). Inside: centered text "Pixel art coming soon" in `text-on-surface-variant text-sm`. Add `data-testid="gif-placeholder"`
      2. **TimezoneClock**: Import and render `<TimezoneClock />` below the GIF placeholder with generous spacing (`mt-16` or similar)
      3. **Brief intro**: Below clock — "Pav Anastasiadis" as display-lg heading + "Data Engineer" as headline-md in on-surface-variant. 1-2 sentence intro about data engineering. Use `data-testid="hero-heading"` on the name heading (preserving testid)
    - Keep `data-testid="hero-heading"` on the main heading (reassign from retro "PAV ANASTASIADIS" to editorial name)
    - Remove `data-testid="about-section"` (the Win95 window is gone — this testid can be removed since it won't be in tests)
    - Use generous spacing per DESIGN.md: `py-24` between sections, centered layout max-w-3xl
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Remove ALL retro classes: `neon-glow-pink`, `neon-glow-cyan`, `neon-border`, `bevel-raised`, `bevel-sunken`

  **Must NOT do**:
  - Do NOT add an actual GIF image file — placeholder container only
  - Do NOT add skill/tech tags grid on homepage
  - Do NOT add links to projects/blog on homepage (no CTA buttons)
  - Do NOT use `#000000`
  - Do NOT use icons

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Homepage layout + new component creation with editorial aesthetic requirements
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Spacing system, visual hierarchy, placeholder design patterns
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T4, T5, T6, T7, T8 after T2 completes)
  - **Parallel Group**: Wave 2 (with T4, T5, T6, T7, T8)
  - **Blocks**: T9
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `app/page.tsx:1-144` — Current homepage to completely replace. Shows the data-testid="hero-heading" (line 11) and data-testid="about-section" (line 30) placements
  - `DESIGN.md:37-38` — Display typography: `display-lg (3.5rem)` with `letter-spacing: -0.02em` for editorial titles
  - `DESIGN.md:80` — Section spacing: `spacing-24 (8.5rem)` for vertical margins between major sections
  - `DESIGN.md:78` — Asymmetric layout principle: text in 1st column, imagery in 3rd

  **External References**:
  - `Intl.DateTimeFormat` API: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat — timeZone option for Europe/Amsterdam
  - Next.js client components: `'use client'` directive + `useEffect` for browser-only APIs

  **WHY Each Reference Matters**:
  - `page.tsx` shows which data-testids exist so we preserve the needed ones
  - DESIGN.md typography/spacing sections define exact editorial sizing
  - MDN DateTimeFormat shows the correct Intl API for timezone clock

  **Acceptance Criteria**:
  - [ ] `components/TimezoneClock.tsx` exists with `'use client'` directive
  - [ ] TimezoneClock has `TIMEZONE = 'Europe/Amsterdam'` exported constant
  - [ ] TimezoneClock uses `useEffect` + `setInterval` + `Intl.DateTimeFormat` with `timeZone` option
  - [ ] TimezoneClock has mounted guard (no SSR hydration mismatch)
  - [ ] `app/page.tsx` contains GIF placeholder element with `data-testid="gif-placeholder"`
  - [ ] `app/page.tsx` renders `<TimezoneClock />`
  - [ ] `app/page.tsx` has hero heading with `data-testid="hero-heading"` containing "Pav Anastasiadis"
  - [ ] Page contains "Data Engineer" text
  - [ ] Zero inline `style={{}}` in page.tsx
  - [ ] Zero retro references: neon-glow, bevel, font-pixel, font-terminal, #ff00ff, #00ffff, #00ff00
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Homepage renders with GIF placeholder, clock, and intro
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert: [data-testid="gif-placeholder"] is visible
      3. Assert: [data-testid="gif-placeholder"] contains text "coming soon" (case insensitive)
      4. Assert: [data-testid="hero-heading"] is visible and contains "Pav Anastasiadis"
      5. Assert: page contains text "Data Engineer"
      6. Wait 2 seconds, then assert: page contains a time string matching pattern \d{2}:\d{2}:\d{2} (clock is ticking)
      7. Take screenshot of full homepage
    Expected Result: GIF placeholder visible, clock showing current time, name + "Data Engineer" visible
    Failure Indicators: Missing placeholder, clock not rendering, wrong title text
    Evidence: .sisyphus/evidence/task-3-homepage.png

  Scenario: Clock updates every second (no hydration mismatch)
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/
      2. Wait for page load complete
      3. Capture time text content at T=0
      4. Wait 2 seconds
      5. Capture time text content at T=2
      6. Assert: T=0 !== T=2 (clock is updating)
      7. Check browser console for hydration errors: page.on('console') should have no "Hydration" error messages
    Expected Result: Clock text changes between captures, no hydration warnings
    Failure Indicators: Same time at T=0 and T=2, or hydration error in console
    Evidence: .sisyphus/evidence/task-3-clock-ticking.txt

  Scenario: No retro elements on homepage
    Tool: Bash (grep)
    Preconditions: T3 implementation complete
    Steps:
      1. Run: grep -cE "(neon-glow|bevel-|font-pixel|font-terminal|ABOUT\.EXE|CORE_SKILLS|FULL-STACK|VISUAL ENGINEER|#ff00ff|#00ffff|#00ff00|style=\{\{)" app/page.tsx
    Expected Result: 0 matches
    Failure Indicators: Any count > 0
    Evidence: .sisyphus/evidence/task-3-no-retro.txt
  ```

  **Commit**: YES
  - Message: `feat: redesign homepage with timezone clock and GIF placeholder`
  - Files: `components/TimezoneClock.tsx`, `app/page.tsx`
  - Pre-commit: `pnpm build`

- [x] 4. Content Cleanup — Delete Blog Posts, Trim Projects, Update RSS Metadata

  **What to do**:
  - **Delete 3 blog MDX files**:
    - Delete `content/blog/hello-world.mdx`
    - Delete `content/blog/building-retro-web.mdx`
    - Delete `content/blog/typescript-tips.mdx`
    - Verify the `content/blog/` directory is empty (or contains nothing — the directory can remain)
  - **Trim `content/projects.ts`** — keep ONLY pixel-canvas:
    - Remove the `retro-terminal` and `neon-clock` project entries
    - Keep the `pixel-canvas` entry exactly as-is (same slug, title, description, tags, demoAvailable, repo)
    - Keep the `ProjectMeta` import from `@/lib/projects`
  - **Update `app/rss.xml/route.ts`** — update metadata strings:
    - Change channel description from `"Pav Anastasiadis's retro developer blog"` to `"Pav Anastasiadis's blog"`
    - Keep everything else: `force-static`, `escapeXml`, `getAllPosts`, item generation logic, channel title "Pav Anastasiadis Blog"
    - The RSS will naturally have 0 `<item>` elements since there are 0 posts — this is valid XML

  **Must NOT do**:
  - Do NOT modify `lib/blog.ts` or `lib/projects.ts` (protected files)
  - Do NOT change the RSS feed URL or response headers
  - Do NOT add new blog posts or projects
  - Do NOT change the pixel-canvas project metadata

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File deletions + small edits to 2 files — straightforward operations
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No visual/UI work — just data file edits and deletions

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T5, T6, T7, T8)
  - **Parallel Group**: Wave 2 (with T3, T5, T6, T7, T8)
  - **Blocks**: T5, T6, T9
  - **Blocked By**: T1 (only needs tokens for consistent commit, but functionally independent)

  **References**:

  **Pattern References**:
  - `content/projects.ts:1-32` — Current file with 3 projects. Keep lines 1-12 (import + pixel-canvas entry), remove lines 13-31 (retro-terminal + neon-clock)
  - `app/rss.xml/route.ts:41` — The line containing `"retro developer blog"` that must be updated

  **API/Type References**:
  - `lib/projects.ts:ProjectMeta` — The type imported by content/projects.ts — do NOT modify this file

  **WHY Each Reference Matters**:
  - `content/projects.ts` shows exact structure to preserve for pixel-canvas
  - `route.ts:41` shows the exact string to find and replace

  **Acceptance Criteria**:
  - [ ] `content/blog/hello-world.mdx` does not exist
  - [ ] `content/blog/building-retro-web.mdx` does not exist
  - [ ] `content/blog/typescript-tips.mdx` does not exist
  - [ ] `content/projects.ts` contains exactly 1 project entry (pixel-canvas)
  - [ ] `content/projects.ts` does NOT contain "retro-terminal" or "neon-clock"
  - [ ] `app/rss.xml/route.ts` description does NOT contain "retro"
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog posts are deleted and project list is trimmed
    Tool: Bash
    Preconditions: T4 implementation complete
    Steps:
      1. Run: ls content/blog/ — expect empty or "No such file" (directory may be empty)
      2. Run: grep -c "slug" content/projects.ts — expect exactly 1
      3. Run: grep "pixel-canvas" content/projects.ts — expect match
      4. Run: grep "retro-terminal" content/projects.ts — expect no match
      5. Run: grep "neon-clock" content/projects.ts — expect no match
    Expected Result: 0 blog files, 1 project (pixel-canvas), no retro projects
    Failure Indicators: Blog files still exist, project count != 1, retro project found
    Evidence: .sisyphus/evidence/task-4-content-cleanup.txt

  Scenario: RSS feed metadata is updated and valid with 0 items
    Tool: Bash (curl)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Run: curl -s http://localhost:3000/rss.xml
      2. Assert: response contains '<rss version="2.0">'
      3. Assert: response contains '<title>Pav Anastasiadis Blog</title>'
      4. Assert: response does NOT contain "retro"
      5. Assert: response does NOT contain '<item>'  (0 posts = 0 items)
    Expected Result: Valid RSS XML with updated description, no items
    Failure Indicators: "retro" found in RSS, or <item> tags present
    Evidence: .sisyphus/evidence/task-4-rss-clean.txt

  Scenario: Build succeeds with reduced content
    Tool: Bash
    Preconditions: T4 implementation complete
    Steps:
      1. Run: pnpm build
    Expected Result: Exit code 0 — generateStaticParams returns empty array for blog, single-item array for projects
    Failure Indicators: Build error about missing blog files or missing project slugs
    Evidence: .sisyphus/evidence/task-4-build.txt
  ```

  **Commit**: YES
  - Message: `chore: remove retro blog posts and trim project list`
  - Files: (deleted) `content/blog/hello-world.mdx`, `content/blog/building-retro-web.mdx`, `content/blog/typescript-tips.mdx`, `content/projects.ts`, `app/rss.xml/route.ts`
  - Pre-commit: `pnpm build`

- [x] 5. Blog Pages Redesign (Listing + Post Detail)

  **What to do**:
  - **Rewrite `app/blog/page.tsx`** — Editorial blog listing:
    - Keep: `getAllPosts`, `getAllTags` imports from `@/lib/blog`, `searchParams` handling, tag filtering logic, `Link` import
    - Replace heading from `[ BLOG ]` to `Blog` in display-lg editorial style (3.5rem, tracking-tight, text-on-surface)
    - Tag filter pills: Replace retro neon-bordered tags with editorial style — `bg-surface-container-low text-on-surface-variant text-sm px-3 py-1 rounded-full` for inactive, `bg-primary text-on-primary` for active. Keep `data-testid="active-tag"` and `data-testid="tag-filter"` attributes
    - Blog post cards: Replace `bevel-raised bg-[#1a1a1a]` with editorial cards — `bg-surface-container-lowest` on `surface-container` background, no border, generous padding (p-8), `4rem` gap between cards per DESIGN.md card spec
    - Keep `data-testid="blog-post-card"` on article elements
    - Post title: `text-xl font-medium text-on-surface` (not pixel font)
    - Post date: `text-sm text-on-surface-variant` (label-md style)
    - Post description: `text-base text-on-surface-variant leading-relaxed`
    - Empty state (0 posts — this is the CURRENT state): Show elegant empty message: "No posts yet. Check back soon." in `text-on-surface-variant` centered. Remove the "No posts found for tag: #" message since there are no tags to filter when there are no posts. The tag filter section should also be hidden when there are 0 posts total (allTags will be empty)
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Max width: `max-w-3xl mx-auto` (narrower, editorial reading width)
    - Page padding: `py-20 px-4 md:px-8` (generous per DESIGN.md spacing-20)
  - **Rewrite `app/blog/[slug]/page.tsx`** — Editorial post detail:
    - Keep: `generateStaticParams`, `generateMetadata`, `dynamicParams = false`, all imports, try/catch with `notFound()` logic, `BlogFrontmatter` type
    - Replace heading style: `text-3xl md:text-4xl font-bold tracking-tight text-on-surface leading-tight` (DESIGN.md display typography)
    - Keep `data-testid="blog-post-title"`, `data-testid="blog-post-tags"`, `data-testid="blog-content"`
    - Date: `text-sm text-on-surface-variant` (label style)
    - Tags: `bg-surface-container-low text-primary text-xs px-2 py-1 rounded-full` (editorial tag chips)
    - Article content area: `prose max-w-none` or custom styling with good line-height (1.6+)
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Page layout: `max-w-3xl mx-auto py-20 px-4 md:px-8`

  **Must NOT do**:
  - Do NOT modify `lib/blog.ts` (protected)
  - Do NOT create new blog posts
  - Do NOT change the `dynamicParams = false` setting
  - Do NOT change `generateStaticParams` logic
  - Do NOT remove any `data-testid` attributes
  - Do NOT use borders to separate blog cards (use spacing)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Two pages requiring editorial typography, card layout, and tag chip styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card layout patterns, tag chip design, empty state UX
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T4, T6, T7, T8)
  - **Parallel Group**: Wave 2
  - **Blocks**: T9
  - **Blocked By**: T1, T2, T4

  **References**:

  **Pattern References**:
  - `app/blog/page.tsx:1-177` — Current listing. Key structures to preserve: `searchParams` handling (lines 5-10), `getAllPosts`/`getAllTags` calls (lines 11-12), tag filtering logic (lines 14-16), `data-testid="blog-post-card"` (line 102), `data-testid="active-tag"` and `data-testid="tag-filter"` (lines 42, 64, 152)
  - `app/blog/[slug]/page.tsx:1-100` — Current post detail. Key: `dynamicParams = false` (line 13), `generateStaticParams` (lines 15-20), `data-testid="blog-post-title"` (line 53), `data-testid="blog-post-tags"` (line 75), `data-testid="blog-content"` (line 95)
  - `DESIGN.md:67-68` — Card spec: no dividers, `spacing-12 (4rem)` between items, `surface_container_low` background

  **WHY Each Reference Matters**:
  - Blog page shows ALL data-testids that E2E tests depend on — must be preserved exactly
  - Post detail shows the generateStaticParams pattern that handles 0 posts (returns `[]`)
  - DESIGN.md card spec defines spacing and background approach

  **Acceptance Criteria**:
  - [ ] `app/blog/page.tsx` renders blog listing with editorial styling
  - [ ] Blog listing shows empty state message when 0 posts (current state)
  - [ ] Tag filter section is hidden when 0 tags exist
  - [ ] `data-testid="blog-post-card"` preserved on article elements
  - [ ] `data-testid="active-tag"` and `data-testid="tag-filter"` preserved on tag elements
  - [ ] `app/blog/[slug]/page.tsx` preserves `dynamicParams = false` and `generateStaticParams`
  - [ ] `data-testid="blog-post-title"`, `data-testid="blog-post-tags"`, `data-testid="blog-content"` preserved
  - [ ] Zero inline `style={{}}` in both files
  - [ ] Zero retro references in both files
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog listing shows editorial empty state
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, 0 blog posts exist
    Steps:
      1. Navigate to http://localhost:3000/blog
      2. Assert: page contains text matching "no posts" or "check back" (case insensitive)
      3. Assert: no element with data-testid="blog-post-card" exists (0 posts)
      4. Assert: page does NOT contain neon colors (#ff00ff, #00ffff, #00ff00) in computed styles
      5. Take screenshot
    Expected Result: Clean empty state message, no blog cards, no retro styling
    Failure Indicators: Blog cards present, retro text/colors visible
    Evidence: .sisyphus/evidence/task-5-blog-empty.png

  Scenario: Blog 404 still works for nonexistent slugs
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/blog/nonexistent-slug-xyz
      2. Assert: response status is 404
    Expected Result: 404 response
    Failure Indicators: 200 or 500 response
    Evidence: .sisyphus/evidence/task-5-blog-404.txt

  Scenario: No retro artifacts in blog files
    Tool: Bash (grep)
    Preconditions: T5 implementation complete
    Steps:
      1. Run: grep -cE "(font-pixel|font-terminal|neon-|bevel-|#ff00ff|#00ffff|#00ff00|#c0c0c0|#0a0a0a|style=\{\{)" app/blog/page.tsx app/blog/\\[slug\\]/page.tsx
    Expected Result: 0 for each file
    Failure Indicators: Any count > 0
    Evidence: .sisyphus/evidence/task-5-no-retro.txt
  ```

  **Commit**: YES (groups with T6)
  - Message: `style: redesign blog and projects pages to editorial style`
  - Files: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
  - Pre-commit: `pnpm build`

- [x] 6. Projects Pages + DemoLoader Redesign (Listing + Detail + Demo)

  **What to do**:
  - **Rewrite `app/projects/page.tsx`** — Editorial projects listing:
    - Keep: `getAllProjects` import, `Link` import
    - Update metadata: change title from `'Projects | Retro Portfolio'` to `'Projects | Pav Anastasiadis'`, description from `'retro-themed web projects'` to `'A collection of projects by Pav Anastasiadis'`
    - Replace heading from `PROJECTS_` to `Projects` in display-lg editorial style
    - Keep `data-testid="projects-grid"` on grid container and `data-testid="project-card"` on each card
    - Project cards: Replace `bevel-raised bg-[#1a1a1a]` with editorial cards — `bg-surface-container-lowest` (white), generous padding (p-8), no border, subtle hover lift with ambient shadow transition
    - Only 1 project (pixel-canvas) will render — layout should still use grid for future expansion
    - Demo badge: Replace neon "VIEW DEMO" with subtle `text-primary text-xs font-medium` label
    - Tags: `bg-surface-container-low text-on-surface-variant text-xs px-2 py-1 rounded-full`
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Remove ALL retro classes: `neon-glow-cyan`, `neon-border`, `neon-glow-green`, `bevel-raised`
  - **Rewrite `app/projects/[slug]/page.tsx`** — Editorial project detail:
    - Keep: `generateStaticParams`, `generateMetadata`, `dynamicParams = false`, `getProjectBySlug`, `notFound()` logic
    - Update metadata: change `'Retro Portfolio'` to `'Pav Anastasiadis'` in generateMetadata
    - Keep `data-testid="project-title"`, `data-testid="project-description"`, `data-testid="demo-link"`
    - Replace back link from `< BACK` to `← Back to projects` in editorial style
    - Title: display-lg editorial (3.5rem, tracking-tight)
    - Tags: same editorial chip style as listing
    - Demo button: Replace neon-border retro button with editorial primary button — gradient background per DESIGN.md (`bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-md px-6 py-3`)
    - Source/external links: `text-primary underline hover:text-primary-dim` (discrete CTA per DESIGN.md)
    - Replace ALL inline `style={{}}` with Tailwind classes
  - **Rewrite `app/projects/[slug]/demo/page.tsx`** — Editorial demo page:
    - Keep: `generateStaticParams`, `generateMetadata`, `dynamicParams = false`, `DemoLoader`, `Suspense`
    - Update metadata: change `'Retro Portfolio'` to `'Pav Anastasiadis'` in generateMetadata
    - Keep `data-testid="demo-container"`
    - Replace back link: `← Back to project` editorial style
    - Title: `{project.title} Demo` in display-lg (not neon-glow-pink)
    - Demo container: Replace `bevel-raised bg-[#1a1a1a]` with `bg-surface-container-lowest` white container with generous padding
    - Demo inner area: Replace `bevel-sunken bg-[#0a0a0a]` with `bg-surface-container rounded-sm` container
    - Suspense fallback: Replace neon "LOADING..." with clean "Loading demo..." in `text-on-surface-variant animate-pulse`
    - Replace ALL inline styles and retro classes
  - **Update `components/DemoLoader.tsx`** — Fix loading state:
    - Replace `text-[#00ff00]` + `fontFamily: 'var(--font-pixel)'` with `text-on-surface-variant` + Tailwind font class
    - Replace `text-[#808080]` + `fontFamily: 'var(--font-terminal)'` with `text-on-surface-variant text-sm`
    - Update text from "LOADING DEMO..." to "Loading demo..."
    - Update text from "INITIALIZING CANVAS CONTEXT" to "Preparing canvas..."
    - Replace ALL inline `style={{}}` with Tailwind classes

  **Must NOT do**:
  - Do NOT modify `lib/projects.ts` (protected)
  - Do NOT modify `components/demos/pixel-canvas.tsx` (protected)
  - Do NOT change `dynamicParams = false` settings
  - Do NOT change `generateStaticParams` logic
  - Do NOT change the Suspense/dynamic import pattern in DemoLoader
  - Do NOT remove any `data-testid` attributes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 3 pages + 1 component requiring editorial card design, button styling, and layout work
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card design, CTA button patterns, demo container layout
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T4, T5, T7, T8)
  - **Parallel Group**: Wave 2
  - **Blocks**: T9
  - **Blocked By**: T1, T2, T4

  **References**:

  **Pattern References**:
  - `app/projects/page.tsx:1-73` — Current listing. Key: `data-testid="projects-grid"` (line 23), `data-testid="project-card"` (line 30), metadata (lines 5-8)
  - `app/projects/[slug]/page.tsx:1-113` — Current detail. Key: `data-testid="project-title"` (line 46), `data-testid="project-description"` (line 66), `data-testid="demo-link"` (line 77), `dynamicParams = false` (line 10), `generateStaticParams` (lines 12-15)
  - `app/projects/[slug]/demo/page.tsx:1-71` — Current demo page. Key: `data-testid="demo-container"` (line 49), Suspense wrapping DemoLoader (lines 58-66), `dynamicParams = false` (line 12)
  - `components/DemoLoader.tsx:1-21` — Loading state with retro fonts/colors to update
  - `DESIGN.md:63-64` — Primary button spec: `surface_tint (#456375)` bg, `on_primary (#f4f9ff)` text, `roundedness-md (0.375rem)`
  - `DESIGN.md:64` — Discrete CTA: text-only with underline, hover transitions from primary_container to primary

  **WHY Each Reference Matters**:
  - All 3 page files show data-testids that E2E tests depend on
  - DemoLoader shows exact retro references to update
  - DESIGN.md button specs define the exact editorial button styling

  **Acceptance Criteria**:
  - [ ] `app/projects/page.tsx` metadata does not contain "Retro"
  - [ ] `data-testid="projects-grid"` and `data-testid="project-card"` preserved
  - [ ] Project listing renders 1 card (pixel-canvas)
  - [ ] `app/projects/[slug]/page.tsx` preserves `data-testid="project-title"`, `data-testid="project-description"`, `data-testid="demo-link"`
  - [ ] `app/projects/[slug]/demo/page.tsx` preserves `data-testid="demo-container"`
  - [ ] `components/DemoLoader.tsx` has no references to `font-pixel`, `font-terminal`, `#00ff00`, `#808080`
  - [ ] All 4 files have zero inline `style={{}}` props
  - [ ] All 4 files have zero retro classes/colors
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Projects listing shows 1 editorial-styled project card
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, only pixel-canvas project exists
    Steps:
      1. Navigate to http://localhost:3000/projects
      2. Assert: [data-testid="projects-grid"] is visible
      3. Assert: [data-testid="project-card"] count is exactly 1
      4. Assert: page contains text "Pixel Canvas"
      5. Assert: page does NOT contain "Retro Terminal" or "Neon Clock"
      6. Click [data-testid="project-card"]
      7. Assert: URL is /projects/pixel-canvas
      8. Take screenshot of projects listing
    Expected Result: 1 project card, no retro projects, navigation to detail works
    Failure Indicators: Wrong card count, retro projects visible, navigation fails
    Evidence: .sisyphus/evidence/task-6-projects-listing.png

  Scenario: Pixel-canvas project detail and demo page work
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/projects/pixel-canvas
      2. Assert: [data-testid="project-title"] contains "Pixel Canvas"
      3. Assert: [data-testid="project-description"] is visible
      4. Assert: [data-testid="demo-link"] is visible with href="/projects/pixel-canvas/demo"
      5. Click [data-testid="demo-link"]
      6. Assert: URL is /projects/pixel-canvas/demo
      7. Assert: [data-testid="demo-container"] is visible
      8. Wait for [data-testid="demo-interactive"] with timeout 10s
      9. Assert: [data-testid="demo-interactive"] is visible (canvas loaded)
      10. Take screenshot of demo page
    Expected Result: Detail page shows project info, demo loads canvas successfully
    Failure Indicators: Missing testids, demo doesn't load, neon styling visible
    Evidence: .sisyphus/evidence/task-6-demo-page.png

  Scenario: Removed projects return 404
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/projects/retro-terminal — assert 404 status
      2. Navigate to http://localhost:3000/projects/neon-clock — assert 404 status
    Expected Result: Both return 404 (dynamicParams: false + removed from generateStaticParams)
    Failure Indicators: 200 or 500 response
    Evidence: .sisyphus/evidence/task-6-removed-projects-404.txt
  ```

  **Commit**: YES (groups with T5)
  - Message: `style: redesign blog and projects pages to editorial style`
  - Files: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/projects/[slug]/demo/page.tsx`, `components/DemoLoader.tsx`
  - Pre-commit: `pnpm build`

- [x] 7. Resume Page Redesign + Data Engineer Content

  **What to do**:
  - **Rewrite `app/resume/page.tsx`** — Complete content + visual overhaul:
    - Keep `data-testid="resume-content"` on root container and `data-testid="resume-download"` on download link
    - Replace heading from `RESUME.EXE` to `Resume` in display-lg editorial style
    - Keep download link pointing to `/resume.pdf` with `download` attribute
    - Style download button: editorial primary button — `bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-md px-6 py-3 text-sm font-medium`
    - **REWRITE ALL JOB CONTENT to data engineering**:
      - Replace "Senior Frontend Engineer" → "Senior Data Engineer"
      - Replace "Acme Corp" → keep or update to a plausible company name
      - Replace frontend bullet points with DE content: built ETL pipelines with Apache Airflow, designed data models in BigQuery, implemented real-time streaming with Kafka, optimized Spark jobs
      - Replace "Web Developer" → "Data Engineer"
      - Replace frontend bullets with: built data pipelines with Python + dbt, maintained PostgreSQL/Snowflake warehouses, created dashboards for stakeholders
      - Replace "Junior Developer" → "Junior Data Analyst"
      - Replace bullets with: wrote SQL queries for business reporting, built Python automation scripts, maintained data quality checks
    - **REWRITE SKILLS section to data engineering**:
      - Replace `['JavaScript (ES6+)', 'TypeScript', 'React', ...]` with `['Python', 'SQL', 'Apache Spark', 'Apache Airflow', 'dbt', 'BigQuery', 'Snowflake', 'Kafka', 'PostgreSQL', 'Docker', 'Git / CI/CD']`
    - Section headings: Replace `> WORK_HISTORY` → `Experience`, `> SKILLS_&_TECHNOLOGIES` → `Skills & Technologies`, `> EDUCATION` → `Education`
    - Section styling: headline-md (1.75rem) in on-surface for section titles, use `text-on-surface-variant` for dates/locations
    - Job entries: no borders/bevels. Use spacing (4rem gap between entries) and background shifts (`bg-surface-container-low` for job cards)
    - Skill tags: `bg-surface-container-low text-on-surface px-3 py-1 rounded-full text-sm`
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Remove ALL retro: neon-glow-green, neon-glow-cyan, neon-glow-pink, bevel-raised, bevel-sunken, `--font-pixel`, `--font-terminal`, all hex neon colors
    - Remove retro text: "Execution time: 0.003ms", "> " prefix on headings

  **Must NOT do**:
  - Do NOT change `data-testid="resume-content"` or `data-testid="resume-download"` attributes
  - Do NOT change the `/resume.pdf` download href
  - Do NOT remove the `download` attribute from the link
  - Do NOT use borders/dividers between sections
  - Do NOT use `#000000`
  - Do NOT add icons

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Large page rewrite with both content creation (DE resume) and editorial visual styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Resume layout design, section hierarchy, skill tag chip patterns
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T4, T5, T6, T8)
  - **Parallel Group**: Wave 2
  - **Blocks**: T9
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `app/resume/page.tsx:1-268` — Current file to completely rewrite. Key elements to preserve: `data-testid="resume-content"` (line 7), `data-testid="resume-download"` (line 30), `/resume.pdf` href (line 28), `download` attribute (line 29). Structure to maintain: header with download button → work history → skills → education. Everything else changes
  - `DESIGN.md:38` — Headlines: `headline-md (1.75rem)` in `on_surface_variant (#5e6059)` for section headers
  - `DESIGN.md:40` — Labels: `label-md (0.75rem)` in `primary (#456375)` for metadata like dates
  - `DESIGN.md:67-68` — Cards: no dividers, `spacing-12 (4rem)` between items, `surface_container_low` backgrounds

  **WHY Each Reference Matters**:
  - `resume/page.tsx` shows the 2 critical data-testids and download link that tests verify
  - DESIGN.md typography specs define heading/label sizes for resume sections
  - Card spec defines job entry visual treatment

  **Acceptance Criteria**:
  - [ ] `data-testid="resume-content"` present on root container
  - [ ] `data-testid="resume-download"` present with `href="/resume.pdf"` and `download` attribute
  - [ ] Page contains "Senior Data Engineer" (not "Senior Frontend Engineer")
  - [ ] Page contains "Experience" heading (not "WORK_HISTORY")
  - [ ] Page contains "Skills & Technologies" heading (not "SKILLS\_&_TECHNOLOGIES")
  - [ ] Skills section contains: Python, SQL, Apache Spark, Airflow, dbt, BigQuery
  - [ ] Page contains "Education" heading
  - [ ] Zero inline `style={{}}` props
  - [ ] Zero retro references: neon-glow, bevel, font-pixel, font-terminal, RESUME.EXE, #ff00ff, #00ffff, #00ff00, #c0c0c0
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Resume page shows data engineer content
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/resume
      2. Assert: [data-testid="resume-content"] is visible
      3. Assert: [data-testid="resume-download"] is visible with href="/resume.pdf" and download attribute
      4. Assert: page contains text "Senior Data Engineer"
      5. Assert: page contains text "Python"
      6. Assert: page contains text "SQL"
      7. Assert: page contains text "Airflow" OR "Apache Airflow"
      8. Assert: page contains text "Experience"
      9. Assert: page does NOT contain "RESUME.EXE"
      10. Assert: page does NOT contain "Senior Frontend Engineer"
      11. Take screenshot
    Expected Result: DE-focused resume content, editorial styling, no retro artifacts
    Failure Indicators: Frontend content visible, retro text present, missing DE skills
    Evidence: .sisyphus/evidence/task-7-resume.png

  Scenario: Resume download link works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/resume
      2. Assert: [data-testid="resume-download"] has attribute href="/resume.pdf"
      3. Assert: [data-testid="resume-download"] has attribute "download"
      4. Fetch /resume.pdf via page.request.get — assert status 200
    Expected Result: Download link present, PDF returns 200
    Failure Indicators: Missing download attribute, 404 for PDF
    Evidence: .sisyphus/evidence/task-7-resume-download.txt

  Scenario: No retro artifacts in resume
    Tool: Bash (grep)
    Preconditions: T7 implementation complete
    Steps:
      1. Run: grep -cE "(RESUME\.EXE|WORK_HISTORY|SKILLS_&|neon-glow|bevel-|font-pixel|font-terminal|#ff00ff|#00ffff|#00ff00|style=\{\{)" app/resume/page.tsx
    Expected Result: 0 matches
    Failure Indicators: Any count > 0
    Evidence: .sisyphus/evidence/task-7-no-retro.txt
  ```

  **Commit**: YES (groups with T8)
  - Message: `style: redesign resume and contact pages, update mdx components`
  - Files: `app/resume/page.tsx`
  - Pre-commit: `pnpm build`

- [x] 8. Contact Page + mdx-components.tsx Redesign

  **What to do**:
  - **Rewrite `app/contact/page.tsx`** — Editorial contact page:
    - Keep contact link URLs: `https://github.com/pav-anastasiadis`, `https://linkedin.com/in/pav-anastasiadis`, `mailto:pav@example.com`
    - Keep `data-testid` attributes: `contact-github`, `contact-linkedin`, `contact-email`
    - Keep `target="_blank"` and `rel="noopener noreferrer"` on external links
    - Update metadata: change description from `'Retro digital guestbook and contact links'` to `'Get in touch with Pav Anastasiadis'`
    - Replace heading from `CONTACT` to `Contact` in display-lg editorial style
    - Remove retro terminal text: "INITIALIZING SECURE COMM CHANNEL...", "WELCOME TO THE DIGITAL GUESTBOOK.", "SELECT A PROTOCOL BELOW TO CONNECT."
    - Replace with brief editorial intro: "Let's connect." or similar in body text style
    - Contact links: Replace retro bevel-raised buttons with editorial discrete CTAs — text links with underline decoration, `text-primary hover:text-primary-dim` styling, spaced vertically (2rem gap)
    - Link labels: Replace `▸ GITHUB` / `▸ LINKEDIN` / `▸ EMAIL` with clean `GitHub` / `LinkedIn` / `Email`
    - Remove inline `<style>` block (the `.retro-btn:hover` rule)
    - Replace ALL inline `style={{}}` with Tailwind classes
    - Remove ALL retro: neon-glow-pink, bevel-raised, retro-btn, neon colors, pixel/terminal fonts
    - Page layout: centered, `max-w-xl mx-auto py-20 px-4`, generous spacing
  - **Rewrite `mdx-components.tsx`** — Editorial typography for MDX content:
    - Keep the function signature: `export function useMDXComponents(components: MDXComponents): MDXComponents`
    - Keep the `...components` spread
    - Replace ALL heading/paragraph/link/blockquote styles:
      - `h1`: `text-3xl font-bold tracking-tight text-on-surface mb-6` (Tailwind classes, not inline styles)
      - `h2`: `text-xl font-semibold text-on-surface mt-8 mb-4`
      - `h3`: `text-lg font-medium text-on-surface mt-6 mb-3`
      - `p`: `text-base leading-relaxed text-on-surface mb-4` (body-lg with 1.6 line-height)
      - `a`: `text-primary underline hover:text-primary-dim transition-colors`
      - `blockquote`: `border-l-2 border-primary-container pl-4 my-6 text-on-surface-variant` (editorial quote — single left border in accent color, no bevel/box-shadow)
    - Use `className` instead of `style={{}}` for ALL elements
    - Remove ALL retro: font-pixel, font-terminal, #ff00ff, #00ffff, #00ff00, #c0c0c0, bevel box-shadow, neon colors

  **Must NOT do**:
  - Do NOT change contact link URLs
  - Do NOT change `data-testid` attributes
  - Do NOT change `target="_blank"` or `rel` attributes
  - Do NOT add a contact form (not in scope)
  - Do NOT add icons to contact links
  - Do NOT change the `useMDXComponents` function signature or the `...components` spread

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Contact page layout + MDX typography system — both require editorial visual treatment
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Contact page UX patterns, typography system design
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T4, T5, T6, T7)
  - **Parallel Group**: Wave 2
  - **Blocks**: T9
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `app/contact/page.tsx:1-138` — Current contact page. Key: metadata (lines 3-6), `data-testid="contact-github"` (line 73), `data-testid="contact-linkedin"` (line 96), `data-testid="contact-email"` (line 118), link URLs (lines 70, 93, 116), `target="_blank"` and `rel` attributes. The inline `<style>` block (lines 23-28) must be removed entirely
  - `mdx-components.tsx:1-80` — Current MDX components. Key: function signature (line 3), `...components` spread (line 78). All inline styles on h1/h2/h3/p/a/blockquote must be replaced with className
  - `DESIGN.md:64` — Discrete CTA spec: text-only with underline, hover transitions from primary_container to primary thickness
  - `DESIGN.md:37-40` — Typography scale for MDX headings and body text

  **WHY Each Reference Matters**:
  - Contact page shows all data-testids and link attributes that E2E tests verify
  - mdx-components shows the exact function structure that must be preserved
  - DESIGN.md discrete CTA spec defines contact link styling
  - DESIGN.md typography scale defines MDX heading/body sizes

  **Acceptance Criteria**:
  - [ ] `app/contact/page.tsx` has heading text "Contact" (not "CONTACT" in retro style)
  - [ ] No "DIGITAL GUESTBOOK" text anywhere
  - [ ] No "INITIALIZING SECURE COMM CHANNEL" text
  - [ ] `data-testid="contact-github"` with `href="https://github.com/pav-anastasiadis"`, `target="_blank"`, `rel="noopener noreferrer"`
  - [ ] `data-testid="contact-linkedin"` with `href="https://linkedin.com/in/pav-anastasiadis"`, same target/rel
  - [ ] `data-testid="contact-email"` with `href="mailto:pav@example.com"`
  - [ ] Metadata description does not contain "retro" or "guestbook"
  - [ ] No inline `<style>` block in contact page
  - [ ] `mdx-components.tsx` uses `className` not `style={{}}` for all elements
  - [ ] mdx-components has zero references to: font-pixel, font-terminal, #ff00ff, #00ffff, #00ff00, #c0c0c0, bevel, neon
  - [ ] Zero inline `style={{}}` in both files
  - [ ] `pnpm build` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Contact page shows editorial links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/contact
      2. Assert: page has heading with text "Contact"
      3. Assert: [data-testid="contact-github"] is visible with href="https://github.com/pav-anastasiadis"
      4. Assert: [data-testid="contact-linkedin"] is visible with href="https://linkedin.com/in/pav-anastasiadis"
      5. Assert: [data-testid="contact-email"] is visible with href="mailto:pav@example.com"
      6. Assert: page does NOT contain text "DIGITAL GUESTBOOK"
      7. Assert: page does NOT contain text "INITIALIZING SECURE COMM"
      8. Take screenshot
    Expected Result: Clean editorial contact page with 3 working links, no retro text
    Failure Indicators: Retro text visible, missing links, wrong hrefs
    Evidence: .sisyphus/evidence/task-8-contact.png

  Scenario: No retro artifacts in contact and MDX
    Tool: Bash (grep)
    Preconditions: T8 implementation complete
    Steps:
      1. Run: grep -cE "(font-pixel|font-terminal|neon-|bevel-|retro-btn|DIGITAL GUESTBOOK|#ff00ff|#00ffff|#00ff00|#c0c0c0|style=\{\{)" app/contact/page.tsx mdx-components.tsx
    Expected Result: 0 for each file
    Failure Indicators: Any count > 0
    Evidence: .sisyphus/evidence/task-8-no-retro.txt

  Scenario: MDX components use className not inline styles
    Tool: Bash (grep)
    Preconditions: T8 implementation complete
    Steps:
      1. Run: grep -c "className" mdx-components.tsx — expect >= 6 (one per element: h1, h2, h3, p, a, blockquote)
      2. Run: grep -c "style={{" mdx-components.tsx — expect 0
    Expected Result: className used throughout, zero inline styles
    Failure Indicators: className count < 6 or style count > 0
    Evidence: .sisyphus/evidence/task-8-mdx-classnames.txt
  ```

  **Commit**: YES (groups with T7)
  - Message: `style: redesign resume and contact pages, update mdx components`
  - Files: `app/contact/page.tsx`, `mdx-components.tsx`
  - Pre-commit: `pnpm build`

- [x] 9. E2E Test Rewrite — All 7 Spec Files

  **What to do**:
  - **Rewrite ALL 7 E2E test files** to match the new editorial content and structure. Every assertion that references retro content, removed components, or changed text must be updated. Tests that reference structural elements (data-testids, URLs) that still exist should be preserved.
  - **`e2e/navigation.spec.ts`** — Update:
    - KEEP: all nav link visibility tests (nav-home, nav-projects, nav-blog, nav-resume, nav-contact), all href assertions, all click navigation tests, footer visibility test, footer-on-every-page test
    - REMOVE: `hit-counter is visible on homepage` test (HitCounter removed)
    - REMOVE: `under-construction banner is visible on homepage` test (UnderConstruction removed)
  - **`e2e/blog.spec.ts`** — Major rewrite:
    - Update "shows all blog post cards" → assert `toHaveCount(0)` (0 posts)
    - REMOVE or REPLACE: "shows tag filter pills" (no tags when 0 posts), "ALL tag is active by default" (no tag filters shown), "clicking a tag filter updates the URL", "filtering by css tag shows only matching posts", "active tag is highlighted when filtering by tag"
    - ADD: "shows empty state message" — assert page contains text matching "no posts" (case insensitive)
    - KEEP: "filtering by non-existent tag shows empty state message" (still valid — but update expected text if changed)
    - REMOVE: all "Blog post pages" tests — hello-world, building-retro-web, typescript-tips posts no longer exist
    - KEEP: "Blog 404 handling" — nonexistent slug returns 404
    - REMOVE: "post cards link to correct post pages" (no cards to click)
  - **`e2e/projects.spec.ts`** — Update counts and remove deleted projects:
    - Update "shows N project cards" → assert `toHaveCount(1)` (1 project)
    - KEEP: "projects-grid is visible", "project cards are clickable links"
    - KEEP: pixel-canvas detail tests (title, description, demo-link)
    - REMOVE: "retro-terminal detail shows title" test
    - REMOVE: "retro-terminal detail has no demo-link" test
    - REMOVE: "neon-clock detail shows title" test
    - REMOVE: "retro-terminal demo page returns 404" test (project no longer exists — route itself 404s)
    - KEEP: pixel-canvas demo tests (demo-container, demo-interactive)
  - **`e2e/resume.spec.ts`** — Update all content assertions:
    - KEEP: "resume-content section is visible"
    - REPLACE: "shows RESUME.EXE heading" → "shows Resume heading" — assert page contains text "Resume" (or the actual heading used)
    - REPLACE: "shows work history section" → "shows Experience section" — assert `text=Experience` (new heading)
    - REPLACE: "shows Senior Frontend Engineer job" → "shows Senior Data Engineer job" — assert `text=Senior Data Engineer`
    - REPLACE: "shows skills section" → assert text "Skills" (not `SKILLS_&_TECHNOLOGIES`)
    - KEEP: "shows TypeScript skill" — REMOVE this, replace with "shows Python skill" — assert `text=Python`
    - REPLACE: "shows education section" → assert `text=Education` (not `> EDUCATION`)
    - KEEP: all resume-download tests (visibility, href, download attribute, PDF 200 status)
  - **`e2e/contact.spec.ts`** — Update text assertions:
    - KEEP: ALL contact link tests (github, linkedin, email — visibility, href, target, rel)
    - KEEP: "contact page shows CONTACT heading" — update to assert heading text is "Contact" (case-sensitive match may change from `'CONTACT'` to `'Contact'`)
    - REMOVE: "contact page shows digital guestbook text" — DIGITAL GUESTBOOK text is gone
  - **`e2e/rss.spec.ts`** — Update for 0 posts:
    - KEEP: status 200, XML content-type, XML declaration, valid RSS 2.0 structure, channel has title
    - REMOVE: "contains blog post items" (0 items now)
    - REMOVE: "contains hello-world post", "contains building-retro-web post", "contains typescript-tips post"
    - ADD: "RSS feed has no items" — assert text does NOT contain `<item>`
    - UPDATE: channel title test — ensure matches "Pav Anastasiadis Blog"
  - **`e2e/mobile.spec.ts`** — Update for removed components and content:
    - KEEP: homepage loads, nav links visible, footer visible, projects grid loads, project detail loads, resume loads, contact loads
    - REMOVE: "hit-counter is visible on mobile" test
    - REMOVE: "under-construction banner is visible on mobile" test
    - REMOVE or UPDATE: "blog listing loads on mobile" — change from asserting first blog-post-card to asserting page loads (no cards with 0 posts)
    - REMOVE: "blog post page loads on mobile" (no posts to load — hello-world doesn't exist)

  **Must NOT do**:
  - Do NOT modify `playwright.config.ts` (protected)
  - Do NOT add unit tests (only E2E)
  - Do NOT change test structure (Playwright test/describe/expect patterns)
  - Do NOT add new test files — update existing 7 only
  - Do NOT invent new data-testids — only use ones that exist in the implementation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex cross-cutting task touching 7 files with nuanced assertion logic. Needs to understand both old and new content to correctly update/remove/add tests
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: The executing agent doesn't need to RUN playwright (that's for QA). This task is writing test code, not executing browser automation
    - `frontend-ui-ux`: No visual design decisions — pure test code

  **Parallelization**:
  - **Can Run In Parallel**: NO (must wait for ALL UI tasks to complete so tests match implementation)
  - **Parallel Group**: Wave 3 (solo)
  - **Blocks**: T10
  - **Blocked By**: T3, T4, T5, T6, T7, T8

  **References**:

  **Pattern References** (CRITICAL — exhaustive per-file test inventory):
  - `e2e/navigation.spec.ts:1-89` — 11 tests. REMOVE lines 72-80 (hit-counter + under-construction tests). Keep remaining 9 tests unchanged — nav links and footer assertions still valid
  - `e2e/blog.spec.ts:1-106` — 14 tests. REMOVE/REWRITE 11 tests. Keep: 404 handling (lines 100-105). Add empty state test. All blog post page tests (lines 57-97) must be removed — those slugs no longer exist
  - `e2e/projects.spec.ts:1-83` — 11 tests. Update count from 3→1 (line 13). REMOVE tests for retro-terminal (lines 46-56) and neon-clock (lines 58-63) and retro-terminal demo 404 (lines 78-81). Keep all pixel-canvas tests
  - `e2e/resume.spec.ts:1-65` — 11 tests. Update 5 content assertion tests (lines 10-38) to match new headings and DE content. Keep all 4 download tests unchanged (lines 41-63)
  - `e2e/contact.spec.ts:1-74` — 12 tests. REMOVE "digital guestbook text" test (lines 69-72). Update heading assertion (line 66) from CONTACT to Contact. Keep all 10 link tests
  - `e2e/rss.spec.ts:1-63` — 9 tests. REMOVE 4 post-specific tests (lines 30-56). ADD "no items" test. Keep 4 structural tests + channel title test
  - `e2e/mobile.spec.ts:1-89` — 10 tests. REMOVE hit-counter (lines 27-31), under-construction (lines 33-37). UPDATE blog tests: listing (no cards), remove hello-world post test. Keep structure tests

  **WHY Each Reference Matters**:
  - Every line reference above maps to a specific test that needs REMOVE/UPDATE/KEEP decision
  - The executing agent MUST read each test file and compare against actual implementation to write correct assertions
  - Wrong test content → `pnpm test:e2e` failure → blocks T10 and Final Verification

  **Acceptance Criteria**:
  - [ ] All 7 E2E test files updated
  - [ ] Zero references to: hello-world, building-retro-web, typescript-tips, retro-terminal, neon-clock
  - [ ] Zero references to: hit-counter, under-construction, RESUME.EXE, WORK*HISTORY, SKILLS*&\_TECHNOLOGIES, DIGITAL GUESTBOOK, Senior Frontend Engineer
  - [ ] Blog tests expect 0 post cards
  - [ ] Projects tests expect 1 project card
  - [ ] RSS tests expect 0 items
  - [ ] Resume tests assert "Senior Data Engineer" and "Python"
  - [ ] Contact tests do NOT assert "DIGITAL GUESTBOOK"
  - [ ] `pnpm test:e2e` — ALL tests pass
  - [ ] `pnpm build` exits 0 (prerequisite for E2E)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All E2E tests pass
    Tool: Bash
    Preconditions: All UI tasks T1-T8 complete, dev server available
    Steps:
      1. Run: pnpm test:e2e
      2. Capture full output
      3. Assert: exit code 0
      4. Assert: output contains "passed" and does NOT contain "failed"
    Expected Result: All tests pass (expect ~50-60 tests after removal of obsolete ones)
    Failure Indicators: Any test failure, non-zero exit code
    Evidence: .sisyphus/evidence/task-9-e2e-results.txt

  Scenario: No references to removed content in test files
    Tool: Bash (grep)
    Preconditions: T9 implementation complete
    Steps:
      1. Run: grep -rlE "(hello-world|building-retro-web|typescript-tips|retro-terminal|neon-clock|hit-counter|under-construction|RESUME\.EXE|WORK_HISTORY|SKILLS_&|DIGITAL GUESTBOOK|Senior Frontend Engineer)" e2e/
    Expected Result: No files match (empty output)
    Failure Indicators: Any file listed
    Evidence: .sisyphus/evidence/task-9-no-retro-tests.txt

  Scenario: Test counts are correct for reduced content
    Tool: Bash (grep)
    Preconditions: T9 implementation complete
    Steps:
      1. Run: grep -c "toHaveCount(0)" e2e/blog.spec.ts — expect >= 1 (0 blog posts)
      2. Run: grep -c "toHaveCount(1)" e2e/projects.spec.ts — expect >= 1 (1 project)
      3. Run: grep "Senior Data Engineer" e2e/resume.spec.ts — expect match
      4. Run: grep "NOT.*contain.*item" e2e/rss.spec.ts — OR grep "toContain.*<item>" should NOT be present
    Expected Result: Correct count assertions for new content state
    Failure Indicators: Wrong counts, old content referenced
    Evidence: .sisyphus/evidence/task-9-test-counts.txt
  ```

  **Commit**: YES
  - Message: `test: rewrite E2E tests for editorial redesign`
  - Files: `e2e/navigation.spec.ts`, `e2e/blog.spec.ts`, `e2e/projects.spec.ts`, `e2e/resume.spec.ts`, `e2e/contact.spec.ts`, `e2e/rss.spec.ts`, `e2e/mobile.spec.ts`
  - Pre-commit: `pnpm test:e2e`

- [x] 10. Delete Retro Components + Update README

  **What to do**:
  - **Delete `components/HitCounter.tsx`** — retro artifact, no longer imported anywhere after T2
  - **Delete `components/UnderConstruction.tsx`** — retro artifact, no longer imported anywhere after T2
  - **Verify no dangling imports**: grep entire codebase for `HitCounter` and `UnderConstruction` — should return 0 matches
  - **Rewrite `README.md`** — update project description:
    - Replace opening description from "A retro 90s developer portfolio featuring CRT scanlines, neon glows, and pixel-perfect terminal aesthetics" to "Personal portfolio of Pav Anastasiadis — Data Engineer. Built with editorial minimalism design principles."
    - Update "Features" section: remove retro references (CRT aesthetic, Win95-style, scanlines, vignette, neon). Replace with: "Editorial minimalism design with Manrope typography, warm palette, and glassmorphism navigation", "Live timezone clock (Europe/Amsterdam)", "5 core pages with data engineering focus"
    - Update "Components" description: remove "(retro UI primitives)" → "(editorial UI components)"
    - Keep all technical details accurate: Next.js 16, TypeScript, Tailwind v4, MDX, Playwright
    - Keep all commands, project structure, and instructions accurate

  **Must NOT do**:
  - Do NOT delete any file other than HitCounter.tsx and UnderConstruction.tsx
  - Do NOT modify build scripts or package.json
  - Do NOT add documentation files beyond README

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 2 file deletions + 1 README text update — straightforward cleanup
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No visual work — file operations only

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T9 — must verify tests pass first)
  - **Parallel Group**: Wave 4 (solo)
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: T9

  **References**:

  **Pattern References**:
  - `components/HitCounter.tsx` — File to delete. Verify no imports remain after T2 removed it from layout
  - `components/UnderConstruction.tsx` — File to delete. Same verification
  - `README.md` — Current file with retro descriptions to update. Opening paragraph (line 3), Features section, Components description

  **WHY Each Reference Matters**:
  - Must verify files exist before deleting (defensive)
  - Must verify no imports remain (would cause build failure)
  - README shows exact text to find and replace

  **Acceptance Criteria**:
  - [ ] `components/HitCounter.tsx` does not exist
  - [ ] `components/UnderConstruction.tsx` does not exist
  - [ ] `grep -r "HitCounter" --include="*.tsx" --include="*.ts"` returns 0 matches
  - [ ] `grep -r "UnderConstruction" --include="*.tsx" --include="*.ts"` returns 0 matches
  - [ ] `README.md` does not contain "retro", "CRT", "scanlines", "neon", "Win95"
  - [ ] `README.md` contains "Data Engineer" and "editorial"
  - [ ] `pnpm build` exits 0
  - [ ] `pnpm lint` exits 0
  - [ ] `pnpm test:e2e` — all tests pass

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Retro components deleted and no dangling imports
    Tool: Bash
    Preconditions: T10 implementation complete
    Steps:
      1. Run: ls components/HitCounter.tsx — expect "No such file"
      2. Run: ls components/UnderConstruction.tsx — expect "No such file"
      3. Run: grep -rl "HitCounter" --include="*.tsx" --include="*.ts" . — expect empty output
      4. Run: grep -rl "UnderConstruction" --include="*.tsx" --include="*.ts" . — expect empty output
    Expected Result: Files deleted, zero references remaining
    Failure Indicators: Files exist or references found
    Evidence: .sisyphus/evidence/task-10-deletions.txt

  Scenario: README updated and no retro references
    Tool: Bash (grep)
    Preconditions: T10 implementation complete
    Steps:
      1. Run: grep -ciE "(retro|CRT|scanlines|neon|Win95|pixel-perfect terminal)" README.md — expect 0
      2. Run: grep -c "Data Engineer" README.md — expect >= 1
      3. Run: grep -c "editorial" README.md — expect >= 1
    Expected Result: README has DE content, no retro references
    Failure Indicators: Retro text found or DE text missing
    Evidence: .sisyphus/evidence/task-10-readme.txt

  Scenario: Full build + lint + test suite passes
    Tool: Bash
    Preconditions: T10 complete (final cleanup task)
    Steps:
      1. Run: pnpm build — assert exit 0
      2. Run: pnpm lint — assert exit 0
      3. Run: pnpm format:check — assert exit 0
      4. Run: pnpm test:e2e — assert exit 0
    Expected Result: All 4 commands pass — project is fully clean
    Failure Indicators: Any command fails
    Evidence: .sisyphus/evidence/task-10-full-verify.txt
  ```

  **Commit**: YES
  - Message: `chore: remove retro components and update README`
  - Files: (deleted) `components/HitCounter.tsx`, `components/UnderConstruction.tsx`, `README.md`
  - Pre-commit: `pnpm build && pnpm lint && pnpm test:e2e`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
      Run `tsc --noEmit` + linter + `pnpm build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check for retro color leaks: grep for #ff00ff, #00ffff, #00ff00, #c0c0c0, #0a0a0a in .tsx files. Check for old font references: grep for Press_Start_2P, VT323, --font-pixel, --font-terminal.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Retro Leaks [CLEAN/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (nav works on all pages, footer present everywhere, clock ticks on homepage). Test edge cases: empty blog, single project, mobile viewport. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes. Verify no modifications to protected files: lib/blog.ts, lib/projects.ts, playwright.config.ts, components/demos/pixel-canvas.tsx.
      Output: `Tasks [N/N compliant] | Protected Files [CLEAN/N violations] | VERDICT`

---

## Commit Strategy

| Commit | Scope | Message                                                           | Verify                                     |
| ------ | ----- | ----------------------------------------------------------------- | ------------------------------------------ |
| 1      | T1+T2 | `style: replace retro design system with editorial minimalism`    | `pnpm build`                               |
| 2      | T3    | `feat: redesign homepage with timezone clock and GIF placeholder` | `pnpm build`                               |
| 3      | T4    | `chore: remove retro blog posts and trim project list`            | `pnpm build`                               |
| 4      | T5+T6 | `style: redesign blog and projects pages to editorial style`      | `pnpm build`                               |
| 5      | T7+T8 | `style: redesign resume and contact pages, update mdx components` | `pnpm build`                               |
| 6      | T9    | `test: rewrite E2E tests for editorial redesign`                  | `pnpm test:e2e`                            |
| 7      | T10   | `chore: remove retro components and update README`                | `pnpm build && pnpm lint && pnpm test:e2e` |

---

## Success Criteria

### Verification Commands

```bash
pnpm build          # Expected: exits 0, no errors
pnpm lint           # Expected: exits 0, no warnings
pnpm format:check   # Expected: exits 0
pnpm test:e2e       # Expected: all tests pass
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] No retro color/font references remain in source
- [ ] DESIGN.md palette faithfully implemented
- [ ] Homepage shows GIF placeholder + ticking clock
- [ ] Blog shows empty state
- [ ] Projects shows only pixel-canvas
- [ ] Resume shows data engineering content
