import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#00ffff',
          fontSize: '1.5rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem',
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#ff00ff',
          fontSize: '1.125rem',
          lineHeight: '1.6',
          marginBottom: '1rem',
          marginTop: '2rem',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          color: '#00ff00',
          fontSize: '0.875rem',
          marginBottom: '0.75rem',
          marginTop: '1.5rem',
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          fontFamily: 'var(--font-terminal, VT323, monospace)',
          fontSize: '1.25rem',
          lineHeight: '1.6',
          marginBottom: '1rem',
          color: '#c0c0c0',
        }}
      >
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a href={href} style={{ color: '#00ffff', textDecoration: 'underline' }}>
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: '4px solid #ff00ff',
          paddingLeft: '1rem',
          margin: '1.5rem 0',
          color: '#808080',
          borderTop: '2px solid #808080',
          borderBottom: '2px solid #fff',
          boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #c0c0c0',
        }}
      >
        {children}
      </blockquote>
    ),
    ...components,
  };
}
