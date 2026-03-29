import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-black italic text-primary-container tracking-tighter font-headline uppercase">
          ADHD Squirrel
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {['T-Shirts', 'Crewnecks', 'Hoodies'].map((item) => (
            <Link
              key={item}
              to={`/category/${item.toLowerCase().replace(' ', '-')}`}
              className="font-headline uppercase tracking-tighter font-bold text-primary hover:text-secondary-container transition-all hover:scale-105 duration-200"
            >
              {item}
            </Link>
          ))}
          <Link
            to="/manifesto"
            className="font-headline uppercase tracking-tighter font-black text-white hover:text-primary transition-all hover:scale-105 duration-200"
          >
            OUR STORY
          </Link>
        </div>

        <div className="flex items-center gap-4 text-primary">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative hover:scale-110 transition-transform active:scale-95 p-2"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-secondary-container text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                {totalItems}
              </span>
            )}
          </button>
          <button className="hover:scale-110 transition-transform active:scale-95 p-2">
            <User size={24} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden hover:scale-110 transition-transform active:scale-95 p-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center overscroll-none"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-4 text-primary hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-12">
              {['T-Shirts', 'Crewnecks', 'Hoodies'].map((item) => (
                <Link
                  key={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                  to={`/category/${item.toLowerCase().replace(' ', '-')}`}
                  className="font-headline text-4xl uppercase tracking-tighter font-black text-white hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="w-16 h-[1px] bg-white/20" />
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/manifesto"
                className="font-headline text-4xl uppercase tracking-widest italic font-black text-primary-container hover:text-white transition-colors"
              >
                OUR STORY
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
