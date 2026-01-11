/**
 * NEWS UTILITIES
 *
 * Feature-specific utility functions
 */

import type { NewsItem } from '../model/types';

/**
 * Format news date
 */
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get news excerpt
 */
export function getNewsExcerpt(news: NewsItem, maxLength: number = 150): string {
  const text = news.summary || news.content || '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Check if news is recent (within 24 hours)
 */
export function isRecentNews(news: NewsItem): boolean {
  const publishedAt = new Date(news.publishedAt);
  const now = new Date();
  const diff = now.getTime() - publishedAt.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours < 24;
}

/**
 * Get news category color
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    football: 'text-blue-500',
    cricket: 'text-green-500',
    basketball: 'text-orange-500',
    tennis: 'text-purple-500',
    hockey: 'text-red-500',
    featured: 'text-yellow-500',
    transfers: 'text-indigo-500',
    injuries: 'text-pink-500',
  };
  return colors[category.toLowerCase()] || 'text-gray-500';
}
