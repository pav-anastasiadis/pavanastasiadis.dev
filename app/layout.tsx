import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';

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
  title: 'Pav Anastasiadis',
  description: 'Personal website of Pav Anastasiadis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${pressStart2P.variable} ${vt323.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
