# Predictions Core System

## Overview
Complete predictions system for sports match outcomes, player performance, and league results.

## Features
- Match prediction interface
- League and tournament browsing
- Player statistics and insights
- Premium subscription features
- Prediction accuracy tracking
- Real-time match updates

## Architecture
- **API Layer**: `api/` - Predictions endpoints and data fetching
- **Components**: `components/` - Prediction UI components
- **Model**: `model/` - Prediction state and types
- **Lib**: `lib/` - Utilities, constants, transformers

## Components

### MatchCard
- Location: `components/MatchCard.tsx`
- Features: Match display, prediction interface, odds display
- Props: match data, prediction handlers, premium status

### MatchHeader
- Location: `components/MatchHeader.tsx`
- Features: Match details, teams, date/time, venue info
- Integration: League and tournament context

### LeagueSelector
- Location: `components/LeagueSelector.tsx`
- Features: League filtering, dropdown selection
- State management: Selected league persistence

### PredictionsSection
- Location: `components/PredictionsSection.tsx`
- Features: Match list with predictions, filtering, sorting
- Performance: Virtualized rendering for large lists

### SelectedPredictionView
- Location: `components/SelectedPredictionView.tsx`
- Features: Detailed prediction interface, expert analysis
- Advanced: Complex prediction logic and statistics

### PredictionsTab
- Location: `components/PredictionsTab.tsx`
- Features: Tabbed interface for different prediction types
- Organization: Match, player, league predictions

### Premium Components
- **PremiumSubscriptionModal**: Subscription prompts
- **MatchListSkeleton**: Loading states
- **Prediction accuracy tracking**

## Pages
- `/dashboard/predictions` - Main predictions list
- `/dashboard/predictions/[matchId]` - Individual match predictions

## API Integration
- Match data endpoints
- Prediction submission
- League and tournament data
- Player statistics
- Premium feature access
- Prediction history and analytics

## Prediction Types
- **Match Outcomes**: Win/Loss/Draw predictions
- **Player Performance**: Goals, assists, cards
- **Over/Under**: Statistical predictions
- **League Standings**: Final positions
- **Tournament Winners**: Competition outcomes

## State Management
Uses Zustand stores for:
- Prediction selections
- League filtering
- Premium status
- Match data caching
- Prediction history

## Business Logic
- Premium feature gating
- Prediction accuracy calculations
- Odds and probability modeling
- Risk assessment
- User engagement metrics

## Usage
```tsx
import { MatchCard } from '@/features/predictions/components/MatchCard';
import { usePredictionsStore } from '@/features/predictions/model/store';

// Basic match card
<MatchCard
  match={matchData}
  onPrediction={handlePrediction}
  isPremium={user.isPremium}
/>

// League selector
<LeagueSelector
  leagues={leagues}
  selectedLeague={selected}
  onSelectLeague={setSelected}
/>
```

## Data Flow
1. User selects league/tournament
2. Matches loaded and displayed
3. User makes predictions
4. Predictions submitted to API
5. Results tracked and displayed
6. Premium features unlocked

## Performance Features
- Virtualized match lists
- Lazy loading of predictions
- Optimized re-renders
- Caching strategies
- Progressive loading

## Analytics & Insights
- Prediction accuracy tracking
- User performance metrics
- League and player statistics
- Trend analysis
- Recommendation engine
