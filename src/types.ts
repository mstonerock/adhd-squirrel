export interface Product {
  id: string;
  name: string;
  price: number;                      // base price (XS–XL for tees, S–XL for crewnecks/hoodies)
  sizePricing: Record<string, number>; // per-size price; falls back to price
  originalPrice?: number;
  description: string;
  category: 't-shirts' | 'crewnecks' | 'hoodies';
  image: string;
  hoverImage?: string;
  graphicImage: string;
  gallery: string[];
  tagline?: string;
  features: string[];
  isSoldOutSoon?: boolean;
  isOutOfStock?: boolean;
  designFamily: 'sonic-inferno' | 'solo-guitarist' | 'adhd-squirrel' | 'late-diagnosed';
  variant: 'standard' | 'full-design';
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

// ─── SIZE PRICING HELPERS ──────────────────────────────────────────────────────

const teeStandard  = (b: number) => ({ XS:b, S:b, M:b, L:b, XL:b, '2XL':b+2, '3XL':b+4 });
const teePremium   = (b: number) => ({ XS:b, S:b, M:b, L:b, XL:b, '2XL':b+2, '3XL':b+4 });
const crewStandard = (b: number) => ({ S:b, M:b, L:b, XL:b, '2XL':b+5, '3XL':b+7, '4XL':b+9, '5XL':b+9 });
const hoodStandard = (b: number) => ({ S:b, M:b, L:b, XL:b, '2XL':b+4, '3XL':b+6, '4XL':b+8, '5XL':b+8 });

// ─── PRODUCT CATALOG ──────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [

  // ══════════════════════════════════════════════════════════════
  // SONIC INFERNO — STANDARD (front print only)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sonic-inferno-standard-tee',
    name: 'Sonic Inferno — Standard Tee',
    price: 27.99,
    sizePricing: teeStandard(27.99),
    description: 'Started 5 things. Finished 1. Wore this.',
    category: 't-shirts',
    image: '/images/products/sonic-inferno-shirt-flat.jpg',
    hoverImage: '/images/products/sonic-inferno-shirt-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-shirt-front.jpg',
      '/images/products/sonic-inferno-shirt-flat.jpg',
    ],
    designFamily: 'sonic-inferno',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'sonic-inferno-standard-crewneck',
    name: 'Sonic Inferno — Standard Crewneck',
    price: 39.99,
    sizePricing: crewStandard(39.99),
    description: 'This made sense 10 seconds ago.',
    category: 'crewnecks',
    image: '/images/products/sonic-inferno-sweatshirt-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: ['/images/products/sonic-inferno-sweatshirt-front.jpg'],
    designFamily: 'sonic-inferno',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder'],
  },
  {
    id: 'sonic-inferno-standard-hoodie',
    name: 'Sonic Inferno — Standard Hoodie',
    price: 47.99,
    sizePricing: hoodStandard(47.99),
    description: 'Lost track of what you were doing again. Put the hood up.',
    category: 'hoodies',
    image: '/images/products/sonic-inferno-hoodie-front.jpg',
    hoverImage: '/images/products/sonic-inferno-hoodie-flat.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-hoodie-front.jpg',
      '/images/products/sonic-inferno-hoodie-flat.jpg',
    ],
    designFamily: 'sonic-inferno',
    variant: 'standard',
    features: ['Gildan 18500 Heavy Blend™', 'Front Print Only', 'Heavyweight Fleece', 'Front Pouch'],
  },

  // ══════════════════════════════════════════════════════════════
  // SONIC INFERNO — FULL DESIGN (front + back)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sonic-inferno-fulldesign-tee',
    name: 'Sonic Inferno — Full Design Tee',
    price: 31.99,
    sizePricing: teePremium(31.99),
    description: 'Controlled chaos on the front. Complete isolation on the back.',
    category: 't-shirts',
    image: '/images/products/shirt-mockup.jpg',
    hoverImage: '/images/mockup-pending.svg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/shirt-mockup.jpg',
      '/images/mockup-pending.svg',
      '/images/products/sonic-inferno-shirt-front.jpg',
    ],
    designFamily: 'sonic-inferno',
    variant: 'full-design',
    features: ['Premium Bella+Canvas 3001', 'Double-Sided Print', 'Soft-Washed Cotton', 'Vintage Feel'],
  },
  {
    id: 'sonic-inferno-fulldesign-crewneck',
    name: 'Sonic Inferno — Full Design Crewneck',
    price: 49.99,
    sizePricing: crewStandard(49.99),
    description: 'High competence. Constant noise.',
    category: 'crewnecks',
    image: '/images/products/sweatshirt-mockup.png',
    hoverImage: '/images/products/sonic-inferno-sweatshirt-back-v2.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sweatshirt-mockup.png',
      '/images/products/sonic-inferno-sweatshirt-back-v2.jpg',
      '/images/products/sonic-inferno-sweatshirt-front.jpg',
    ],
    designFamily: 'sonic-inferno',
    variant: 'full-design',
    features: ['Gildan 18000 Heavy Blend™', 'Double-Sided Print', 'Drop Shoulder', 'Premium Wash'],
  },
  {
    id: 'sonic-inferno-fulldesign-hoodie',
    name: 'Sonic Inferno — Full Design Hoodie',
    price: 59.99,
    sizePricing: hoodStandard(59.99),
    description: 'Built for hyperfocus. Or staring at a wall for two hours.',
    category: 'hoodies',
    image: '/images/products/hoodie-mockup.jpg',
    hoverImage: '/images/mockup-pending.svg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/hoodie-mockup.jpg',
      '/images/mockup-pending.svg',
      '/images/products/sonic-inferno-hoodie-front.jpg',
    ],
    tagline: '"HEY LOOK! A SQUIRREL!"',
    designFamily: 'sonic-inferno',
    variant: 'full-design',
    features: ['Gildan 18500 Heavy Blend™', 'Double-Sided Print', 'Heavyweight Fleece', 'Front Pouch Pocket'],
  },

  // ══════════════════════════════════════════════════════════════
  // SOLO GUITARIST
  // ══════════════════════════════════════════════════════════════
  {
    id: 'solo-guitarist-tee',
    name: 'Solo Guitarist Tee',
    price: 27.99,
    sizePricing: teeStandard(27.99),
    description: 'Sometimes the internal noise is just one loud riff.',
    category: 't-shirts',
    image: '/images/mockup-pending.svg',
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: ['/images/mockup-pending.svg'],
    designFamily: 'solo-guitarist',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'solo-guitarist-crewneck',
    name: 'Solo Guitarist Crewneck',
    price: 39.99,
    sizePricing: crewStandard(39.99),
    description: 'Loud enough to drown out your own thoughts.',
    category: 'crewnecks',
    image: '/images/mockup-pending.svg',
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: ['/images/mockup-pending.svg'],
    designFamily: 'solo-guitarist',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder'],
  },

  // ══════════════════════════════════════════════════════════════
  // ADHD SQUIRREL
  // ══════════════════════════════════════════════════════════════
  {
    id: 'adhd-squirrel-tee',
    name: 'ADHD Squirrel Tee',
    price: 27.99,
    sizePricing: teeStandard(27.99),
    description: "Simpler than the noise inside your head. That's the point.",
    category: 't-shirts',
    image: '/images/mockup-pending.svg',
    graphicImage: '/images/mockup-pending.svg',
    gallery: ['/images/mockup-pending.svg'],
    designFamily: 'adhd-squirrel',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'adhd-squirrel-crewneck',
    name: 'ADHD Squirrel Crewneck',
    price: 39.99,
    sizePricing: crewStandard(39.99),
    description: 'The quiet version. Only slightly.',
    category: 'crewnecks',
    image: '/images/mockup-pending.svg',
    graphicImage: '/images/mockup-pending.svg',
    gallery: ['/images/mockup-pending.svg'],
    designFamily: 'adhd-squirrel',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder'],
  },

  // ══════════════════════════════════════════════════════════════
  // LATE DIAGNOSED
  // ══════════════════════════════════════════════════════════════
  {
    id: 'late-diagnosed-tee',
    name: 'Late Diagnosed Tee',
    price: 27.99,
    sizePricing: teeStandard(27.99),
    description: 'Decades of overcompensation. Finally makes sense.',
    category: 't-shirts',
    image: '/images/products/signs-shirt-flat.jpg',
    hoverImage: '/images/products/signs-shirt-front.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/signs-shirt-front.jpg',
      '/images/products/signs-shirt-flat.jpg',
    ],
    designFamily: 'late-diagnosed',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', '100% Organic Cotton', 'Front Graphic Only', 'Screen Printed'],
  },
  {
    id: 'late-diagnosed-crewneck',
    name: 'Late Diagnosed Crewneck',
    price: 39.99,
    sizePricing: crewStandard(39.99),
    description: 'Function over form. Until the form breaks.',
    category: 'crewnecks',
    image: '/images/products/signs-sweatshirt-1.jpg',
    hoverImage: '/images/products/signs-sweatshirt-2.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/signs-sweatshirt-1.jpg',
      '/images/products/signs-sweatshirt-2.jpg',
    ],
    designFamily: 'late-diagnosed',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Fleece Interior', 'Front Graphic Only', 'Stadium Ready'],
  },
];
