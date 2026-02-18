/**
 * Match Detail Page
 * Shows detailed prediction information for a specific match
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MatchHeader,
  OverviewTab,
  PredictionsTab,
  TableTab,
} from '@/features/predictions/components';
import { usePredictionById } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import { DashboardNewsSidebar } from '@/shared/components/shared';
import type { NewsItem } from '@/features/news/model/types';

type TabType = 'overview' | 'predictions' | 'table';

const MatchDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.matchId ? Number(params.matchId) : null;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    data: matchData,
    isLoading: matchLoading,
    error: matchError,
  } = usePredictionById(matchId, { enabled: !!matchId });

  const leagueId = matchData?.prediction?.leagueId;

  const {
    featuredNews = [],
    isLoading: isFeaturedNewsLoading,
  } = useFeaturedNews(1);
  const {
    data: newsData,
    isLoading: isNewsLoading,
  } = useNews({ pageSize: 6 });

  const handleBack = () => {
    router.push('/dashboard/predictions');
  };

  if (!matchId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Match not found</h2>
          <p className="text-gray-500">Invalid match ID</p>
        </div>
      </div>
    );
  }

  const sidebarNewsItems: NewsItem[] =
    (newsData as { items: NewsItem[] } | undefined)?.items ?? [];

  // Unified loading: wait for match + news before rendering
  const pageLoading = matchLoading || isNewsLoading || isFeaturedNewsLoading;
  if (pageLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
        {/* Top bar skeleton */}
        <div className="w-full flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-8 py-4 max-w-360 w-full mx-auto">
          {/* Main content skeleton */}
          <div className="flex-1 min-w-0">
            {/* Match header skeleton */}
            <div className="bg-white rounded-2xl shadow p-4 mb-4">
              <div className="w-full bg-gray-200 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
                <div className="animate-pulse p-4">
                  <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    </div>
                  </div>
                  <div className="w-32 h-6 bg-gray-300 rounded mb-6" />
                  <div className="flex justify-center items-center gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
                      <div className="w-20 h-4 bg-gray-300 rounded" />
                    </div>
                    <div className="w-24 h-12 bg-gray-300 rounded" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
                      <div className="w-20 h-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-300 rounded" />
                    <div className="flex-1 h-10 bg-gray-300 rounded" />
                    <div className="flex-1 h-10 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                    <div className="w-40 h-6 bg-gray-200 rounded mb-3" />
                    <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="hidden md:block w-87.5 shrink-0">
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-3 animate-pulse">
                  <div className="w-full h-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const effectiveMatch = matchData;
  
  if (matchError && !effectiveMatch) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Error loading match</h2>
          <p className="text-gray-500">{matchError?.message || 'Failed to load match details'}</p>
          <button className="mt-4 px-4 py-2 bg-[#e11d48] text-white rounded" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Ensure prediction has required data
  const prediction = effectiveMatch?.prediction;
  if (!prediction) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Match data unavailable</h2>
          <p className="text-gray-500">Unable to load prediction details for this match.</p>
          <button className="mt-4 px-4 py-2 bg-[#e11d48] text-white rounded" onClick={handleBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top bar: back, share, notification, profile */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="rounded-full p-2 hover:bg-gray-100">
            <span className="material-icons">arrow_back</span>
          </button>
          <span className="text-lg font-bold text-[#1e7c1e]">Match Details</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-icons text-gray-400">share</span>
          <span className="material-icons text-gray-400">notifications</span>
          <span className="material-icons text-gray-400">account_circle</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-8 py-4 max-w-360 w-full mx-auto">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow p-0 md:p-4 mb-4">
            <MatchHeader
              prediction={prediction}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBack={handleBack}
            />
          </div>

          <div className={activeTab === 'table' ? '' : 'bg-white rounded-2xl shadow p-0 md:p-4'}>
            {activeTab === 'overview' && (
              <OverviewTab
                prediction={prediction}
                detailed={effectiveMatch.detailed}
              />
            )}

            {activeTab === 'predictions' && (
              <PredictionsTab
                picks={effectiveMatch.picks as Array<Record<string, unknown>>}
                isLoading={matchLoading}
              />
            )}

            {activeTab === 'table' && (
              <TableTab leagueId={leagueId} />
            )}
          </div>
        </div>
        {/* Sidebar: News (desktop only) */}
        <aside className="hidden md:block w-87.5 shrink-0">
          <DashboardNewsSidebar
            topNews={featuredNews}
            laligaNews={sidebarNewsItems}
            isLoading={isNewsLoading || isFeaturedNewsLoading}
          />
        </aside>
      </div>

      {/* Bottom navigation (mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex md:hidden z-30">
        <button className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-[#e11d48]">
          <span className="material-icons">home</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-[#1e7c1e] font-semibold">
          <span className="material-icons">bar_chart</span>
          <span className="text-xs">Predictions</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-[#e11d48]">
          <span className="material-icons">emoji_events</span>
          <span className="text-xs">Live Matches</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-[#e11d48]">
          <span className="material-icons">article</span>
          <span className="text-xs">News</span>
        </button>
      </nav>
    </div>
  );
};

export default MatchDetailPage;
