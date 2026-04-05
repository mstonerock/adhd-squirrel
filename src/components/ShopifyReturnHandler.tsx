import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export default function ShopifyReturnHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, setIsCartOpen } = useCart();

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

  return null;
}
