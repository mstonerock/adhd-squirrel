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

const teeStandard = () => ({ XS: 23.99, S: 23.99, M: 23.99, L: 23.99, XL: 23.99, '2XL': 25.99, '3XL': 28.99 });
const teePremium = () => ({ XS: 29.99, S: 29.99, M: 29.99, L: 29.99, XL: 29.99, '2XL': 31.99, '3XL': 34.99 });
const crewStandard = () => ({ S: 34.99, M: 34.99, L: 34.99, XL: 34.99, '2XL': 37.99, '3XL': 38.99, '4XL': 40.99, '5XL': 40.99 });
const crewPremium = () => ({ S: 41.99, M: 41.99, L: 41.99, XL: 41.99, '2XL': 44.99, '3XL': 45.99, '4XL': 47.99, '5XL': 47.99 });
const hoodStandard = () => ({ S: 39.99, M: 39.99, L: 39.99, XL: 39.99, '2XL': 41.99, '3XL': 42.99, '4XL': 42.99, '5XL': 42.99 });
const hoodPremium = () => ({ S: 45.99, M: 45.99, L: 45.99, XL: 45.99, '2XL': 47.99, '3XL': 49.99, '4XL': 49.99, '5XL': 49.99 });

// ─── PRODUCT CATALOG ──────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [

  // ══════════════════════════════════════════════════════════════
  // SONIC INFERNO — STANDARD (front print only)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sonic-inferno-standard-tee',
    name: 'Sonic Inferno — Standard Tee',
    price: 23.99,
    sizePricing: teeStandard(),
    description: 'Started 5 things. Finished 1. Wore this.',
    category: 't-shirts',
    image: '/images/products/sonic-inferno-tee-hang.jpg',
    hoverImage: '/images/products/sonic-inferno-tee-model.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-tee-model.jpg',
      '/images/products/sonic-inferno-tee-hang.jpg',
      '/images/products/sonic-inferno-tee-video.mp4',
    ],
    designFamily: 'sonic-inferno',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'sonic-inferno-standard-crewneck',
    name: 'Sonic Inferno — Standard Crewneck',
    price: 34.99,
    sizePricing: crewStandard(),
    description: 'This made sense 10 seconds ago.',
    category: 'crewnecks',
    image: '/images/products/sonic-inferno-crewneck-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-crewneck-front.jpg',
      '/images/products/sonic-inferno-crewneck-video.mp4',
    ],
    designFamily: 'sonic-inferno',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder'],
  },
  {
    id: 'sonic-inferno-standard-hoodie',
    name: 'Sonic Inferno — Standard Hoodie',
    price: 39.99,
    sizePricing: hoodStandard(),
    description: 'Lost track of what you were doing again. Put the hood up.',
    category: 'hoodies',
    image: '/images/products/sonic-inferno-hoodie-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-hoodie-front.jpg',
      '/images/products/sonic-inferno-hoodie-video.mp4',
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
    price: 29.99,
    sizePricing: teePremium(),
    description: 'Controlled chaos on the front. Complete isolation on the back.',
    category: 't-shirts',
    image: '/images/products/sonic-inferno-tee-model.jpg',
    hoverImage: '/images/products/sonic-inferno-tee-back.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-tee-model.jpg',
      '/images/products/sonic-inferno-tee-back.jpg',
      '/images/products/sonic-inferno-tee-hang.jpg',
      '/images/products/sonic-inferno-tee-video.mp4',
    ],
    designFamily: 'sonic-inferno',
    variant: 'full-design',
    features: ['Premium Bella+Canvas 3001', 'Double-Sided Print', 'Soft-Washed Cotton', 'Vintage Feel'],
  },
  {
    id: 'sonic-inferno-fulldesign-crewneck',
    name: 'Sonic Inferno — Full Design Crewneck',
    price: 41.99,
    sizePricing: crewPremium(),
    description: 'High competence. Constant noise.',
    category: 'crewnecks',
    image: '/images/products/sonic-inferno-crewneck-front.jpg',
    hoverImage: '/images/products/sonic-inferno-crewneck-back.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-crewneck-front.jpg',
      '/images/products/sonic-inferno-crewneck-back.jpg',
      '/images/products/sonic-inferno-crewneck-video.mp4',
    ],
    designFamily: 'sonic-inferno',
    variant: 'full-design',
    features: ['Gildan 18000 Heavy Blend™', 'Double-Sided Print', 'Drop Shoulder', 'Premium Wash'],
  },
  {
    id: 'sonic-inferno-fulldesign-hoodie',
    name: 'Sonic Inferno — Full Design Hoodie',
    price: 45.99,
    sizePricing: hoodPremium(),
    description: 'Built for hyperfocus. Or staring at a wall for two hours.',
    category: 'hoodies',
    image: '/images/products/sonic-inferno-hoodie-front.jpg',
    hoverImage: '/images/products/sonic-inferno-hoodie-back.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-hoodie-front.jpg',
      '/images/products/sonic-inferno-hoodie-back.jpg',
      '/images/products/sonic-inferno-hoodie-video.mp4',
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
    price: 23.99,
    sizePricing: teeStandard(),
    description: 'Sometimes the internal noise is just one loud riff.',
    category: 't-shirts',
    image: '/images/products/solo-guitarist-tee-flat.jpg',
    hoverImage: '/images/products/solo-guitarist-tee-model.jpg',
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: [
      '/images/products/solo-guitarist-tee-model.jpg',
      '/images/products/solo-guitarist-tee-flat.jpg',
      '/images/products/solo-guitarist-tee-hang.jpg',
      '/images/products/solo-guitarist-tee-video.mp4',
    ],
    designFamily: 'solo-guitarist',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'solo-guitarist-crewneck',
    name: 'Solo Guitarist Crewneck',
    price: 34.99,
    sizePricing: crewStandard(),
    description: 'Loud enough to drown out your own thoughts.',
    category: 'crewnecks',
    image: '/images/products/solo-guitarist-crewneck-front.jpg',
    hoverImage: '/images/products/solo-guitarist-crewneck-alt.jpg',
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: [
      '/images/products/solo-guitarist-crewneck-front.jpg',
      '/images/products/solo-guitarist-crewneck-alt.jpg',
      '/images/products/solo-guitarist-crewneck-video.mp4',
    ],
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
    price: 23.99,
    sizePricing: teeStandard(),
    description: "Simpler than the noise inside your head. That's the point.",
    category: 't-shirts',
    image: '/images/products/adhd-squirrel-tee-flat.jpg',
    hoverImage: '/images/products/adhd-squirrel-tee-model.jpg',
    graphicImage: '/images/products/ADHD2.jpg',
    gallery: [
      '/images/products/adhd-squirrel-tee-model.jpg',
      '/images/products/adhd-squirrel-tee-flat.jpg',
      '/images/products/adhd-squirrel-tee-hang.jpg',
      '/images/products/adhd-squirrel-tee-video.mp4',
    ],
    designFamily: 'adhd-squirrel',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit'],
  },
  {
    id: 'adhd-squirrel-crewneck',
    name: 'ADHD Squirrel Crewneck',
    price: 34.99,
    sizePricing: crewStandard(),
    description: 'The quiet version. Only slightly.',
    category: 'crewnecks',
    image: '/images/products/adhd-squirrel-crewneck-front.jpg',
    hoverImage: '/images/products/adhd-squirrel-crewneck-alt.jpg',
    graphicImage: '/images/products/ADHD2.jpg',
    gallery: [
      '/images/products/adhd-squirrel-crewneck-front.jpg',
      '/images/products/adhd-squirrel-crewneck-alt.jpg',
      '/images/products/adhd-squirrel-crewneck-video.mp4',
    ],
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
    price: 23.99,
    sizePricing: teeStandard(),
    description: 'Decades of overcompensation. Finally makes sense.',
    category: 't-shirts',
    image: '/images/products/late-diagnosed-tee-flat.jpg',
    hoverImage: '/images/products/late-diagnosed-tee-model.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/late-diagnosed-tee-model.jpg',
      '/images/products/late-diagnosed-tee-flat.jpg',
      '/images/products/late-diagnosed-tee-hang.jpg',
      '/images/products/late-diagnosed-tee-video.mp4',
    ],
    designFamily: 'late-diagnosed',
    variant: 'standard',
    features: ['Premium Bella+Canvas 3001', '100% Organic Cotton', 'Front Graphic Only', 'Screen Printed'],
  },
  {
    id: 'late-diagnosed-crewneck',
    name: 'Late Diagnosed Crewneck',
    price: 34.99,
    sizePricing: crewStandard(),
    description: 'Function over form. Until the form breaks.',
    category: 'crewnecks',
    image: '/images/products/late-diagnosed-crewneck-front.jpg',
    hoverImage: '/images/products/late-diagnosed-crewneck-alt.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/late-diagnosed-crewneck-front.jpg',
      '/images/products/late-diagnosed-crewneck-alt.jpg',
      '/images/products/late-diagnosed-crewneck-video.mp4',
    ],
    designFamily: 'late-diagnosed',
    variant: 'standard',
    features: ['Gildan 18000 Heavy Blend™', 'Fleece Interior', 'Front Graphic Only', 'Stadium Ready'],
  },
];
