/**
 * NEWS ENTITY - Domain Model
 * 
 * Core news business entity for sports news and articles
 */

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  excerpt: string;
  author: Author;
  source: NewsSource;
  category: NewsCategory;
  tags: string[];
  sport?: Sport;
  competition?: Competition;
  teams?: Team[];
  players?: Player[];
  publishedAt: string;
  updatedAt: string;
  status: ArticleStatus;
  priority: ArticlePriority;
  featured: boolean;
  trending: boolean;
  breaking: boolean;
  media: MediaContent[];
  seo: SEOMetadata;
  engagement: EngagementMetrics;
  localization: LocalizationInfo;
  metadata: ArticleMetadata;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  email?: string;
  social?: SocialLinks;
  expertise: string[];
  verified: boolean;
  stats: AuthorStats;
}

export interface AuthorStats {
  articlesPublished: number;
  totalViews: number;
  averageRating: number;
  followers: number;
  joinedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  description?: string;
  country?: string;
  language: string;
  credibility: number; // 1-10 scale
  type: SourceType;
  rssUrl?: string;
  isActive: boolean;
  lastCrawled?: string;
}

export type SourceType = 
  | 'official'      // Official team/league sources
  | 'mainstream'    // Major news outlets
  | 'sports_media'  // Sports-specific media
  | 'blog'          // Sports blogs
  | 'social'        // Social media
  | 'wire'          // News wire services
  | 'aggregator';   // News aggregators

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  parent?: string;
  order: number;
  isActive: boolean;
}

export type ArticleStatus = 
  | 'draft'
  | 'published'
  | 'updated'
  | 'archived'
  | 'deleted';

export type ArticlePriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent'
  | 'breaking';

export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  sport: Sport;
  country?: string;
  logo?: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  logo?: string;
  sport: Sport;
  country?: string;
}

export interface Player {
  id: string;
  name: string;
  slug: string;
  position?: string;
  team?: Team;
  nationality?: string;
  photo?: string;
  dateOfBirth?: string;
}

export interface MediaContent {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  credits?: string;
  width?: number;
  height?: number;
  duration?: number; // For videos
  size?: number; // File size in bytes
  mimeType?: string;
  isMain: boolean;
  order: number;
}

export type MediaType = 
  | 'image'
  | 'video'
  | 'audio'
  | 'gallery'
  | 'infographic'
  | 'embed';

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: unknown;
}

export interface EngagementMetrics {
  views: number;
  uniqueViews: number;
  shares: number;
  likes: number;
  comments: number;
  readTime: number; // Average read time in seconds
  bounceRate: number;
  clickThroughRate: number;
  socialShares: SocialShareMetrics;
  trending: TrendingMetrics;
}

export interface SocialShareMetrics {
  facebook: number;
  twitter: number;
  linkedin: number;
  whatsapp: number;
  telegram: number;
  reddit: number;
  total: number;
}

export interface TrendingMetrics {
  score: number; // Trending score
  velocity: number; // Rate of engagement increase
  peakTime?: string;
  trendingDuration: number; // Minutes
}

export interface LocalizationInfo {
  originalLanguage: string;
  availableLanguages: string[];
  translations?: Record<string, TranslationInfo>;
  region?: string;
  timezone?: string;
}

export interface TranslationInfo {
  title: string;
  summary: string;
  content?: string;
  translatedBy: 'human' | 'ai' | 'hybrid';
  quality: number; // 1-10 scale
  lastUpdated: string;
}

export interface ArticleMetadata {
  wordCount: number;
  readingTime: number; // Estimated reading time in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  factChecked: boolean;
  lastFactCheck?: string;
  sources: string[];
  relatedArticles: string[];
  series?: string;
  episodeNumber?: number;
  sponsored: boolean;
  advertiser?: string;
  contentWarnings: string[];
  ageRating?: string;
  region: string;
  crawledAt?: string;
  originalUrl?: string;
}

// News search and filtering
export interface NewsSearchParams {
  query?: string;
  categoryId?: string;
  sportId?: string;
  competitionId?: string;
  teamId?: string;
  playerId?: string;
  authorId?: string;
  sourceId?: string;
  tags?: string[];
  status?: ArticleStatus;
  priority?: ArticlePriority;
  featured?: boolean;
  trending?: boolean;
  breaking?: boolean;
  language?: string;
  region?: string;
  dateFrom?: string;
  dateTo?: string;
  minViews?: number;
  hasMedia?: boolean;
  mediaType?: MediaType;
  sortBy?: 'publishedAt' | 'views' | 'engagement' | 'trending' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface NewsSearchResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets: NewsFacets;
  trending: NewsArticle[];
  breaking: NewsArticle[];
  featured: NewsArticle[];
}

export interface NewsFacets {
  categories: Array<{ id: string; name: string; count: number }>;
  sports: Array<{ id: string; name: string; count: number }>;
  competitions: Array<{ id: string; name: string; count: number }>;
  teams: Array<{ id: string; name: string; count: number }>;
  authors: Array<{ id: string; name: string; count: number }>;
  sources: Array<{ id: string; name: string; count: number }>;
  tags: Array<{ tag: string; count: number }>;
  languages: Array<{ language: string; count: number }>;
}

