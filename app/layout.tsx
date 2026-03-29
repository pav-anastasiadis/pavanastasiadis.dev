import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';

import Footer from '@/components/Footer';
import HitCounter from '@/components/HitCounter';
import Navigation from '@/components/Navigation';
import UnderConstruction from '@/components/UnderConstruction';

import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pav Anastasiadis',
    template: '%s | Pav Anastasiadis',
  },
  description: 'Personal developer portfolio of Pav Anastasiadis — retro 90s web aesthetic',
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${pressStart2P.variable} ${vt323.variable}`}>
      <body
        className="min-h-full flex flex-col scanlines"
        style={{ backgroundColor: '#0a0a0a', color: '#c0c0c0' }}
      >
        <UnderConstruction />
        <Navigation />
        <main className="flex-1 crt-vignette">{children}</main>
        <footer style={{ backgroundColor: '#c0c0c0' }}>
          <div
            style={{
              padding: '0.5rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <HitCounter />
          </div>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
