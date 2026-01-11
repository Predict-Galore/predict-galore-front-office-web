import type { GetNewsRequest } from '../api/types';
import type { NewsItem, NewsPagination } from '../model/types';

const now = new Date();

const makeNews = (
  id: number,
  title: string,
  category: string,
  sport: string,
  isFeatured = false,
  isBreaking = false
): NewsItem => ({
  id,
  title,
  category,
  sport,
  content: `${title} - detailed analysis and insights for fans.`,
  summary: `${title} summary.`,
  author: 'Predict Galore Desk',
  publishedAt: new Date(now.getTime() - id * 60 * 60 * 1000).toISOString(),
  updatedAt: now.toISOString(),
  imageUrl:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  tags: [sport, category],
  viewCount: 1200 + id,
  likeCount: 200 + id,
  isFeatured,
  isBreaking,
});

export const mockNewsItems: NewsItem[] = [
  makeNews(1, 'Premier League title race heats up', 'football', 'soccer', true, true),
  makeNews(2, 'La Liga derby preview: tactics to watch', 'football', 'soccer', true),
  makeNews(3, 'NBA mid-season power rankings', 'basketball', 'basketball'),
  makeNews(4, 'Tennis grand slam upsets continue', 'tennis', 'tennis'),
  makeNews(5, 'Transfer window: top five rumours', 'transfers', 'soccer', true),
  makeNews(6, 'Injury report: key stars sidelined', 'injuries', 'soccer'),
  makeNews(7, 'Champions League knockout bracket set', 'football', 'soccer', true),
  makeNews(8, 'WNBA finals storylines', 'basketball', 'basketball'),
];

export const getMockNews = (
  filters: GetNewsRequest = {}
): { items: NewsItem[]; pagination: NewsPagination } => {
  const filtered = mockNewsItems.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.sport && item.sport !== filters.sport) return false;
    if (filters.isFeatured && !item.isFeatured) return false;
    if (filters.isBreaking && !item.isBreaking) return false;
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    return true;
  });

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    },
  };
};
