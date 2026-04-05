# Shopify Extensions

This repo now includes the Shopify app workspace at `shopify-app/adhd-squirrel-shpfy`.

## Included extensions

### `return-to-storefront`

- Type: Checkout UI extension
- Targets:
  - `purchase.thank-you.block.render`
  - `customer-account.order-status.block.render`
- Purpose:
  - give customers a branded `Return to storefront` CTA after Shopify-hosted checkout
  - append `purchase=complete` so the React storefront can clear the local cart on return

Merchant setting required:

- `storefront_url`
  - full ADHD Squirrel storefront URL, for example `https://your-domain.com/`

### `adhd-squirrel-theme`

- Type: Theme app extension
- Purpose:
  - keep a clean branded Shopify-side block available without editing theme files directly
  - provide a global `Brand Embed` app embed that loads ADHD Squirrel storefront styling across the Shopify-hosted theme
  - current block is `Storefront Bridge`
  - use it where the Shopify-hosted side needs to feel intentional instead of generic

Suggested block setup:

- Primary URL: `https://adhdsquirrelshop.com`
- Secondary URL: your Shopify contact page or store support route

## Local commands

From `shopify-app/adhd-squirrel-shpfy`:

```bash
npm run dev
npm run deploy
```

## Merchant setup after deploy

1. Deploy the app version with the extensions.
2. In Shopify checkout customization, add `return-to-storefront` to:
   - Thank you page
   - Order status page
3. Set the `storefront_url` extension setting to the live ADHD Squirrel storefront URL.
4. In the Shopify theme editor, optionally add the `Storefront Bridge` app block where needed.
5. In the Shopify theme editor, enable the `Brand Embed` app embed to apply the ADHD Squirrel storefront styling to the Shopify-hosted theme.

## Storefront integration

The React storefront now clears the local cart when the shopper returns with:

```text
?purchase=complete
```

That behavior lives in `src/components/ShopifyReturnHandler.tsx`.
