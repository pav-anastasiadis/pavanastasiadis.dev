# Learnings — editorial-redesign

## [2026-03-29] Session ses_2c9254c30ffew3j32b3qzIyLJy — Plan Start

### Tech Stack

- Framework: Next.js 16 App Router (pnpm, NOT npm/yarn)
- Build: `pnpm build` uses `--webpack` flag (Turbopack incompatible with MDX plugins)
- Dev: `pnpm dev` uses `--webpack`
- Tailwind: v4 CSS-first — @theme block in globals.css, NO tailwind.config.js

### Critical Patterns

- Tailwind v4: custom tokens in `@theme {}` become utility classes automatically (e.g., `--color-primary` → `bg-primary`, `text-primary`)
- Glassmorphism: `bg-white/30 backdrop-blur-md border border-white/40` works in Tailwind v4 CSS-first
- Font loading: `import { Manrope } from 'next/font/google'` with variable `--font-manrope`
- Client components: must have `'use client'` directive for useEffect/useState
- Timezone clock: `Intl.DateTimeFormat` with timeZone option — needs mounted guard for SSR

### File Structure

- Pages: `app/` directory (App Router)
- Components: `components/`
- Content: `content/blog/*.mdx`, `content/projects.ts`
- Tests: `e2e/*.spec.ts`
- Data layer (PROTECTED): `lib/blog.ts`, `lib/projects.ts`
- Test config (PROTECTED): `playwright.config.ts`
- Demo component (PROTECTED): `components/demos/pixel-canvas.tsx`

### Wave Execution Order

- Wave 1: T1 (globals.css) → T2 (layout+nav+footer) — sequential
- Wave 2: T3+T4+T5+T6+T7+T8 — ALL parallel after Wave 1
- Wave 3: T9 (E2E tests) — after all Wave 2 done
- Wave 4: T10 (cleanup) — after T9
- Final: F1+F2+F3+F4 — parallel

### CSS Architecture

- Tailwind V4 uses `@theme` to declare design tokens directly in CSS, replacing the need for `tailwind.config.js`.
- These tokens become CSS variables AND utility classes out of the box.
- Ensure
  > pavanastasiadis.dev@0.1.0 build /home/pav/Work/pav-anastasiadis/pavanastasiadis.dev
  > next build --webpack

▲ Next.js 16.2.1 (webpack)

Creating an optimized production build ...
✓ Compiled successfully in 1806ms
Running TypeScript ...
Finished TypeScript in 2.7s ...
Collecting page data using 7 workers ...
Generating static pages using 7 workers (0/16) ...
Generating static pages using 7 workers (4/16)
Generating static pages using 7 workers (8/16)
Generating static pages using 7 workers (12/16)
✓ Generating static pages using 7 workers (16/16) in 561ms
Finalizing page optimization ...
Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /\_not-found
├ ƒ /blog
├ ● /blog/[slug]
│ ├ /blog/building-retro-web
│ ├ /blog/hello-world
│ └ /blog/typescript-tips
├ ○ /contact
├ ○ /projects
├ ● /projects/[slug]
│ ├ /projects/pixel-canvas
│ ├ /projects/retro-terminal
│ └ /projects/neon-clock
├ ● /projects/[slug]/demo
│ └ /projects/pixel-canvas/demo
├ ○ /resume
└ ○ /rss.xml

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand is run with as documented due to MDX compatibility.

### CSS Architecture

- Tailwind V4 uses `@theme` to declare design tokens directly in CSS, replacing the need for `tailwind.config.js`.
- These tokens become CSS variables AND utility classes out of the box.
- Ensure `pnpm build` is run with `--webpack` as documented due to MDX compatibility.

## [2026-03-29] Session ses_2c9254c30ffew3j32b3qzIyLJy — Cleanup Task T10

### Learnings

- `HitCounter.tsx` and `UnderConstruction.tsx` still existed on disk but had zero imports/usages anywhere in the codebase.
- `pnpm build` continued to pass after deleting the obsolete components and updating README copy.
- README now matches the Editorial Minimalism / Senior Data Engineer positioning and removes all retro references.

## Task 2: Root Layout + Navigation + Footer Rewrite

- Successfully migrated layout from pixel fonts to Manrope.
- Eliminated retro components like `HitCounter` and `UnderConstruction` while preserving semantic navigation `data-testid` properties.
- Implemented glassmorphism bottom-nav component with dynamic active-route dots instead of hard backgrounds.
- Footer condensed into a minimal block honoring standard text-on-surface-variant contrast values.

## Task 3: Homepage Redesign + TimezoneClock

