import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../types';
import { BUNDLE_DEFINITIONS, CATEGORY_SIZES } from '../lib/productUtils';
import { useCart } from '../lib/CartContext';
import { cn } from '../lib/utils';

const TEE_SIZES = CATEGORY_SIZES['t-shirts'];

export default function Bundles() {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('L');
  const [activeBundleId, setActiveBundleId] = useState<string | null>(null);

  const bundleCards = BUNDLE_DEFINITIONS.map((bundle) => {
    const products = bundle.productIds
      .map((id) => PRODUCTS.find((product) => product.id === id))
      .filter(Boolean);

    const standardCost = products.reduce((sum, product) => {
      if (!product) return sum;
      return sum + (product.sizePricing?.[selectedSize] ?? product.price);
    }, 0);

    return {
      ...bundle,
      products,
      standardCost,
      savings: Math.max(0, standardCost - bundle.price),
    };
  });

  const handleAddBundle = (bundleId: string) => {
    const bundle = bundleCards.find((card) => card.id === bundleId);
    if (!bundle) return;

    setActiveBundleId(bundleId);
    bundle.products.forEach((product) => {
      if (product) {
        addToCart(product, selectedSize);
      }
    });

    window.setTimeout(() => setActiveBundleId((current) => (current === bundleId ? null : current)), 900);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="max-w-3xl">
          <p className="font-headline text-xs font-black tracking-[0.35em] text-secondary-container uppercase">
            BUNDLES // TEE ONLY
          </p>
          <h1 className="mt-4 font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            LESS CLICKING.
            <span className="block text-primary-container">MORE SHIRTS.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-outline max-w-2xl leading-relaxed">
            The point is simple: keep the choices tight, show the combinations clearly, and make the bundle path feel easier than piecing it together shirt by shirt.
          </p>
        </header>

        <section className="mt-10 flex flex-col gap-6 border border-white/10 bg-surface-container-low p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              ONE SIZE FOR THE SET
            </p>
            <p className="mt-2 text-sm text-outline">Bundles are tees only for now. Pick the size once.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'h-11 min-w-11 border px-3 font-headline text-sm font-black uppercase transition-colors',
                  selectedSize === size
                    ? 'border-primary-container bg-primary-container text-white'
                    : 'border-outline/20 text-white hover:border-primary/60',
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {bundleCards.map((bundle) => (
            <article key={bundle.id} className="flex h-full flex-col border border-white/10 bg-surface-container p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <p className="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                    BUNDLE
                  </p>
                  <h2 className="mt-3 min-h-[4.5rem] text-balance font-headline text-3xl font-black uppercase tracking-tighter leading-none sm:min-h-[4rem] xl:min-h-[4.5rem]">
                    {bundle.name}
                  </h2>
                </div>
                <div className="min-h-[4.5rem] text-right sm:min-h-[4rem] xl:min-h-[4.5rem] flex flex-col justify-start">
                  <p className="font-headline text-xs font-black uppercase tracking-[0.3em] text-outline">
                    Bundle Price
                  </p>
                  <p className="mt-2 font-headline text-4xl font-black text-secondary-container">
                    ${bundle.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-1 flex-col">
                <div className={cn('grid gap-3', bundle.products.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
                  {bundle.products.map((product) =>
                    product ? (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group flex h-full flex-col bg-surface-container-highest border border-white/5 p-3 transition-colors hover:border-primary/30"
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-3 min-h-[3.75rem] font-headline text-[11px] font-black uppercase leading-tight text-white/85">
                          {product.name}
                        </p>
                      </Link>
                    ) : null,
                  )}
                </div>

                <div className="mt-auto">
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-outline">You Save</p>
                      <p className="mt-2 font-headline text-2xl font-black text-primary">
                        ${bundle.savings.toFixed(2)}
                      </p>
                      <p className="mt-2 text-xs text-white/55 uppercase tracking-widest">FREE SHIPPING</p>
                    </div>
                    <div className="text-right text-xs text-outline">
                      <p>Normal total: ${bundle.standardCost.toFixed(2)}</p>
                      <p className="mt-1 italic text-white/60">...nice.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBundle(bundle.id)}
                    className={cn(
                      'mt-6 flex w-full items-center justify-center gap-3 py-4 font-headline text-lg font-black uppercase tracking-tight transition-colors',
                      activeBundleId === bundle.id
                        ? 'bg-secondary-container text-surface'
                        : 'bg-primary-container text-white hover:bg-secondary-container hover:text-surface',
                    )}
                  >
                    {activeBundleId === bundle.id ? (
                      <>
                        Added.
                        <ShoppingBag className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Add Bundle
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
