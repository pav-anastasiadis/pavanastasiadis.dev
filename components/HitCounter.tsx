'use client';

import { useEffect, useState } from 'react';

const FAKE_COUNT = 42069;

export default function HitCounter() {
  const [count, setCount] = useState(FAKE_COUNT);

  useEffect(() => {
    // Cosmetic: increment by random small amount on mount
    setCount(FAKE_COUNT + Math.floor(Math.random() * 100));
  }, []);

  return (
    <div
      data-testid="hit-counter"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#0a0a0a',
        border: '2px solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        padding: '0.25rem 0.5rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-terminal, monospace)',
          fontSize: '0.875rem',
          color: '#808080',
        }}
      >
        VISITORS:
      </span>
      <span
        style={{
          fontFamily: 'var(--font-terminal, monospace)',
          fontSize: '1.25rem',
          color: '#00ff00',
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
          letterSpacing: '0.1em',
        }}
      >
        {count.toString().padStart(7, '0')}
      </span>
    </div>
  );
}
