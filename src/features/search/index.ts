/**
 * SEARCH FEATURE - Public API
 *
 * Public exports for the search feature
 */

// API
export * from './api';

// Model
export { useSearchStore } from './model/store';
export type * from './model/types';

// Components
export {
  SearchBar,
  SearchFilters,
  SearchResults,
  SearchModal,
  PopularSection,
  NoResults,
} from './components';
