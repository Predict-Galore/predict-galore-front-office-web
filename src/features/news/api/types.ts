/**
 * NEWS API TYPES
 *
 * API-specific types for news feature
 */

import type { NewsFilter } from '../model/types';

// ==================== API REQUEST TYPES ====================
export interface GetNewsRequest extends NewsFilter {
  category?: string;
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  search?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface NewsResponse {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  sport?: string;
  author?: string;
  source?: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface NewsListResponse {
  success: boolean;
  message: string;
  errors: string | null;
  data: NewsResponse[] | {
    items: NewsResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface NewsDetailResponse {
  success: boolean;
  message: string;
  errors: string | null;
  data: NewsResponse;
}
