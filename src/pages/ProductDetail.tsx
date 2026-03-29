import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../types';
import { ArrowRight, Layers, DraftingCompass, Bolt, ShoppingBag, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [activeMedia, setActiveMedia] = useState(product.gallery[0] || product.image);
  const [selectedSize, setSelectedSize] = useState('L');
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const sizeCharts: Record<string, { title: string; desc: string; columns: string[]; rows: string[][] }> = {
    't-shirts': {
      title: 'BELLA+CANVAS 3001',
      desc: 'Premium unisex retail fit. Measurements in inches.',
      columns: ['Size', 'Width', 'Length'],
      rows: [
        ['S', '18"', '28"'],
        ['M', '20"', '29"'],
        ['L', '22"', '30"'],
        ['XL', '24"', '31"'],
        ['2XL', '26"', '32"'],
        ['3XL', '28"', '33"'],
      ]
    },
    'crewnecks': {
      title: 'GILDAN 18000',
      desc: 'Heavy blend classic crewneck. Measurements in inches.',
      columns: ['Size', 'Width', 'Length'],
      rows: [
        ['S', '20"', '27"'],
        ['M', '22"', '28"'],
        ['L', '24"', '29"'],
        ['XL', '26"', '30"'],
        ['2XL', '28"', '31"'],
        ['3XL', '30"', '32"'],
        ['4XL', '32"', '33"'],
        ['5XL', '34"', '34"'],
      ]
    },
    'hoodies': {
      title: 'GILDAN 18500',
      desc: 'Heavy blend classic hoodie. Measurements in inches.',
      columns: ['Size', 'Width', 'Length'],
      rows: [
        ['S', '20"', '27"'],
        ['M', '22"', '28"'],
        ['L', '24"', '29"'],
        ['XL', '26"', '30"'],
        ['2XL', '28"', '31"'],
        ['3XL', '30"', '32"'],
        ['4XL', '32"', '33"'],
        ['5XL', '34"', '34"'],
      ]
    }
  };

  const currentChart = sizeCharts[product.category] || sizeCharts['t-shirts'];

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Product Image Section */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full aspect-[4/5] max-h-[60vh] md:max-h-none bg-surface-container-low overflow-hidden group rounded-xl">
            {activeMedia.endsWith('.mp4') ? (
              <video
                src={activeMedia}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeMedia}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
            
            <div className="absolute bottom-8 left-0 bg-primary-container text-white px-6 py-3 font-headline font-black italic text-2xl -rotate-2 z-10 uppercase pointer-events-none">
              SONIC INFERNO DROP
            </div>
          </div>

          <div className="mt-6 flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {product.gallery?.map((media, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveMedia(media)}
                className={cn(
                  "flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden border-2 snap-start transition-all",
                  activeMedia === media ? "border-primary opacity-100" : "border-outline/20 hover:border-primary/50 opacity-60 hover:opacity-100"
                )}
              >
                {media.endsWith('.mp4') ? (
                  <video src={media} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <img src={media} className="w-full h-full object-cover pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32 h-fit">
          <div>
            <span className="font-headline text-secondary-container tracking-widest uppercase text-sm mb-2 block">
              Premium Apparel — 001
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              {product.name.split(' ').slice(0, 2).join(' ')} <br />
              <span className="text-primary-container">{product.name.split(' ').slice(2).join(' ')}</span>
            </h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="font-headline text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="font-headline text-outline line-through text-xl">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="font-body text-outline text-lg leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* Features Bento */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            {[
              { label: 'Double-Lined Hood', icon: <Layers size={20} /> },
              { label: 'Reinforced Stitching', icon: <DraftingCompass size={20} /> },
              { label: 'High-Voltage Print', icon: <Bolt size={20} /> }
            ].map((feature) => (
              <div key={feature.label} className="bg-surface-container px-6 py-4 flex items-center justify-between group hover:bg-surface-container-highest transition-colors">
                <span className="font-headline font-bold uppercase text-lg tracking-tight">{feature.label}</span>
                <span className="text-primary-container group-hover:scale-110 transition-transform">{feature.icon}</span>
              </div>
            ))}
          </div>

          {/* Size Selection */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <label className="font-headline uppercase text-xs tracking-widest text-outline">Select Size</label>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-headline uppercase text-secondary-container hover:text-primary transition-colors underline underline-offset-4"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentChart.rows.map((row) => row[0]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center font-headline font-bold text-lg border transition-colors",
                    selectedSize === size 
                      ? "bg-primary-container border-primary-container text-white" 
                      : "border-outline-variant/20 hover:border-primary text-white"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "w-full py-6 text-white font-headline font-black uppercase text-2xl tracking-tighter transition-all active:scale-[0.98] duration-100 flex items-center justify-center gap-4",
                isAdding ? "bg-secondary-container" : "bg-primary-container hover:bg-secondary-container"
              )}
            >
              {isAdding ? (
                <>
                  DONE. FINALLY.
                  <ShoppingBag className="animate-bounce" />
                </>
              ) : (
                <>
                  YEAH, THIS ONE.
                  <ArrowRight />
                </>
              )}
            </button>
          </div>

          {/* Sticky Mobile CTA */}
          <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-t border-white/10 p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "w-full py-4 text-white font-headline font-black uppercase text-xl tracking-tighter transition-all active:scale-[0.98] duration-100 flex items-center justify-center gap-4 rounded-lg",
                isAdding ? "bg-secondary-container" : "bg-primary-container"
              )}
            >
              {isAdding ? "DONE. FINALLY." : `YEAH, THIS ONE. — $${product.price.toFixed(2)}`}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-headline uppercase tracking-widest text-secondary">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              Actually in stock.
            </div>
            <div className="flex items-center gap-2 text-xs font-headline uppercase tracking-widest text-outline">
              <span className="w-2 h-2 bg-outline rounded-full" />
              We ship it. Try not to forget you ordered it.
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <section className="mt-32 bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-5xl font-black uppercase tracking-tighter mb-12 italic text-primary-container">HOW IT'S BUILT.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'The Fabric', desc: 'Heavyweight and structured. Not cheap.' },
              { title: 'The Print', desc: 'Industrial ink. Won\'t crack under pressure.' },
              { title: 'The Fit', desc: 'Distorted silhouette but hangs exactly right.' }
            ].map((spec) => (
              <div key={spec.title} className="space-y-4 border-l-2 border-primary-container/20 pl-6">
                <h3 className="font-headline font-bold text-2xl uppercase">{spec.title}</h3>
                <p className="font-body text-outline">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface-container border border-outline/20 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain hide-scrollbar"
            >
              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-outline hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
              
              <h3 className="font-headline text-3xl font-black uppercase tracking-tighter mb-1 mt-2 text-primary-container">{currentChart.title}</h3>
              <p className="text-sm font-bold text-outline uppercase tracking-widest mb-8">{currentChart.desc}</p>

              <div className="overflow-hidden border border-outline/20">
                <table className="w-full text-left font-headline">
                  <thead>
                    <tr className="bg-surface-container-highest uppercase text-xs tracking-widest text-secondary-container">
                      {currentChart.columns.map((col, idx) => (
                        <th key={idx} className="p-4 indent-1">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentChart.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-primary/5 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={cn("p-4 font-bold", cellIdx === 0 ? "text-primary-container text-lg" : "text-white text-base")}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-outline mt-6 font-bold uppercase tracking-widest text-center leading-relaxed">
                * WIDTH: MEASURED ACROSS CHEST, 1 INCH BELOW THE ARMHOLE.<br/>
                * LENGTH: MEASURED FROM THE HIGHEST POINT OF THE SHOULDER TO THE HEM.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
