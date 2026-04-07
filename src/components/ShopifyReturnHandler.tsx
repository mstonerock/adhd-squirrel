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
          return;
        }

        const shouldClearCurrentCart = cart.length > 0 && isPendingCheckoutSessionCartMatch(cart, pendingSession);

        clearPendingCheckoutSession();

        if (shouldClearCurrentCart) {
          clearCart();
          setIsCartOpen(false);
        }
      } catch (error) {
        console.warn('Checkout completion sync failed.', error);
      }
    };

    void syncCheckoutCompletion();

    return () => {
      isCancelled = true;
    };
  }, [cart, clearCart, location.key, setIsCartOpen]);

  return null;
}
