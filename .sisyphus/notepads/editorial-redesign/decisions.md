# Decisions — editorial-redesign

## [2026-03-29] Session ses_2c9254c30ffew3j32b3qzIyLJy — Plan Start

### Design Decisions

- Timezone: Europe/Amsterdam — stored as exported constant `TIMEZONE = 'Europe/Amsterdam'` in TimezoneClock.tsx
- GIF placeholder: Styled container box with dashed border, "Pixel art coming soon" text, data-testid="gif-placeholder"
- Content: Update to data engineering (Python, SQL, Spark, Airflow, dbt, BigQuery, Kafka, Snowflake)
- Blog: 0 posts — empty state shown
- Projects: pixel-canvas only (keep demo infrastructure)
- Contact: Same URLs, just restyle

### Visual Decisions (from DESIGN.md)

- Font: Manrope (weights 300, 400, 500, 700, 800)
- Background: #fbf9f4 (warm off-white)
- Primary: #456375 (muted blue)
- On-surface: #31332e (NOT pure black #000000)
- NO borders to separate sections — use background color shifts
- NO standard drop shadows — ambient shadow only (40px blur, 4% opacity, y:8px)
- Navigation: floating glassmorphism bar, bottom-positioned, active dot indicator

### Commit Strategy (7 commits)

1. T1+T2: `style: replace retro design system with editorial minimalism`
2. T3: `feat: redesign homepage with timezone clock and GIF placeholder`
3. T4: `chore: remove retro blog posts and trim project list`
4. T5+T6: `style: redesign blog and projects pages to editorial style`
5. T7+T8: `style: redesign resume and contact pages, update mdx components`
6. T9: `test: rewrite E2E tests for editorial redesign`
7. T10: `chore: remove retro components and update README`
