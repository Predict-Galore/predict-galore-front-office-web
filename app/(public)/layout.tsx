// src/app/(public)/layout.tsx

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';


// Lazy load heavy components to improve initial load time
// We keep `ssr: true` but avoid showing custom gradient placeholders;
// the route segment `app/(public)/loading.tsx` already shows a global loader.
const Header = dynamic(() => import('./components/Header'), {
  ssr: true,
  loading: () => null,
});

const Footer = dynamic(() => import('./components/Footer'), {
  ssr: true,
  loading: () => null,
});

const CTASection = dynamic(() => import('./components/CTASection'), {
  ssr: true,
  loading: () => null,
});

interface LayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      

        <main className="grow">{children}</main>

      
      <Suspense fallback={null}>
        <CTASection />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default PublicLayout;
