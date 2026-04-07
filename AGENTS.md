# AGENTS.md

## Project identity
ADHD Squirrel is not a generic merch store. It is a niche identity-driven apparel brand built around controlled chaos, glitch energy, and late-diagnosed ADHD realism. The site should feel like internal thoughts leaking through a polished system.

## Product strategy
- Flagship line: Sonic Inferno
- Premium variant: Full Design (Front + Back)
- Companion lines: Solo Guitarist, ADHD Squirrel, Late Diagnosed
- Bundles are shirt-only and meant to raise AOV without increasing complexity
- Upgrades are same-design jumps to crewneck/hoodie and must remain separate from bundles

## UX/brand rules
- Voice is dry, sharp, internal-thought style
- Do not over-explain
- Do not apply branded voice to forms or payment fields
- Keep buying flow simple and decisive, never configurator-like
- Default to premium/high-intent option when it makes sense

## Conversion priorities
- Make Full Design visually dominant
- Keep bundle section secondary to Add to Cart
- Keep upgrade section secondary to bundle section
- Preserve trust in checkout
- Do not trade clarity for cleverness

## Responsive standards
- Build mobile-first by default
- Breakpoint intent:
  - Mobile: under `640px`
  - Tablet: `768px+`
  - Desktop/Laptop: `1024px+`
- Device priority:
  - Phones first
  - Tablets second
  - Desktop third
- On mobile:
  - Show product art before supporting brand copy on conversion-critical surfaces
  - Keep price and primary CTA visible fast
  - Compress supporting copy before adding new UI
- On tablet:
  - Preserve the same hierarchy with more spacing, not more decisions
- On desktop:
  - Atmosphere can expand, but product and buy path must stay obvious
- QA viewports:
  - `390x844`
  - `430x932`
  - `768x1024`
  - `1366x768`
  - `1440x900`

## Product data rules
- Use stable internal keys:
  - sonic-inferno
  - solo-guitarist
  - adhd-squirrel
  - late-diagnosed
- Variants:
  - standard
  - full-design
- Do not use display labels for logic

## Current pricing
- Standard tee:
  - `S-XL`: `$23.99`
  - `2XL`: `$25.99`
  - `3XL`: `$28.99`
- Full Design tee:
  - `S-XL`: `$29.99`
  - `2XL`: `$31.99`
  - `3XL`: `$34.99`
- Standard crewneck:
  - `S-XL`: `$34.99`
  - `2XL`: `$37.99`
  - `3XL`: `$38.99`
- Full Design crewneck:
  - `S-XL`: `$41.99`
  - `2XL`: `$44.99`
  - `3XL`: `$45.99`
- Standard hoodie:
  - `S-XL`: `$39.99`
  - `2XL`: `$41.99`
  - `3XL`: `$42.99`
  - `4XL-5XL`: `$42.99`
- Full Design hoodie:
  - `S-XL`: `$45.99`
  - `2XL`: `$47.99`
  - `3XL`: `$49.99`
  - `4XL-5XL`: `$49.99`

## Current bundle definitions
- `the-full-set`
  - Products:
    - `sonic-inferno-standard-tee`
    - `adhd-squirrel-tee`
  - Shopify checkout source-of-truth pricing:
    - `S-XL`: `$42.99`
    - `2XL`: `$46.99`
    - `3XL`: `$52.99`
  - Current checkout savings: `$4.99`
- `diagnosis-pack`
  - Products:
    - `late-diagnosed-tee`
    - `sonic-inferno-standard-tee`
  - Shopify checkout source-of-truth pricing:
    - `S-XL`: `$42.99`
    - `2XL`: `$46.99`
    - `3XL`: `$52.99`
  - Current checkout savings: `$4.99`
- `complete-chaos-set`
  - Products:
    - `sonic-inferno-standard-tee`
    - `adhd-squirrel-tee`
    - `late-diagnosed-tee`
  - Shopify checkout source-of-truth pricing:
    - `S-XL`: `$59.99`
    - `2XL`: `$65.99`
    - `3XL`: `$74.99`
  - Current checkout savings: `$11.98`

## Guardrails
- Do not change working logic unless explicitly asked
- Prefer explicit mappings over inferred “smart” logic
- Preserve accessibility
- Preserve mobile parity
- Keep copy consistent with established brand inventory

## Agent workflow guardrails
- Do not pop visible PowerShell or command windows when starting local background processes
- When starting the dev server or other long-running local tools, prefer hidden/background-safe process launch patterns
- If a local server must be restarted, reuse the existing terminal or a hidden process path instead of opening a new visible shell window

## Definition of done
A change is only done if:
- it matches brand tone
- it keeps the buying flow simpler, not more complex
- it preserves existing working behavior unless the task is explicitly to change that behavior
- it does not break pricing, bundle mapping, or variant naming
