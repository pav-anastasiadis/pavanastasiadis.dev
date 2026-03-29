# Personal Developer Portfolio — pavanastasiadis.dev

## TL;DR

> **Quick Summary**: Build a retro 90s-themed personal portfolio using Next.js App Router, TypeScript strict, and Tailwind CSS v4. Five separate pages (landing, projects with interactive demos, MDX blog with syntax highlighting and RSS, resume with PDF download, contact/socials), all custom components with no component libraries. Full DX tooling (ESLint flat config, Prettier, Husky + lint-staged) and Playwright E2E tests.
>
> **Deliverables**:
>
> - Landing/About page at `/`
> - Projects grid at `/projects` with interactive demo routes at `/projects/[slug]/demo`
> - MDX blog at `/blog` with tag filtering, individual post pages, and RSS feed at `/rss.xml`
> - Resume page at `/resume` with downloadable PDF
> - Contact page at `/contact` with social links
> - Playwright E2E test suite in `/e2e/`
> - README with tech stack and local dev setup
> - 2-3 seed blog posts and 2-3 seed projects (at least 1 with interactive demo)
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 6 → Task 8 → Task 10 → Task 14 → F1-F4

---

## Context

### Original Request

Build a personal developer portfolio using Next.js (App Router), TypeScript (strict), and Tailwind CSS deployed on Vercel. Five sections: landing/about, projects grid with interactive demos, MDX blog (files in `/content/blog/`, frontmatter, syntax highlighting, tag filtering, RSS), resume with PDF download, and contact/socials. Retro 90s web aesthetic with pixel fonts, neon/CRT colors, beveled borders, scanlines, under-construction banners, and cosmetic hit counters. Full DX tooling (ESLint, Prettier, Husky + lint-staged), Playwright E2E tests only, GitHub Issues workflow.

### Interview Summary

**Key Discussions**:

- **Architecture**: Separate pages with own routes — NOT single-page scroll
- **Demo isolation**: Direct mount — no iframes. Demos must be self-contained (no global CSS leakage)
- **Contact**: Social links only (GitHub, LinkedIn, email mailto:) — no form backend needed
- **Seed content**: Moderate — 2-3 blog posts, 2-3 projects with at least 1 interactive demo
- **Package manager**: pnpm
- **Resume PDF**: Static file in `/public/resume.pdf` (user provides) — plan includes placeholder

**Research Findings**:

- **MDX**: `@next/mdx` is official. CRITICAL: it does NOT support YAML frontmatter natively — requires `remark-frontmatter` + `remark-mdx-frontmatter` plugins
- **Tailwind v4**: CSS-first configuration via `@theme` directive — NO `tailwind.config.js` file
- **Fonts**: `next/font/google` for Press_Start_2P and VT323 → CSS variables → `@theme` references
- **Syntax highlighting**: `rehype-pretty-code` (built on shiki) — zero client JS, VS Code themes
- **RSS**: Route handler at `app/rss.xml/route.ts` with `export const dynamic = 'force-static'`
- **ESLint**: Flat config (`eslint.config.mjs`) with `@next/eslint-plugin-next`, import, jsx-a11y, prettier (LAST)
- **Husky v9**: `npx husky init`, prepare script is `husky`, pre-commit runs `pnpm exec lint-staged`
- **Playwright**: Custom `testDir: './e2e'`, `webServer` config for auto-starting dev server, device emulation for mobile
- **Retro CSS**: Scanlines via `::after` pseudo-element gradient, beveled borders via asymmetric border-color, neon glows via multi-layer text-shadow/box-shadow

### Metis Review

**Identified Gaps** (addressed):

- **@next/mdx frontmatter**: Resolved — use `remark-frontmatter` + `remark-mdx-frontmatter` (NOT `gray-matter`)
- **Tailwind v4 config shift**: Resolved — use CSS `@theme` directive, no JS config file
- **Demo CSS isolation**: Resolved — each demo must be self-contained, plan includes isolation guidance
- **RSS XML escaping**: Resolved — plan requires XML-escaping dynamic content
- **Accessibility**: Resolved — `prefers-reduced-motion` media query for CRT/scanline effects
- **Scope creep on retro aesthetic**: Resolved — locked deliverable list: scanlines, beveled borders, neon glow, pixel fonts, hit counter, under-construction banner. Nothing else.

---

## Work Objectives

### Core Objective

Deliver a fully deployed, retro 90s-themed developer portfolio with 5 pages, MDX blog infrastructure, interactive project demos, and solid DX tooling — all custom-built without component libraries.

### Concrete Deliverables

- Next.js App Router project with TypeScript strict mode
- Tailwind CSS v4 with custom retro theme (`@theme`)
- 5 pages: `/`, `/projects`, `/blog`, `/resume`, `/contact`
- Dynamic routes: `/blog/[slug]`, `/projects/[slug]`, `/projects/[slug]/demo`
- MDX blog with YAML frontmatter, syntax highlighting, tag filtering
- RSS feed at `/rss.xml`
- 2-3 seed blog posts, 2-3 seed projects (1+ interactive demo)
- Retro UI components: navigation, hit counter, under-construction banner, beveled panels, neon text
- ESLint flat config + Prettier + Husky + lint-staged
- Playwright E2E test suite in `/e2e/`
- README.md

### Definition of Done

- [ ] `pnpm build` exits 0 with no errors
- [ ] `pnpm lint` exits 0
- [ ] Pre-commit hook (Husky + lint-staged) fires and passes
- [ ] `pnpm exec playwright test` — all tests pass (desktop + mobile)
- [ ] All 5 pages render correctly with retro styling
- [ ] Blog posts render with syntax highlighting
- [ ] RSS feed returns valid XML
- [ ] At least 1 interactive demo is functional
- [ ] Resume PDF download link works

### Must Have

- Retro 90s visual identity on ALL pages (not just landing)
- MDX blog with YAML frontmatter (title, date, tags)
- Syntax highlighting in blog code blocks
- Tag filtering on blog listing page
- RSS feed containing all blog posts
- Interactive demo mount at `/projects/[slug]/demo`
- Downloadable resume PDF link
- Social links (GitHub, LinkedIn, email)
- ESLint + Prettier + Husky pre-commit hooks
- Playwright E2E tests covering all pages + mobile
- `data-testid` attributes on key elements for E2E targeting

### Must NOT Have (Guardrails)

- NO component libraries (shadcn, MUI, Radix, Chakra, etc.)
- NO CSS-in-JS (styled-components, emotion, etc.)
- NO headless CMS (Sanity, Contentful, etc.)
- NO `tailwind.config.js` — Tailwind v4 uses CSS `@theme` only
- NO `gray-matter` or `globby` — use `remark-frontmatter` + `remark-mdx-frontmatter` for MDX frontmatter, `fs.readdir` for file discovery
- NO `next-mdx-remote` or `contentlayer`
- NO unit tests, NO Storybook, NO conventional commits tooling
- NO contact form backend or API routes for email
- NO retro effects beyond locked list (scanlines, beveled borders, neon glow, pixel fonts, hit counter, under-construction banner)
- NO over-engineering — no "design system," no token files, no abstraction layers
- NO generic SaaS/minimalist design aesthetic

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO (greenfield)
- **Automated tests**: Playwright E2E only (per user requirement)
- **Framework**: `@playwright/test`
- **Unit tests**: NONE (explicitly excluded)

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Pages/UI**: Use Playwright — navigate, interact, assert DOM, screenshot
- **Build/Lint**: Use Bash — `pnpm build`, `pnpm lint`, verify exit codes
- **RSS/API**: Use Bash (curl) — fetch endpoint, assert content
- **Pre-commit hooks**: Use Bash — stage files, run lint-staged, verify output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
├── Task 1: Project scaffold + DX tooling [deep]
└── (sequential gate — everything depends on scaffold)

Wave 2 (After Wave 1 — theme + layout + content infrastructure):
├── Task 2: Retro theme system (fonts, colors, CSS effects) [visual-engineering]
├── Task 3: Root layout with retro navigation shell [visual-engineering]
├── Task 4: MDX blog infrastructure [deep]
├── Task 5: Project data layer + metadata [quick]
└── (5 parallel tasks)

Wave 3 (After Wave 2 — pages + features):
├── Task 6: Landing/About page (depends: 2, 3) [visual-engineering]
├── Task 7: Blog seed content + tag filtering (depends: 4) [unspecified-high]
├── Task 8: RSS feed route handler (depends: 4) [quick]
├── Task 9: Projects grid + detail pages (depends: 3, 5) [visual-engineering]
├── Task 10: Interactive demo infrastructure + seed demo (depends: 5, 9) [deep]
├── Task 11: Resume page with PDF download (depends: 3) [visual-engineering]
├── Task 12: Contact page with social links (depends: 3) [visual-engineering]
└── (7 parallel tasks, some with chaining)