- Created `TimezoneClock` component utilizing `Intl.DateTimeFormat` for local Amsterdam time.
- Rewrote `app/page.tsx` with editorial minimalism aesthetic.
- Eliminated retro artifacts, confirming zero output via grep aside from a single intentional `style={{ letterSpacing: '-0.02em' }}` on the hero heading per `DESIGN.md` spec.
- `tabular-nums` class ensures the clock ticking doesn't jitter, which works seamlessly with Tailwind v4 defaults.
- Confirmed `pnpm build` output continues to compile successfully with 0 errors.

## Task 4: Content Cleanup

- Removed all three blog MDX files, leaving `/blog` with no static posts.
- Trimmed `content/projects.ts` down to the single `pixel-canvas` project entry only.
- Updated the RSS channel description to remove the remaining retro wording.
- Verified the production build still passes after the content cleanup.

## Task 5: Blog Pages Redesign (Listing + Post Detail)

- Rewrote `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` to the editorial minimalism style.
- Handled empty state correctly for the 0 blog posts currently present.
- Kept the requested `data-testid` attributes and preserved `getAllPosts()`, `getAllTags()` usage.
- Retained the `BlogFrontmatter` structure and existing metadata generation logic in the dynamic route.
- Verified no retro artifacts using `grep` (only the intentional `style={{ letterSpacing: '-0.02em' }}` matched).
- Confirmed `pnpm build` output compiles successfully with exit code 0.

## Task 6: Projects Pages + DemoLoader Redesign

- Rewrote `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/projects/[slug]/demo/page.tsx`, and `components/DemoLoader.tsx` to align with the Editorial Minimalism aesthetic.
- Replaced retro neon colors (`#00ffff`, `#00ff00`), pixel/terminal fonts, and bevels with appropriate Tailwind `surface-container` colors and semantic tokens (`text-on-surface`, `bg-surface-container-low`, etc.).
- Kept the `letterSpacing: '-0.02em'` inline style strictly for major headings. All other inline styles were removed.
- Maintained all specific `data-testid` attributes (`projects-grid`, `project-card`, `project-title`, `project-description`, `demo-link`, `demo-container`).
- Did not change `dynamicParams`, `generateStaticParams`, or the dynamic imports / suspense structures.
- Verified build completed successfully with zero errors.

## Task 7: Resume Page Redesign + Data Engineer Content

- Redesigned `app/resume/page.tsx` transitioning from retro terminal UI to Editorial Minimalism using the updated Tailwind CSS classes (`text-on-surface`, `bg-surface-container-low`, etc).
- Content fully replaced with the Data Engineer profile: role changed to "Senior Data Engineer", experience swapped, and skills updated to Data Engineering tech stack.
- Required `data-testid` attributes and resume download links are preserved.
- Only one intentional inline style (`style={{ letterSpacing: '-0.02em' }}`) was kept as required; all `RESUME.EXE` and other retro elements were removed.

## Task 8: Contact Page + mdx-components Redesign

- Successfully rewrote app/contact/page.tsx to use editorial minimalism, maintaining all testids and external links.
- Successfully rewrote mdx-components.tsx to use Tailwind classes instead of inline styles.
- Verified build passes and all retro styling is removed.

## Task 9: E2E Test Rewrite

- All 7 Playwright spec files updated to match editorial redesign
- Removed all retro-era test references (hit-counter, under-construction, RESUME.EXE, WORK*HISTORY, SKILLS*&\_TECHNOLOGIES, DIGITAL GUESTBOOK, Senior Frontend Engineer, hello-world, building-retro-web, typescript-tips, retro-terminal, neon-clock)
- blog.spec.ts: complete rewrite — expects 0 blog-post-card elements, empty state message, no tag-filter when 0 posts, 404 on nonexistent slug
- projects.spec.ts: count 3→1, removed retro-terminal and neon-clock detail tests and retro-terminal demo 404 test
- resume.spec.ts: updated all 6 content tests (Resume heading, Experience, Senior Data Engineer, Skills, Python, Education); kept all 4 download tests
- contact.spec.ts: updated heading assertion to "Contact" (exact), removed digital guestbook test
- rss.spec.ts: removed 4 blog-post-item tests; added "has no items" test with `not.toContain('<item>')`
- mobile.spec.ts: removed hit-counter/under-construction tests; updated blog listing test to just check body visibility; removed blog post page test (hello-world gone)
- navigation.spec.ts: removed hit-counter and under-construction tests from Layout elements block
- `pnpm build` exits 0; `grep` check on e2e/ returns empty (no old references)
