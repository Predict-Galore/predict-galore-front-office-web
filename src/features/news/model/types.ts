/**
 * NEWS MODEL TYPES
 *
 * Domain types and entities for news feature
 */

export type NewsCategory =
  | 'all'
  | 'football'
  | 'cricket'
  | 'basketball'
  | 'tennis'
  | 'hockey'
  | 'featured'
  | 'transfers'
  | 'injuries';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  sport?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isBookmarked?: boolean;
}

export interface NewsFilter {
  category?: string;
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  search?: string;
  sport?: string;
}

export interface NewsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
