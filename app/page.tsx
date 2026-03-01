import { Suspense } from 'react';
import PublicLayout from './(public)/layout';
import LandingPageContent from './(public)/components/LandingPageContent';

export const dynamic = 'force-dynamic';

export default function RootPage() {
  return (
    <Suspense fallback={null}>
      <PublicLayout>
        <LandingPageContent />
      </PublicLayout>
    </Suspense>
  );
}
