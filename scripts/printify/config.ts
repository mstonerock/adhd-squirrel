import type { Product } from '../../src/types';

export type PrintSides = 'front-only' | 'front-and-back';
export type SetupPhase = 'tees' | 'crewnecks' | 'hoodies';

export interface PrintPlacement {
  x: number;
  y: number;
  scale: number;
  angle: number;
}

export interface PrintifyProductConfig {
  productId: Product['id'];
  designLabel: string;
  variantLabel: string;
  blankCode: string;
  blankName: string;
  apparelLabel: string;
  color: string;
  printSides: PrintSides;
  frontMaster: string;
  backMaster?: string;
  frontPlacement?: PrintPlacement;
  backPlacement?: PrintPlacement;
  setupPhase: SetupPhase;
}

export const PRINTIFY_PRODUCT_CONFIG: PrintifyProductConfig[] = [
  {
    productId: 'sonic-inferno-standard-tee',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Standard',
    blankCode: '3001',
    blankName: 'Bella+Canvas 3001',
    apparelLabel: 'Tee',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'tees',
  },
  {
    productId: 'sonic-inferno-fulldesign-tee',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Full Design',
    blankCode: '3001',
    blankName: 'Bella+Canvas 3001',
    apparelLabel: 'Tee',
    color: 'Black',
    printSides: 'front-and-back',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno.png',
    backMaster: 'product-masters/sonic-inferno/solo-guitarist.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'tees',
  },
  {
    productId: 'solo-guitarist-tee',
    designLabel: 'Solo Guitarist',
    variantLabel: 'Standard',
    blankCode: '3001',
    blankName: 'Bella+Canvas 3001',
    apparelLabel: 'Tee',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/solo-guitarist/solo-guitarist.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'tees',
  },
  {
    productId: 'adhd-squirrel-tee',
    designLabel: 'ADHD Squirrel',
    variantLabel: 'Standard',
    blankCode: '3001',
    blankName: 'Bella+Canvas 3001',
    apparelLabel: 'Tee',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/adhd-squirrel/adhd-squirrel.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'tees',
  },
  {
    productId: 'late-diagnosed-tee',
    designLabel: 'Late Diagnosed',
    variantLabel: 'Standard',
    blankCode: '3001',
    blankName: 'Bella+Canvas 3001',
    apparelLabel: 'Tee',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/late-diagnosed/late-diagnosed.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'tees',
  },
  {
    productId: 'sonic-inferno-standard-crewneck',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Standard',
    blankCode: '18000',
    blankName: 'Gildan 18000',
    apparelLabel: 'Crewneck',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'crewnecks',
  },
  {
    productId: 'sonic-inferno-fulldesign-crewneck',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Full Design',
    blankCode: '18000',
    blankName: 'Gildan 18000',
    apparelLabel: 'Crewneck',
    color: 'Black',
    printSides: 'front-and-back',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno.png',
    backMaster: 'product-masters/sonic-inferno/solo-guitarist.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    backPlacement: { x: 0.5000000000000001, y: 0.47294117647058775, scale: 0.95, angle: 0 },
    setupPhase: 'crewnecks',
  },
  {
    productId: 'solo-guitarist-crewneck',
    designLabel: 'Solo Guitarist',
    variantLabel: 'Standard',
    blankCode: '18000',
    blankName: 'Gildan 18000',
    apparelLabel: 'Crewneck',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/solo-guitarist/solo-guitarist.png',
    frontPlacement: { x: 0.5000000000000001, y: 0.47294117647058775, scale: 0.95, angle: 0 },
    setupPhase: 'crewnecks',
  },
  {
    productId: 'adhd-squirrel-crewneck',
    designLabel: 'ADHD Squirrel',
    variantLabel: 'Standard',
    blankCode: '18000',
    blankName: 'Gildan 18000',
    apparelLabel: 'Crewneck',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/adhd-squirrel/adhd-squirrel.png',
    frontPlacement: { x: 0.5, y: 0.5163673400779213, scale: 0.9202066378884737, angle: 0 },
    setupPhase: 'crewnecks',
  },
  {
    productId: 'late-diagnosed-crewneck',
    designLabel: 'Late Diagnosed',
    variantLabel: 'Standard',
    blankCode: '18000',
    blankName: 'Gildan 18000',
    apparelLabel: 'Crewneck',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/late-diagnosed/late-diagnosed.png',
    frontPlacement: { x: 0.5, y: 0.5105943836659403, scale: 0.95, angle: 0 },
    setupPhase: 'crewnecks',
  },
  {
    productId: 'sonic-inferno-standard-hoodie',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Standard',
    blankCode: '18500',
    blankName: 'Gildan 18500',
    apparelLabel: 'Hoodie',
    color: 'Black',
    printSides: 'front-only',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno-hoodie.png',
    frontPlacement: { x: 0.5, y: 0.5, scale: 0.95, angle: 0 },
    setupPhase: 'hoodies',
  },
  {
    productId: 'sonic-inferno-fulldesign-hoodie',
    designLabel: 'Sonic Inferno',
    variantLabel: 'Full Design',
    blankCode: '18500',
    blankName: 'Gildan 18500',
    apparelLabel: 'Hoodie',
    color: 'Black',
    printSides: 'front-and-back',
    frontMaster: 'product-masters/sonic-inferno/sonic-inferno-hoodie.png',
    backMaster: 'product-masters/sonic-inferno/solo-guitarist.png',
    frontPlacement: { x: 0.5, y: 0.5, scale: 0.95, angle: 0 },
    setupPhase: 'hoodies',
  },
];
