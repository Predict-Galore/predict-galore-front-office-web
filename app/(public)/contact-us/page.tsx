// app/(public)/contact-us/page.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Container, Paper } from '@mui/material';

// Lazy load contact components for better performance
const ContactHero = dynamic(
  () => import('@/features/contact').then((mod) => ({ default: mod.ContactHero })),
  {
    ssr: true,
    loading: () => <div className="h-64 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />,
  }
);

const ContactForm = dynamic(
  () => import('@/features/contact').then((mod) => ({ default: mod.ContactForm })),
  {
    ssr: true,
    loading: () => (
      <div className="p-8">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    ),
  }
);

/**
 * Contact Page - Uses the PublicLayout shared by other static pages.
 */
const ContactPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Suspense fallback={<div className="h-64 bg-linear-to-b from-[#DC2626] to-[#EA580C]" />}>
        <ContactHero />
      </Suspense>

      {/* Contact Form Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '16px',
            backgroundColor: 'white',
          }}
        >
          <Suspense
            fallback={
              <div className="p-4">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/3" />
                <div className="space-y-4">
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-32 bg-gray-100 rounded" />
                </div>
              </div>
            }
          >
            <ContactForm />
          </Suspense>
        </Paper>
      </Container>
    </>
  );
};

export default ContactPage;
