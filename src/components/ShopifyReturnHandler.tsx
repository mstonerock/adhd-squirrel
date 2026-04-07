import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import {
  clearPendingCheckoutSession,
  isPendingCheckoutSessionCartMatch,
  readPendingCheckoutSession,
  shouldUseCheckoutSessionSync,
} from '../lib/checkoutSession';

export default function ShopifyReturnHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get('purchase') !== 'complete') {
      return;
    }

    clearCart();
    setIsCartOpen(false);

    searchParams.delete('purchase');
    searchParams.delete('source');

    const nextSearch = searchParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true },
    );
  }, [clearCart, location.pathname, location.search, navigate, setIsCartOpen]);

  useEffect(() => {
    const pendingSession = readPendingCheckoutSession();

    if (!pendingSession || !shouldUseCheckoutSessionSync()) {
      return;
    }

    let isCancelled = false;
    let intervalId: number | null = null;
    let timeoutId: number | null = null;

    const syncCheckoutCompletion = async () => {
      try {
        const response = await fetch(`/api/checkout-session-status?sessionId=${encodeURIComponent(pendingSession.sessionId)}`, {
          cache: 'no-store',
          credentials: 'same-origin',
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { completed?: boolean };
        if (!payload.completed || isCancelled) {
          return false;
        }

        const shouldClearCurrentCart = cart.length > 0 && isPendingCheckoutSessionCartMatch(cart, pendingSession);

        clearPendingCheckoutSession();

        if (shouldClearCurrentCart) {
          clearCart();
          setIsCartOpen(false);
        }

        return true;
      } catch (error) {
        console.warn('Checkout completion sync failed.', error);
        return false;
      }
    };

    const stopPolling = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const runSyncCheck = async () => {
      const completed = await syncCheckoutCompletion();
      if (completed) {
        stopPolling();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void runSyncCheck();
      }
    };

    void runSyncCheck();

    intervalId = window.setInterval(() => {
      void runSyncCheck();
    }, 5000);

    timeoutId = window.setTimeout(() => {
      stopPolling();
    }, 120000);

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isCancelled = true;
      stopPolling();
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cart, clearCart, location.key, setIsCartOpen]);

  return null;
}
