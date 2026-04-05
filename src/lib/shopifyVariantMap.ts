import type { CartItem } from '../types';

export type ShopifyVariantIdMap = Record<string, string>;

function buildSkuKey(productId: string, size: string): string {
  return `${productId}__${size}`;
}

function parseVariantMapEnv(raw: string | undefined): ShopifyVariantIdMap {
  if (!raw?.trim()) {
    return {};
  }

  const candidates = [raw, raw.replace(/\\"/g, '"')];

  try {
    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate) as unknown;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          continue;
        }

        return Object.fromEntries(
          Object.entries(parsed).flatMap(([sku, value]) => {
            if (typeof value !== 'string' || !value.trim()) {
              return [];
            }

            return [[sku, value.trim()]];
          }),
        );
      } catch {
        continue;
      }
    }

    throw new Error('Variant map must be a JSON object');
  } catch (error) {
    console.warn('Invalid VITE_SHOPIFY_VARIANT_ID_MAP value. Expected JSON object of SKU -> variant id.', error);
    return {};
  }
}

function normalizeVariantId(value: string): string {
  if (value.startsWith('gid://shopify/ProductVariant/')) {
    return value;
  }

  if (/^\d+$/.test(value)) {
    return `gid://shopify/ProductVariant/${value}`;
  }

  return value;
}

// @ts-ignore
export const shopifyVariantIdMap = parseVariantMapEnv(import.meta.env.VITE_SHOPIFY_VARIANT_ID_MAP);

export function getCartItemSku(item: Pick<CartItem, 'id' | 'selectedSize'>): string | null {
  if (!item.selectedSize) {
    return null;
  }

  return buildSkuKey(item.id, item.selectedSize);
}

export function resolveShopifyVariantId(item: Pick<CartItem, 'id' | 'selectedSize'>): string | null {
  const sku = getCartItemSku(item);
  if (!sku) {
    return null;
  }

  const mapped = shopifyVariantIdMap[sku];
  if (!mapped) {
    return null;
  }

  return normalizeVariantId(mapped);
}

export function getMissingVariantSkus(items: Array<Pick<CartItem, 'id' | 'selectedSize'>>): string[] {
  return Array.from(
    new Set(
      items
        .map(getCartItemSku)
        .filter((sku): sku is string => Boolean(sku))
        .filter((sku) => !shopifyVariantIdMap[sku]),
    ),
  );
}
