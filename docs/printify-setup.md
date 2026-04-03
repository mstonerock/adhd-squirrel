# Printify Setup Pack

## Scope
Set up only the products that are actually live in the storefront right now.

Provider baseline:
- Use `Monster Digital` as the source of truth for blank availability and live size ranges.
- If the storefront and Printify drift, Monster Digital availability wins until the storefront is updated.

Do not create:
- non-Sonic hoodies
- bundle products in Printify
- extra colorways
- account/login products or any speculative variants

Bundles are storefront/cart logic only. In Printify, create the individual products only.

## Naming Convention
Use this for the Printify admin title:

`ADHD Squirrel | {Design Family} | {Variant} | {Blank Code} | {Apparel} | Black`

Examples:
- `ADHD Squirrel | Sonic Inferno | Standard | 3001 | Tee | Black`
- `ADHD Squirrel | Sonic Inferno | Full Design | 18000 | Crewneck | Black`
- `ADHD Squirrel | Late Diagnosed | Standard | 3001 | Tee | Black`

Use this for SKU roots:

`{storefront_product_id}__{size}`

Examples:
- `sonic-inferno-standard-tee__L`
- `sonic-inferno-fulldesign-hoodie__2XL`

## Source Of Truth
Storefront product IDs and prices already live in:
- [src/types.ts](C:/Projects/ADHD-Squirrel/src/types.ts)

Bundle definitions already live in:
- [src/lib/productUtils.ts](C:/Projects/ADHD-Squirrel/src/lib/productUtils.ts)

Primary print masters live in:
- [product-masters/adhd-squirrel/adhd-squirrel.png](C:/Projects/ADHD-Squirrel/product-masters/adhd-squirrel/adhd-squirrel.png)
- [product-masters/late-diagnosed/late-diagnosed.png](C:/Projects/ADHD-Squirrel/product-masters/late-diagnosed/late-diagnosed.png)
- [product-masters/solo-guitarist/solo-guitarist.png](C:/Projects/ADHD-Squirrel/product-masters/solo-guitarist/solo-guitarist.png)
- [product-masters/sonic-inferno/sonic-inferno.png](C:/Projects/ADHD-Squirrel/product-masters/sonic-inferno/sonic-inferno.png)
- [product-masters/sonic-inferno/solo-guitarist.png](C:/Projects/ADHD-Squirrel/product-masters/sonic-inferno/solo-guitarist.png)
- [product-masters/sonic-inferno/sonic-inferno-hoodie.png](C:/Projects/ADHD-Squirrel/product-masters/sonic-inferno/sonic-inferno-hoodie.png)

Ignore this for product setup:
- [product-masters/late-diagnosed/Auto-generated Video Mockup - Video mockup.mp4](C:/Projects/ADHD-Squirrel/product-masters/late-diagnosed/Auto-generated%20Video%20Mockup%20-%20Video%20mockup.mp4)

