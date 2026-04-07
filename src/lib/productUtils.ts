import { Product, PRODUCTS } from '../types';

// ─── BUNDLE DEFINITIONS ───────────────────────────────────────────────────────

export interface BundleDefinition {
  id: string;
  name: string;
  productIds: string[];  // canonical product IDs included in this bundle
  discountAmount: number; // fixed Shopify checkout discount applied once per set
}

export interface AppliedBundle {
  bundle: BundleDefinition;
  sets: number;
  discountPerSet: number;
}

export const BUNDLE_DEFINITIONS: BundleDefinition[] = [
  {
    id: 'the-full-set',
    name: 'The Full Set',
    productIds: ['sonic-inferno-standard-tee', 'adhd-squirrel-tee'],
    discountAmount: 4.99,
  },
  {
    id: 'diagnosis-pack',
    name: 'Diagnosis Pack',
    productIds: ['late-diagnosed-tee', 'sonic-inferno-standard-tee'],
    discountAmount: 4.99,
  },
  {
    id: 'complete-chaos-set',
    name: 'Complete Chaos Set',
    productIds: ['sonic-inferno-standard-tee', 'adhd-squirrel-tee', 'late-diagnosed-tee'],
    discountAmount: 11.98,
  },
];

/** Returns the named bundle that contains BOTH product IDs, or null. */
export function getBundleForProducts(idA: string, idB: string): BundleDefinition | null {
  return (
    BUNDLE_DEFINITIONS.find(
      (b) => b.productIds.includes(idA) && b.productIds.includes(idB),
    ) ?? null
  );
}

// ─── BUNDLE ELIGIBILITY ───────────────────────────────────────────────────────

/** Only these product IDs are eligible to show/receive a bundle suggestion. */
const BUNDLE_ELIGIBLE_IDS = new Set([
  'sonic-inferno-standard-tee',
  'adhd-squirrel-tee',
  'late-diagnosed-tee',
]);

// ─── COMPLEMENT MAP ───────────────────────────────────────────────────────────
// For each bundle-eligible design family, preferred complement families (in priority order).

const BUNDLE_MAP: Record<string, string[]> = {
  'sonic-inferno': ['adhd-squirrel', 'late-diagnosed'],
  'adhd-squirrel': ['sonic-inferno', 'late-diagnosed'],
  'late-diagnosed': ['sonic-inferno', 'adhd-squirrel'],
  'solo-guitarist': [], // not in bundles
};

// ─── BUNDLE LOGIC ─────────────────────────────────────────────────────────────

/**
 * Returns the best bundle complement for the current product.
 * - Current product must be bundle-eligible (standard tee, eligible design family).
 * - Always returns a standard tee from a complementary design family.
 * - Returns null if current product is not bundle-eligible.
 */
export function getBundleTarget(currentProduct: Product): Product | null {
  if (!BUNDLE_ELIGIBLE_IDS.has(currentProduct.id)) return null;

  const targets = BUNDLE_MAP[currentProduct.designFamily] ?? [];

  for (const targetFamily of targets) {
    const match = PRODUCTS.find(
      (p) =>
        p.designFamily === targetFamily &&
        p.category === 't-shirts' &&
        p.variant === 'standard' &&
        !p.isOutOfStock &&
        p.id !== currentProduct.id,
    );
    if (match) return match;
  }

  return null;
}

// ─── UPGRADE LOGIC ────────────────────────────────────────────────────────────

/**
 * Returns same-design, different-category products (the upgrade path).
 * Variant-preserving: standard → standard, full-design → full-design.
 * Falls back to any same-design, different-category product.
 */
export function getUpgradeTargets(currentProduct: Product): Product[] {
  const sameVariant = PRODUCTS.filter(
    (p) =>
      p.designFamily === currentProduct.designFamily &&
      p.variant === currentProduct.variant &&
      p.category !== currentProduct.category &&
      !p.isOutOfStock &&
      p.id !== currentProduct.id,
  );

  if (sameVariant.length > 0) return sameVariant;

  return PRODUCTS.filter(
    (p) =>
      p.designFamily === currentProduct.designFamily &&
      p.category !== currentProduct.category &&
      !p.isOutOfStock &&
      p.id !== currentProduct.id,
  );
}

// ─── SIZE AVAILABILITY ────────────────────────────────────────────────────────

export const CATEGORY_SIZES: Record<string, string[]> = {
  't-shirts':  ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  'crewnecks': ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  'hoodies':   ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
};

/** Returns true if the given size exists in the product's category size range. */
export function isSizeAvailableForProduct(size: string, product: Product): boolean {
  const valid = CATEGORY_SIZES[product.category] ?? CATEGORY_SIZES['t-shirts'];
  return valid.includes(size);
}

/**
 * Scans the cart for specific bundle combinations and returns the total discount amount.
 * Note: Each item in a bundle must exist at least once. 
 * This treats bundle quantities as 1 set maximum for simplicity, or could be expanded.
 */
export function calculateBundleDiscount(cart: { id: string; price: number; quantity: number }[]): number {
  return findAppliedBundles(cart).reduce((sum, entry) => sum + entry.discountPerSet * entry.sets, 0);
}

export function getBundleCheckoutPrice(bundle: BundleDefinition, standardCost: number): number {
  return Math.max(0, standardCost - bundle.discountAmount);
}

export function findAppliedBundles(cart: { id: string; price: number; quantity: number }[]): AppliedBundle[] {
  const appliedBundles: AppliedBundle[] = [];

  // We'll work on a copy of quantities so a single item isn't counted for multiple bundles
  const itemCounts = cart.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Sort bundles by size (Complete Chaos first) to maximize customer savings
  const sortedBundles = [...BUNDLE_DEFINITIONS].sort((a,b) => b.productIds.length - a.productIds.length);

  for (const bundle of sortedBundles) {
    // Check how many times this bundle can be formed
    let possibleSets = Infinity;
    for (const pid of bundle.productIds) {
      possibleSets = Math.min(possibleSets, itemCounts[pid] || 0);
    }

    if (possibleSets > 0 && possibleSets !== Infinity) {
      const discountPerSet = bundle.discountAmount;

      if (discountPerSet > 0) {
        appliedBundles.push({
          bundle,
          sets: possibleSets,
          discountPerSet,
        });

        // Deduct items from the pool
        for (const pid of bundle.productIds) {
          itemCounts[pid] -= possibleSets;
        }
      }
    }
  }

  return appliedBundles;
}

// ─── DISPLAY LABELS ───────────────────────────────────────────────────────────

export const CATEGORY_LABEL: Record<string, string> = {
  't-shirts':   'TEE',
  'crewnecks':  'CREWNECK',
  'hoodies':    'HOODIE',
};

export const VARIANT_LABEL: Record<string, string> = {
  'standard':    'Standard',
  'full-design': 'Full Design (Front + Back)',
};
