'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load terms components for better performance
const TermsHero = dynamic(
  () => import('@/features/terms').then((mod) => ({ default: mod.TermsHero })),
  {
    ssr: true,
    loading: () => <div className="h-64 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />,
  }
);

const TermsContent = dynamic(
  () => import('@/features/terms').then((mod) => ({ default: mod.TermsContent })),
  {
    ssr: true,
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    ),
  }
);

/**
 * Terms Page - Displays Terms of Service content using the LandingLayout.
 */
const TermsPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div className="h-64 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />}>
        <TermsHero />
      </Suspense>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          </div>
        }
      >
        <TermsContent />
      </Suspense>
    </>
  );
};

export default TermsPage;
