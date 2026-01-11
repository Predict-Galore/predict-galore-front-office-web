/**
 * DATA SOURCE SWITCH
 *
 * Central toggle to flip between backend APIs and mock data.
 * - Set DATA_SOURCE_MODE to 'api' to always hit the backend.
 * - Set to 'mock' to force local mock data.
 * - Set to 'api-with-fallback' to use backend but fall back to mock on errors.
 *
 * You can also set NEXT_PUBLIC_DATA_SOURCE_MODE env var to override.
 */

export type DataSourceMode = 'api' | 'mock' | 'api-with-fallback';

const envMode = (process.env.NEXT_PUBLIC_DATA_SOURCE_MODE || '').toLowerCase();

const DEFAULT_MODE: DataSourceMode = 'api-with-fallback';

export const DATA_SOURCE_MODE: DataSourceMode =
  envMode === 'api' || envMode === 'mock' || envMode === 'api-with-fallback'
    ? (envMode as DataSourceMode)
    : DEFAULT_MODE;

export const USE_MOCK_DATA = DATA_SOURCE_MODE === 'mock';
export const USE_MOCK_ON_ERROR = DATA_SOURCE_MODE === 'api-with-fallback';

export const DATA_SOURCE_HELP =
  "Update DATA_SOURCE_MODE in src/shared/constants/data-source.ts (or NEXT_PUBLIC_DATA_SOURCE_MODE env) to switch between 'api', 'mock', or 'api-with-fallback'.";
