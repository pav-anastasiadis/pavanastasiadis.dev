# Decisions — portfolio-site

## [Init] Key Architectural Decisions

- Separate pages (NOT single-page scroll): /, /projects, /blog, /resume, /contact
- Demo isolation: direct mount (no iframes), self-contained, no global CSS leakage
- Contact: social links only (GitHub, LinkedIn, email mailto:) — no form backend
- Seed content: 2-3 blog posts, 2-3 projects, at least 1 with interactive demo
- Resume: static /public/resume.pdf — user provides real one, placeholder for testing
- Retro effects locked to: scanlines, beveled borders, neon glow, pixel fonts, hit counter, under-construction banner
- No over-engineering: no design system, no token files, no abstraction layers
