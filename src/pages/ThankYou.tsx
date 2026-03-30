import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/20"
        >
          <CheckCircle className="w-16 h-16 text-white" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            ORDER <span className="fire-gradient-text">CONFIRMED</span>
          </h1>
          <p className="text-xl font-light text-outline max-w-md mx-auto leading-relaxed">
            Your gear is being forged in the static. We'll send a transmission once it's ready to ship.
          </p>
        </div>

        <div className="bg-surface-container p-8 border border-white/5 space-y-6">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-outline">
            <span>Order Number</span>
            <span className="text-white font-mono">#ADHD-9921-X</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-outline">
            <span>Estimated Delivery</span>
            <span className="text-white font-mono">4-7 Business Days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-10 py-5 bg-primary-container text-white font-bold uppercase tracking-widest hover:bg-secondary-container transition-colors duration-300 flex items-center justify-center gap-3"
          >
            BACK TO BASE
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/category/new-drop"
            className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
          >
            WHAT ELSE DROPPED?
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
