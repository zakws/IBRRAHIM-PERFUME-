# IBRAHIM Fragrances — Luxury Fragrance Store

A complete, production-quality front-end fragrance store for **IBRAHIM Fragrances**. Dark, editorial, cinematic and restrained, built around the real IBRAHIM bottle and a new five-fragrance range. A working cart, an interactive bundle builder, a five-slide hero carousel, a polished demo checkout and a full confirmation experience.

This is a **front-end demonstration**. No backend, no payment provider, no data leaves the browser. Cart and preferences persist in `localStorage`.

---

## The collection (in order)

1. **Sultan Oud** — Dark Amber — *Deep. Refined. Commanding.*
2. **Glamorous** — Rose Gold — *Radiant. Elegant. Magnetic.*
3. **Blue Chill** — Ocean Blue — *Crisp. Cool. Energising.*
4. **Charizma** — Warm Amber — *Warm. Bold. Charismatic.*
5. **Magic Caramel** — Rich Amber Gourmand — *Warm. Addictive. Unforgettable.*

Every full-size fragrance is **$89.99 AUD**, **100 mL**, Eau de Parfum.

> Detailed fragrance notes are only asserted for **Magic Caramel** (approved copy: Opening — caramelized warmth; Heart — soft spice and creamy sweetness; Base — vanilla, amber and woody notes). The other four use their approved category and character wording, with **no invented ingredient claims** (they show a "Character" panel instead of a note pyramid).

---

## Highlights

- **Five-slide hero carousel** — one slide per fragrance, using each fragrance's own atmospheric hero image. Text sits over the black negative space, never over the bottle or plaque. Keyboard, dots, swipe and autoplay, all respecting `prefers-reduced-motion`.
- **Collection** of five themed cards, each using only its own `Product Card` photograph, with a subtle per-fragrance accent colour (never a recoloured photo).
- **Individual product pages** with an atmospheric banner, a four-view gallery (front / angle / three-quarter / detail), a notes pyramid *or* character panel, specs, editorial "world", craftsmanship and heritage bands, shipping/returns accordions, related fragrances and a final atmospheric CTA.
- **Discovery Set** page built from the five real matched product images (clearly presented as 3 mL samples, never a full-size bottle dressed as a vial).
- **Interactive bundle builder** (any 2 for $159.99, any 3 for $229.99, all five for $369.99) where every selected slot shows that fragrance's own photograph.
- **Working cart** — slide-out drawer, quantity controls, bundle savings, discount codes, free-shipping progress, empty state, `localStorage` persistence, and automatic **sanitisation** of any stale product/bundle IDs on load.
- **Demo checkout + confirmation** — validation, order summary, shipping selection, generated order number, cart clearing.
- **Motion system** — hover lift and glow, magnetic buttons, count-up statistics, screen-entry reveals. All respect reduced motion.
- **Search, filtering, account panel, wishlist, newsletter.** Structured data (Organization + Product JSON-LD), OpenGraph per fragrance.
- **Fully responsive** (390px mobile through 1440px+), self-contained, offline-capable, no external fonts, CDNs or JavaScript libraries.

---

## Photography — how each fragrance is mapped

Photography is mapped **explicitly and deterministically** in [`build/photo-map.js`](build/photo-map.js). Each fragrance uses **only** photographs of that exact bottle, identified by the **product name printed on the plaque** (verified visually, never chosen by colour). If any mapped master is missing, the image pipeline **aborts and reports it** rather than substituting.

The supplied renders arrived as flat master PNGs in the project's parent folder (`../`). Each fragrance's roles map to these masters:

