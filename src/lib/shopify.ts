import Client from 'shopify-buy';

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
 */

// @ts-ignore
const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'adhd-squirrel.myshopify.com';
// @ts-ignore
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'placeholder_token';

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
export const processShopifyCheckout = async (cartItems: any[]) => {
  try {
    // 1. Create an empty checkout session
    const checkout = await shopifyClient.checkout.create();
    
    // 2. Map our local cart items to actual Shopify Variant IDs.
    // When you finally pull down live Shopify products, item.id will naturally be the Shopify Variant base64 ID.
    const lineItemsToAdd = cartItems.map(item => {
      // We fake the encoding shape locally to gracefully fail if no real Shopify token is configured
      const variantId = item.id.includes('gid://') ? item.id : btoa(`gid://shopify/ProductVariant/${item.id}`);
      return {
        variantId: variantId,
        quantity: item.quantity,
        customAttributes: [{ key: "Size", value: String(item.selectedSize || "L") }]
      };
    });

    // 3. Inject our mapped items into the Shopify checkout
    const updatedCheckout = await shopifyClient.checkout.addLineItems(checkout.id, lineItemsToAdd);
    
    // 4. Return the Shopify-hosted payment portal screen!
    return updatedCheckout.webUrl;
  } catch (error) {
    // This warning hits if the VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing or item map fails.
    console.warn("Shopify integration bridge triggered: Pending real storefront Token / Live Variant Mapping. Safely routing to dummy developer checkout.");
    return null; // Signals the Cart component to failover to local dev page
  }
};
