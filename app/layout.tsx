// app/layout.tsx
/**
 * ROOT LAYOUT
 *
 * Main application layout that wraps all pages.
 * Sets up global providers, metadata, and base structure.
 */
import type { Metadata, Viewport } from 'next';
import Providers from '../src/providers/index';

import './globals.css';

export const metadata: Metadata = {
  title: 'Predict Galore - Sports Analytics Platform',
  description: 'Advanced sports prediction and analytics platform',
  keywords: ['sports', 'predictions', 'analytics', 'betting', 'statistics'],
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
