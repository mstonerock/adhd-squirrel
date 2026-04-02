import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoryLinks = ['T-Shirts', 'Crewnecks', 'Hoodies'];
  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      'font-headline uppercase tracking-tighter transition-all hover:scale-105 duration-200',
      isActive ? 'font-black text-secondary-container' : 'font-bold text-primary hover:text-secondary-container',
    ].join(' ');
  const desktopStoryClass = ({ isActive }: { isActive: boolean }) =>
    [
      'font-headline uppercase tracking-tighter transition-all hover:scale-105 duration-200',
      isActive ? 'font-black text-secondary-container' : 'font-black text-white hover:text-primary',
    ].join(' ');
  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      'font-headline text-4xl uppercase tracking-tighter font-black transition-colors',
      isActive ? 'text-secondary-container' : 'text-white hover:text-primary',
    ].join(' ');
  const mobileStoryClass = ({ isActive }: { isActive: boolean }) =>
    [
      'font-headline text-4xl uppercase tracking-widest italic font-black transition-colors',
      isActive ? 'text-secondary-container' : 'text-primary-container hover:text-white',
    ].join(' ');

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-black italic text-primary-container tracking-tighter font-headline uppercase">
          ADHD Squirrel
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/bundles"
            className={desktopNavClass}
          >
            Bundles
          </NavLink>
          {categoryLinks.map((item) => (
            <NavLink
              key={item}
              to={`/category/${item.toLowerCase().replace(' ', '-')}`}
              className={desktopNavClass}
            >
              {item}
            </NavLink>
          ))}
          <NavLink
            to="/manifesto"
            className={desktopStoryClass}
          >
            OUR STORY
          </NavLink>
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
              <NavLink
                onClick={() => setIsMobileMenuOpen(false)}
                to="/bundles"
                className={mobileNavClass}
              >
                Bundles
              </NavLink>
              {categoryLinks.map((item) => (
                <NavLink
                  key={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                  to={`/category/${item.toLowerCase().replace(' ', '-')}`}
                  className={mobileNavClass}
                >
                  {item}
                </NavLink>
              ))}
              <div className="w-16 h-[1px] bg-white/20" />
              <NavLink
                onClick={() => setIsMobileMenuOpen(false)}
                to="/manifesto"
                className={mobileStoryClass}
              >
                OUR STORY
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
