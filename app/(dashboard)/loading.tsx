/**
 * DASHBOARD PAGES LOADING COMPONENT
 * 
 * This loading component will be shown for all dashboard pages
 * while they are loading/rendering
 */

import { PageLoading } from '@/shared/components/ui';

export default function DashboardPagesLoading() {
  return (
    <PageLoading 
      title="Dashboard"
      message="Loading your personalized dashboard..."
      variant="spinner"
      size="lg"
    />
  );
}