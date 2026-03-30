import fs from 'fs';
import path from 'path';

import type { Metadata } from 'next';
import Link from 'next/link';
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
  if (files.length === 0) {
    return [{ slug: '__no-posts__' }];
  }

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
    <div className="max-w-3xl mx-auto px-4 py-20">
      <Link
        href="/blog"
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-10 inline-block"
      >
        ← Back to blog
      </Link>

      <article>
        <h1
          data-testid="blog-post-title"
          className="text-4xl font-bold tracking-tight text-on-surface mb-4 leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {frontmatter.title}
        </h1>

        <p className="text-sm text-on-surface-variant mb-6">
          {new Date(frontmatter.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div data-testid="blog-post-tags" className="flex flex-wrap gap-2 mb-10">
            {frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-surface-container-low text-primary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          data-testid="blog-content"
          className="prose prose-slate max-w-none text-on-surface leading-relaxed"
        >
          <Post />
        </div>
      </article>
    </div>
  );
}
