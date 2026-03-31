# SPA Static Export + Docker Migration

## TL;DR

> **Quick Summary**: Fix the blog build-time crash (missing `content/blog/` directory), remove all Vercel deployment references, convert the Next.js site to a static SPA export, and containerize with Docker + nginx for self-hosted deployment.
> 
> **Deliverables**:
> - Blog bug fix (Webpack context resolution)
> - Vercel reference cleanup (README.md, .gitignore)
> - Static export configuration (`output: 'export'`)
> - Blog page refactored for client-side tag filtering
> - Multi-stage Dockerfile (pnpm build → nginx:alpine)
> - nginx.conf with SPA fallback, gzip, security headers, caching
> - Updated E2E tests for static export behavior
> - Updated README with Docker deployment instructions
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 4 → Task 5 → Task 7 → F1-F4

---

## Context

### Original Request
Fix the blog navigation bug, clean up all Vercel deployment references, and create a Dockerfile to run the project as a static SPA.

### Interview Summary
**Key Discussions**:
- Blog crash is a Webpack build-time issue — `content/blog/` directory was deleted in the editorial-redesign task, causing `import(\`@/content/blog/${slug}.mdx\`)` in `lib/blog.ts` to fail at Webpack context resolution time
- Vercel references are limited to README.md (lines 13, 113) and .gitignore (line 42). No vercel.json, no @vercel/* packages
- SPA conversion requires `output: 'export'` + `images: { unoptimized: true }` in next.config.mjs
- Blog page uses server-side `searchParams` which is incompatible with static export — needs client-side conversion
- Docker: multi-stage build with pnpm + nginx:alpine serving the static `out/` directory

**Research Findings**:
- `lib/blog.ts` has runtime guards (`fs.existsSync`) that prevent crashes at runtime, but Webpack's static analysis of the dynamic import template requires the directory to exist at build time
- `app/blog/page.tsx` exports `metadata` as a static export (lines 5-8) — this CANNOT exist in a `'use client'` component, so the page must be split into a server layout (metadata) + server page (data fetching) + client component (filtering)
- `getAllPosts()` and `getAllTags()` use Node.js `fs` module — cannot run client-side. Data must be fetched in a server component and passed as props
- `app/rss.xml/route.ts` has `export const dynamic = 'force-static'` — compatible with static export
- No `next/image` usage found — `images: { unoptimized: true }` is precautionary
- `pnpm start` (`next start`) will break after static export — needs documentation update
- Playwright tests will break: blog 404 test checks HTTP status (nginx behavior differs), RSS content-type test may need nginx MIME handling
- No `app/not-found.tsx` exists — Next.js will generate a default 404.html for static export

### Metis Review
**Identified Gaps** (addressed):
- Blog page conversion is NOT a simple `'use client'` swap — requires three-file architecture (layout + page + client component)
- `getAllPosts()`/`getAllTags()` use `fs` — cannot be called client-side. Server component must fetch and pass as props
- `export const metadata` forbidden in client components — extracted to `app/blog/layout.tsx`
- Blog 404 E2E test checks HTTP status code — nginx serves 404 differently than Next.js dev server
- RSS route may output to `out/rss.xml/index.html` instead of `out/rss.xml` — nginx needs explicit MIME handling
- `pnpm start` becomes unusable after static export — must be documented
- nginx `try_files` should NOT fall back to `/index.html` (this is NOT a client-side SPA router) — should use `$uri $uri.html $uri/ /404.html =404`

---

## Work Objectives

### Core Objective
Convert the Next.js portfolio site from Vercel-hosted SSR to a self-hosted static export served by nginx in Docker, while fixing the blog build bug and preserving all existing functionality.

### Concrete Deliverables
- `content/blog/.gitkeep` — fixes Webpack context resolution
- `app/blog/layout.tsx` — new file with extracted metadata
- `app/blog/page.tsx` — refactored to server component that passes data to client child
- `components/blog-content.tsx` — new client component for tag filtering via `useSearchParams()`
- `next.config.mjs` — updated with `output: 'export'` and `images: { unoptimized: true }`
- `Dockerfile` — multi-stage build (node:22-slim + pnpm → nginx:alpine)
- `nginx.conf` — production nginx configuration
- `.dockerignore` — exclude node_modules, .next, .git, etc.
- `README.md` — Vercel refs removed, Docker deployment added, `pnpm start` docs updated
- `.gitignore` — Vercel comment and entry removed
- `e2e/blog.spec.ts` — blog 404 test updated for static export behavior

### Definition of Done
- [ ] `pnpm build` completes with exit code 0 and produces `out/` directory
- [ ] `docker build -t pavanastasiadis-dev .` completes successfully
- [ ] `docker run -p 8080:80 pavanastasiadis-dev` serves the full site
- [ ] All pages accessible via nginx (home, blog, projects, resume, contact)
- [ ] RSS feed served with correct `application/xml` content-type
- [ ] 404 page served for unknown routes
- [ ] `pnpm test:e2e` passes all tests (against dev server)
- [ ] Zero Vercel references in README.md and .gitignore
- [ ] Blog page renders "No posts yet" empty state correctly

### Must Have
- Static export output in `out/` directory
- Multi-stage Docker build (build → serve)
- nginx with gzip, security headers, cache headers for static assets
- Blog tag filtering works client-side (even though currently no posts exist — architecture must support it)
- All existing E2E tests pass (with necessary updates for static export behavior changes)
- Blog metadata (`<title>Blog</title>`) preserved in HTML `<head>`

### Must NOT Have (Guardrails)
- DO NOT modify `lib/blog.ts` — existing constraint from editorial-redesign plan
- DO NOT add new npm dependencies (no `serve`, no `http-server`, no Docker-related packages)
- DO NOT create `docker-compose.yml` — Dockerfile only
- DO NOT add SSL/TLS to nginx config — reverse proxy handles that in production
- DO NOT add environment variables or `.env` files — this is a static portfolio
- DO NOT add rate limiting, HTTP/2, or advanced nginx features beyond the basics
- DO NOT convert the entire `app/blog/page.tsx` to `'use client'` — `fs` module won't work client-side
- DO NOT add pagination, search, or any new blog features — only convert existing functionality
- DO NOT modify any pages/components beyond what's needed for the SPA conversion
- DO NOT add new test coverage beyond fixing broken assertions
- DO NOT use `as any`, `@ts-ignore`, or empty catch blocks
- DO NOT upgrade any dependencies

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: YES — Playwright E2E (7 spec files)
- **Automated tests**: Tests-after (update existing E2E tests where broken by behavioral changes)
- **Framework**: Playwright (existing)
- **No unit test framework** — not adding one for this scope

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build verification**: Use Bash — `pnpm build` exit code + verify `out/` contents
- **Docker verification**: Use Bash — `docker build` + `docker run` + `curl` assertions
- **E2E verification**: Use Bash — `pnpm test:e2e` pass/fail
- **Content verification**: Use Bash — `grep` for presence/absence of strings

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — independent fixes):
├── Task 1: Fix blog build bug (.gitkeep) [quick]
├── Task 2: Remove Vercel references [quick]
└── Task 3: Refactor blog page for client-side filtering [unspecified-high]

Wave 2 (After Wave 1 — depends on blog fix + blog refactor):
├── Task 4: Enable static export in next.config.mjs [quick]
├── Task 5: Create Dockerfile + nginx.conf + .dockerignore [unspecified-high]
└── Task 6: Update README with Docker deployment [quick]

Wave 3 (After Wave 2 — integration verification):
└── Task 7: Update E2E tests for static export behavior [unspecified-high]

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
| T1   | —         | T4     | 1    |
| T2   | —         | T6     | 1    |
| T3   | —         | T4, T7 | 1    |
| T4   | T1, T3    | T5, T7 | 2    |
| T5   | T4        | F1-F4  | 2    |
| T6   | T2        | F1-F4  | 2    |
| T7   | T4        | F1-F4  | 3    |
| F1-F4| T5,T6,T7  | —      | FINAL|

### Agent Dispatch Summary

- **Wave 1**: **3 tasks** — T1 → `quick`, T2 → `quick`, T3 → `unspecified-high`
- **Wave 2**: **3 tasks** — T4 → `quick`, T5 → `unspecified-high`, T6 → `quick`
- **Wave 3**: **1 task** — T7 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Fix Blog Build Bug — Create content/blog/.gitkeep

- [x] 2. Remove All Vercel Deployment References

- [x] 3. Refactor Blog Page for Client-Side Tag Filtering

- [x] 4. Enable Next.js Static Export

- [x] 5. Create Dockerfile + nginx.conf + .dockerignore

  **What to do**:
  Create three new files for Docker deployment:

  **Step 1: Create `Dockerfile`** (multi-stage build):
  - **Stage 1 (builder)**: `FROM node:22-slim AS builder`
    - Install pnpm via corepack: `RUN corepack enable && corepack prepare pnpm@latest --activate`
    - Set `WORKDIR /app`
    - Copy `package.json` and `pnpm-lock.yaml` first (for layer caching)
    - Run `pnpm install --frozen-lockfile`
    - Copy all source files
    - Run `pnpm build` (which executes `next build --webpack`, producing `out/`)
  - **Stage 2 (runner)**: `FROM nginx:alpine`
    - Copy `nginx.conf` to `/etc/nginx/nginx.conf`
    - Copy `out/` from builder stage to `/usr/share/nginx/html`
    - Expose port 80
    - CMD `["nginx", "-g", "daemon off;"]`

  **Step 2: Create `nginx.conf`**:
  - Worker processes: `auto`
  - HTTP block with:
    - `gzip on` with types: text/html, text/css, application/javascript, application/json, application/xml, text/plain, image/svg+xml
    - Security headers:
      - `X-Frame-Options: DENY`
      - `X-Content-Type-Options: nosniff`
      - `X-XSS-Protection: 1; mode=block`
      - `Referrer-Policy: strict-origin-when-cross-origin`
    - Server block listening on port 80:
      - `root /usr/share/nginx/html`
      - `index index.html`
      - Main location `/`: `try_files $uri $uri.html $uri/ /404.html =404;` — NOT `/index.html` fallback
      - RSS location: `location = /rss.xml { ... }` with explicit `default_type application/xml;` to ensure correct Content-Type
      - Static asset caching: `location /_next/static/ { expires 1y; add_header Cache-Control "public, immutable"; }`
      - Error page: `error_page 404 /404.html;`

  **Step 3: Create `.dockerignore`**:
  ```
  node_modules
  .next
  out
  .git
  .gitignore
  .sisyphus
  playwright-report
  test-results
  e2e
  *.md
  .env*
  .husky
  ```

  **IMPORTANT — RSS output path**: Task 4 confirmed `out/rss.xml` is a FLAT FILE (not `out/rss.xml/index.html`). So nginx location block `location = /rss.xml { default_type application/xml; }` will serve it directly with correct MIME type — no rewrite needed.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Docker image builds successfully
    Steps:
      1. Run `docker build -t pavanastasiadis-dev .`
      2. Check exit code is 0
    Evidence: .sisyphus/evidence/task-5-docker-build.txt

  Scenario: Docker container serves the site correctly
    Steps:
      1. docker run -d -p 8080:80 --name spa-test pavanastasiadis-dev
      2. curl http://localhost:8080/ — expect 200 + "pavanastasiadis" in body
      3. curl http://localhost:8080/blog — expect 200 + "No posts yet" in body
      4. curl http://localhost:8080/projects — expect 200
      5. curl http://localhost:8080/resume — expect 200
      6. curl http://localhost:8080/contact — expect 200
      7. docker stop spa-test && docker rm spa-test
    Evidence: .sisyphus/evidence/task-5-docker-serves-site.txt

  Scenario: RSS feed served with correct content-type
    Steps:
      1. curl -sI http://localhost:8080/rss.xml — Content-Type must contain "xml"
      2. curl -s http://localhost:8080/rss.xml | head -1 — must start with "<?xml"
    Evidence: .sisyphus/evidence/task-5-rss-content-type.txt

  Scenario: 404 returned for unknown routes
    Steps:
      1. curl http://localhost:8080/nonexistent-page — expect 404
      2. curl http://localhost:8080/blog/nonexistent-slug — expect 404
    Evidence: .sisyphus/evidence/task-5-404-handling.txt

  Scenario: Security headers present
    Steps:
      1. curl -sI http://localhost:8080/ — check X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
    Evidence: .sisyphus/evidence/task-5-security-headers.txt

  Scenario: Gzip compression enabled
    Steps:
      1. curl -sI -H "Accept-Encoding: gzip" http://localhost:8080/ — check Content-Encoding: gzip
    Evidence: .sisyphus/evidence/task-5-gzip.txt
  ```

  **Commit**: YES
  - Message: `feat: add Docker deployment with nginx`
  - Files: `Dockerfile`, `nginx.conf`, `.dockerignore`
  - Pre-commit: `docker build -t pavanastasiadis-dev .`

- [x] 6. Update README with Docker Deployment Instructions

  **What to do**:
  - Edit `README.md` to add Docker deployment information:
    - In the **Tech Stack** section, add: `- **Deployment**: Docker + nginx`
    - Update the **Other Scripts** section: update `pnpm start` description to note it requires `next start` which is not used for production (Docker handles serving)
    - Add a new **## Deployment** section at the bottom with `docker build` + `docker run` instructions and port 8080

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: README contains Docker deployment instructions
    Steps:
      1. grep "Docker" README.md — verify Docker is mentioned
      2. grep "docker build" README.md — verify build command present
      3. grep "docker run" README.md — verify run command present
      4. grep "8080" README.md — verify port documented
    Evidence: .sisyphus/evidence/task-6-readme-docker.txt

  Scenario: README Tech Stack updated
    Steps:
      1. grep -i "deployment.*docker" README.md — Docker in Tech Stack
      2. grep -i "vercel" README.md — must return nothing
    Evidence: .sisyphus/evidence/task-6-tech-stack.txt
  ```

  **Commit**: YES
  - Message: `docs: update README with Docker deployment instructions`
  - Files: `README.md`

- [x] 7. Update E2E Tests for Static Export Behavior

  **What to do**:
  Run the full E2E suite and fix any tests broken by the migration (Tasks 1-6). The blog 404 test (`e2e/blog.spec.ts:22-27`) checks HTTP status — verify it still passes against dev server. Run `pnpm test:e2e` and fix failures.

  **Acceptance Criteria**:

  ```
  Scenario: Full E2E test suite passes
    Steps:
      1. Run `pnpm test:e2e`
      2. Exit code 0
    Evidence: .sisyphus/evidence/task-7-e2e-full-suite.txt
  ```

  **Commit**: YES (only if changes needed)
  - Message: `test: update E2E tests for static export behavior`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read `.sisyphus/plans/spa-docker-migration.md` end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm build` + `pnpm lint` + `pnpm test:e2e`. Review all changed files.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Execute EVERY QA scenario from EVERY task. Test Docker serving.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| # | Commit | Files | Status |
|---|--------|-------|--------|
| 1 | `fix(blog): add content/blog directory for Webpack context resolution` | `content/blog/.gitkeep` | ✅ DONE |
| 2 | `chore: remove Vercel deployment references` | `README.md`, `.gitignore` | ✅ DONE |
| 3 | `refactor(blog): split page into server/client for static export compatibility` | `app/blog/layout.tsx`, `app/blog/page.tsx`, `components/blog-content.tsx` | ✅ DONE |
| 4 | `feat: enable Next.js static export` | `next.config.mjs`, `app/blog/[slug]/page.tsx` | ✅ DONE |
| 5 | `feat: add Docker deployment with nginx` | `Dockerfile`, `nginx.conf`, `.dockerignore` | ⏳ PENDING |
| 6 | `docs: update README with Docker deployment instructions` | `README.md` | ⏳ PENDING |
| 7 | `test: update E2E tests for static export behavior` | `e2e/blog.spec.ts` | ⏳ PENDING |
