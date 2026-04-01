import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../types';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function Home() {
  const { category } = useParams();
  const heroProduct = PRODUCTS.find(p => p.id === 'sonic-inferno-standard-tee') || PRODUCTS[0];
  const followupProduct = PRODUCTS.find(p => p.id === 'adhd-squirrel-tee') || heroProduct;
  const heroImage = heroProduct.hoverImage || heroProduct.image;
  const heroBadge = heroProduct.variant === 'full-design' ? 'FLAGSHIP // FULL DESIGN' : 'FLAGSHIP // STANDARD';
  const followupImage = followupProduct.hoverImage || followupProduct.image;
  const entryTeePrice = PRODUCTS
    .filter((product) => product.category === 't-shirts')
    .reduce((lowest, product) => Math.min(lowest, product.price), Number.POSITIVE_INFINITY);

  const filteredProducts = category 
    ? PRODUCTS.filter(p => p.category === category || p.category === category.replace('-', ' '))
    : PRODUCTS;

  if (category) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-16">
            <h2 className="font-headline text-xs font-black tracking-[0.3em] text-secondary mb-4 uppercase">CATEGORY // 001</h2>
            <h1 className="font-headline text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              THE <span className="fire-gradient-text">{category.replace('-', ' ')}</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="group relative bg-surface-container overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${product.hoverImage ? 'absolute inset-0 z-10 group-hover:opacity-0' : 'z-0'}`}
                  />
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt={product.name.concat(' Model')}
                      className="w-full h-full object-cover absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-all duration-700"
                    />
                  )}
                  {product.isSoldOutSoon && (
                    <div className="absolute top-4 left-4 bg-secondary-container text-black px-3 py-1 font-headline font-black italic uppercase text-[10px] z-10">
                      SOLD OUT SOON
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <div className="bg-white text-black px-6 py-3 font-headline font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      YEAH… THIS ONE
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-xl uppercase tracking-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-headline font-black text-primary text-xl">${product.price}</span>
                  </div>
                  <p className="text-xs text-outline uppercase font-bold tracking-widest">{product.category}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-6">
              <ShoppingBag className="w-16 h-16 mx-auto opacity-20" />
              <h3 className="font-headline text-3xl font-black uppercase">Nothing here yet</h3>
              <p className="text-outline">The static is still forming. Check back soon for new drops.</p>
              <Link to="/" className="inline-block px-8 py-4 bg-primary-container text-white font-bold uppercase tracking-widest hover:bg-secondary-container transition-colors">
                BACK TO BASE
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[72vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/products/6.jpg"
            alt="ADHD Squirrel Band"
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h2 className="font-headline text-sm font-black tracking-[0.4em] text-secondary mb-4 uppercase">ADHD SQUIRREL</h2>
            <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase mb-2 leading-none">
              FOR THOSE WHO <span className="fire-gradient-text block">REFUSE</span> TO TURN DOWN THEIR VOLUME.
            </h1>
            <p className="font-headline text-[10px] md:text-xs font-black text-white/40 tracking-[0.4em] uppercase mb-8 pl-1">
              (AND COULDN'T IF THEY WANTED TO)
            </p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:hidden mb-8"
            >
              <Link to={`/product/${heroProduct.id}`} className="block max-w-sm mx-auto">
                <div className="relative overflow-hidden border-4 border-primary/20 shadow-2xl">
                  <img
                    src={heroImage}
                    alt={heroProduct.name}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute left-0 bottom-5 bg-secondary-container text-surface px-5 py-2 font-headline font-black italic uppercase text-base">
                    STANDARD
                  </div>
                </div>
              </Link>
              <div className="max-w-sm mx-auto mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-primary-container px-3 py-2 text-[10px] font-headline font-black uppercase tracking-[0.3em] text-white">
                    Tees From
                  </span>
                  <span className="font-headline text-3xl font-black uppercase tracking-tight text-secondary-container">
                    ${entryTeePrice.toFixed(2)}
                  </span>
                </div>
                <div className="border border-secondary-container/30 px-4 py-3 text-center">
                  <div className="font-headline text-xs font-black uppercase tracking-[0.3em] text-secondary-container">
                    FREE SHIPPING
                  </div>
                  <div className="mt-1 font-body text-sm italic text-white/70">
                    ...nice.
                  </div>
                </div>
                <Link
                  to={`/product/${heroProduct.id}`}
                  className="block w-full border-2 border-primary-container bg-surface-container-highest px-6 py-4 text-center font-headline text-lg font-black uppercase tracking-tight text-primary-container transition-all duration-300 active:scale-95 hover:bg-primary-container hover:text-white"
                >
                  SEE THE STANDARD TEE
                </Link>
              </div>
            </motion.div>

            <p className="text-base md:text-xl max-w-xl mb-8 font-light text-outline leading-relaxed">
              Built by someone who lives in two completely different systems at the same time. This is what the contrast actually feels like.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-4 px-8 py-4 border border-outline/20 backdrop-blur-sm bg-surface-container-highest/50">
                <span className="font-headline font-black text-secondary-container text-xl uppercase tracking-[0.2em]">
                  TEES FROM ${entryTeePrice.toFixed(2)}
                </span>
              </div>
              <div className="hidden lg:inline-flex lg:flex-col lg:items-start px-8 py-4 border border-outline/20 backdrop-blur-sm bg-surface-container-highest/50">
                <span className="font-headline font-black text-primary text-xl uppercase tracking-[0.2em]">
                  FREE SHIPPING
                </span>
                <span className="mt-1 font-body text-base italic text-white/70">
                  ...nice.
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block lg:col-span-5 relative"
          >
            <div className="relative z-20 shadow-2xl">
              <img
                src={heroImage}
                alt="ADHD Squirrel Rock Band"
                className="w-full border-4 border-primary/20"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary-container text-surface px-6 py-2 font-headline font-black italic uppercase text-xl shadow-lg">
                STANDARD
              </div>
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Product Highlight */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary-container opacity-0 group-hover:opacity-10 transition-opacity" />
              <img
                src={followupImage}
                alt={followupProduct.name}
                className="w-full relative z-10 object-cover"
              />
              <div className="absolute top-4 left-4 bg-surface-container-lowest px-4 py-2 border-l-4 border-primary-container z-20">
                <span className="font-headline font-black text-xs text-primary uppercase">ENTRY LINE // EASY YES</span>
              </div>
            </motion.div>

            <div>
              <h3 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{followupProduct.name}</h3>
              <p className="font-headline text-2xl font-black text-secondary-container mb-6 italic uppercase tracking-tight">
                Lower friction. Same energy. Easier yes.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary-container text-surface px-4 py-2 text-sm font-black tracking-widest uppercase italic">FRONT PRINT ONLY</div>
                <div className="text-secondary-container font-headline font-black text-4xl tracking-widest">${followupProduct.price.toFixed(2)}</div>
              </div>
              <div className="mb-8">
                <p className="font-headline text-xs font-black uppercase tracking-[0.3em] text-primary">
                  FREE SHIPPING
                </p>
                <p className="mt-1 font-body text-base italic text-white/70">
                  ...nice.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-12">
                {followupProduct.features.map((feature, idx) => (
                  <div
                    key={feature}
                    className={`flex min-h-24 items-start gap-3 p-4 md:p-5 ${idx === 0 ? 'bg-surface-container-highest border-l-2 border-primary-container' : 'bg-surface-container border-l-2 border-outline/20'}`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center text-primary-container shrink-0">
                      {idx === 0 ? '⚡' : idx === 1 ? '💀' : '🔥'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline font-black text-xs md:text-sm uppercase leading-tight">{feature}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to={`/product/${followupProduct.id}`}
                className="block w-full text-center py-6 bg-surface-container-highest border-2 border-primary-container text-primary-container font-headline font-black uppercase text-xl hover:bg-primary-container hover:text-white transition-all duration-300 active:scale-95"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drops */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-xs font-black tracking-[0.3em] text-secondary mb-4 uppercase">CURRENT STATE</h2>
              <h3 className="font-headline text-5xl font-black uppercase tracking-tighter italic">CONTROLLED <span className="text-primary">NOISE.</span></h3>
            </div>
            <Link to="/category/t-shirts" className="group flex items-center gap-2 font-headline font-bold uppercase text-xs tracking-widest text-outline hover:text-primary transition-colors">
              SEE EVERYTHING
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['solo-guitarist-tee', 'late-diagnosed-tee'].map((id) => {
              const product = PRODUCTS.find(p => p.id === id);
              if (!product) return null;
              return (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`}
                className="group relative bg-surface-container overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${product.hoverImage ? 'absolute inset-0 z-10 group-hover:opacity-0' : 'z-0'}`}
                  />
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt={product.name.concat(' Model')}
                      className="w-full h-full object-cover absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-all duration-700"
                    />
                  )}
                  {product.isSoldOutSoon && (
                    <div className="absolute top-4 left-4 bg-secondary-container text-black px-3 py-1 font-headline font-black italic uppercase text-[10px] z-10">
                      SOLD OUT SOON
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <div className="bg-white text-black px-6 py-3 font-headline font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      YEAH… THIS ONE
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-xl uppercase tracking-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-headline font-black text-primary text-xl">${product.price}</span>
                  </div>
                  <p className="text-xs text-outline uppercase font-bold tracking-widest">{product.category}</p>
                </div>
                </Link>
              );
            })}
            <Link
              to="/category/t-shirts"
              className="group flex min-h-[28rem] flex-col justify-between border border-white/10 bg-surface-container-low p-8 transition-all duration-500 hover:border-primary/40 hover:bg-surface-container"
            >
              <div>
                <p className="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  THE REST
                </p>
                <h4 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter text-white">
                  SEE THE WHOLE LINE.
                </h4>
                <p className="mt-4 max-w-xs text-sm text-outline">
                  Once the flagship and the easy entry make sense, the rest of the catalog can do its job.
                </p>
              </div>
              <div className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-secondary transition-colors group-hover:text-primary">
                BROWSE THE REST
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Mosaic */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
            <Link to="/product/sonic-inferno-standard-tee" className="col-span-2 md:row-span-2 bg-surface-container relative overflow-hidden group hover:border-primary-container/30 border border-transparent transition-all">
              <img
                src="/images/products/sonic-inferno-shirt-front.jpg"
                alt="Shredder"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6">
                <h4 className="font-headline text-2xl md:text-3xl font-black uppercase text-secondary-container leading-none group-hover:text-white transition-colors">THE SHREDDER</h4>
                <p className="text-[10px] md:text-xs font-bold text-outline uppercase tracking-widest mt-2 group-hover:text-secondary-container transition-colors">RAW ENERGY UNLEASHED</p>
              </div>
            </Link>
            <Link to="/manifesto" className="col-span-1 bg-surface-container-highest flex items-center justify-center p-4 md:p-8 text-center border-t-4 border-primary-container hover:bg-surface-container-high transition-colors group border-r-4 border-surface-container-lowest md:border-r-0">
              <div className="font-headline text-xl md:text-4xl font-black italic uppercase leading-none text-primary group-hover:text-white transition-colors">STAY<br />WEIRD.</div>
            </Link>
            <Link to="/product/late-diagnosed-tee" className="col-span-1 border-t-4 border-transparent relative overflow-hidden group bg-surface-container hover:border-white/10 transition-all">
              <img
                src="/images/products/signs-shirt-front.jpg"
                alt="Late Diagnosis"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            </Link>
            <div className="col-span-2 bg-primary-container flex flex-col justify-end p-6 md:p-8 group">
              <div className="transform group-hover:-translate-y-2 transition-transform">
                <h4 className="font-headline text-2xl md:text-4xl font-black uppercase text-surface tracking-tighter">JOIN THE CHAOS</h4>
                <p className="text-surface border-black text-xs md:text-base mt-1 md:mt-2">Sign up for secret drops.</p>
                <div className="mt-4 md:mt-6 flex bg-surface/20 p-1">
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    className="bg-transparent border-none text-surface placeholder:text-surface/70 focus:ring-0 flex-grow font-headline font-bold uppercase px-2 md:px-4 text-xs md:text-base w-full min-w-0"
                  />
                  <button className="bg-surface text-primary-container px-4 md:px-6 py-2 font-black uppercase text-xs md:text-sm">JOIN</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
