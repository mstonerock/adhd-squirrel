# ADHD Squirrel Launch Checklist

Use this when moving a React storefront onto Shopify + Printify again.

## Current technical state

- The React storefront is deployed and browsable.
- Printify products exist in the connected production shop `27048284`.
- Production Printify variants already have stable SKUs in the format `storefront_product_id__SIZE`.
- The current cart tries to hand off to Shopify checkout through [shopify.ts](C:/Projects/ADHD-Squirrel/src/lib/shopify.ts).
- The current app still falls back to the local `/checkout` page if the Shopify Storefront token is missing or the variant mapping is not real.

## Headless storefront blockers

- Add real `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
- Fill `VITE_SHOPIFY_VARIANT_ID_MAP` with real Shopify variant ids before checkout handoff.
- Confirm each product/size in the React app maps to the correct Shopify variant.
- Test full cart -> Shopify checkout redirect on mobile and desktop.

Reference files:

- [shopify.ts](C:/Projects/ADHD-Squirrel/src/lib/shopify.ts)
- [shopifyVariantMap.ts](C:/Projects/ADHD-Squirrel/src/lib/shopifyVariantMap.ts)
- [shopify-variant-id-map.template.json](C:/Projects/ADHD-Squirrel/docs/shopify-variant-id-map.template.json)

## Printify walkthrough

### Store sanity check

- Confirm you are inside the connected store, not a disconnected or expired duplicate.
- Confirm the production destination is still the Shopify-connected shop, not the staging shop.

### Payments and billing

- Go to `Wallet -> Payments`.
- Add a default credit/debit card for automatic order charges.
- Optionally add Printify Balance as a buffer.
- Set a low-balance alert if you want warning before failed order charges.
- Confirm the billing address on the saved card is correct.

### Account and invoice settings

- Go to `Account -> My account`.
- Confirm business name, contact details, and address are correct for future invoices.
- Go to `Account -> Settings`.
- Choose invoice frequency:
  - `Per order` for simpler one-order tracing
  - `Monthly invoice` for cleaner bookkeeping

### Store settings

- Open the connected Shopify store inside Printify.
- Go to `Store settings`.
- Confirm store name.
- Confirm ship-from address.
- Confirm order approval settings.
- Confirm billing currency and store currency are what you expect.

### Product readiness

- Confirm every product is in the connected shop.
- Confirm hidden/unpublished status before final review.
- Confirm front/back placement on the premium products.
- Confirm mockups look right for tee, crewneck, and hoodie.
- Confirm enabled sizes match Monster Digital:
  - `3001` black = `S-3XL`
  - `18000` black = `S-3XL`
  - `18500` black = `S-5XL`
- Confirm SKUs are attached to enabled Black variants only.

## Shopify walkthrough

### Plan and store access

- Confirm the store is on a paid plan if you want public access.
- Check `Online Store -> Preferences`.
- Remove password protection only when you are actually ready for public traffic.

### Payments and payouts

- Go to `Settings -> Payments`.
- Confirm Shopify Payments is active, or confirm the payment provider you actually plan to use.
- Under Shopify Payments `Manage`, confirm:
  - payout account / bank account
  - payout notification emails
  - payout schedule
  - statement descriptor / payout name
- If you change the bank account, expect a temporary payout pause.

### Billing

- Go to `Settings -> Billing`.
- Confirm the card or bank method used for Shopify subscription/app charges.
- Confirm store owner and billing contact are correct.

### Shipping, taxes, and policies

- Confirm shipping zones and rates.
- Confirm tax settings.
- Confirm refund/privacy/terms/shipping policy pages are set.
- Confirm contact email and business address are correct.

### Product and sales channel checks

- Confirm products pushed from Printify exist in Shopify.
- Confirm products are active, not draft.
- Confirm they are available on the intended sales channel(s).
- Confirm at minimum they are available on `Online Store` before expecting Storefront checkout to work.
- Confirm product titles, descriptions, images, and variants look correct after sync.
- Confirm SKU values survived the sync.
- Confirm variants are actually sellable:
  - inventory policy is not blocking checkout
  - either positive inventory is present or `Continue selling when out of stock` is enabled for launch/testing

### Production parity rule

- Anything required to make dev Storefront checkout work must be mirrored on production before the app points at production Shopify.
- Current known parity requirements:
  - products assigned to `Online Store`
  - variants sellable from Storefront
  - SKU mappings still intact after sync
  - published products resolved into the production variant-id map

## Go-live order

1. Finish Printify payment, invoice, and store settings.
2. Publish one test product from Printify to Shopify.
3. Verify that product in Shopify:
   - active status
   - images
   - variants
   - SKUs
   - sales channel availability
4. Wire the real Shopify Storefront token into the React app.
5. Map React cart items to real Shopify variant ids.
6. Run a full checkout test from the React app into Shopify checkout.
7. Publish the remaining approved Printify products.
8. Remove Shopify password protection only when the checkout path is verified.

## First live test

- Add one tee from the React app.
- Confirm redirect reaches real Shopify checkout, not the local fallback page.
- Complete a low-risk real order if possible.
- Confirm:
  - payment captured in Shopify
  - order appears in Printify
  - Printify payment method covers production cost
  - shipping label/store details look right
  - payout path in Shopify is correct