// News feed and personalization
export interface NewsFeed {
  userId?: string;
  articles: NewsArticle[];
  personalized: boolean;
  algorithm: string;
  generatedAt: string;
  preferences: FeedPreferences;
  sections: FeedSection[];
}

export interface FeedPreferences {
  sports: string[];
  competitions: string[];
  teams: string[];
  players: string[];
  categories: string[];
  authors: string[];
  sources: string[];
  languages: string[];
  regions: string[];
  excludeTopics: string[];
  contentTypes: MediaType[];
  maxArticlesPerSource: number;
  freshness: 'latest' | 'trending' | 'mixed';
  diversity: number; // 1-10 scale
}

export interface FeedSection {
  id: string;
  title: string;
  type: SectionType;
  articles: NewsArticle[];
  order: number;
  customizable: boolean;
  collapsible: boolean;
}

export type SectionType = 
  | 'breaking'
  | 'trending'
  | 'featured'
  | 'personalized'
  | 'category'
  | 'sport'
  | 'team'
  | 'latest'
  | 'popular'
  | 'recommended';

// News analytics and insights
export interface NewsAnalytics {
  period: AnalyticsPeriod;
  totalArticles: number;
  totalViews: number;
  totalEngagement: number;
  topArticles: NewsArticle[];
  topCategories: CategoryStats[];
  topSports: SportStats[];
  topAuthors: AuthorStats[];
  topSources: SourceStats[];
  trendingTopics: TrendingTopic[];
  engagement: EngagementAnalytics;
  audience: AudienceAnalytics;
}

export interface AnalyticsPeriod {
  start: string;
  end: string;
  type: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface CategoryStats {
  category: NewsCategory;
  articles: number;
  views: number;
  engagement: number;
  growth: number; // Percentage change
}

export interface SportStats {
  sport: Sport;
  articles: number;
  views: number;
  engagement: number;
  topTeams: Team[];
}

export interface SourceStats {
  source: NewsSource;
  articles: number;
  views: number;
  engagement: number;
  reliability: number;
}

export interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number; // -1 to 1
  growth: number;
  relatedArticles: string[];
  peakTime: string;
}

export interface EngagementAnalytics {
  averageReadTime: number;
  bounceRate: number;
  shareRate: number;
  commentRate: number;
  returnVisitorRate: number;
  engagementByHour: HourlyEngagement[];
  engagementByDevice: DeviceEngagement[];
}

export interface HourlyEngagement {
  hour: number;
  views: number;
  engagement: number;
}

export interface DeviceEngagement {
  device: 'desktop' | 'mobile' | 'tablet';
  views: number;
  engagement: number;
  averageReadTime: number;
}

export interface AudienceAnalytics {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  demographics: Demographics;
  interests: Interest[];
  behavior: BehaviorMetrics;
}

export interface Demographics {
  ageGroups: AgeGroup[];
  genders: GenderDistribution[];
  locations: LocationDistribution[];
  languages: LanguageDistribution[];
}

export interface AgeGroup {
  range: string;
  percentage: number;
  engagement: number;
}

export interface GenderDistribution {
  gender: string;
  percentage: number;
  engagement: number;
}

export interface LocationDistribution {
  country: string;
  percentage: number;
  engagement: number;
}

export interface LanguageDistribution {
  language: string;
  percentage: number;
  engagement: number;
}

export interface Interest {
  topic: string;
  affinity: number; // 1-10 scale
  articles: number;
}

export interface BehaviorMetrics {
  averageSessionDuration: number;
  pagesPerSession: number;
  sessionsByTimeOfDay: HourlyEngagement[];
  devicePreferences: DeviceEngagement[];
  contentPreferences: ContentPreference[];
}

export interface ContentPreference {
  type: string;
  preference: number; // 1-10 scale
  engagement: number;
}

// News creation and management
export interface CreateArticleRequest {
  title: string;
  slug?: string;
  summary: string;
  content?: string;
  excerpt: string;
  authorId: string;
  sourceId: string;
  categoryId: string;
  tags: string[];
  sportId?: string;
  competitionId?: string;
  teamIds?: string[];
  playerIds?: string[];
  priority: ArticlePriority;
  featured?: boolean;
  breaking?: boolean;
  media?: CreateMediaRequest[];
  seo?: Partial<SEOMetadata>;
  publishedAt?: string;
  metadata?: Partial<ArticleMetadata>;
}

export interface CreateMediaRequest {
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  credits?: string;
  isMain?: boolean;
  order?: number;
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  excerpt?: string;
  categoryId?: string;
  tags?: string[];
  sportId?: string;
  competitionId?: string;
  teamIds?: string[];
  playerIds?: string[];
  priority?: ArticlePriority;
  featured?: boolean;
  breaking?: boolean;
  status?: ArticleStatus;
  media?: CreateMediaRequest[];
  seo?: Partial<SEOMetadata>;
  metadata?: Partial<ArticleMetadata>;
}
