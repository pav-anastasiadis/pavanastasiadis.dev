import fs from 'fs';
import path from 'path';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { BlogFrontmatter } from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    const frontmatter = mod.frontmatter as BlogFrontmatter;
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let Post: React.ComponentType;
  let frontmatter: BlogFrontmatter;

  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    Post = mod.default;
    frontmatter = mod.frontmatter as BlogFrontmatter;
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1
        data-testid="blog-post-title"
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#00ffff',
          fontSize: '1.25rem',
          marginBottom: '1rem',
          lineHeight: '1.8',
        }}
      >
        {frontmatter!.title}
      </h1>
      <div style={{ marginBottom: '1.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-terminal, monospace)',
            color: '#808080',
            fontSize: '1.25rem',
            marginRight: '1rem',
          }}
        >
          {frontmatter!.date}
        </span>
        <span data-testid="blog-post-tags">
          {frontmatter!.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-block',
                padding: '0 0.5rem',
                margin: '0 0.25rem',
                background: '#1a1a1a',
                color: '#00ff00',
                fontFamily: 'var(--font-terminal, monospace)',
                fontSize: '1rem',
                border: '1px solid #00ff00',
              }}
            >
              {tag}
            </span>
          ))}
        </span>
      </div>
      <article data-testid="blog-content" style={{ lineHeight: '1.8' }}>
        <Post />
      </article>
    </main>
  );
}
