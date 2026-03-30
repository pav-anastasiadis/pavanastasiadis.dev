# pavanastasiadis.dev

A personal portfolio site with an Editorial Minimalism aesthetic for a Senior Data Engineer.

## Tech Stack

- **Framework**: [Next.js 16.2.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first, no `tailwind.config.js`)
- **Content**: [MDX](https://mdxjs.com/) with YAML frontmatter
- **Syntax Highlighting**: [rehype-pretty-code](https://github.com/rehype-pretty-code/rehype-pretty-code) + [Shiki](https://shiki.style/)
- **Testing**: [Playwright](https://playwright.dev/) (E2E)

## Features

- 5 core pages: `/` (About), `/projects`, `/blog`, `/resume`, `/contact`
- MDX blog with syntax highlighting and automatic RSS feed generation at `/rss.xml` (currently empty)
- 1 interactive project demo at `/projects/[slug]/demo`
- Clean Editorial Minimalism styling with warm off-white surfaces and muted blue accents
- Data engineer-focused content and case studies
- Strict ESLint and Prettier configuration with Husky git hooks

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build

Note: The build uses the `--webpack` flag as Turbopack does not yet support certain MDX plugin functions.

```bash
pnpm build
```

### Other Scripts

- `pnpm start`: Run the production build locally
- `pnpm lint`: Run ESLint check
- `pnpm lint:fix`: Run ESLint and apply fixes
- `pnpm format`: Run Prettier and apply fixes
- `pnpm format:check`: Check if files are formatted correctly
- `pnpm test:e2e`: Run Playwright E2E tests

## Project Structure

- `app/`: Next.js App Router pages and global styles
- `components/`: React components for the editorial UI
- `content/`: Static content
  - `blog/`: MDX files for blog posts
  - `projects.ts`: Project metadata and definitions
- `lib/`: Utility functions and shared logic
- `e2e/`: Playwright E2E tests
- `public/`: Static assets (images, fonts, resume PDF)

## Adding Content

### Blog Posts

Create a new `.mdx` file in `content/blog/` with the following YAML frontmatter:

```mdx
---
title: 'Post Title'
date: '2026-03-29'
description: 'A brief summary of the post.'
tags: ['tag1', 'tag2']
---

Your content here...
```

The site uses `remark-frontmatter` and `remark-mdx-frontmatter` to process this metadata.

At the moment, the blog is empty and ready for future posts.

### Projects

Edit `content/projects.ts` and add a new project object to the `projects` array:

```typescript
{
  slug: 'my-project',
  title: 'My Project',
  description: 'Project description...',
  tags: ['react', 'typescript'],
  demoAvailable: true, // If true, create demo in app/projects/[slug]/demo/
  repo: 'https://github.com/pav-anastasiadis/my-project',
}
```

The portfolio currently highlights a single interactive project demo.
