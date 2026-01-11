# Performance Optimizations

This document outlines the performance optimizations implemented in the Predict Galore frontend
application.

## 1. React Query Configuration

### Optimizations Applied:

- **Increased staleTime**: 5 minutes (from 1 minute) - Reduces unnecessary refetches
- **Increased gcTime**: 30 minutes (from 5 minutes) - Keeps data in cache longer
- **Disabled refetchOnWindowFocus**: Reduces API calls when user switches tabs
- **PlaceholderData**: Uses stale data while refetching for better UX
- **Reduced retries**: Fail fast with only 1 retry

### Benefits:

- Fewer API calls
- Faster page loads (uses cached data)
- Better user experience with instant data display

## 2. Code Splitting

### Dynamic Imports:

- **Heavy Components**: Modals, Charts, News Panel, Sidebar
- **Below-the-fold Content**: Features sections, FAQ, How It Works
- **Development Tools**: React Query DevTools (only in dev mode)

### Components Lazy Loaded:

1. `PremiumModal` - Subscription modals
2. `DashboardNewsSidebar` - News sidebar component
3. `NewsPanel` - News panel component
4. `Banner` - Dashboard banner
5. `FeaturesSection` - Landing page features
6. `HowItWorks` - Landing page how it works section
7. `FAQSection` - Landing page FAQ section
8. `ReactQueryDevtools` - Development tools

### Benefits:

- Smaller initial bundle size
- Faster Time to Interactive (TTI)
- Improved First Contentful Paint (FCP)

## 3. Next.js Configuration

### Optimizations Applied:

#### Image Optimization:

- Modern formats: AVIF and WebP
- Optimized device sizes: [640, 750, 828, 1080, 1200, 1920]
- Optimized image sizes: [16, 32, 48, 64, 96, 128, 256, 384]
- Minimum cache TTL: 60 seconds
- SVG support with security policies

#### Package Optimization:

- `optimizePackageImports`: Tree-shakes unused exports from:
  - @mui/material
  - @mui/icons-material
  - lucide-react
  - react-icons
  - dayjs
  - framer-motion

#### Compiler Options:

- Remove console logs in production (except error/warn)
- SWC minification (faster than Terser)
- Optimized CSS
- Production source maps disabled
- Optimized font loading

### Benefits:

- Smaller bundle sizes
- Faster compilation
- Better runtime performance

## 4. Caching Strategies

### HTTP Cache Headers:

#### Static Assets:

```
Cache-Control: public, max-age=31536000, immutable
```

- Next.js static files (\_next/static)
- Never expire (immutable)

#### Images:

```
Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

- 1 day cache
- 7 days stale-while-revalidate

#### API Routes:

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

- 60 seconds server cache
- 5 minutes stale-while-revalidate

### Security Headers:

- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Benefits:

- Reduced server load
- Faster page loads
- Better user experience

## 5. Bundle Size Optimization

### Strategies:

1. **Tree Shaking**: Removed unused code through specific imports
2. **Code Splitting**: Dynamic imports for heavy components
3. **Package Optimization**: optimizePackageImports for MUI and other libraries
4. **Minification**: SWC minifier for faster builds
5. **Source Maps**: Disabled in production

### Bundle Analysis:

Run bundle analyzer:

```bash
ANALYZE=true npm run build
```

## 6. Image Optimization

### Best Practices:

- Always use Next.js `Image` component
- Specify `sizes` prop for responsive images
- Use `priority` for above-the-fold images
- Use `loading="lazy"` for below-the-fold images (default)
- Optimize image formats (AVIF > WebP > JPEG/PNG)

### Example:

```tsx
<Image
  src={imageUrl}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
/>
```

## 7. Performance Monitoring

### Metrics to Track:

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Tools:

- Next.js Bundle Analyzer
- Lighthouse
- React DevTools Profiler
- Web Vitals

## 8. Future Optimizations

### Potential Improvements:

1. **Server Components**: Migrate more components to Server Components (Next.js 15)
2. **Streaming SSR**: Use Suspense boundaries for streaming
3. **Incremental Static Regeneration (ISR)**: For static pages
4. **Service Worker**: Add offline support and caching
5. **Prefetching**: Prefetch links on hover
6. **Resource Hints**: Add DNS prefetch and preconnect

## 9. Performance Checklist

- [x] React Query caching optimized
- [x] Code splitting implemented
- [x] Image optimization configured
- [x] Bundle size optimization
- [x] HTTP cache headers
- [x] MUI imports optimized
- [x] Console logs removed in production
- [x] Source maps disabled in production
- [ ] All images use Next.js Image component
- [ ] Bundle size < 250KB (first load)
- [ ] Lighthouse score > 90
