import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

import './globals.css';

const manrope = Manrope({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pav Anastasiadis',
    template: '%s | Pav Anastasiadis',
  },
  description: 'Personal portfolio of Pav Anastasiadis — Data Engineer',
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
    <html lang="en" className={`h-full antialiased ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-on-surface">
        <main className="flex-1">{children}</main>
        <Navigation />
        <Footer />
      </body>
    </html>
  );
}
