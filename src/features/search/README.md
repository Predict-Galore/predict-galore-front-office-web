# Search & Discovery System

## Overview
Complete search and discovery system for finding players, teams, leagues, and sports content.

## Features
- Real-time search with debouncing
- Advanced filtering and sorting
- Popular items suggestions
- Search results display
- No results handling
- Search history and suggestions

## Architecture
- **API Layer**: `api/` - Search endpoints and data fetching
- **Components**: `components/` - Search UI components
- **Model**: `model/` - Search state and types
- **Store**: Zustand store for search state management

## Components

### SearchBar
- Location: `components/SearchBar.tsx`
- Features: Input field, search icon, clear functionality
- Props: placeholder, variant, onSearch callback

### SearchFilters
- Location: `components/SearchFilters.tsx`
- Features: Category filters, active state management
- Types: players, teams, leagues, all

### SearchResults
- Location: `components/SearchResults.tsx`
- Features: Results display, loading states, error handling
- Integration: Virtualized list for performance

### NoResults
- Location: `components/NoResults.tsx`
- Features: Empty state display, user guidance
- Responsive design with emoji and messaging

### PopularSection
- Location: `components/PopularSection.tsx`
- Features: Trending items, location-based suggestions
- Dynamic content based on user location

### SearchModal
- Location: `components/SearchModal.tsx`
- Features: Full-screen search interface, mobile optimized
- Overlay functionality with backdrop

## API Integration
- Search endpoint with query parameters
- Popular items endpoint
- Real-time search with debouncing
- Error handling and retry logic

## State Management
Uses Zustand store for:
- Search query state
- Filter selections
- Search results
- Loading states
- Error states
- Search history

## Performance Features
- Debounced search (300ms delay)
- Virtualized results list
- Lazy loading of popular items
- Optimized re-renders
- Memory efficient state management

## Usage
```tsx
import { SearchBar } from '@/features/search/components/SearchBar';
import { useSearchStore } from '@/features/search/model/store';

// Basic usage
<SearchBar placeholder="Search for players, teams..." />

// Advanced usage with custom handler
<SearchBar
  onSearch={(query) => console.log('Searching:', query)}
  variant="header"
/>
```

## Search Flow
1. User types in SearchBar
2. Debounced API call triggers
3. Results displayed in SearchResults
4. Filters applied via SearchFilters
5. Popular items shown when no query
6. NoResults shown when no matches found
