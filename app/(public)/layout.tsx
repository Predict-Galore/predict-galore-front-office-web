// src/app/(public)/layout.tsx
'use client';

import React, { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components to improve initial load time
const Header = dynamic(() => import('./components/Header'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white" />, // Placeholder for header
});

const Footer = dynamic(() => import('./components/Footer'), {
  ssr: true,
  loading: () => <div className="h-64 bg-[#991b1b]" />, // Placeholder for footer
});

const CTASection = dynamic(() => import('./components/CTASection'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#166534]" />, // Placeholder for CTA
});

interface LayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 bg-white" />}>
        <Header />
      </Suspense>
      <main className="grow">{children}</main>
      <Suspense fallback={<div className="h-96 bg-[#166534]" />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-[#991b1b]" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default PublicLayout;
