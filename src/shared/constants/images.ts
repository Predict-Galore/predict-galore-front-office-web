/**
 * IMAGE CONSTANTS
 * 
 * Centralized image paths for the entire application.
 * Single source of truth for all image assets.
 * 
 * Usage:
 * import { IMAGES } from '@/shared/constants/images';
 * <Image src={IMAGES.LOGO.MAIN} alt="Logo" />
 */

export const IMAGES = {
  // ==================== BRANDING ====================
  LOGO: {
    MAIN: '/predict-galore-logo.png',
    ALTERNATE: '/predict-galore-logo-2.png',
  },

  FAVICON: '/favicon.png',

  // ==================== LANDING PAGE ====================
  LANDING: {
    // Hero Section
    HERO_PHONE_MOCKUP: '/landing-page/phone-mockup-hero.png',

    // How It Works Section
    HOW_IT_WORKS_1: '/landing-page/how-it-works-1.png',
    HOW_IT_WORKS_2: '/landing-page/how-it-works-2.png',
    HOW_IT_WORKS_3: '/landing-page/how-it-works-3.png',

    // Arrows
    CURVED_ARROW: '/landing-page/curved-arrow.png',
    VERTICAL_ARROW: '/landing-page/vertical-arrow.png',

    // Features Section
    FEATURE_INSIGHTS: '/landing-page/feature-insights.png',
    FEATURE_LIVE: '/landing-page/feature-live.png',
    FEATURE_HUB: '/landing-page/feature-hub.png',
    FEATURE_FEED: '/landing-page/feature-feed.png',

    // CTA Section
    DOUBLE_PHONE_MOCKUP: '/landing-page/double-phone-mockup.png',
  },

  // ==================== AUTH ====================
  AUTH: {
    BACKGROUND: '/auth/auth-bg.jpg',
  },

  // ==================== PLACEHOLDERS ====================
  PLACEHOLDERS: {
    PLAYER_AVATAR: '/placeholders/player-avatar.svg',
    LEAGUE_LOGO: '/placeholders/league-logo.svg',
    NEWS_ARTICLE: '/placeholders/news-placeholder.svg',
  },

  // ==================== LEAGUES ====================
  LEAGUES: {
    PREMIER_LEAGUE: '/leagues/premier-league.svg',
    LA_LIGA: '/leagues/la-liga.svg',
    SERIE_A: '/leagues/serie-a.svg',
    BUNDESLIGA: '/leagues/bundesliga.svg',
    CHAMPIONS_LEAGUE: '/leagues/champions-league.svg',
  },

  // ==================== DOCUMENTS ====================
  DOCS: {
    ABOUT_US: '/docs/predict-galore-about-us.pdf',
    COOKIE_POLICY: '/docs/predict-galore-cookie-policy.pdf',
    PRIVACY_POLICY: '/docs/predict-galore-privacy-policy.pdf',
    TERMS_OF_USE: '/docs/predict-galore-terms-of-use.pdf',
  },
} as const;

// Type helper for image paths
export type ImagePath = typeof IMAGES;

// Helper function to get image path with fallback
export const getImagePath = (path: string, fallback?: string): string => {
  return path || fallback || IMAGES.PLACEHOLDERS.PLAYER_AVATAR;
};

// Export individual sections for convenience
export const { LOGO, LANDING, AUTH, PLACEHOLDERS, LEAGUES, DOCS } = IMAGES;
