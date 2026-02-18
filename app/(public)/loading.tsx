/**
 * PUBLIC PAGES LOADING COMPONENT
 * 
 * This loading component will be shown for all public pages
 * while they are loading/rendering
 */

import { PageLoading } from '@/shared/components/ui';

export default function PublicPagesLoading() {
  return (
    <PageLoading 
      title="Predict Galore"
      message="Loading your sports predictions experience..."
      variant="spinner"
      size="lg"
    />
  );
}