| Role | Placement | Sultan Oud | Glamorous | Blue Chill | Charizma | Magic Caramel |
| --- | --- | --- | --- | --- | --- | --- |
| hero (atmospheric) | carousel + PDP banner + OG | #58 | #59 | #60 | #61 | #62 |
| front | card + main + search + cart thumb | #10 | #2 | #19 | #61 (hero) | #62 (hero) |
| alt | gallery 2 | #26 | #3 | #20 | #42 | #51 |
| three-quarter | gallery 3 | corr-08 | #9 | corr-10 | — | #57 |
| rear/detail | gallery 4 | #25 | #1 | #21 | #40 | #50 |
| flat lay | editorial "world" | corr-03 | corr-01 | corr-05 | corr-11 | corr-13 |
| macro | craftsmanship | corr-04 | corr-02 | corr-06 | corr-12 | corr-14 |
| heritage | heritage band | #30 | #7 | #34 | #46 | #55 |
| lifestyle | lifestyle band | #17 | #8 | #35 | #48 | #56 |

(#n = original master position; corr-NN = file from the client-corrected pack in `../IBRAHIM-corrected-perfume-images/`. Exact filenames are hard-coded in `photo-map.js`.)

**Wrong-bottle rule (July 2026):** the studio shots #6, #29, #33, #45 and #54 show a different bottle design (black printed label, "50 ML / 1.7 FL. OZ.") that is not the stocked gold-plaque product — all excluded (`EXCLUDED_WRONG_BOTTLE`). Charizma and Magic Caramel reuse their hero shot as the canonical front until dedicated front shots of the real bottle are supplied.

**Lettering rule (July 2026):** plaque lettering must be **black**. A strict audit found the original flat-lay and tilted close-up compositions (#4, #5, #13, #14, #22, #23, #24, #27, #28, #37, #41, #43, #44, #49, #52, #53) render the calligraphy embossed gold/silver tone-on-tone; all are excluded (`EXCLUDED_GOLD_LETTERING`) and replaced with the client's corrected pack, each file verified black-lettered by its plaque. Charizma still lacks a clean three-quarter shot (its two corrected files fill flat lay and macro), so its gallery shows three views until one more corrected close-up arrives.

### Export handling

The described six-export structure (`Master.png`, `Website.webp`, `Product Card Square.png`, `Hero Landscape.webp`, `Mobile Portrait.webp`, `Thumbnail Small.webp`) did not exist on disk — only single square master PNGs. The pipeline therefore **generates the responsive web renditions itself** with `sharp`: a card square, a website/gallery image, a thumbnail, and desktop + mobile hero crops. The 4K masters are **never served** to visitors. Desktop heroes and mobile portraits are separate assets served via `<picture>`/`srcset`, and crops only ever trim side negative space so the cap, plaque and base are always preserved.

### Not used

- **Image #47** (a two-men street lifestyle shot): the bottle is held at an angle and the plaque's product name is **illegible**, so it could not be positively identified. Per the non-negotiable rule it was **not assigned to any fragrance** and is intentionally unused.
- Several near-duplicate master variants were consolidated (the best distinct composition per role is used), so no derivative or duplicate is shown as if it were a different photograph.

---

## Tech stack

- **HTML, CSS, vanilla JavaScript.** No framework, no runtime dependencies.
- A tiny **Node static-site generator** (`build/`) renders every page from `data/products.js` (the single source of truth, also loaded in the browser as `window.IBRAHIM_DATA`).
- **`sharp`** is used only at build time to render the responsive images. It is a dev dependency; the generated images are committed, so the site runs with zero installation.

---

## Quick start

```bash
# from the ibrahim-store folder
npm run serve        # → http://localhost:4173  (site is pre-built; no install needed)
```

To rebuild from source (regenerate images + all HTML):

```bash
npm install          # installs sharp (dev only)
npm run build        # node build/process-images.js && node build/render.js
```

| Command | What it does |
| --- | --- |
| `npm run images` | Regenerates all responsive images from the mapped masters. |
| `npm run render` | Regenerates every HTML page from `data/products.js` + templates. |
| `npm run build` | Images then render (a full rebuild). |
| `npm run serve` | Serves the site at `http://localhost:4173`. |
| `npm run dev` | Renders pages, then serves. |

Deploy by uploading the whole folder to any static host (Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages). No server code runs in production.

---

## Project structure

```
ibrahim-store/
├── index.html                 # homepage (generated)
├── products/                  # sultan-oud, glamorous, blue-chill, charizma, magic-caramel (generated)
├── pages/                     # discovery, bundles, about, contact, checkout, confirmation + policy pages
├── data/products.js           # SINGLE SOURCE OF TRUTH (products, deals, brand, image paths)
├── styles/main.css            # full design system
├── scripts/
│   ├── store.js               # cart + pricing engine (localStorage + stale-ID sanitisation)
│   ├── app.js                 # shared UI + motion
│   ├── hero.js                # hero carousel controller
│   ├── bundles.js             # bundle builder
│   └── checkout.js            # checkout + confirmation
├── build/
│   ├── photo-map.js           # EXPLICIT product -> role -> master mapping
│   ├── process-images.js      # sharp image pipeline
│   ├── templates.js / pages.js / info.js / render.js / serve.js
├── assets/images/{products,hero}   # generated web renditions
└── package.json / site.webmanifest / README.md
```

Change a product, price or image role in `data/products.js` (and `build/photo-map.js` for image sources), then run `npm run build`.

---

## Pricing and offers

- Full-size fragrance: **$89.99 AUD**, 100 mL, Eau de Parfum.
- **Any 2** for **$159.99** (save $20) · **Any 3** for **$229.99** (save $40) · **All five** for **$369.99** (save $80).
- **Discovery Set** $45, fully **redeemable** against a full-size bottle (auto-credited when both are in the bag).
- **Free shipping** over $150 and on every bundle. Standard shipping otherwise $12, express $22.
- Demo codes: `IBRAHIM10` / `WELCOME10` (10% off), `SCENT15` (15%), `DISCOVER45` ($45 discovery credit).

---

## Accessibility & performance

Semantic landmarks, skip link, keyboard-operable menus/drawers/carousel with focus trapping and Escape, visible focus states, labelled controls, descriptive alt text naming the correct fragrance, correct heading order, live regions for cart and forms. All motion is reduced or disabled under `prefers-reduced-motion`.

Responsive WebP with explicit `width`/`height` (no layout shift), lazy loading below the fold, the first hero preloaded with `fetchpriority="high"`, GPU-friendly transforms, and no third-party scripts or fonts.

---

## Notes

Demonstration store. Order numbers, delivery estimates, stock and offers are illustrative; no payment is processed or stored. The IBRAHIM name and Arabic plaque appear only within the supplied photographs and are never recreated, traced or altered. Brand contact details and social handles are placeholders and can be replaced in `data/products.js`. © 2026 IBRAHIM Fragrances.

---

## Enhancements (waves A, C, B)

Fixes & accessibility: announcement bar pauses on hover/focus, carousel announces slides to screen readers, keyboard navigation and click-to-dismiss in search, raised text contrast, a branded `404.html`, a print stylesheet for receipts, a service worker + PWA manifest, and `decoding="async"` throughout.

Technical & SEO: `sitemap.xml` + `robots.txt`, canonical + hreflang + absolute OpenGraph/Twitter images, BreadcrumbList / FAQPage / upgraded Product / Article JSON-LD, AVIF beside every WebP (served automatically), a cookie-consent banner gating analytics, `_headers` / `netlify.toml` / `vercel.json` (security + cache), a GitHub Actions CI running Lighthouse + pa11y, a self-hosted-serif scaffold (`assets/fonts/`), and a Journal engine (`data/journal.js`).

Conversion: a scent-finder quiz (`pages/quiz.html`), a wishlist page with shareable `?w=` links (`pages/wishlist.html`), gallery lightbox with zoom, sticky mobile add-to-bag, PDP free-shipping progress, in-cart complete-the-collection nudge, "layer it with" pairing, a $5 sample add-on and gift wrapping + message at checkout, express-checkout placeholders, a reviews section (demo reviews stored locally; no fake reviews shipped), recently-viewed, empty-cart recommendations, clickable announcements, exit-intent and shareable order confirmation.

A single `brand.domain` in `data/products.js` drives canonical/sitemap/OG. Set your real domain, and (for analytics) your IDs in `brand`-level `analytics`, before launch.
