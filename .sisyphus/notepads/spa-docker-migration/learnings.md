## [2026-03-30] Task: T4 — Static Export Config
- RSS output path: out/rss.xml
- Blog output path: out/blog.html
- out/ directory structure verified: all pages exported
- Dynamic route fix: returned a placeholder static param when the blog collection is empty so `output: 'export'` can prerender `/blog/[slug]` successfully.
