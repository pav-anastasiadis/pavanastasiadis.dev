# Learnings — portfolio-site

## [Init] Architecture Decisions

- Package manager: pnpm exclusively
- Next.js App Router, TypeScript strict, Tailwind CSS v4 (CSS-first @theme, NO tailwind.config.js)
- @next/mdx for MDX — requires remark-frontmatter + remark-mdx-frontmatter for YAML frontmatter support
- gray-matter is FORBIDDEN — MDX frontmatter via remark-mdx-frontmatter only
- ESLint flat config (eslint.config.mjs), eslint-config-prettier MUST be last
- Husky v9: npx husky init, prepare script is "husky"
- Fonts: next/font/google → CSS variables (--font-pixel, --font-terminal) → @theme references
- File discovery: fs.readdirSync (not globby)
- Dynamic imports: await import(`@/content/blog/${slug}.mdx`) for blog posts
- Plugin order: remark plugins first (frontmatter → GFM), then rehype (slug → pretty-code)
- RSS: route handler at app/rss.xml/route.ts, must XML-escape all dynamic content
- Demo isolation: next/dynamic with ssr: false, CSS Modules or inline styles per demo
- prefers-reduced-motion required for all CRT/scanline animations
