'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: '[ HOME ]', testId: 'nav-home' },
  { href: '/projects', label: '[ PROJECTS ]', testId: 'nav-projects' },
  { href: '/blog', label: '[ BLOG ]', testId: 'nav-blog' },
  { href: '/resume', label: '[ RESUME ]', testId: 'nav-resume' },
  { href: '/contact', label: '[ CONTACT ]', testId: 'nav-contact' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="bevel-raised"
      style={{
        backgroundColor: '#c0c0c0',
        padding: '0.5rem 1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          fontSize: '0.6rem',
          color: '#0a0a0a',
          marginRight: '1rem',
          whiteSpace: 'nowrap',
        }}
      >
        PAV.EXE
      </span>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            data-testid={link.testId}
            style={{
              fontFamily: 'var(--font-pixel, monospace)',
              fontSize: '0.5rem',
              padding: '0.375rem 0.625rem',
              textDecoration: 'none',
              color: isActive ? '#ff00ff' : '#0a0a0a',
              backgroundColor: isActive ? '#1a1a1a' : 'transparent',
              border: '2px solid',
              borderColor: isActive
                ? '#808080 #ffffff #ffffff #808080'
                : '#ffffff #808080 #808080 #ffffff',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
