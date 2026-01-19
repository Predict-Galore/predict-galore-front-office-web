/**
 * NEWS TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { NewsItem, NewsPagination } from '../model/types';
import type { NewsResponse, NewsListResponse } from '../api/types';

export class NewsTransformer {
  /**
   * Transform API response to domain model
   */
  static transformNewsResponse(response: NewsResponse): NewsItem {
    return {
      id: response.id,
      title: response.title,
      content: response.content,
      summary: response.summary,
      category: response.category,
      sport: response.sport,
      author: response.author,
      publishedAt: response.publishedAt,
      updatedAt: response.updatedAt,
      imageUrl: response.imageUrl,
      thumbnailUrl: response.thumbnailUrl,
      tags: response.tags,
      viewCount: response.viewCount,
      likeCount: response.likeCount,
      isFeatured: response.isFeatured,
      isBreaking: response.isBreaking,
    };
  }

  /**
   * Transform news list response
   */
  static transformNewsListResponse(response: NewsListResponse): {
    items: NewsItem[];
    pagination: NewsPagination;
  } {
    if (!response.success || !response.data || !response.data.items) {
      return {
        items: [],
        pagination: {
          page: response.data?.page || 1,
          pageSize: response.data?.pageSize || 10,
          total: response.data?.total || 0,
          totalPages: response.data?.totalPages || 0,
        },
      };
    }

    // Ensure items is an array
    const items = Array.isArray(response.data.items) ? response.data.items : [];

    return {
      items: items.map(this.transformNewsResponse),
      pagination: {
        page: response.data.page || 1,
        pageSize: response.data.pageSize || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      },
    };
  }

  /**
   * Build query parameters
   */
  static buildQueryParams(filters: {
    category?: string;
    page?: number;
    pageSize?: number;
    isFeatured?: boolean;
    isBreaking?: boolean;
    search?: string;
    sport?: string;
  }): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.category) params.category = filters.category;
    if (filters.isFeatured !== undefined) params.isFeatured = String(filters.isFeatured);
    if (filters.isBreaking !== undefined) params.isBreaking = String(filters.isBreaking);
    if (filters.search) params.search = filters.search;
    if (filters.sport) params.sport = filters.sport;

    return params;
  }
}
