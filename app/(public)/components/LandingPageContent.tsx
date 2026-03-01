'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.HeroSection })),
  {
    ssr: true,
    loading: () => null,
  }
);

const FeaturesSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.FeaturesSection })),
  {
    ssr: true,
    loading: () => null,
  }
);

const HowItWorks = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.HowItWorks })),
  {
    ssr: true,
    loading: () => null,
  }
);

const FAQSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.FAQSection })),
  {
    ssr: true,
    loading: () => null,
  }
);

const LandingPageContent: React.FC = () => {
  return (
    <>
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={null}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={null}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>
    </>
  );
};

export default LandingPageContent;
