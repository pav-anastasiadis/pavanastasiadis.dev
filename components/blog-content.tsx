'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { BlogPost } from '@/lib/blog';

interface BlogContentProps {
  posts: BlogPost[];
  tags: string[];
}

function BlogContentInner({ posts: allPosts, tags: allTags }: BlogContentProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') ?? undefined;

  const posts = tag ? allPosts.filter((post) => post.frontmatter.tags?.includes(tag)) : allPosts;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1
        className="text-5xl font-bold tracking-tight text-on-surface mb-12"
        style={{ letterSpacing: '-0.02em' }}
      >
        Blog
      </h1>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            href="/blog"
            data-testid="tag-filter"
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              !tag
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${t}`}
              data-testid={tag === t ? 'active-tag' : 'tag-filter'}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                tag === t
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-on-surface-variant text-base">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <article key={post.slug} data-testid="blog-post-card">
              <Link href={`/blog/${post.slug}`} className="group block">
                <p className="text-xs text-on-surface-variant mb-2 uppercase tracking-wide">
                  {new Date(post.frontmatter.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h2 className="text-xl font-medium text-on-surface group-hover:text-primary transition-colors mb-2">
                  {post.frontmatter.title}
                </h2>
                {post.frontmatter.description && (
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    {post.frontmatter.description}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogContent(props: BlogContentProps) {
  return (
    <Suspense fallback={null}>
      <BlogContentInner {...props} />
    </Suspense>
  );
}
