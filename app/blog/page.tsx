import Link from 'next/link';

import { getAllPosts, getAllTags } from '@/lib/blog';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();

  const filteredPosts = tag
    ? allPosts.filter((post) => post.frontmatter.tags.includes(tag))
    : allPosts;

  return (
    <main className="min-h-screen p-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1
        className="neon-glow-cyan"
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#00ffff',
          fontSize: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        [ BLOG ]
      </h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <Link href="/blog">
          <span
            data-testid={!tag ? 'active-tag' : 'tag-filter'}
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              fontFamily: 'var(--font-terminal, monospace)',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: !tag ? '#00ffff' : 'transparent',
              color: !tag ? '#0a0a0a' : '#00ffff',
              border: '2px solid #00ffff',
              boxShadow: !tag ? '0 0 8px #00ffff, 0 0 16px #00ffff' : '0 0 4px rgba(0,255,255,0.3)',
            }}
          >
            ALL
          </span>
        </Link>

        {allTags.map((t) => {
          const isActive = tag === t;
          return (
            <Link key={t} href={isActive ? '/blog' : `/blog?tag=${t}`}>
              <span
                data-testid={isActive ? 'active-tag' : 'tag-filter'}
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  fontFamily: 'var(--font-terminal, monospace)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#ff00ff' : 'transparent',
                  color: isActive ? '#0a0a0a' : '#ff00ff',
                  border: '2px solid #ff00ff',
                  boxShadow: isActive
                    ? '0 0 8px #ff00ff, 0 0 16px #ff00ff'
                    : '0 0 4px rgba(255,0,255,0.3)',
                }}
              >
                #{t}
              </span>
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredPosts.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-terminal, monospace)',
              color: '#808080',
              fontSize: '1.25rem',
            }}
          >
            No posts found for tag: #{tag}
          </p>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bevel-raised"
              data-testid="blog-post-card"
              style={{
                padding: '1.25rem',
                backgroundColor: '#1a1a1a',
              }}
            >
              <Link href={`/blog/${post.slug}`}>
                <h2
                  style={{
                    fontFamily: 'var(--font-pixel, monospace)',
                    color: '#ff00ff',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    lineHeight: '1.6',
                  }}
                >
                  {post.frontmatter.title}
                </h2>
              </Link>

              <p
                style={{
                  fontFamily: 'var(--font-terminal, monospace)',
                  fontSize: '1rem',
                  color: '#808080',
                  marginBottom: '0.5rem',
                }}
              >
                {post.frontmatter.date}
              </p>

              {post.frontmatter.description && (
                <p
                  style={{
                    fontFamily: 'var(--font-terminal, monospace)',
                    fontSize: '1.1rem',
                    color: '#c0c0c0',
                    marginBottom: '0.75rem',
                  }}
                >
                  {post.frontmatter.description}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {post.frontmatter.tags.map((t) => {
                  const isActive = tag === t;
                  return (
                    <Link key={t} href={isActive ? '/blog' : `/blog?tag=${t}`}>
                      <span
                        data-testid={isActive ? 'active-tag' : 'tag-filter'}
                        style={{
                          display: 'inline-block',
                          padding: '0.125rem 0.5rem',
                          fontFamily: 'var(--font-terminal, monospace)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          backgroundColor: isActive ? '#00ff00' : 'transparent',
                          color: isActive ? '#0a0a0a' : '#00ff00',
                          border: '1px solid #00ff00',
                          boxShadow: isActive ? '0 0 6px #00ff00' : '0 0 2px rgba(0,255,0,0.3)',
                        }}
                      >
                        #{t}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
