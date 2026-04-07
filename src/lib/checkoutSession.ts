import type { CartItem } from '../types';

const CHECKOUT_SESSION_STORAGE_KEY = 'adhd_squirrel_checkout_session';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

export interface PendingCheckoutSession {
  sessionId: string;
  cartFingerprint: string;
  checkoutStartedAt: string;
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCartFingerprint(cartItems: CartItem[]): string {
  return cartItems
    .map((item) =>
      [
        item.id,
        item.selectedSize ?? 'no-size',
        item.quantity,
        item.price.toFixed(2),
      ].join(':'),
    )
    .sort()
    .join('|');
}

export function readPendingCheckoutSession(): PendingCheckoutSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(CHECKOUT_SESSION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as PendingCheckoutSession;

    if (
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.cartFingerprint !== 'string' ||
      typeof parsed.checkoutStartedAt !== 'string'
    ) {
      storage.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    storage.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
    return null;
  }
}

export function beginPendingCheckoutSession(cartItems: CartItem[]): PendingCheckoutSession {
  const session: PendingCheckoutSession = {
    sessionId: createSessionId(),
    cartFingerprint: createCartFingerprint(cartItems),
    checkoutStartedAt: new Date().toISOString(),
  };

  const storage = getStorage();
  storage?.setItem(CHECKOUT_SESSION_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function clearPendingCheckoutSession(): void {
  const storage = getStorage();
  storage?.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
}

export function invalidatePendingCheckoutSession(): void {
  clearPendingCheckoutSession();
}

export function isPendingCheckoutSessionCartMatch(cartItems: CartItem[], session: PendingCheckoutSession): boolean {
  return createCartFingerprint(cartItems) === session.cartFingerprint;
}

export function shouldUseCheckoutSessionSync(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !LOCAL_HOSTNAMES.has(window.location.hostname);
}
