'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home', testId: 'nav-home' },
  { href: '/projects', label: 'Projects', testId: 'nav-projects' },
  { href: '/blog', label: 'Blog', testId: 'nav-blog' },
  { href: '/resume', label: 'Resume', testId: 'nav-resume' },
  { href: '/contact', label: 'Contact', testId: 'nav-contact' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 py-2 flex items-center gap-1 ambient-shadow">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            data-testid={link.testId}
            className={`text-sm font-medium px-4 py-2 rounded-full relative flex flex-col items-center transition-colors ${
              isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {link.label}
            {isActive && <span className="block w-1 h-1 rounded-full bg-primary mx-auto mt-0.5" />}
          </Link>
        );
      })}
    </nav>
  );
}
