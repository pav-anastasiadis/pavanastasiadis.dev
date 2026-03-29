import Link from 'next/link';

import { getAllPosts } from '@/lib/blog';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen p-8">
      <h1
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#00ffff',
          fontSize: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        [ BLOG ]
      </h1>
      <div>
        {posts.map((post) => (
          <article
            key={post.slug}
            data-testid="blog-post-card"
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '2px solid #808080',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              boxShadow: 'inset 1px 1px 0 #c0c0c0, inset -1px -1px 0 #404040',
            }}
          >
            <Link href={`/blog/${post.slug}`}>
              <h2
                style={{
                  fontFamily: 'var(--font-pixel, monospace)',
                  color: '#ff00ff',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
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
              }}
            >
              {post.frontmatter.date}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
