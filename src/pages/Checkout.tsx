import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate('/thank-you');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-headline text-4xl font-black uppercase mb-4">Your cart is empty</h1>
        <p className="text-outline mb-8">You can't checkout with nothing. Go grab some gear.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-primary-container text-white font-bold uppercase tracking-widest hover:bg-secondary-container transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Shipping Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="font-headline text-xl font-bold uppercase tracking-tight">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">First Name</label>
                    <input required type="text" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">Last Name</label>
                    <input required type="text" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">Address</label>
                    <input required type="text" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">City</label>
                    <input required type="text" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">Postal Code</label>
                    <input required type="text" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors" />
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-headline text-xl font-bold uppercase tracking-tight">Payment Method</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-outline tracking-widest">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-outline tracking-widest">Expiry</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-outline tracking-widest">CVC</label>
                      <input required type="text" placeholder="000" className="w-full bg-surface-container border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" />
                    </div>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 bg-primary text-black font-display font-black uppercase text-2xl tracking-tighter hover:bg-white transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'PROCESSING...' : `PAY $${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container p-8 sticky top-32 border border-white/5">
              <h2 className="font-headline text-2xl font-bold uppercase mb-8 tracking-tight">Order Summary</h2>
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-surface-variant flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold uppercase">{item.name}</h4>
                      <p className="text-[10px] text-outline uppercase font-bold mt-1">
                        Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}
                      </p>
                      <p className="text-primary font-mono font-bold mt-1">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm uppercase font-bold text-outline">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm uppercase font-bold text-outline">
                  <span>Shipping</span>
                  <span className="text-secondary">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-display font-black uppercase pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[10px] uppercase font-bold text-outline/60">
                <ShieldCheck className="w-4 h-4" />
                Secure 256-bit SSL Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
