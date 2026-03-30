# Issues — editorial-redesign

## [2026-03-29] Session ses_2c9254c30ffew3j32b3qzIyLJy — Plan Start

### Known Gotchas (from Metis analysis)

1. **Inline style explosion**: Current codebase uses extensive `style={{}}` props with hardcoded retro hex colors.
   - ALL must be replaced with Tailwind classes
   - grep for `style={{` to verify cleanup

2. **DemoLoader retro fonts**: components/DemoLoader.tsx references `--font-pixel` and `--font-terminal` in loading state.
   - Must update in T6 (NOT T1)

3. **mdx-components.tsx time bomb**: Even with 0 posts, MDX component styles persist.
   - Must restyle in T8 now (not skip because "no posts")

4. **RSS empty state**: Current tests assert `<item>` exists — tests must expect 0 items after T4 removes all posts.
   - Handle in T9 (E2E test rewrite)

5. **Metadata "retro" strings**: Appear in multiple files — must catch all:
   - app/layout.tsx metadata
   - app/projects/page.tsx metadata
   - app/projects/[slug]/page.tsx generateMetadata
   - app/projects/[slug]/demo/page.tsx generateMetadata
   - app/contact/page.tsx metadata
   - app/rss.xml/route.ts

6. **data-testid preservation**: E2E tests depend on these — ALL must survive in redesigned markup
   - nav-home, nav-projects, nav-blog, nav-resume, nav-contact
   - footer
   - hero-heading, gif-placeholder (new)
   - blog-post-card, active-tag, tag-filter
   - blog-post-title, blog-post-tags, blog-content
   - projects-grid, project-card
   - project-title, project-description, demo-link
   - demo-container, demo-interactive
   - resume-content, resume-download
   - contact-github, contact-linkedin, contact-email

7. **prefers-reduced-motion**: New globals.css MUST maintain this accessibility section

- F1 audit (2026-03-29): plan compliance currently fails. Inline style props remain in app/page.tsx, app/blog/page.tsx, app/blog/[slug]/page.tsx, app/projects/page.tsx, app/projects/[slug]/page.tsx, app/projects/[slug]/demo/page.tsx, app/resume/page.tsx, and app/contact/page.tsx. Retro colors/fonts and #000000 remain in components/demos/pixel-canvas.tsx. pnpm format:check fails due to .sisyphus/boulder.json.
