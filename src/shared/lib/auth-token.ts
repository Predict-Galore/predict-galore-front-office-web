/**
 * Auth token access for API client.
 * Reads the auth cookie set at login (same name as middleware uses).
 */

const AUTH_COOKIE_NAME = 'auth-token';

/**
 * Get the auth token from the cookie (client-side only).
 * Used by the API client to send Authorization header so backend accepts requests.
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + AUTH_COOKIE_NAME.replace(/[\-.]/g, '\\$&') + '=([^;]*)')
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return value || null;
}