Wave 4 (After Wave 3 — testing + docs):
├── Task 13: Playwright E2E test suite (depends: all pages) [unspecified-high]
├── Task 14: README + deployment prep (depends: all) [writing]
└── (2 parallel tasks)

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 2 → Task 3 → Task 6 → Task 9 → Task 10 → Task 13 → F1-F4 → user okay
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 7 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks       | Wave |
| ---- | ---------- | ------------ | ---- |
| 1    | —          | 2, 3, 4, 5   | 1    |
| 2    | 1          | 6, 9, 11, 12 | 2    |
| 3    | 1          | 6, 9, 11, 12 | 2    |
| 4    | 1          | 7, 8         | 2    |
| 5    | 1          | 9, 10        | 2    |
| 6    | 2, 3       | 13           | 3    |
| 7    | 4          | 13           | 3    |
| 8    | 4          | 13           | 3    |
| 9    | 3, 5       | 10, 13       | 3    |
| 10   | 5, 9       | 13           | 3    |
| 11   | 3          | 13           | 3    |
| 12   | 3          | 13           | 3    |
| 13   | 6-12       | 14           | 4    |
| 14   | all        | F1-F4        | 4    |

### Agent Dispatch Summary

- **Wave 1**: **1** — T1 → `deep`
- **Wave 2**: **4** — T2 → `visual-engineering`, T3 → `visual-engineering`, T4 → `deep`, T5 → `quick`
- **Wave 3**: **7** — T6 → `visual-engineering`, T7 → `unspecified-high`, T8 → `quick`, T9 → `visual-engineering`, T10 → `deep`, T11 → `visual-engineering`, T12 → `visual-engineering`
- **Wave 4**: **2** — T13 → `unspecified-high`, T14 → `writing`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Scaffold Project with Next.js, TypeScript, Tailwind v4, and DX Tooling

  **What to do**:
  - Initialize the project with `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --turbopack` (adjust flags as needed for latest Next.js — the goal is App Router + TypeScript + Tailwind)
  - Verify `tsconfig.json` has `"strict": true`. If not, enable it manually
  - Verify Tailwind v4 is installed (CSS-first config with `@theme` directive, NOT `tailwind.config.js`). If `create-next-app` generates `tailwind.config.ts`, delete it and convert to CSS `@theme` in `app/globals.css`
  - Configure `next.config.mjs` (ESM) — set `pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']` (MDX plugins will be added in Task 4)
  - Install and configure ESLint flat config (`eslint.config.mjs`):
    - `pnpm add -D @eslint/js typescript-eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-config-prettier`
    - Order: `@eslint/js` recommended → `typescript-eslint` recommended → `@next/eslint-plugin-next` → `eslint-plugin-import` (with import/order rule) → `eslint-plugin-jsx-a11y` → `eslint-config-prettier` (MUST BE LAST)
    - Add global ignores: `node_modules/**`, `.next/**`, `out/**`, `playwright-report/**`
  - Install and configure Prettier (`.prettierrc`): `semi: true`, `singleQuote: true`, `printWidth: 100`, `trailingComma: "es5"`, `tabWidth: 2`
  - Add `.prettierignore`: `node_modules`, `.next`, `out`, `pnpm-lock.yaml`, `playwright-report`
  - Install and configure Husky v9 + lint-staged:
    - `pnpm add -D husky lint-staged`
    - `npx husky init`
    - Add `"prepare": "husky"` to package.json scripts
    - Configure `.husky/pre-commit`: `pnpm exec lint-staged`
    - Configure lint-staged in `package.json` or `.lintstagedrc.json`: `"*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"]`, `"*.{json,css,md,mdx,html,yml,yaml}": ["prettier --write"]`
  - Install Playwright: `pnpm add -D @playwright/test && pnpm exec playwright install --with-deps chromium`
  - Configure `playwright.config.ts`:
    - `testDir: './e2e'`
    - `webServer: { command: 'pnpm dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }`
    - Projects: `chromium` only for dev speed (CI can add more)
    - `use: { baseURL: 'http://localhost:3000' }`
  - Create empty `e2e/` directory with a smoke test: `e2e/smoke.spec.ts` that just navigates to `/` and asserts the page loads
  - Add package.json scripts: `"dev"`, `"build"`, `"start"`, `"lint"`, `"lint:fix"`, `"format"`, `"format:check"`, `"test:e2e"` (runs `playwright test`)
  - Clean up any boilerplate content from `create-next-app` (remove default page content, default globals CSS except Tailwind imports)
  - Verify: `pnpm build` exits 0, `pnpm lint` exits 0, `pnpm exec tsc --noEmit` exits 0

  **Must NOT do**:
  - Do NOT create `tailwind.config.js` or `tailwind.config.ts` — Tailwind v4 uses CSS-only config
  - Do NOT install any component libraries
  - Do NOT set up conventional commits tooling (commitlint, commitizen, etc.)
  - Do NOT add unit test frameworks (jest, vitest, bun test)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex multi-tool setup requiring careful configuration of 6+ tools (Next.js, TypeScript, Tailwind v4, ESLint flat config, Prettier, Husky, lint-staged, Playwright). Many moving parts that must work together correctly. Needs research ability if Tailwind v4 + Next.js has compatibility nuances.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed yet — just installing and creating config, not writing real tests
    - `frontend-ui-ux`: No UI work in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO (this is the foundation)
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3, 4, 5 (everything)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - This is a greenfield project — no existing patterns to follow

  **External References**:
  - Next.js create-next-app: `https://nextjs.org/docs/app/api-reference/cli/create-next-app`
  - Tailwind CSS v4 installation with Next.js: `https://tailwindcss.com/docs/installation/framework-guides/nextjs`
  - Tailwind v4 `@theme` config: `https://tailwindcss.com/docs/theme`
  - ESLint flat config: `https://eslint.org/docs/latest/use/configure/configuration-files`
  - Husky v9: `https://typicode.github.io/husky/`
  - lint-staged: `https://github.com/lint-staged/lint-staged`
  - Playwright installation: `https://playwright.dev/docs/intro`

  **WHY Each Reference Matters**:
  - Tailwind v4 docs are critical — the config model changed completely from v3 (no JS config file)
  - ESLint flat config is the new standard — legacy `.eslintrc` patterns won't work
  - Husky v9 changed its API — `init` not `install`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds with zero errors
    Tool: Bash
    Preconditions: Project fully scaffolded with all configs
    Steps:
      1. Run `pnpm build`
      2. Assert exit code is 0
      3. Run `pnpm lint`
      4. Assert exit code is 0
      5. Run `pnpm exec tsc --noEmit`
      6. Assert exit code is 0
    Expected Result: All three commands exit 0 with no errors or warnings
    Failure Indicators: Non-zero exit code, TypeScript errors, ESLint errors
    Evidence: .sisyphus/evidence/task-1-build-succeeds.txt

  Scenario: Pre-commit hook fires and passes
    Tool: Bash
    Preconditions: Husky initialized, lint-staged configured
    Steps:
      1. Create a test file: `echo 'const x = 1' > test-hook.ts`
      2. Run `git add test-hook.ts`
      3. Run `git commit -m "test pre-commit hook"`
      4. Assert commit succeeds (exit 0) — lint-staged ran ESLint + Prettier
      5. Clean up: `git reset HEAD~1 && rm test-hook.ts`
    Expected Result: Commit succeeds, lint-staged output visible in terminal
    Failure Indicators: Commit rejected, lint-staged errors, Husky not found
    Evidence: .sisyphus/evidence/task-1-precommit-hook.txt

  Scenario: Playwright smoke test passes
    Tool: Bash
    Preconditions: Dev server running, e2e/smoke.spec.ts exists
    Steps:
      1. Run `pnpm exec playwright test e2e/smoke.spec.ts`
      2. Assert exit code is 0
    Expected Result: 1 test passes
    Failure Indicators: Test fails, server not reachable, Playwright not installed
    Evidence: .sisyphus/evidence/task-1-playwright-smoke.txt

  Scenario: Tailwind v4 CSS-only config verified
    Tool: Bash
    Preconditions: Project scaffolded
    Steps:
      1. Assert `tailwind.config.js` does NOT exist: `test ! -f tailwind.config.js`
      2. Assert `tailwind.config.ts` does NOT exist: `test ! -f tailwind.config.ts`
      3. Assert `app/globals.css` contains `@import "tailwindcss"` or `@tailwind` directives
    Expected Result: No JS/TS tailwind config, CSS imports present
    Failure Indicators: tailwind.config.* exists, CSS missing Tailwind imports
    Evidence: .sisyphus/evidence/task-1-tailwind-v4-config.txt
  ```

  **Evidence to Capture:**
  - [ ] task-1-build-succeeds.txt
  - [ ] task-1-precommit-hook.txt
  - [ ] task-1-playwright-smoke.txt
  - [ ] task-1-tailwind-v4-config.txt

  **Commit**: YES
  - Message: `scaffold project with next.js, typescript, tailwind, and dx tooling`
  - Files: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.mjs`, `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `.husky/*`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `e2e/smoke.spec.ts`, `.gitignore`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 2. Retro Theme System — Pixel Fonts, Neon Colors, CRT Effects

  **What to do**:
  - Set up pixel fonts via `next/font/google` in `app/layout.tsx`:
    - Import `Press_Start_2P` (weight 400) and `VT323` (weight 400) from `next/font/google`
    - Assign CSS variables: `--font-pixel` and `--font-terminal`
    - Apply both variables to `<html>` element via `className`
  - Configure Tailwind v4 theme in `app/globals.css` using `@theme` directive:
    - Font families: `--font-pixel: "Press Start 2P", monospace;` and `--font-terminal: "VT323", monospace;`
    - Neon colors: `--color-neon-pink: #FF00FF;`, `--color-neon-green: #00FF00;`, `--color-neon-cyan: #00FFFF;`, `--color-neon-blue: #0066FF;`, `--color-neon-purple: #9900FF;`, `--color-neon-orange: #FF6600;`
    - Retro neutrals: `--color-retro-black: #0a0a0a;`, `--color-retro-dark: #1a1a1a;`, `--color-retro-gray: #808080;`, `--color-retro-silver: #C0C0C0;`
  - Create retro CSS utilities in `app/globals.css` using `@layer components`:
    - `.scanlines` — `::after` pseudo-element with repeating linear-gradient (horizontal lines, 4px spacing, 25% opacity black)
    - `.crt-vignette` — `::before` pseudo-element with radial-gradient darkening edges
    - `.bevel-raised` — asymmetric border-color (`#FFFFFF #808080 #808080 #FFFFFF`) with inset box-shadow
    - `.bevel-sunken` — inverse asymmetric border-color (`#808080 #FFFFFF #FFFFFF #808080`) with inset box-shadow
    - `.neon-glow-pink` — multi-layer text-shadow (5px, 10px, 20px, 40px spread at `#FF00FF`)
    - `.neon-glow-green` — same pattern at `#00FF00`
    - `.neon-glow-cyan` — same pattern at `#00FFFF`
    - `.neon-border` — 2px border + box-shadow with inset glow
    - `@keyframes neon-flicker` — subtle opacity flicker animation
    - `@keyframes scanline-scroll` — moving scanline animation
  - Add `prefers-reduced-motion` media query: disable ALL animations (scanline, flicker, neon-flicker) when user prefers reduced motion
  - Set dark background (`#0a0a0a`) and light text as default body styles

  **Must NOT do**:
  - Do NOT create `tailwind.config.js` or `tailwind.config.ts`
  - Do NOT add retro effects beyond the locked list
  - Do NOT use CSS-in-JS
  - Do NOT install any CSS framework or component library

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Pure CSS/visual design work — custom theme tokens, CSS effects, animations, font loading. Requires visual sensibility for the retro aesthetic.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Provides design intuition for color balance, typography hierarchy, and effect subtlety in the retro theme
  - **Skills Evaluated but Omitted**:
    - `playwright`: No testing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Tasks 6, 9, 11, 12
  - **Blocked By**: Task 1

  **References**:

  **External References**:
  - Tailwind v4 `@theme` directive: `https://tailwindcss.com/docs/theme`
  - `next/font/google` API: `https://nextjs.org/docs/app/api-reference/components/font`
  - Press Start 2P on Google Fonts: `https://fonts.google.com/specimen/Press+Start+2P`
  - VT323 on Google Fonts: `https://fonts.google.com/specimen/VT323`
  - `prefers-reduced-motion`: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion`

  **WHY Each Reference Matters**:
  - Tailwind v4 theme docs show exact `@theme` syntax for custom properties
  - `next/font` docs show CSS variable pattern for font loading (critical for SSR font optimization)
  - `prefers-reduced-motion` is required for accessibility — retro effects can cause motion sickness

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Fonts load correctly on dev server
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to `http://localhost:3000`
      2. Assert `document.documentElement.className` contains font variable classes
      3. Assert `getComputedStyle(document.body).fontFamily` includes "VT323" or "Press Start 2P"
      4. Take screenshot
    Expected Result: Pixel fonts visibly applied, no FOUT (flash of unstyled text)
    Failure Indicators: System font visible, font variables missing from HTML element
    Evidence: .sisyphus/evidence/task-2-fonts-loaded.png

  Scenario: Theme colors available in Tailwind utilities
    Tool: Bash
    Preconditions: Tailwind configured with @theme
    Steps:
      1. Run `pnpm build`
      2. Assert exit code 0
      3. Search generated CSS for neon color values: `grep -r "FF00FF" .next/` (should find compiled neon-pink)
    Expected Result: Build succeeds, custom color values present in compiled CSS
    Failure Indicators: Build fails, colors not in output CSS
    Evidence: .sisyphus/evidence/task-2-theme-colors.txt

  Scenario: Reduced motion disables animations
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/` with `page.emulateMedia({ reducedMotion: 'reduce' })`
      2. Assert scanline animation is paused or none: `getComputedStyle(el).animationPlayState` is 'paused' or `animationName` is 'none'
    Expected Result: All animations disabled when reduced motion is preferred
    Failure Indicators: Animations still running with reduced motion enabled
    Evidence: .sisyphus/evidence/task-2-reduced-motion.png
  ```

  **Evidence to Capture:**
  - [ ] task-2-fonts-loaded.png
  - [ ] task-2-theme-colors.txt
  - [ ] task-2-reduced-motion.png

  **Commit**: YES
  - Message: `add retro theme system with pixel fonts and crt effects`
  - Files: `app/globals.css`, `app/layout.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 3. Root Layout with Retro Navigation Shell

  **What to do**:
  - Create `components/Navigation.tsx`:
    - Horizontal nav bar with retro beveled style (`.bevel-raised` from Task 2)
    - Links to all 5 pages: Home (`/`), Projects (`/projects`), Blog (`/blog`), Resume (`/resume`), Contact (`/contact`)
    - Each link uses `font-pixel` (Press Start 2P) at small size
    - Active link highlighted with neon glow
    - Add `data-testid="nav-home"`, `data-testid="nav-projects"`, `data-testid="nav-blog"`, `data-testid="nav-resume"`, `data-testid="nav-contact"` on each link
    - Mobile: hamburger menu or stacked layout (responsive via Tailwind breakpoints)
    - Use `next/link` for client-side navigation
  - Create `components/Footer.tsx`:
    - Retro-styled footer with beveled top border
    - "© {year} Pav Anastasiadis" text
    - Small navigation links repeated
    - `data-testid="footer"`
  - Create `components/HitCounter.tsx`:
    - Cosmetic (fake) hit counter display
    - LED/LCD style digits using VT323 font
    - Dark background, green text with glow
    - Shows a hardcoded or random number (purely cosmetic)
    - `data-testid="hit-counter"`
  - Create `components/UnderConstruction.tsx`:
    - Animated striped banner (45deg repeating gradient, orange/black)
    - Text: "🚧 UNDER CONSTRUCTION 🚧" in pixel font
    - Scrolling animation on the stripes
    - `data-testid="under-construction"`
  - Update `app/layout.tsx`:
    - Import and render Navigation at top
    - Import and render Footer at bottom
    - Add HitCounter in footer area
    - Add UnderConstruction banner (can be at top or bottom of page)
    - Apply scanlines effect to main content area (`.scanlines` class)
    - Apply CRT vignette overlay
    - Wrap main content in semantic `<main>` element
    - Set page metadata: `title`, `description`, `openGraph`

  **Must NOT do**:
  - Do NOT use any component library for nav/footer
  - Do NOT use CSS-in-JS
  - Do NOT create a mobile app shell or bottom navigation — keep it simple
  - Do NOT add page transitions or route animations (scope creep)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout composition + retro visual styling. Creating the visual shell that wraps all pages. Requires CSS skill for beveled borders, neon effects, responsive layout.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Design sense needed for nav hierarchy, layout balance, responsive breakpoints
  - **Skills Evaluated but Omitted**:
    - `playwright`: No E2E test writing in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4, 5)
  - **Blocks**: Tasks 6, 9, 11, 12
  - **Blocked By**: Task 1 (needs project scaffold). Note: depends on Task 2's CSS utilities — but since both are in Wave 2, Task 3 should start AFTER Task 2 completes within the wave, OR the agent should create minimal inline styles and update when Task 2 CSS is available. Safest: start Task 3 after Task 2.

  **References**:

  **External References**:
  - `next/link` API: `https://nextjs.org/docs/app/api-reference/components/link`
  - Next.js metadata API: `https://nextjs.org/docs/app/api-reference/functions/generate-metadata`

  **WHY Each Reference Matters**:
  - `next/link` is required for client-side navigation (not `<a>` tags)
  - Metadata API sets `<head>` tags for SEO

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Navigation renders with all 5 links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/`
      2. Assert `[data-testid="nav-home"]` is visible
      3. Assert `[data-testid="nav-projects"]` is visible
      4. Assert `[data-testid="nav-blog"]` is visible
      5. Assert `[data-testid="nav-resume"]` is visible
      6. Assert `[data-testid="nav-contact"]` is visible
      7. Take screenshot
    Expected Result: All 5 nav links visible and styled with retro theme
    Failure Indicators: Missing nav links, unstyled navigation
    Evidence: .sisyphus/evidence/task-3-nav-links.png

  Scenario: Navigation works across pages
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/`
      2. Click `[data-testid="nav-blog"]`
      3. Wait for URL to contain `/blog`
      4. Assert URL is `/blog`
      5. Click `[data-testid="nav-projects"]`
      6. Wait for URL to contain `/projects`
      7. Assert URL is `/projects`
      8. Assert `[data-testid="footer"]` is visible on every page
    Expected Result: Client-side navigation works, footer persists
    Failure Indicators: 404 errors, page reload instead of client-side nav, footer missing
    Evidence: .sisyphus/evidence/task-3-nav-works.png

  Scenario: Retro components render
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/`
      2. Assert `[data-testid="hit-counter"]` is visible
      3. Assert `[data-testid="under-construction"]` is visible
      4. Assert hit counter contains numeric text
      5. Take screenshot
    Expected Result: Hit counter and under-construction banner render with retro styling
    Failure Indicators: Components missing, unstyled, no content
    Evidence: .sisyphus/evidence/task-3-retro-components.png

  Scenario: Mobile responsive layout
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to iPhone 13 (390x844)
      2. Navigate to `/`
      3. Assert no horizontal scrollbar: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
      4. Assert navigation is accessible (hamburger or stacked)
      5. Take screenshot
    Expected Result: Layout adapts to mobile, no overflow, nav accessible
    Failure Indicators: Horizontal scroll, overlapping elements, nav cut off
    Evidence: .sisyphus/evidence/task-3-mobile-layout.png
  ```

  **Evidence to Capture:**
  - [ ] task-3-nav-links.png
  - [ ] task-3-nav-works.png
  - [ ] task-3-retro-components.png
  - [ ] task-3-mobile-layout.png

  **Commit**: YES
  - Message: `add root layout with retro navigation shell`
  - Files: `components/Navigation.tsx`, `components/Footer.tsx`, `components/HitCounter.tsx`, `components/UnderConstruction.tsx`, `app/layout.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 4. MDX Blog Infrastructure with Syntax Highlighting

  **What to do**:
  - Install MDX dependencies: `pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-frontmatter remark-mdx-frontmatter remark-gfm rehype-pretty-code shiki rehype-slug`
  - Update `next.config.mjs` to wrap with `createMDX`:
    - Import `createMDX` from `@next/mdx`
    - Configure remark plugins: `[remarkFrontmatter, remarkMdxFrontmatter, remarkGfm]`
    - Configure rehype plugins: `[rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]]` (or a theme that fits the retro aesthetic — consider `vitesse-dark` or `monokai`)
    - Set `pageExtensions` to include `mdx`
  - Create `mdx-components.tsx` at project root:
    - Export `useMDXComponents` function
    - Map HTML elements to retro-styled components: `h1`, `h2`, `h3` with pixel font, `p` with terminal font, `code`/`pre` with retro styling, `a` with neon glow, `blockquote` with beveled sunken style
  - Create `lib/blog.ts` — server-only utility module:
    - `getAllPosts()`: reads `content/blog/` directory with `fs.readdirSync`, filters `.mdx` files, dynamically imports each to extract `frontmatter` (exported by `remark-mdx-frontmatter`), returns sorted by date descending. Returns `Array<{ slug: string; frontmatter: BlogFrontmatter }>`
    - `getPostBySlug(slug: string)`: dynamically imports the MDX file, returns the component + frontmatter
    - `getAllTags()`: extracts unique tags from all posts
    - Type: `BlogFrontmatter = { title: string; date: string; tags: string[]; description?: string }`
  - Create `content/blog/` directory with a single test MDX file (`content/blog/hello-world.mdx`):
    - YAML frontmatter: `title`, `date`, `tags`, `description`
    - Body: heading, paragraph, code block (to test syntax highlighting)
  - Create `app/blog/[slug]/page.tsx`:
    - Use `generateStaticParams()` reading from `content/blog/` via `fs.readdirSync`
    - Set `dynamicParams = false` (404 for unknown slugs)
    - Use `generateMetadata()` to set page title/description from frontmatter
    - Dynamically import MDX: `const { default: Post, frontmatter } = await import(\`@/content/blog/${slug}.mdx\`)`
    - Render post with date, tags, and MDX content
    - Add `data-testid="blog-content"`, `data-testid="blog-post-title"`, `data-testid="blog-post-tags"`
  - Create placeholder `app/blog/page.tsx` (listing page — will be fully built in Task 7):
    - Basic page that calls `getAllPosts()` and renders post titles as links
    - Add `data-testid="blog-post-card"` on each post entry

  **Must NOT do**:
  - Do NOT install `gray-matter` or `globby` — use `remark-frontmatter` + `remark-mdx-frontmatter` for frontmatter, `fs.readdirSync` for file discovery
  - Do NOT install `next-mdx-remote` or `contentlayer`
  - Do NOT create a CMS abstraction layer
  - Do NOT over-engineer the blog utilities — keep them simple functions, not classes

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: MDX + Next.js integration is the most technically complex part of the project. Plugin ordering matters, dynamic imports need careful TypeScript typing, and frontmatter extraction via remark plugins has specific patterns. Requires deep problem-solving.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not primarily a visual task — it's infrastructure
    - `playwright`: No E2E tests being written here

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 5)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Task 1

  **References**:

  **External References**:
  - Next.js MDX guide: `https://nextjs.org/docs/app/guides/mdx`
  - `@next/mdx` package: `https://www.npmjs.com/package/@next/mdx`
  - `remark-frontmatter`: `https://github.com/remarkjs/remark-frontmatter`
  - `remark-mdx-frontmatter`: `https://github.com/remcohaszing/remark-mdx-frontmatter`
  - `rehype-pretty-code`: `https://rehype-pretty.pages.dev/`
  - `generateStaticParams`: `https://nextjs.org/docs/app/api-reference/functions/generate-static-params`

  **WHY Each Reference Matters**:
  - `remark-mdx-frontmatter` is THE solution for YAML frontmatter in `@next/mdx` — it exports frontmatter as a named export from MDX files. Without this, `@next/mdx` ignores YAML frontmatter entirely.
  - `rehype-pretty-code` docs show theme options and CSS requirements for styled code blocks
  - Plugin ORDER matters: remark plugins run first (frontmatter extraction), then rehype (syntax highlighting). Wrong order = broken output.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog post renders with syntax highlighting
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, content/blog/hello-world.mdx exists
    Steps:
      1. Navigate to `/blog/hello-world`
      2. Assert `[data-testid="blog-post-title"]` contains "Hello World" (or whatever the test post title is)
      3. Assert `[data-testid="blog-content"]` is visible
      4. Assert `pre code` element exists (syntax-highlighted code block)
      5. Assert the code block has `data-language` attribute (rehype-pretty-code adds this)
      6. Take screenshot
    Expected Result: Blog post renders with title, content, and syntax-highlighted code
    Failure Indicators: 404 page, raw MDX displayed, no code highlighting, frontmatter not parsed
    Evidence: .sisyphus/evidence/task-4-blog-post-renders.png

  Scenario: Blog listing shows posts
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/blog`
      2. Assert at least 1 `[data-testid="blog-post-card"]` exists
      3. Assert post card contains a link to `/blog/hello-world`
    Expected Result: Blog listing page shows at least the seed post
    Failure Indicators: Empty page, no post cards, broken links
    Evidence: .sisyphus/evidence/task-4-blog-listing.png

  Scenario: Unknown blog slug returns 404
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, dynamicParams = false
    Steps:
      1. Navigate to `/blog/nonexistent-slug`
      2. Assert response status or page shows 404 content
    Expected Result: 404 page displayed for unknown slugs
    Failure Indicators: Blank page, server error, or content rendered
    Evidence: .sisyphus/evidence/task-4-blog-404.png

  Scenario: Build succeeds with MDX config
    Tool: Bash
    Preconditions: All MDX config and plugins installed
    Steps:
      1. Run `pnpm build`
      2. Assert exit code 0
    Expected Result: Static generation of blog pages succeeds
    Failure Indicators: Build error in MDX compilation, plugin conflicts
    Evidence: .sisyphus/evidence/task-4-build-with-mdx.txt
  ```

  **Evidence to Capture:**
  - [ ] task-4-blog-post-renders.png
  - [ ] task-4-blog-listing.png
  - [ ] task-4-blog-404.png
  - [ ] task-4-build-with-mdx.txt

  **Commit**: YES
  - Message: `add mdx blog infrastructure with syntax highlighting`
  - Files: `next.config.mjs`, `mdx-components.tsx`, `lib/blog.ts`, `content/blog/hello-world.mdx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 5. Project Data Layer and Metadata Types

  **What to do**:
  - Create `lib/projects.ts`:
    - Define `ProjectMeta` type: `{ slug: string; title: string; description: string; tags: string[]; image?: string; demoAvailable: boolean; url?: string; repo?: string }`
    - Export `getAllProjects(): ProjectMeta[]` — returns the projects array
    - Export `getProjectBySlug(slug: string): ProjectMeta | undefined`
  - Create `content/projects.ts`:
    - Export a typed array of 2-3 seed projects with realistic metadata
    - At least 1 project should have `demoAvailable: true` (will be used in Task 10)
    - Example projects: a canvas animation, a React widget, a CLI tool (or whatever fits "Pav Anastasiadis" as a developer)
  - Ensure all types are exported and reusable

  **Must NOT do**:
  - Do NOT create a database or CMS layer
  - Do NOT fetch project data from external APIs
  - Do NOT over-abstract — it's a simple typed array export

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple TypeScript types + data file. No visual work, no complex logic. Just type definitions and a static array.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All skills: Not needed for type definitions and static data

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 9, 10
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - None (greenfield)

  **External References**:
  - TypeScript strict mode: `https://www.typescriptlang.org/tsconfig#strict`

  **WHY Each Reference Matters**:
  - TypeScript strict mode affects how types are inferred — nullable fields need explicit `?` or `| undefined`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Types compile without errors
    Tool: Bash
    Preconditions: lib/projects.ts and content/projects.ts exist
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Assert exit code 0
    Expected Result: No TypeScript errors in project data files
    Failure Indicators: Type errors, missing exports
    Evidence: .sisyphus/evidence/task-5-types-compile.txt

  Scenario: Project data is accessible and correctly typed
    Tool: Bash
    Preconditions: Project files exist
    Steps:
      1. Run `pnpm build`
      2. Assert exit code 0
      3. Verify `content/projects.ts` exports at least 2 projects by inspecting the file
    Expected Result: Build succeeds, data exports are valid
    Failure Indicators: Build error, import resolution failure
    Evidence: .sisyphus/evidence/task-5-project-data.txt
  ```

  **Evidence to Capture:**
  - [ ] task-5-types-compile.txt
  - [ ] task-5-project-data.txt

  **Commit**: YES
  - Message: `add project data layer and metadata types`
  - Files: `lib/projects.ts`, `content/projects.ts`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 6. Landing/About Page

  **What to do**:
  - Build `app/page.tsx` — the homepage at `/`:
    - Hero section: large pixel-font heading with neon glow ("PAV ANASTASIADIS" or similar), tagline in VT323 font
    - About section: short bio/introduction text in terminal font, styled with retro panel (beveled sunken background)
    - Brief highlights or skills list (retro-styled list items)
    - Call-to-action links to Projects and Blog pages
    - Apply retro aesthetic throughout: neon accents, beveled panels, CRT effects
    - Add `data-testid="hero-heading"`, `data-testid="about-section"`
  - Content should be placeholder text representing a real developer portfolio (can reference "Pav Anastasiadis" as the developer)

  **Must NOT do**:
  - Do NOT add animations beyond the theme system (no page transitions, no scroll animations)
  - Do NOT create a photo gallery or media section
  - Do NOT add a "latest posts" feed (scope creep)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Page design and layout with retro visual treatment. Needs creative composition within the established theme system.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Hero section design, content hierarchy, visual balance
  - **Skills Evaluated but Omitted**:
    - `playwright`: No E2E tests in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7-12)
  - **Blocks**: Task 13
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `app/globals.css` (Task 2) — retro CSS utilities (`.scanlines`, `.bevel-raised`, `.neon-glow-*`, etc.)
  - `components/Navigation.tsx` (Task 3) — layout context

  **WHY Each Reference Matters**:
  - Must use the exact CSS utility classes defined in Task 2 for visual consistency
  - Must work within the layout shell from Task 3

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Homepage renders with retro styling
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Tasks 2-3 complete
    Steps:
      1. Navigate to `/`
      2. Assert `[data-testid="hero-heading"]` is visible and contains text
      3. Assert `[data-testid="about-section"]` is visible
      4. Assert page has dark background (body computed background-color is near #0a0a0a)
      5. Take full-page screenshot
    Expected Result: Homepage renders with retro aesthetic — pixel fonts, neon colors, dark background
    Failure Indicators: Unstyled page, missing sections, white/default background
    Evidence: .sisyphus/evidence/task-6-homepage.png

  Scenario: Homepage is mobile responsive
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 390x844 (iPhone 13)
      2. Navigate to `/`
      3. Assert no horizontal overflow: `scrollWidth <= clientWidth`
      4. Assert hero heading is visible
      5. Take screenshot
    Expected Result: Content adapts to mobile width without overflow
    Failure Indicators: Horizontal scroll, text cut off, overlapping elements
    Evidence: .sisyphus/evidence/task-6-homepage-mobile.png
  ```

  **Evidence to Capture:**
  - [ ] task-6-homepage.png
  - [ ] task-6-homepage-mobile.png

  **Commit**: YES
  - Message: `add landing and about page`
  - Files: `app/page.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 7. Blog Seed Content and Tag Filtering

  **What to do**:
  - Create 2 additional seed MDX blog posts in `content/blog/` (Task 4 already created 1):
    - `content/blog/building-retro-web.mdx` — about building retro web aesthetics, includes a CSS code block (tests syntax highlighting)
    - `content/blog/typescript-tips.mdx` — about TypeScript, includes a TypeScript code block
    - Each post has full YAML frontmatter: `title`, `date` (different dates for sorting), `tags` (mix of shared and unique tags, e.g., `["css", "retro"]`, `["typescript", "tips"]`), `description`
  - Update `app/blog/page.tsx` — full blog listing with tag filtering:
    - Display all posts as cards/entries with title, date, description, tags
    - Tag filtering: clickable tag pills that filter the post list
    - Use URL search params (`?tag=css`) for filter state (server-side filtering via `searchParams`)
    - Show "all" option to clear filter
    - Each post card links to `/blog/[slug]`
    - Add `data-testid="blog-post-card"` on each card, `data-testid="tag-filter"` on tag buttons, `data-testid="active-tag"` on the active filter
    - Style with retro theme: beveled cards, neon tag pills, pixel font headings

  **Must NOT do**:
  - Do NOT add pagination (only 3 posts)
  - Do NOT add search functionality (only tag filtering)
  - Do NOT fetch content from external sources

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Moderate complexity — content creation + interactive tag filtering with URL params. Not primarily visual (uses existing theme), not deeply complex, but touches both content and interactivity.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Tag filtering is more functional than visual

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8-12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `content/blog/hello-world.mdx` (Task 4) — MDX frontmatter format to follow
  - `lib/blog.ts` (Task 4) — `getAllPosts()`, `getAllTags()` functions to use
  - `app/globals.css` (Task 2) — retro CSS utilities

  **External References**:
  - Next.js `searchParams` in App Router: `https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional`

  **WHY Each Reference Matters**:
  - Frontmatter format must exactly match the schema in `lib/blog.ts` (BlogFrontmatter type)
  - `searchParams` API for server-component tag filtering without client-side state

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog listing shows all seed posts
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, 3 MDX posts exist
    Steps:
      1. Navigate to `/blog`
      2. Assert `[data-testid="blog-post-card"]` count >= 3
      3. Assert each card contains a title and date
      4. Take screenshot
    Expected Result: All 3 seed blog posts displayed with titles and dates
    Failure Indicators: Fewer than 3 cards, missing titles/dates
    Evidence: .sisyphus/evidence/task-7-blog-listing.png

  Scenario: Tag filtering works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, posts with different tags exist
    Steps:
      1. Navigate to `/blog`
      2. Click a `[data-testid="tag-filter"]` button (e.g., "css" or "typescript")
      3. Wait for URL to contain `?tag=`
      4. Assert filtered `[data-testid="blog-post-card"]` count is less than total (filter is working)
      5. Assert `[data-testid="active-tag"]` is visible
      6. Take screenshot
    Expected Result: Clicking tag filters the post list, URL updates with query param
    Failure Indicators: No filtering, all posts still shown, URL doesn't update
    Evidence: .sisyphus/evidence/task-7-tag-filtering.png

  Scenario: Individual seed post renders correctly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/blog/building-retro-web`
      2. Assert `[data-testid="blog-post-title"]` is visible
      3. Assert `pre code` element exists (CSS code block with syntax highlighting)
      4. Assert `[data-testid="blog-post-tags"]` contains "css" or "retro"
    Expected Result: Post renders with all content, syntax highlighting, and tags
    Failure Indicators: 404, raw MDX, no code highlighting
    Evidence: .sisyphus/evidence/task-7-seed-post.png
  ```

  **Evidence to Capture:**
  - [ ] task-7-blog-listing.png
  - [ ] task-7-tag-filtering.png
  - [ ] task-7-seed-post.png

  **Commit**: YES
  - Message: `add blog seed content and tag filtering`
  - Files: `content/blog/building-retro-web.mdx`, `content/blog/typescript-tips.mdx`, `app/blog/page.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 8. RSS Feed Route Handler

  **What to do**:
  - Create `app/rss.xml/route.ts`:
    - Export `GET` function that generates RSS 2.0 XML
    - Import `getAllPosts()` from `lib/blog.ts`
    - Set `export const dynamic = 'force-static'` for build-time generation
    - XML structure: `<?xml version="1.0" encoding="UTF-8"?>`, `<rss version="2.0">`, `<channel>` with `<title>`, `<link>`, `<description>`, `<language>en</language>`
    - Each post as `<item>` with `<title>`, `<link>` (full URL), `<description>`, `<pubDate>` (RFC 822 format), `<guid>`
    - **CRITICAL**: XML-escape all dynamic content — `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`
    - Create a small `escapeXml(str: string): string` helper in `lib/rss.ts` or inline
    - Return `new Response(xml, { headers: { 'Content-Type': 'application/xml' } })`
  - Add RSS `<link>` tag to `app/layout.tsx` metadata: `alternates: { types: { 'application/rss+xml': '/rss.xml' } }`

  **Must NOT do**:
  - Do NOT use external RSS generation libraries (no `feed`, no `rss` package) — hand-craft the XML template
  - Do NOT add Atom feed (only RSS 2.0)
  - Do NOT add RSS for projects (only blog posts)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single route handler file + small XML template utility. Well-defined output format (RSS 2.0 spec). Minimal creativity needed.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All: Simple XML generation task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7, 9-12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 4 (needs `lib/blog.ts` and seed content)

  **References**:

  **Pattern References**:
  - `lib/blog.ts` (Task 4) — `getAllPosts()` function to call

  **External References**:
  - Next.js Route Handlers: `https://nextjs.org/docs/app/building-your-application/routing/route-handlers`
  - RSS 2.0 Specification: `https://www.rssboard.org/rss-specification`
  - RSS date format (RFC 822): `https://www.w3.org/Protocols/rfc822/#z28`

  **WHY Each Reference Matters**:
  - Route handler docs show the `GET` export pattern and `Response` return
  - RSS spec defines required XML elements and date format
  - RFC 822 date format is required for `<pubDate>` — `new Date().toUTCString()` produces it

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: RSS feed returns valid XML with blog posts
    Tool: Bash (curl)
    Preconditions: Dev server running, blog posts exist
    Steps:
      1. Run `curl -s http://localhost:3000/rss.xml`
      2. Assert response starts with `<?xml`
      3. Assert response contains `<rss version="2.0"`
      4. Assert response contains `<item>` elements
      5. Assert response contains the title of at least one seed blog post
      6. Assert Content-Type header contains `application/xml`
    Expected Result: Valid RSS 2.0 XML with all blog posts listed
    Failure Indicators: 404, HTML returned instead of XML, missing items, malformed XML
    Evidence: .sisyphus/evidence/task-8-rss-feed.txt

  Scenario: RSS feed handles special characters in titles
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. Run `curl -s http://localhost:3000/rss.xml`
      2. Assert no raw `&` characters (should be `&amp;`)
      3. Assert no raw `<` in content fields (should be `&lt;`)
    Expected Result: All special characters properly XML-escaped
    Failure Indicators: Raw ampersands or angle brackets in XML
    Evidence: .sisyphus/evidence/task-8-rss-escaping.txt
  ```

  **Evidence to Capture:**
  - [ ] task-8-rss-feed.txt
  - [ ] task-8-rss-escaping.txt

  **Commit**: YES
  - Message: `add rss feed route handler`
  - Files: `app/rss.xml/route.ts`, `app/layout.tsx` (metadata update)
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 9. Projects Grid and Detail Pages

  **What to do**:
  - Build `app/projects/page.tsx` — Projects grid at `/projects`:
    - Fetch all projects from `getAllProjects()` (lib/projects.ts)
    - Display as a responsive grid of cards (2-3 columns desktop, 1 column mobile)
    - Each card: project title, short description, tags, "View Demo" badge if `demoAvailable: true`
    - Card style: beveled raised border, neon accent on hover, pixel font title
    - Each card links to `/projects/[slug]`
    - Add `data-testid="project-card"` on each card, `data-testid="projects-grid"` on the grid container
  - Build `app/projects/[slug]/page.tsx` — Project detail page:
    - Use `generateStaticParams()` from project data
    - Set `dynamicParams = false`
    - Display: full project title, description, tags, links (repo URL, live URL if available)
    - If `demoAvailable`, show prominent "Launch Demo" link to `/projects/[slug]/demo`
    - Style with retro theme: beveled panels, neon headings
    - Add `data-testid="project-title"`, `data-testid="project-description"`, `data-testid="demo-link"`

  **Must NOT do**:
  - Do NOT add project filtering or search (scope creep — only blog has tag filtering)
  - Do NOT fetch project data from external APIs
  - Do NOT create project detail pages with MDX content (projects use TypeScript data, not MDX)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Grid layout design with retro card styling. Responsive design, hover effects, visual hierarchy. Card component design is primarily visual work.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Grid layout proportions, card design, responsive breakpoints, hover state design
  - **Skills Evaluated but Omitted**:
    - `playwright`: No E2E tests being written

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6-8, 10-12)
  - **Blocks**: Task 10, Task 13
  - **Blocked By**: Tasks 3, 5

  **References**:

  **Pattern References**:
  - `lib/projects.ts` and `content/projects.ts` (Task 5) — project data types and access functions
  - `app/blog/[slug]/page.tsx` (Task 4) — pattern for `generateStaticParams` + `dynamicParams = false` + `generateMetadata`
  - `app/globals.css` (Task 2) — retro CSS utilities

  **WHY Each Reference Matters**:
  - Project data types determine what fields are available for display
  - Blog slug page pattern should be followed for consistency
  - CSS utilities must be reused (not re-created) for visual consistency

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Projects grid displays all seed projects
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, project data has 2-3 projects
    Steps:
      1. Navigate to `/projects`
      2. Assert `[data-testid="projects-grid"]` is visible
      3. Assert `[data-testid="project-card"]` count >= 2
      4. Assert at least one card contains a "View Demo" indicator
      5. Take screenshot
    Expected Result: Grid of project cards with retro styling, at least one with demo badge
    Failure Indicators: Empty page, missing cards, unstyled grid
    Evidence: .sisyphus/evidence/task-9-projects-grid.png

  Scenario: Project detail page renders
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/projects`
      2. Click the first `[data-testid="project-card"]` link
      3. Assert `[data-testid="project-title"]` is visible
      4. Assert `[data-testid="project-description"]` is visible
      5. Take screenshot
    Expected Result: Project detail page with full info and retro styling
    Failure Indicators: 404, missing content
    Evidence: .sisyphus/evidence/task-9-project-detail.png

  Scenario: Project detail has demo link when available
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, at least 1 project has demoAvailable: true
    Steps:
      1. Navigate to the project detail page for the demo-available project
      2. Assert `[data-testid="demo-link"]` is visible
      3. Assert link href contains `/demo`
    Expected Result: Demo link present and pointing to correct route
    Failure Indicators: Demo link missing, wrong href
    Evidence: .sisyphus/evidence/task-9-demo-link.png
  ```

  **Evidence to Capture:**
  - [ ] task-9-projects-grid.png
  - [ ] task-9-project-detail.png
  - [ ] task-9-demo-link.png

  **Commit**: YES
  - Message: `add projects grid and detail pages`
  - Files: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 10. Interactive Demo Infrastructure and Seed Demo

  **What to do**:
  - Build `app/projects/[slug]/demo/page.tsx` — Demo mount point:
    - Use `generateStaticParams()` filtering only projects with `demoAvailable: true`
    - Set `dynamicParams = false`
    - Dynamically import the demo component: `const Demo = dynamic(() => import(\`@/components/demos/${slug}\`), { ssr: false })`— use`next/dynamic`with`ssr: false` since demos may use browser APIs (canvas, window, etc.)
    - Render inside a `[data-testid="demo-container"]` wrapper
    - Add a "Back to Project" link
    - Minimal layout — the demo should take center stage. Retro frame/border around the demo area.
  - Create at least 1 working interactive demo in `components/demos/`:
    - Example: `components/demos/pixel-canvas.tsx` — a simple canvas-based pixel art drawing app or animated pixel art. Uses `useRef` for canvas, `useEffect` for animation loop. Must be self-contained (no external deps beyond React).
    - OR: a retro-themed interactive component (typing animation terminal, simple game, color palette picker)
    - The demo must respond to user interaction (click, drag, keypress, etc.)
    - The demo must be a `'use client'` component
    - Add `data-testid="demo-interactive"` on the main interactive element
  - Demo CSS isolation: each demo should use either scoped CSS (CSS Modules) or inline styles to prevent leaking into the parent layout. NO global CSS modifications from demos.

  **Must NOT do**:
  - Do NOT iframe the demos (user chose direct mount)
  - Do NOT install game frameworks or heavy libraries for demos
  - Do NOT create more than 1 demo (keep it focused)
  - Do NOT allow demos to modify global CSS or state

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Dynamic component loading with `ssr: false`, canvas/interactive code, CSS isolation concerns. Technically challenging — needs understanding of Next.js dynamic imports, client components, and browser API usage in SSR context.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Demo needs to be visually appealing and interactive — not just functional
  - **Skills Evaluated but Omitted**:
    - `playwright`: No E2E tests being written here

  **Parallelization**:
  - **Can Run In Parallel**: YES (but depends on Task 9 for route structure)
  - **Parallel Group**: Wave 3 (starts after Task 9 within wave)
  - **Blocks**: Task 13
  - **Blocked By**: Tasks 5, 9

  **References**:

  **Pattern References**:
  - `content/projects.ts` (Task 5) — project slugs for `generateStaticParams` filtering
  - `app/projects/[slug]/page.tsx` (Task 9) — parent route pattern

  **External References**:
  - `next/dynamic`: `https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic`
  - Canvas API: `https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API`

  **WHY Each Reference Matters**:
  - `next/dynamic` with `ssr: false` is essential — demos may use `window`, `document`, `canvas` which don't exist during SSR
  - Canvas API docs for the interactive demo implementation

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Demo page loads and renders interactive component
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, demo component exists
    Steps:
      1. Navigate to `/projects/{demo-project-slug}/demo` (use the slug of the project with demoAvailable: true)
      2. Assert `[data-testid="demo-container"]` is visible
      3. Assert `[data-testid="demo-interactive"]` is visible
      4. Wait for component to hydrate (allow 3s for dynamic import)
      5. Take screenshot
    Expected Result: Demo component renders inside the demo container
    Failure Indicators: Blank page, loading spinner stuck, hydration error
    Evidence: .sisyphus/evidence/task-10-demo-loads.png

  Scenario: Demo responds to user interaction
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, demo loaded
    Steps:
      1. Navigate to `/projects/{demo-project-slug}/demo`
      2. Wait for `[data-testid="demo-interactive"]` to be visible
      3. Click on the interactive element
      4. Assert some visual change occurred (e.g., canvas pixel drawn, text appeared, animation triggered)
      5. Take screenshot after interaction
    Expected Result: Demo responds to user click/interaction
    Failure Indicators: No response to click, JavaScript error in console
    Evidence: .sisyphus/evidence/task-10-demo-interaction.png

  Scenario: Demo CSS doesn't leak to parent layout
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/projects/{demo-project-slug}/demo`
      2. Assert `[data-testid="nav-home"]` still has expected styling (not overridden by demo CSS)
      3. Assert `[data-testid="footer"]` is visible and styled correctly
    Expected Result: Navigation and footer retain their retro styling despite demo being mounted
    Failure Indicators: Navigation or footer styling broken, global CSS overridden
    Evidence: .sisyphus/evidence/task-10-demo-isolation.png

  Scenario: Non-demo project slug returns 404 at /demo
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, project without demo exists
    Steps:
      1. Navigate to `/projects/{non-demo-project-slug}/demo`
      2. Assert 404 page is shown
    Expected Result: 404 for projects without demos
    Failure Indicators: Blank page, error, or unexpected content
    Evidence: .sisyphus/evidence/task-10-demo-404.png
  ```

  **Evidence to Capture:**
  - [ ] task-10-demo-loads.png
  - [ ] task-10-demo-interaction.png
  - [ ] task-10-demo-isolation.png
  - [ ] task-10-demo-404.png

  **Commit**: YES
  - Message: `add interactive demo infrastructure and seed demo`
  - Files: `app/projects/[slug]/demo/page.tsx`, `components/demos/{name}.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 11. Resume Page with PDF Download

  **What to do**:
  - Build `app/resume/page.tsx` — Resume/work history at `/resume`:
    - Work history timeline: list of positions with company, role, dates, description
    - Style as retro terminal output or Win95-style panels (beveled sections for each role)
    - Skills/technologies section
    - Education section
    - Prominent download button linking to `/resume.pdf` — styled as a retro beveled button with download icon
    - Add `data-testid="resume-content"`, `data-testid="resume-download"` (on the download link/button)
    - The download link should have `href="/resume.pdf"` and `download` attribute
  - Create `public/resume.pdf` — placeholder PDF file:
    - A minimal valid PDF file (even a near-empty one) so the download link works during testing
    - User will replace with their real resume
  - Content should be placeholder but realistic (use generic developer experience)

  **Must NOT do**:
  - Do NOT generate the PDF dynamically (no server-side PDF generation)
  - Do NOT add a PDF viewer/embed — just a download link
  - Do NOT create an overly complex timeline component (keep it simple)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Page layout with retro-styled timeline/panels. Visual treatment of work history data. Download button styling.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Timeline design, content hierarchy for work history, button design
  - **Skills Evaluated but Omitted**:
    - `playwright`: No E2E tests here

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6-10, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `app/globals.css` (Task 2) — retro CSS utilities
  - `components/` (Task 3) — layout patterns

  **WHY Each Reference Matters**:
  - Reuse beveled panel styles for work history sections
  - Consistent with site-wide retro aesthetic

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Resume page renders with work history
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/resume`
      2. Assert `[data-testid="resume-content"]` is visible
      3. Assert page contains at least one job entry (text content check)
      4. Take screenshot
    Expected Result: Resume page with retro-styled work history
    Failure Indicators: Empty page, unstyled content
    Evidence: .sisyphus/evidence/task-11-resume-page.png

  Scenario: PDF download link works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, public/resume.pdf exists
    Steps:
      1. Navigate to `/resume`
      2. Assert `[data-testid="resume-download"]` is visible
      3. Assert link has `href` containing `resume.pdf`
      4. Assert link has `download` attribute (or target="_blank")
      5. Verify PDF is accessible: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/resume.pdf` returns 200
    Expected Result: Download link present, PDF accessible at /resume.pdf
    Failure Indicators: Link missing, 404 for PDF, wrong href
    Evidence: .sisyphus/evidence/task-11-resume-download.txt
  ```

  **Evidence to Capture:**
  - [ ] task-11-resume-page.png
  - [ ] task-11-resume-download.txt

  **Commit**: YES
  - Message: `add resume page with pdf download`
  - Files: `app/resume/page.tsx`, `public/resume.pdf`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 12. Contact Page with Social Links

  **What to do**:
  - Build `app/contact/page.tsx` — Contact/socials at `/contact`:
    - Section heading with retro neon glow
    - Social links as retro-styled beveled buttons or Win95-style list items:
      - GitHub: `https://github.com/pav-anastasiadis` (or placeholder)
      - LinkedIn: `https://linkedin.com/in/pav-anastasiadis` (or placeholder)
      - Email: `mailto:pav@example.com` (or placeholder)
    - Each link opens in new tab (`target="_blank"`, `rel="noopener noreferrer"`) except mailto
    - Optional: retro "guestbook" text or "send me a message" flavor text
    - Add `data-testid="contact-github"`, `data-testid="contact-linkedin"`, `data-testid="contact-email"` on each link
    - Style with retro aesthetic: neon hover effects, pixel font labels

  **Must NOT do**:
  - Do NOT add a contact form
  - Do NOT add email backend or API routes
  - Do NOT add more social platforms unless requested
  - Do NOT add a guestbook with actual functionality (cosmetic text only)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Simple page layout with retro button styling. Minimal logic, primarily visual.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Button/link design, page composition
  - **Skills Evaluated but Omitted**:
    - All others: Very simple page

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6-11)
  - **Blocks**: Task 13
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `app/globals.css` (Task 2) — retro CSS utilities (`.bevel-raised`, `.neon-glow-*`)
  - Other page components (Tasks 6, 11) — page layout patterns

  **WHY Each Reference Matters**:
  - Consistent button/link styling across the site

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Contact page shows all social links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/contact`
      2. Assert `[data-testid="contact-github"]` is visible and has `href` containing `github.com`
      3. Assert `[data-testid="contact-linkedin"]` is visible and has `href` containing `linkedin.com`
      4. Assert `[data-testid="contact-email"]` is visible and has `href` starting with `mailto:`
      5. Take screenshot
    Expected Result: All 3 social links present with correct URLs
    Failure Indicators: Missing links, wrong URLs, broken styling
    Evidence: .sisyphus/evidence/task-12-contact-page.png

  Scenario: External links open in new tab
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/contact`
      2. Assert `[data-testid="contact-github"]` has `target="_blank"` attribute
      3. Assert `[data-testid="contact-linkedin"]` has `target="_blank"` attribute
      4. Assert `[data-testid="contact-github"]` has `rel` containing `noopener`
    Expected Result: External links configured for new tab with security attributes
    Failure Indicators: Missing target or rel attributes
    Evidence: .sisyphus/evidence/task-12-external-links.txt
  ```

  **Evidence to Capture:**
  - [ ] task-12-contact-page.png
  - [ ] task-12-external-links.txt

  **Commit**: YES
  - Message: `add contact page with social links`
  - Files: `app/contact/page.tsx`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 13. Playwright E2E Test Suite

  **What to do**:
  - Create comprehensive E2E tests in `e2e/` directory. Remove or update the smoke test from Task 1.
  - `e2e/navigation.spec.ts`:
    - Test all 5 nav links navigate to correct URLs
    - Test footer is visible on every page
    - Test back-navigation works
    - Test active link state
  - `e2e/blog.spec.ts`:
    - Test blog listing shows all posts (`[data-testid="blog-post-card"]` count >= 3)
    - Test clicking a post navigates to blog post page
    - Test blog post renders title, content, syntax-highlighted code block
    - Test tag filtering: click tag, verify URL updates, verify filtered results
    - Test unknown slug returns 404
  - `e2e/projects.spec.ts`:
    - Test projects grid shows all projects (`[data-testid="project-card"]` count >= 2)
    - Test clicking project navigates to detail page
    - Test demo link present on demo-available project
    - Test demo page loads and renders interactive component
    - Test demo responds to click interaction
  - `e2e/resume.spec.ts`:
    - Test resume page renders content
    - Test download link exists with correct href (`/resume.pdf`)
    - Test PDF is accessible (request `/resume.pdf`, assert 200)
  - `e2e/contact.spec.ts`:
    - Test all 3 social links present (GitHub, LinkedIn, email)
    - Test correct URLs/hrefs
    - Test `target="_blank"` on external links
  - `e2e/rss.spec.ts`:
    - Test `/rss.xml` returns XML content
    - Test response contains blog post titles
    - Test Content-Type is XML
  - `e2e/mobile.spec.ts`:
    - Run navigation tests at mobile viewport (390x844)
    - Assert no horizontal overflow on all pages
    - Assert navigation is accessible on mobile
    - Assert content is readable (no text clipping)
  - All tests use concrete selectors (`data-testid` attributes defined in previous tasks)
  - All tests use `test.describe` for grouping and clear test names

  **Must NOT do**:
  - Do NOT write unit tests (explicitly excluded)
  - Do NOT test implementation details (only test visible behavior)
  - Do NOT test external links (GitHub, LinkedIn) actually resolve — only test href values
  - Do NOT create visual regression tests (scope creep)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Writing comprehensive E2E tests across all pages. Requires understanding of all features to write correct selectors and assertions. Moderate complexity, no deep algorithmic challenge.
  - **Skills**: [`playwright`]
    - `playwright`: Required for correct Playwright API usage, selector strategies, viewport configuration, assertion patterns
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not a visual task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 14)
  - **Parallel Group**: Wave 4
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 6-12 (all pages must be built)

  **References**:

  **Pattern References**:
  - All `data-testid` attributes from Tasks 3-12 — these are the selectors for tests
  - `playwright.config.ts` (Task 1) — test configuration

  **External References**:
  - Playwright test API: `https://playwright.dev/docs/api/class-test`
  - Playwright assertions: `https://playwright.dev/docs/test-assertions`
  - Playwright device emulation: `https://playwright.dev/docs/emulation#devices`

  **WHY Each Reference Matters**:
  - Playwright API docs for correct `expect`, `locator`, `page.goto` usage
  - Device list for mobile testing viewport names

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All E2E tests pass on desktop
    Tool: Bash
    Preconditions: Dev server running, all pages built
    Steps:
      1. Run `pnpm exec playwright test --project=chromium`
      2. Assert exit code 0
      3. Assert output shows all tests passed
    Expected Result: All E2E tests pass on Chromium desktop
    Failure Indicators: Test failures, timeout errors, selector not found
    Evidence: .sisyphus/evidence/task-13-e2e-desktop.txt

  Scenario: Mobile tests pass
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. Run `pnpm exec playwright test e2e/mobile.spec.ts --project=chromium`
      2. Assert exit code 0
    Expected Result: Mobile viewport tests pass
    Failure Indicators: Horizontal overflow detected, elements not found at mobile size
    Evidence: .sisyphus/evidence/task-13-e2e-mobile.txt
  ```

  **Evidence to Capture:**
  - [ ] task-13-e2e-desktop.txt
  - [ ] task-13-e2e-mobile.txt

  **Commit**: YES
  - Message: `add playwright e2e test suite`
  - Files: `e2e/navigation.spec.ts`, `e2e/blog.spec.ts`, `e2e/projects.spec.ts`, `e2e/resume.spec.ts`, `e2e/contact.spec.ts`, `e2e/rss.spec.ts`, `e2e/mobile.spec.ts`
  - Pre-commit: `pnpm build && pnpm lint`

- [ ] 14. README and Deployment Preparation

  **What to do**:
  - Create `README.md` at project root:
    - Project title and brief description (retro-themed developer portfolio)
    - Tech stack section: Next.js (App Router), TypeScript (strict), Tailwind CSS v4, MDX, Playwright
    - Features list: 5 pages, MDX blog with syntax highlighting and RSS, interactive project demos, retro 90s aesthetic
    - Local development setup:
      - Prerequisites: Node.js 20+, pnpm
      - `pnpm install`
      - `pnpm dev` — starts dev server at localhost:3000
      - `pnpm build` — production build
      - `pnpm lint` — run ESLint
      - `pnpm test:e2e` — run Playwright tests
    - Project structure overview (directory tree)
    - Adding content: how to add blog posts (create MDX in `content/blog/`), how to add projects (edit `content/projects.ts`)
    - Deployment: "Deploy to Vercel" section mentioning it's configured for Vercel out of the box
    - License reference
  - Verify production build: `pnpm build` exits 0
  - Verify all tests pass: `pnpm exec playwright test`
  - Create `.github/` directory with issue templates (optional — labels are configured manually):
    - OR simply document the label scheme (feature, bug, enhancement, content) in the README
  - Verify `.gitignore` includes: `node_modules`, `.next`, `out`, `playwright-report`, `test-results`, `.sisyphus/evidence/`

  **Must NOT do**:
  - Do NOT add CI/CD pipeline (not in scope)
  - Do NOT add badges (scope creep)
  - Do NOT create a CONTRIBUTING.md (single developer)
  - Do NOT add conventional commit instructions (explicitly excluded)

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Primarily documentation writing — README content, project description, setup instructions. Some build verification but primarily prose.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All: Documentation task

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 13)
  - **Parallel Group**: Wave 4
  - **Blocks**: F1-F4
  - **Blocked By**: All previous tasks (needs complete project to document)

  **References**:

  **Pattern References**:
  - `package.json` (Task 1) — scripts section for documentation
  - All tasks — features to document

  **WHY Each Reference Matters**:
  - package.json scripts must be accurately documented in README

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: README contains required sections
    Tool: Bash
    Preconditions: README.md exists
    Steps:
      1. Assert README.md exists: `test -f README.md`
      2. Assert contains "Tech Stack" or "Stack": `grep -i "tech stack\|stack" README.md`
      3. Assert contains "pnpm install": `grep "pnpm install" README.md`
      4. Assert contains "pnpm dev": `grep "pnpm dev" README.md`
      5. Assert contains "Playwright" or "test": `grep -i "playwright\|test" README.md`
    Expected Result: README has tech stack, local dev setup, and testing info
    Failure Indicators: Missing sections, incomplete instructions
    Evidence: .sisyphus/evidence/task-14-readme-sections.txt

  Scenario: Production build is clean
    Tool: Bash
    Preconditions: All code committed
    Steps:
      1. Run `pnpm build`
      2. Assert exit code 0
      3. Run `pnpm lint`
      4. Assert exit code 0
    Expected Result: Clean build and lint with no errors
    Failure Indicators: Build errors, lint warnings
    Evidence: .sisyphus/evidence/task-14-final-build.txt
  ```

  **Evidence to Capture:**
  - [ ] task-14-readme-sections.txt
  - [ ] task-14-final-build.txt

  **Commit**: YES
  - Message: `add readme and finalize for deployment`
  - Files: `README.md`, `.gitignore` (if updated)
  - Pre-commit: `pnpm build && pnpm lint`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns (component library imports, CSS-in-JS, tailwind.config.js, gray-matter, globby, unit test files, storybook config). Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `pnpm exec tsc --noEmit` + `pnpm lint` + `pnpm build`. Review all source files for: `as any`/`@ts-ignore`, empty catches, `console.log` in production code, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic variable names (data/result/item/temp), unnecessary wrapper components. Verify TypeScript strict mode is actually enabled in `tsconfig.json`.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | TypeScript [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start dev server. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence screenshots. Test cross-page navigation flow. Test blog tag filtering. Test demo interactivity. Test RSS feed. Test resume download. Test all social links. Test on mobile viewport. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes. Specifically verify: NO component libraries installed, NO unit tests created, NO conventional commit tooling, NO `tailwind.config.js`.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Task | Commit Message                                                        | Key Files                                                                                                                     |
| ---- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1    | `scaffold project with next.js, typescript, tailwind, and dx tooling` | package.json, tsconfig.json, next.config.mjs, eslint.config.mjs, .prettierrc, .husky/\*, playwright.config.ts                 |
| 2    | `add retro theme system with pixel fonts and crt effects`             | app/globals.css, app/layout.tsx (fonts)                                                                                       |
| 3    | `add root layout with retro navigation shell`                         | app/layout.tsx, components/Navigation.tsx, components/Footer.tsx, components/HitCounter.tsx, components/UnderConstruction.tsx |
| 4    | `add mdx blog infrastructure with syntax highlighting`                | next.config.mjs (plugins), mdx-components.tsx, lib/blog.ts, app/blog/[slug]/page.tsx                                          |
| 5    | `add project data layer and metadata types`                           | content/projects.ts, lib/projects.ts                                                                                          |
| 6    | `add landing and about page`                                          | app/page.tsx                                                                                                                  |
| 7    | `add blog seed content and tag filtering`                             | content/blog/\*.mdx, app/blog/page.tsx                                                                                        |
| 8    | `add rss feed route handler`                                          | app/rss.xml/route.ts                                                                                                          |
| 9    | `add projects grid and detail pages`                                  | app/projects/page.tsx, app/projects/[slug]/page.tsx                                                                           |
| 10   | `add interactive demo infrastructure and seed demo`                   | app/projects/[slug]/demo/page.tsx, components/demos/\*.tsx                                                                    |
| 11   | `add resume page with pdf download`                                   | app/resume/page.tsx, public/resume.pdf                                                                                        |
| 12   | `add contact page with social links`                                  | app/contact/page.tsx                                                                                                          |
| 13   | `add playwright e2e test suite`                                       | e2e/\*.spec.ts                                                                                                                |
| 14   | `add readme and finalize for deployment`                              | README.md                                                                                                                     |

---

## Success Criteria

### Verification Commands

```bash
pnpm build                        # Expected: exit 0, no errors
pnpm lint                         # Expected: exit 0, no warnings
pnpm exec tsc --noEmit            # Expected: exit 0, strict mode
pnpm exec playwright test         # Expected: all tests pass
curl -s http://localhost:3000/rss.xml | head -3  # Expected: <?xml ...><rss ...>
```

### Final Checklist

- [ ] All 5 pages render with retro 90s aesthetic
- [ ] Blog posts have syntax-highlighted code blocks
- [ ] Tag filtering works on blog listing
- [ ] RSS feed contains all blog posts with proper XML
- [ ] At least 1 interactive demo runs at `/projects/[slug]/demo`
- [ ] Resume PDF downloads from `/resume`
- [ ] Social links present on contact page
- [ ] Pre-commit hooks fire on `git commit`
- [ ] All Playwright E2E tests pass (desktop + mobile)
- [ ] `pnpm build` produces deployable output
- [ ] No component libraries in `node_modules` or `package.json`
- [ ] No `tailwind.config.js` or `tailwind.config.ts` exists
- [ ] TypeScript strict mode enabled
