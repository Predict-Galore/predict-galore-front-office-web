/**
 * Session helpers
 *
 * Used for correlating auth/social sessions with a stable device id.
 */

const SESSION_ID_KEY = 'pg_session_id';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pg_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return createSessionId();

  try {
    const existing = window.localStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const sessionId = createSessionId();
    window.localStorage.setItem(SESSION_ID_KEY, sessionId);
    return sessionId;
  } catch {
    return createSessionId();
  }
}