## Product Matrix
| Storefront ID | Storefront Name | Printify Title | Blank | Print Sides | Sizes | Retail |
|---|---|---|---|---|---|---|
| `sonic-inferno-standard-tee` | Sonic Inferno — Standard Tee | ADHD Squirrel \| Sonic Inferno \| Standard \| 3001 \| Tee \| Black | Bella+Canvas 3001 | Front only | S-3XL | S-XL `$23.99`, 2XL `$25.99`, 3XL `$28.99` |
| `sonic-inferno-fulldesign-tee` | Sonic Inferno — Full Design Tee | ADHD Squirrel \| Sonic Inferno \| Full Design \| 3001 \| Tee \| Black | Bella+Canvas 3001 | Front + back | S-3XL | S-XL `$29.99`, 2XL `$31.99`, 3XL `$34.99` |
| `solo-guitarist-tee` | Solo Guitarist Tee | ADHD Squirrel \| Solo Guitarist \| Standard \| 3001 \| Tee \| Black | Bella+Canvas 3001 | Front only | S-3XL | S-XL `$23.99`, 2XL `$25.99`, 3XL `$28.99` |
| `adhd-squirrel-tee` | ADHD Squirrel Tee | ADHD Squirrel \| ADHD Squirrel \| Standard \| 3001 \| Tee \| Black | Bella+Canvas 3001 | Front only | S-3XL | S-XL `$23.99`, 2XL `$25.99`, 3XL `$28.99` |
| `late-diagnosed-tee` | Late Diagnosed Tee | ADHD Squirrel \| Late Diagnosed \| Standard \| 3001 \| Tee \| Black | Bella+Canvas 3001 | Front only | S-3XL | S-XL `$23.99`, 2XL `$25.99`, 3XL `$28.99` |
| `sonic-inferno-standard-crewneck` | Sonic Inferno — Standard Crewneck | ADHD Squirrel \| Sonic Inferno \| Standard \| 18000 \| Crewneck \| Black | Gildan 18000 | Front only | S-3XL | S-XL `$34.99`, 2XL `$37.99`, 3XL `$38.99` |
| `sonic-inferno-fulldesign-crewneck` | Sonic Inferno — Full Design Crewneck | ADHD Squirrel \| Sonic Inferno \| Full Design \| 18000 \| Crewneck \| Black | Gildan 18000 | Front + back | S-3XL | S-XL `$41.99`, 2XL `$44.99`, 3XL `$45.99` |
| `solo-guitarist-crewneck` | Solo Guitarist Crewneck | ADHD Squirrel \| Solo Guitarist \| Standard \| 18000 \| Crewneck \| Black | Gildan 18000 | Front only | S-3XL | S-XL `$34.99`, 2XL `$37.99`, 3XL `$38.99` |
| `adhd-squirrel-crewneck` | ADHD Squirrel Crewneck | ADHD Squirrel \| ADHD Squirrel \| Standard \| 18000 \| Crewneck \| Black | Gildan 18000 | Front only | S-3XL | S-XL `$34.99`, 2XL `$37.99`, 3XL `$38.99` |
| `late-diagnosed-crewneck` | Late Diagnosed Crewneck | ADHD Squirrel \| Late Diagnosed \| Standard \| 18000 \| Crewneck \| Black | Gildan 18000 | Front only | S-3XL | S-XL `$34.99`, 2XL `$37.99`, 3XL `$38.99` |
| `sonic-inferno-standard-hoodie` | Sonic Inferno — Standard Hoodie | ADHD Squirrel \| Sonic Inferno \| Standard \| 18500 \| Hoodie \| Black | Gildan 18500 | Front only | S-5XL | S-XL `$39.99`, 2XL `$41.99`, 3XL-5XL `$42.99` |
| `sonic-inferno-fulldesign-hoodie` | Sonic Inferno — Full Design Hoodie | ADHD Squirrel \| Sonic Inferno \| Full Design \| 18500 \| Hoodie \| Black | Gildan 18500 | Front + back | S-5XL | S-XL `$45.99`, 2XL `$47.99`, 3XL-5XL `$49.99` |

## Art Placement Map
| Storefront ID | Front master | Back master |
|---|---|---|
| `sonic-inferno-standard-tee` | `product-masters/sonic-inferno/sonic-inferno.png` | none |
| `sonic-inferno-fulldesign-tee` | `product-masters/sonic-inferno/sonic-inferno.png` | `product-masters/sonic-inferno/solo-guitarist.png` |
| `solo-guitarist-tee` | `product-masters/solo-guitarist/solo-guitarist.png` | none |
| `adhd-squirrel-tee` | `product-masters/adhd-squirrel/adhd-squirrel.png` | none |
| `late-diagnosed-tee` | `product-masters/late-diagnosed/late-diagnosed.png` | none |
| `sonic-inferno-standard-crewneck` | `product-masters/sonic-inferno/sonic-inferno.png` | none |
| `sonic-inferno-fulldesign-crewneck` | `product-masters/sonic-inferno/sonic-inferno.png` | `product-masters/sonic-inferno/solo-guitarist.png` |
| `solo-guitarist-crewneck` | `product-masters/solo-guitarist/solo-guitarist.png` | none |
| `adhd-squirrel-crewneck` | `product-masters/adhd-squirrel/adhd-squirrel.png` | none |
| `late-diagnosed-crewneck` | `product-masters/late-diagnosed/late-diagnosed.png` | none |
| `sonic-inferno-standard-hoodie` | `product-masters/sonic-inferno/sonic-inferno-hoodie.png` | none |
| `sonic-inferno-fulldesign-hoodie` | `product-masters/sonic-inferno/sonic-inferno-hoodie.png` | `product-masters/sonic-inferno/solo-guitarist.png` |

## Setup Order
1. Build all `3001` tees first.
2. Build `18000` crewnecks second.
3. Build only the two Sonic hoodies last.
4. Record Printify product IDs and variant IDs immediately in the mapping sheet.
5. Do not create bundles in Printify.

## Operational Notes
- Color should stay `Black` unless the storefront changes.
- `Gildan 18000` in Monster Digital black is currently `S-3XL` only.
- `Gildan 18500` in Monster Digital black is currently `S-5XL`.
- Variant logic is storefront-driven:
  - `standard` = front only
  - `full-design` = front + back
- `Solo Guitarist`, `ADHD Squirrel`, and `Late Diagnosed` are single-configuration products.
- Only `Sonic Inferno` uses both `standard` and `full-design`.
- If Printify requires separate placement tuning for hoodies, use the hoodie-specific front master for both Sonic hoodie products.
