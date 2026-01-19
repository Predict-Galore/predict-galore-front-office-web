// app/layout.tsx
/**
 * ROOT LAYOUT
 *
 * Main application layout that wraps all pages.
 * Sets up global providers, metadata, and base structure.
 */
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/providers';
// import { AuthProvider } from '../providers/AuthProvider';

import './globals.css';

// Configure Inter font with explicit options - only load weights we actually use
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Add display swap for better loading
  weight: ['400', '500', '600', '700'], // Only load weights we use
  variable: '--font-inter',
  preload: true, // Explicitly enable preload
  adjustFontFallback: true, // Better font fallback
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts domain */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
