import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../types';
import { ArrowRight, Layers, DraftingCompass, Bolt, ShoppingBag, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { getBundleTarget, getUpgradeTargets, getBundleForProducts, CATEGORY_LABEL, VARIANT_LABEL, isSizeAvailableForProduct } from '../lib/productUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
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
        ['XS', '16"', '27"'],
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
  const defaultSize = currentChart.rows.find(([size]) => size === 'L')?.[0] || currentChart.rows[0][0];
  const bundleProduct = getBundleTarget(product);
  const upgradeTargets = getUpgradeTargets(product);
  const currentPrice = product.sizePricing?.[selectedSize] ?? product.price;
  const bundlePrice = bundleProduct ? (bundleProduct.sizePricing?.[selectedSize] ?? bundleProduct.price) : null;
  const bundleSizeOk = bundleProduct ? isSizeAvailableForProduct(selectedSize, bundleProduct) : false;
  const activeBundleDef = bundleProduct ? getBundleForProducts(product.id, bundleProduct.id) : null;
  const bundleSavings =
    activeBundleDef && bundlePrice != null
      ? Math.max(0, currentPrice + bundlePrice - activeBundleDef.price)
      : 0;
  const featureIcons = [
    <Layers size={20} />,
    <DraftingCompass size={20} />,
    <Bolt size={20} />,
  ];
  const categoryTitle = {
    't-shirts': 'Tee',
    'crewnecks': 'Crewneck',
    'hoodies': 'Hoodie',
  }[product.category];
  const designFamilyLabel = {
    'sonic-inferno': 'Sonic Inferno',
    'solo-guitarist': 'Solo Guitarist',
    'adhd-squirrel': 'ADHD Squirrel',
    'late-diagnosed': 'Late Diagnosed',
  }[product.designFamily];
  const eyebrowLabel =
    product.designFamily === 'sonic-inferno'
      ? `Flagship Line // ${product.variant === 'full-design' ? 'Full Design' : 'Standard'}`
      : `${designFamilyLabel} // ${categoryTitle}`;
  const titlePrimary = designFamilyLabel;
  const titleSecondary =
    product.designFamily === 'sonic-inferno'
      ? `${product.variant === 'full-design' ? 'Full Design' : 'Standard'} ${categoryTitle}`
      : categoryTitle;
  const formatDetailsLabel =
    product.variant === 'full-design'
      ? 'Front + Back Graphic'
      : 'Front Print Only';
  const mediaBadge =
    product.designFamily === 'sonic-inferno' && product.variant === 'full-design'
      ? 'FULL DESIGN'
      : designFamilyLabel.toUpperCase();
  const currentInCart = cart.some(
    (item) => item.id === product.id && item.selectedSize === selectedSize,
  );
  const sonicInfernoVariantIds: Record<'standard' | 'full-design', Record<'t-shirts' | 'crewnecks' | 'hoodies', string>> = {
    standard: {
      't-shirts': 'sonic-inferno-standard-tee',
      'crewnecks': 'sonic-inferno-standard-crewneck',
      'hoodies': 'sonic-inferno-standard-hoodie',
    },
    'full-design': {
      't-shirts': 'sonic-inferno-fulldesign-tee',
      'crewnecks': 'sonic-inferno-fulldesign-crewneck',
      'hoodies': 'sonic-inferno-fulldesign-hoodie',
    },
  };

  useEffect(() => {
    setActiveMedia(product.gallery[0] || product.image);
    setSelectedSize(defaultSize);
    setIsAdding(false);
    setIsSizeGuideOpen(false);
  }, [product.id, defaultSize, product.gallery, product.image]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleAddBundle = () => {
    if (!bundleProduct) return;

    if (!currentInCart) {
      addToCart(product, selectedSize);
    }

    addToCart(bundleProduct, selectedSize);
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
            
            <div className="absolute bottom-8 left-0 bg-primary-container text-white px-6 py-3 font-headline font-black italic text-lg md:text-2xl -rotate-2 z-10 uppercase pointer-events-none">
              {mediaBadge}
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
              {eyebrowLabel}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              {titlePrimary} <br />
              <span className="text-primary-container">{titleSecondary}</span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="bg-primary-container px-3 py-2 text-[10px] font-headline font-black uppercase tracking-[0.3em] text-white">
                {formatDetailsLabel}
              </span>
              {product.designFamily === 'sonic-inferno' && product.variant === 'full-design' && (
                <span className="border border-secondary-container/40 px-3 py-2 text-[10px] font-headline font-black uppercase tracking-[0.3em] text-secondary-container">
                  Premium Path
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="font-headline text-4xl font-bold text-white">${currentPrice.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="font-headline text-outline line-through text-xl">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="-mt-4">
            <p className="font-headline text-xs font-black uppercase tracking-[0.3em] text-primary">
              FREE SHIPPING
            </p>
            <p className="mt-1 font-body text-base italic text-white/70">
              ...nice.
            </p>
          </div>

          <p className="font-body text-outline text-lg leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* Features Bento */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <div key={feature} className="bg-surface-container px-6 py-4 flex items-center justify-between group hover:bg-surface-container-highest transition-colors">
                <span className="font-headline font-bold uppercase text-lg tracking-tight">{feature}</span>
                <span className="text-primary-container group-hover:scale-110 transition-transform">{featureIcons[idx] ?? featureIcons[featureIcons.length - 1]}</span>
              </div>
            ))}
          </div>

          {/* Variant Selection (Sonic Inferno only) */}
          {product.designFamily === 'sonic-inferno' && (
            <div className="mt-8">
              <label className="font-headline uppercase text-xs tracking-widest text-outline mb-4 block">Select Configuration</label>
              <div className="grid grid-cols-2 gap-4">
                {['full-design', 'standard'].map((v) => {
                  const targetId = sonicInfernoVariantIds[v as 'standard' | 'full-design'][product.category];
                  const isActive = product.variant === v;
                  return (
                    <Link
                      key={v}
                      to={`/product/${targetId}`}
                      className={cn(
                        "flex flex-col p-4 border-2 transition-all text-left",
                        isActive 
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-white/10 hover:border-white/30 backdrop-blur-sm"
                      )}
                    >
                      <span className={cn(
                        "font-headline font-black uppercase text-sm tracking-tight",
                        isActive ? "text-primary" : "text-white"
                      )}>
                        {VARIANT_LABEL[v]}
                      </span>
                      {v === 'full-design' && (
                        <span className="mt-2 inline-flex w-fit bg-secondary-container px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-surface">
                          Recommended
                        </span>
                      )}
                      <span className="text-[10px] text-outline uppercase font-bold mt-1">
                        {v === 'full-design' ? '+ Back Graphic' : 'Front Only'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

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
            {product.isOutOfStock ? (
              <button
                disabled
                aria-label="Out of stock"
                className="w-full py-6 bg-surface-container-highest text-outline font-headline font-black uppercase text-2xl tracking-tighter cursor-not-allowed"
              >
                <span aria-hidden="true">GONE. YOU HESITATED.</span>
              </button>
            ) : (
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
            )}
          </div>

          {/* Sticky Mobile CTA */}
          <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-t border-white/10 p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {product.isOutOfStock ? (
              <button
                disabled
                aria-label="Out of stock"
                className="w-full py-4 bg-surface-container-highest text-outline font-headline font-black uppercase text-xl tracking-tighter rounded-lg cursor-not-allowed"
              >
                <span aria-hidden="true">GONE. YOU HESITATED.</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "w-full py-4 text-white font-headline font-black uppercase text-xl tracking-tighter transition-all active:scale-[0.98] duration-100 flex items-center justify-center gap-4 rounded-lg",
                  isAdding ? "bg-secondary-container" : "bg-primary-container"
                )}
              >
                {isAdding ? "DONE. FINALLY." : `YEAH, THIS ONE. — $${currentPrice.toFixed(2)}`}
              </button>
            )}
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

          {/* ── Bundle Section ─────────────────────────────────────────────
               Different shirt, different design. Adds to cart.
               Hidden when selected size is unavailable in the bundle product. */}
          {bundleProduct && !product.isOutOfStock && bundleSizeOk && (
            <div className="border-t border-white/5 pt-4 mt-2">
              <div className="bg-surface-container-lowest/60 border border-white/8 p-4">
                <div className="mb-3">
                  <p className="font-headline font-black text-[10px] tracking-[0.3em] uppercase text-primary/80">
                    {activeBundleDef?.name ?? 'COMPLETE THE CHAOS'}
                  </p>
                  <p className="text-outline/70 text-xs mt-0.5">
                    You'll want both.
                    {activeBundleDef && (
                      <span className="text-primary/60 ml-1">
                        Bundle saves ${bundleSavings.toFixed(2)}.
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 flex-shrink-0 overflow-hidden bg-surface-container opacity-80">
                    <img src={bundleProduct.image} alt={bundleProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-headline font-bold uppercase text-xs truncate text-white/80">{bundleProduct.name}</p>
                    <p className="text-primary/80 font-headline font-black text-sm mt-0.5">${(bundlePrice ?? bundleProduct.price).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={handleAddBundle}
                    className="flex-shrink-0 border border-white/15 px-3 py-2 font-headline font-black uppercase text-[10px] tracking-widest text-white/70 hover:border-primary/60 hover:text-primary transition-colors"
                  >
                    {currentInCart ? 'ADD IT TOO.' : 'ADD THE SET.'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Upgrade Section ────────────────────────────────────────────
               Same design, different apparel. Navigates — does not add to cart. */}
          {upgradeTargets.length > 0 && !product.isOutOfStock && (
            <div className="pt-3">
              <p className="font-headline font-black text-[10px] tracking-[0.3em] uppercase text-outline/50 mb-2">ALSO AS</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {upgradeTargets.map((upgrade) => (
                  <Link
                    key={upgrade.id}
                    to={`/product/${upgrade.id}`}
                    className="text-xs font-headline font-bold uppercase text-outline/60 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>{CATEGORY_LABEL[upgrade.category]}</span>
                    <span className="text-outline/35 font-normal text-[10px]">{VARIANT_LABEL[upgrade.variant]}</span>
                    <span className="text-outline/35 font-normal">${upgrade.price.toFixed(2)}</span>
                    <span className="text-outline/30">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
