// app/layout.tsx
/**
 * ROOT LAYOUT
 *
 * Main application layout that wraps all pages.
 * Sets up global providers, metadata, and base structure.
 */
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from '../src/providers/index';

import './globals.css';

// Configure Inter font - Next.js requires this to be a const at module scope
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

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
      <head>
        {/* DNS prefetch and preconnect for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
