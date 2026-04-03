# ADHD SQUIRREL — Storefront

> *Built by someone who lives in two completely different systems at the same time.*

Live: **[adhd-squirrel.vercel.app](https://adhd-squirrel.vercel.app)**  
Repo: `mstonerock/adhd-squirrel`

---

## What This Is

A custom React storefront for ADHD Squirrel — a brand built around ADHD identity, heavy graphic apparel, and the internal monologue that comes with it. This is a headless frontend that will connect to Shopify for cart, checkout, and order management.

---

## Current State

- ✅ Full React + TypeScript + Vite storefront
- ✅ Homepage with hero, product grid, mosaic lifestyle section, email capture
- ✅ Product detail pages with gallery, size selection, size guide modal, sticky mobile CTA
- ✅ Slide-out cart drawer with quantity controls
- ✅ Mobile-first — hamburger nav overlay, sticky "YEAH, THIS ONE." CTA
- ✅ Branded voice throughout (see Brand Copy section below)
- ✅ Checkout page (currently local dev form — Shopify handoff pending)
- ✅ Thank You / order confirmation page
- ✅ Manifesto / Our Story page
- ✅ Deployed on Vercel (auto-deploys on push to `master`)

---

## Future State

- ⏳ **Shopify integration** — wire Storefront API keys so cart → Shopify checkout is live
- ⏳ **Custom domain** — point domain at Vercel once purchased
- ⏳ **Bundle UI** — "COMPLETE THE CHAOS" section on product pages with bundle CTA (`ADD IT TOO.`)
- ⏳ **Out-of-stock state** — `Gone. You hesitated.` copy + disabled state on sold-out products
- ⏳ **Solo Guitarist product mockups** — designs exist, need proper garment mockups generated before launch (currently showing `MOCKUP PENDING` placeholder — do **not** swap in raw graphic)
- ⏳ **2-sided product mockups** — `sonic-inferno-2sided-*` products need back-side mockups applied

---

## Brand Copy Guardrails

- Tone = internal thoughts, not marketing copy
- Checkout and transactional fields stay readable and trustworthy
- Do not brand form labels, address fields, or standard inputs
- Let structure stay familiar; let copy carry the personality

**Key copy reference:**

| Location | Copy |
|---|---|
| Add to cart (desktop) | `YEAH, THIS ONE.` |
| Add to cart (mobile) | `YEAH, THIS ONE. — $XX` |
| Post-add confirmation | `DONE. FINALLY.` |
| Cart title | `Your Haul` |
| Checkout CTA | `COMMIT (FOR ONCE)` |
| Checkout dismiss | `Wait—what was I doing?` |
| Checkout page title | `LET'S DO THIS.` |
| Submit payment | `LOCK IT IN — $XX` |
| Processing | `RUNNING THE NUMBERS...` |
| SSL trust text | `Your payment is secure. Your attention span is not.` |
| Empty cart | `You opened this for a reason.` / `Empty.` |
| Order confirmed body | `Your gear is being forged in the static.` |

---

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## Deploy

Pushing to `master` on GitHub auto-deploys to Vercel. No manual build step needed.

For end-of-day saves or major changes:

```bash
git add -A
git commit -m "your message"
git push
```

---

## Printify Notes

If this store pattern gets reused, keep these rules:

- Printify stores are not the same thing as the Printify account. One account can accumulate multiple store records with the same Shopify title. Reinstalls can create a new connected store and leave old disconnected/expired ones behind.
- Verify the real destination shop by API `shop_id` and `sales_channel`, not by store title alone.
- Keep one disconnected staging shop for placement tests and one connected production shop for real publishes. The local create script supports `--shop-id` for this reason.
- Use the print provider as the source of truth for live size ranges. For this project, `Monster Digital` won over earlier storefront assumptions.
- Attach SKUs at the variant level using stable internal keys, not display labels. Pattern used here: `storefront_product_id__SIZE`.
- When updating Printify `variants`, fetch the current product first and preserve the disabled catalog variants. Printify returns the full variant set, not just the enabled Black variants.
- Keep the Printify token out of repo files. This project uses a Windows DPAPI-backed local secret path instead of `.env`.

Reference files:

- [printify-setup.md](C:/Projects/ADHD-Squirrel/docs/printify-setup.md)
- [printify-mapping-template.csv](C:/Projects/ADHD-Squirrel/docs/printify-mapping-template.csv)
- [create-product.ts](C:/Projects/ADHD-Squirrel/scripts/printify/create-product.ts)
- [sync-skus.ts](C:/Projects/ADHD-Squirrel/scripts/printify/sync-skus.ts)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer) |
| Routing | React Router v7 |
| Commerce | Shopify Storefront API (pending) |
| Hosting | Vercel (free tier) |
| Icons | Lucide React |
