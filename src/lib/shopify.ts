import Client from 'shopify-buy';
import type { CartItem } from '../types';
import { getMissingVariantSkus, resolveShopifyVariantId, shopifyVariantIdMap } from './shopifyVariantMap';

/**
 * Shopify Headless Commerce Client
 * 
 * Instructions:
 * When you are ready to connect to Printify, you will:
 * 1. Sign up for Shopify ($5 Starter Plan)
 * 2. Create a "Headless" app in the Shopify settings to get a Storefront API Token.
 * 3. Add these to your .env file:
 *    VITE_SHOPIFY_DOMAIN=your-store-name.myshopify.com
 *    VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
 *    VITE_SHOPIFY_VARIANT_ID_MAP={"sonic-inferno-standard-tee__L":"gid://shopify/ProductVariant/1234567890"}
 */

// @ts-ignore
const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'adhd-squirrel.myshopify.com';
// @ts-ignore
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'placeholder_token';

export function isShopifyConfigured(): boolean {
  return storefrontAccessToken !== 'placeholder_token' && Boolean(domain);
}

export function isShopifyCheckoutReady(): boolean {
  return isShopifyConfigured() && Object.keys(shopifyVariantIdMap).length > 0;
}

export const shopifyClient = Client.buildClient({
  domain,
  storefrontAccessToken,
  apiVersion: '2024-01',
});

/**
 * Creates an empty cart/checkout session in Shopify
 * Used when a user clicks "Add to Cart" for the first time
 */
export const createShopifyCheckout = async () => {
  try {
    if (!isShopifyConfigured()) {
      return null;
    }

    const checkout = await shopifyClient.checkout.create();
    return checkout;
  } catch (error) {
    console.error("Shopify is not configured yet. Use the dummy cart for now.", error);
    return null;
  }
};

/**
 * The Master Bridge between React Cart State and Live Shopify Checkouts
 */
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

    // 1. Create an empty checkout session
    const checkout = await shopifyClient.checkout.create();
    
    // 2. Map cart items to explicit Shopify variant IDs using the stable SKU convention.
    const lineItemsToAdd = cartItems.map(item => {
      const variantId = resolveShopifyVariantId(item);
      if (!variantId) {
        throw new Error(`Missing Shopify variant id for ${item.id} (${item.selectedSize ?? 'no-size'})`);
      }

      return {
        variantId,
        quantity: item.quantity,
        customAttributes: [{ key: "Size", value: String(item.selectedSize || "L") }]
      };
    });

    // 3. Inject our mapped items into the Shopify checkout
    const updatedCheckout = await shopifyClient.checkout.addLineItems(checkout.id, lineItemsToAdd);
    
    // 4. Return the Shopify-hosted payment portal screen!
    return updatedCheckout.webUrl;
  } catch (error) {
    console.warn("Shopify integration bridge triggered: storefront mapping is not fully wired yet. Safely routing to dummy developer checkout.");
    return null; // Signals the Cart component to failover to local dev page
  }
};
