export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 't-shirts' | 'crewnecks' | 'hoodies';
  image: string; // The default hero image
  hoverImage?: string; // The image shown when hovering on a product card
  graphicImage: string; // Heritage legacy graphic
  gallery: string[]; // Paths to all media, including .mp4 videos
  tagline?: string;
  features: string[];
  isSoldOutSoon?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export const PRODUCTS: Product[] = [
  // ==========================================
  // DESIGN 1: FULL BAND - 1 SIDED (Cheaper Version)
  // ==========================================
  {
    id: 'sonic-inferno-core-shirt',
    name: 'Sonic Inferno Front-Only Tee',
    price: 35,
    description: "Started 5 things. Finished 1. Wore this.",
    category: 't-shirts',
    image: '/images/products/sonic-inferno-shirt-flat.jpg',
    hoverImage: '/images/products/sonic-inferno-shirt-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-shirt-front.jpg',
      '/images/products/sonic-inferno-shirt-flat.jpg'
    ],
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit']
  },
  {
    id: 'sonic-inferno-core-sweatshirt',
    name: 'Sonic Inferno Front-Only Crewneck',
    price: 55,
    description: "This made sense 10 seconds ago.",
    category: 'crewnecks',
    image: '/images/products/sonic-inferno-sweatshirt-front.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-sweatshirt-front.jpg'
    ],
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder']
  },
  {
    id: 'sonic-inferno-core-hoodie',
    name: 'Sonic Inferno Front-Only Hoodie',
    price: 75,
    description: "Lost track of what you were doing again. Put the hood up.",
    category: 'hoodies',
    image: '/images/products/sonic-inferno-hoodie-front.jpg',
    hoverImage: '/images/products/sonic-inferno-hoodie-flat.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sonic-inferno-hoodie-front.jpg',
      '/images/products/sonic-inferno-hoodie-flat.jpg'
    ],
    features: ['Gildan 18500 Heavy Blend™', 'Front Print Only', 'Heavyweight Fleece', 'Front Pouch']
  },

  // ==========================================
  // DESIGN 2: FULL BAND - 2 SIDED (Premium Version)
  // ==========================================
  {
    id: 'sonic-inferno-2sided-shirt',
    name: 'Sonic Inferno 2-Sided Tour Tee',
    price: 45,
    description: "Controlled chaos on the front. Complete isolation on the back.",
    category: 't-shirts',
    image: '/images/products/shirt-mockup.jpg',
    hoverImage: '/images/mockup-pending.svg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/shirt-mockup.jpg',
      '/images/mockup-pending.svg',
      '/images/products/sonic-inferno-shirt-front.jpg'
    ],
    features: ['Premium Bella+Canvas 3001', 'Double-Sided Print', 'Soft-Washed Cotton', 'Vintage Feel']
  },
  {
    id: 'sonic-inferno-2sided-sweatshirt',
    name: 'Sonic Inferno 2-Sided Crewneck',
    price: 75,
    description: "High competence. Constant noise.",
    category: 'crewnecks',
    image: '/images/products/sweatshirt-mockup.png',
    hoverImage: '/images/products/sonic-inferno-sweatshirt-back-v2.jpg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/sweatshirt-mockup.png',
      '/images/products/sonic-inferno-sweatshirt-back-v2.jpg',
      '/images/products/sonic-inferno-sweatshirt-front.jpg'
    ],
    features: ['Gildan 18000 Heavy Blend™', 'Double-Sided Print', 'Drop Shoulder', 'Premium Wash']
  },
  {
    id: 'sonic-inferno-2sided-hoodie',
    name: 'Sonic Inferno 2-Sided Tour Hoodie',
    price: 95,
    description: "Built for hyperfocus. Or staring at a wall for two hours.",
    category: 'hoodies',
    image: '/images/products/hoodie-mockup.jpg',
    hoverImage: '/images/mockup-pending.svg',
    graphicImage: '/images/products/6.jpg',
    gallery: [
      '/images/products/hoodie-mockup.jpg',
      '/images/mockup-pending.svg',
      '/images/products/sonic-inferno-hoodie-front.jpg'
    ],
    tagline: '"HEY LOOK! A SQUIRREL!"',
    features: ['Gildan 18500 Heavy Blend™', 'Double-Sided Print', 'Heavyweight Fleece', 'Front Pouch Pocket']
  },

  // ==========================================
  // DESIGN 3: LATE DIAGNOSIS - 1 SIDED
  // ==========================================
  {
    id: 'late-diagnosis-core-shirt',
    name: 'Late Diagnosis Core Tee',
    price: 35,
    description: "Decades of overcompensation. Finally makes sense.",
    category: 't-shirts',
    image: '/images/products/signs-shirt-flat.jpg',
    hoverImage: '/images/products/signs-shirt-front.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/signs-shirt-front.jpg',
      '/images/products/signs-shirt-flat.jpg'
    ],
    features: ['Premium Bella+Canvas 3001', '100% Organic Cotton', 'Front Graphic Only', 'Screen Printed']
  },
  {
    id: 'late-diagnosis-core-sweatshirt',
    name: 'Late Diagnosis Crewneck',
    price: 65,
    description: "Function over form. Until the form breaks.",
    category: 'crewnecks',
    image: '/images/products/signs-sweatshirt-1.jpg',
    hoverImage: '/images/products/signs-sweatshirt-2.jpg',
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/signs-sweatshirt-1.jpg',
      '/images/products/signs-sweatshirt-2.jpg'
    ],
    features: ['Gildan 18000 Heavy Blend™', 'Fleece Interior', 'Front Graphic Only', 'Stadium Ready']
  },
  {
    id: 'late-diagnosis-core-hoodie',
    name: 'Late Diagnosis Heavyweight Hoodie',
    price: 89,
    originalPrice: 120,
    description: "You'll probably forget you bought this until it arrives.",
    category: 'hoodies',
    // TO RE-UPLOAD: User must replace this hoodie mockup once they generate a horizontal pocket-cleared graphic
    image: '/images/products/signs-hoodie.jpg', 
    graphicImage: '/images/products/ADHD5.jpg',
    gallery: [
      '/images/products/signs-hoodie.jpg'
    ],
    tagline: '"BUT THERE WERE CLUES!"',
    features: ['Gildan 18500 Heavy Blend™', 'Double-Lined Hood', 'High-Voltage Print', 'Front Graphic Only'],
    isSoldOutSoon: true
  },

  // ==========================================
  // DESIGN 4: SOLO GUITARIST - 1 SIDED
  // ==========================================
  {
    id: 'solo-guitarist-core-shirt',
    name: 'Solo Guitarist Core Tee',
    price: 35,
    description: "Sometimes the internal noise is just one loud riff.",
    category: 't-shirts',
    image: '/images/mockup-pending.svg', // TODO: Replace with actual tee mockup
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: [
      '/images/mockup-pending.svg'
    ],
    features: ['Premium Bella+Canvas 3001', 'Front Print Only', '100% Cotton', 'Classic Fit']
  },
  {
    id: 'solo-guitarist-core-sweatshirt',
    name: 'Solo Guitarist Crewneck',
    price: 65,
    description: "Loud enough to drown out your own thoughts.",
    category: 'crewnecks',
    image: '/images/mockup-pending.svg', // TODO: Replace with actual crewneck mockup
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: [
      '/images/mockup-pending.svg'
    ],
    features: ['Gildan 18000 Heavy Blend™', 'Front Print Only', 'Fleece Interior', 'Drop Shoulder']
  },
  {
    id: 'solo-guitarist-core-hoodie',
    name: 'Solo Guitarist Hoodie',
    price: 85,
    description: "Hood up. Internal volume maximum.",
    category: 'hoodies',
    image: '/images/mockup-pending.svg', // TODO: Replace with actual hoodie mockup
    graphicImage: '/images/products/ADHD3.jpg',
    gallery: [
      '/images/mockup-pending.svg'
    ],
    tagline: '"HEY LOOK! A SQUIRREL!"',
    features: ['Gildan 18500 Heavy Blend™', 'Front Print Only', 'Heavyweight Fleece', 'Front Pouch']
  }
];
