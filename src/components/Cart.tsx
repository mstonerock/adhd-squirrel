import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { processShopifyCheckout } from '../lib/shopify';

export default function Cart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalDiscount, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // 1. Attempt to build and redirect to live Shopify Checkout
      const checkoutUrl = await processShopifyCheckout(cart);
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Live handoff to Shopify
      } else {
        // 2. Fallback to Local Dev Form if Shopify tokens are placeholders 
        setIsCartOpen(false);
        navigate('/checkout');
      }
    } catch (error) {
      console.warn('Checkout initialization failed', error);
      setIsCartOpen(false);
      navigate('/checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-bold uppercase tracking-wider">Your Haul</h2>
                <span className="bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag className="w-16 h-16" />
                  <div>
                    <p className="text-lg font-bold uppercase">You opened this for a reason.</p>
                    <p className="text-sm">Empty.</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-all uppercase text-xs font-bold tracking-widest"
                  >
                    GO FIND SOMETHING.
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="p-1 text-white/40 hover:text-primary transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.selectedSize && (
                          <p className="text-[10px] text-white/60 uppercase font-bold mt-1">
                            Size: <span className="text-primary">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-primary font-mono font-bold mt-1">${item.price}</p>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-white/10 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                            className="p-1.5 hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                            className="p-1.5 hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-surface-variant/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase font-bold text-white/60">Subtotal</span>
                  <span className="text-2xl font-mono font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="text-center">
                  <p className="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    FREE SHIPPING
                  </p>
                  <p className="mt-1 text-sm italic text-white/70">
                    ...nice.
                  </p>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center bg-primary/10 px-3 py-2 -mx-3 border-l-2 border-primary">
                    <span className="text-[10px] uppercase font-black tracking-widest text-primary">Bundle Savings applied</span>
                    <span className="text-sm font-mono font-bold text-primary">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <p className="text-[10px] text-white/40 uppercase text-center">
                  Taxes calculated at checkout
                </p>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-primary-container text-white flex items-center justify-center gap-2 font-display font-black uppercase text-center tracking-widest hover:bg-secondary-container transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Encrypting...
                    </>
                  ) : (
                    "COMMIT (FOR ONCE)"
                  )}
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Wait—what was I doing?
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
