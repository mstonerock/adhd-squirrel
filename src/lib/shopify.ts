import type { CartItem } from '../types';
import { getMissingVariantSkus, resolveShopifyVariantId, shopifyVariantIdMap } from './shopifyVariantMap';
import { findAppliedBundles } from './productUtils';

// @ts-ignore
const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'adhd-squirrel.myshopify.com';
// @ts-ignore
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'placeholder_token';

const STOREFRONT_API_VERSION = '2025-10';

function parseJsonEnv<T>(rawValue: string | undefined, fallback: T): T {
  if (!rawValue?.trim()) {
    return fallback;
  }

  try {
    const candidates = [rawValue, rawValue.replace(/\\"/g, '"')];

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate) as T;
      } catch {
        continue;
      }
    }

    throw new Error('Invalid JSON environment variable');
  } catch (error) {
    console.warn('Failed to parse Shopify JSON environment variable.', error);
    return fallback;
  }
}

// @ts-ignore
const shopifyBundleDiscountCodes = parseJsonEnv<Record<string, string>>(import.meta.env.VITE_SHOPIFY_BUNDLE_DISCOUNT_CODES, {});

type StorefrontUserError = {
  field?: string[] | null;
  message: string;
};

type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
      } | null;
      userErrors?: StorefrontUserError[] | null;
      warnings?: Array<{ code?: string | null; message: string; target?: string | null }> | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

type CartDiscountCodesUpdateResponse = {
  data?: {
    cartDiscountCodesUpdate?: {
      cart?: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
      } | null;
      userErrors?: StorefrontUserError[] | null;
      warnings?: Array<{ code?: string | null; message: string; target?: string | null }> | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

export function isShopifyConfigured(): boolean {
  return storefrontAccessToken !== 'placeholder_token' && Boolean(domain);
}

export function isShopifyCheckoutReady(): boolean {
  return isShopifyConfigured() && Object.keys(shopifyVariantIdMap).length > 0;
}

function resolveApplicableDiscountCodes(cartItems: CartItem[]): string[] {
  const appliedBundles = findAppliedBundles(
    cartItems.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
    })),
  );

  const codes = appliedBundles
    .map(({ bundle }) => shopifyBundleDiscountCodes[bundle.id])
    .filter((code): code is string => Boolean(code));

  return [...new Set(codes)];
}

async function storefrontRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const createShopifyCheckout = async () => {
  try {
    if (!isShopifyConfigured()) {
      return null;
    }

    const result = await storefrontRequest<CartCreateResponse>(
      `
        mutation CreateCart($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              totalQuantity
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { input: {} },
    );

    const userErrors = result.data?.cartCreate?.userErrors ?? [];
    if (result.errors?.length || userErrors.length) {
      console.warn('Shopify cart creation failed.', {
        errors: result.errors,
        userErrors,
      });
      return null;
    }

    return result.data?.cartCreate?.cart ?? null;
  } catch (error) {
    console.error('Shopify cart creation failed.', error);
    return null;
  }
};

export const processShopifyCheckout = async (cartItems: CartItem[]) => {
  try {
    if (!isShopifyConfigured()) {
      console.warn('Shopify checkout skipped: missing storefront domain/token.');
      return null;
    }

    const missingVariantSkus = getMissingVariantSkus(cartItems);
    if (missingVariantSkus.length > 0) {
      console.warn('Shopify checkout skipped: missing Shopify variant ids for SKUs.', missingVariantSkus);
      return null;
    }

    const lines = cartItems.map((item) => {
      const merchandiseId = resolveShopifyVariantId(item);
      if (!merchandiseId) {
        throw new Error(`Missing Shopify variant id for ${item.id} (${item.selectedSize ?? 'no-size'})`);
      }

      return {
        merchandiseId,
        quantity: item.quantity,
        attributes: [{ key: 'Size', value: String(item.selectedSize || 'L') }],
      };
    });

    const discountCodes = resolveApplicableDiscountCodes(cartItems);

    const result = await storefrontRequest<CartCreateResponse>(
      `
        mutation CreateCart($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              totalQuantity
            }
            userErrors {
              field
              message
            }
            warnings {
              code
              message
              target
            }
          }
        }
      `,
      { input: { lines } },
    );

    const cartCreate = result.data?.cartCreate;
    const userErrors = cartCreate?.userErrors ?? [];
    const warnings = cartCreate?.warnings ?? [];
    let cart = cartCreate?.cart ?? null;

    if (result.errors?.length || userErrors.length) {
      console.warn('Shopify checkout skipped: cart creation returned errors.', {
        errors: result.errors,
        userErrors,
      });
      return null;
    }

    if (!cart?.checkoutUrl || cart.totalQuantity < 1) {
      console.warn('Shopify checkout skipped: cart was created without line items.', {
        cart,
        warnings,
      });
      return null;
    }

    if (discountCodes.length > 0) {
      const discountResult = await storefrontRequest<CartDiscountCodesUpdateResponse>(
        `
          mutation UpdateCartDiscountCodes($cartId: ID!, $discountCodes: [String!]) {
            cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
              cart {
                id
                checkoutUrl
                totalQuantity
              }
              userErrors {
                field
                message
              }
              warnings {
                code
                message
                target
              }
            }
          }
        `,
        {
          cartId: cart.id,
          discountCodes,
        },
      );

      const discountUpdate = discountResult.data?.cartDiscountCodesUpdate;
      const discountUserErrors = discountUpdate?.userErrors ?? [];
      const discountWarnings = discountUpdate?.warnings ?? [];
      const updatedCart = discountUpdate?.cart ?? null;

      if (discountResult.errors?.length || discountUserErrors.length) {
        console.warn('Shopify bundle discount codes could not be applied.', {
          discountCodes,
          errors: discountResult.errors,
          userErrors: discountUserErrors,
          warnings: discountWarnings,
        });
      } else if (updatedCart?.checkoutUrl) {
        cart = updatedCart;
      }
    }

    return cart.checkoutUrl;
  } catch (error) {
    console.warn('Shopify integration bridge triggered: storefront cart creation failed. Safely routing to dummy developer checkout.', error);
    return null;
  }
};
