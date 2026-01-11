'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load hero and below-the-fold content for better performance
const HeroSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.HeroSection })),
  {
    ssr: true,
    loading: () => <div className="h-72 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />,
  }
);

const FeaturesSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.FeaturesSection })),
  {
    ssr: true, // Keep SSR for SEO
    loading: () => (
      <div className="min-h-[400px] bg-neutral-50 border border-neutral-200/60 rounded-2xl mx-4 md:mx-8" />
    ),
  }
);

const HowItWorks = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.HowItWorks })),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] bg-linear-to-b from-[#DC2626] to-[#EA580C] opacity-80" />
    ),
  }
);

const FAQSection = dynamic(
  () => import('@/features/landing').then((mod) => ({ default: mod.FAQSection })),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[320px] bg-neutral-50 border border-dashed border-neutral-200/80 rounded-2xl mx-4 md:mx-8" />
    ),
  }
);

/**
 * Landing Page — combines all sections using the LandingLayout.
 */
const LandingPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div className="h-72 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <FAQSection />
      </Suspense>
    </>
  );
};

export default LandingPage;
