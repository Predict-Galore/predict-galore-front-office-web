/**
 * Social sign-in helpers (web)
 *
 * - Google: OIDC implicit flow in a popup to obtain an `id_token` (JWT).
 * - Apple: Uses Apple's official JS SDK to obtain `identityToken` (JWT).
 */

'use client';

import { getOrCreateSessionId } from '@/shared/lib/session';

type PopupResult = {
  idToken: string;
};

function openCenteredPopup(url: string, name: string, width = 520, height = 680): Window | null {
  const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
  const screenWidth = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const screenHeight = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
  const left = screenWidth / 2 - width / 2 + dualScreenLeft;
  const top = screenHeight / 2 - height / 2 + dualScreenTop;
  const features = `scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`;
  return window.open(url, name, features);
}

function waitForPopupMessage<T>(opts: {
  popup: Window;
  type: string;
  timeoutMs?: number;
  validate?: (data: unknown) => data is T;
}): Promise<T> {
  const { popup, type, timeoutMs = 2 * 60 * 1000, validate } = opts;

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Sign-in timed out. Please try again.'));
    }, timeoutMs);

    const poll = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('Sign-in was cancelled.'));
      }
    }, 400);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const payload = event.data as { type?: string; data?: unknown } | undefined;
      if (!payload || payload.type !== type) return;
      if (validate && !validate(payload.data)) return;
      cleanup();
      resolve(payload.data as T);
    };

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      window.removeEventListener('message', onMessage);
    };

    window.addEventListener('message', onMessage);
  });
}

function isPopupResult(data: unknown): data is PopupResult {
  if (!data || typeof data !== 'object') return false;
  return typeof (data as { idToken?: unknown }).idToken === 'string';
}

export async function getGoogleIdToken(): Promise<{ idToken: string; sessionId: string }> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Google sign-in is not configured (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID).');
  }

  const sessionId = getOrCreateSessionId();
  const state = `${sessionId}:${Math.random().toString(16).slice(2)}`;
  const nonce = Math.random().toString(16).slice(2) + Date.now().toString(16);
  const redirectUri = `${window.location.origin}/social/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
    nonce,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  const popup = openCenteredPopup(url, 'pg_google_signin');
  if (!popup) throw new Error('Popup blocked. Please allow popups and try again.');

  const result = await waitForPopupMessage<PopupResult>({
    popup,
    type: 'pg_google_id_token',
    validate: isPopupResult,
  });

  if (!result.idToken) throw new Error('Google sign-in failed. Please try again.');
  return { idToken: result.idToken, sessionId };
}

type AppleSignInResponse = {
  authorization?: { id_token?: string };
  user?: { name?: { firstName?: string; lastName?: string } };
};

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      // If already loaded, resolve immediately
      if ((existing as unknown as { readyState?: string }).readyState === 'complete') resolve();
      return resolve();
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Apple sign-in. Please try again.'));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (opts: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}

export async function getAppleIdentityToken(): Promise<{
  identityToken: string;
  firstName?: string;
  lastName?: string;
}> {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const redirectURI =
    process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? `${window.location.origin}/social/apple/callback`;

  if (!clientId) {
    throw new Error('Apple sign-in is not configured (missing NEXT_PUBLIC_APPLE_CLIENT_ID).');
  }

  await loadScriptOnce(
    'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
  );

  if (!window.AppleID?.auth) {
    throw new Error('Apple sign-in failed to initialize. Please try again.');
  }

  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  });

  const response = await window.AppleID.auth.signIn();
  const identityToken = response.authorization?.id_token;
  if (!identityToken) throw new Error('Apple sign-in failed. Please try again.');

  return {
    identityToken,
    firstName: response.user?.name?.firstName,
    lastName: response.user?.name?.lastName,
  };
}

