/**
 * AUTH PAGES LOADING COMPONENT
 * 
 * This loading component will be shown for all authentication pages
 * while they are loading/rendering
 */

import { PageLoading } from '@/shared/components/ui';

export default function AuthPagesLoading() {
  return (
    <PageLoading 
      title="Predict Galore"
      message="Preparing your authentication experience..."
      variant="spinner"
      size="lg"
    />
  );
}