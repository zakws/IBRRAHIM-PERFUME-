# Shopify theme plan — recreating the IBRAHIM design

Goal: rebuild the current site's look inside Shopify so the store stays on-brand.
Recommended theme: **Dawn** (free, made by Shopify, fast) — everything below uses only
built-in Dawn sections, no paid theme needed. A paid dark theme (e.g. "Prestige" or
"Impact") gets closer to the editorial look but costs ~$500 AUD one-off; start with Dawn.

## Brand settings (Theme → Customize → Theme settings)
- **Colors:** background `#08080a`, text `#f4f1ea`, accent/buttons `#c79a4e`,
  secondary background `#111114`, lines `#2a2a2e`.
- **Typography:** headings **Playfair Display** (closest match to the current serif in
  Shopify's built-in font library), body **Assistant** or **Inter**.
- **Buttons:** small corner radius (4px), uppercase labels if the theme offers it.
- **Logo:** use the monogram + wordmark; upload `assets/icons/icon-512.png` as the
  square logo/favicon for now.

## Homepage, section by section (matches the current site top to bottom)
| Current site | Dawn section | Content |
| --- | --- | --- |
| Announcement bar | Announcement bar (supports multiple rotating messages) | The 5 messages: free shipping over $150, 10% first order IBRAHIM10, Discovery Set $45, any 2 $159.99, any 3 $229.99 |
| Hero carousel (5 fragrances) | **Slideshow** | One slide per fragrance using `assets/images/hero/<slug>-hero-1600.webp` (dark side = text side). Heading "Scent is Identity", subheading the fragrance name + category, button "Discover <name>" linking to the product |
| Collection grid | **Featured collection** | Collection "Fragrances", 5 products, 1 row on desktop |
| Quiz button | **Rich text** with button | "Not sure? Take the 30-second scent quiz" → /pages/quiz |
| Heritage band | **Image with text** | `sultan-oud-heritage-1400.webp` + the "A modern Middle Eastern fragrance house" copy from the About page |
| Blue Chill editorial | **Image with text** (reversed) | `blue-chill-lifestyle-1400.webp` + Blue Chill copy + button |
| Offers (bundles + discovery) | **Multicolumn** (4 columns) | Any 2 $159.99 / Any 3 $229.99 / Discovery $45 / All five $369.99, each with a button (see discounts below) |
| Magic Caramel editorial | **Image with text** | `magic-caramel-flatlay-1200.webp` + copy |
| Stats strip | **Multicolumn** (5 columns, no images) | 5 fragrances · 100 mL · $45 redeemable · $150 free shipping · $80 saved |
| Trust section | **Multicolumn** (4 columns) | Eau de Parfum / One bottle language / Free shipping / Secure & simple |
| Newsletter | **Email signup** | "10% off your first order" (wire the welcome code via a Shopify automation or Klaviyo) |
| Footer | Footer | Shop / Customer care / Company link lists + socials + "Sydney, Australia" |

## Product pages
- Dawn's product template already covers: gallery (all images import from the CSV in the
  right order), price, quantity, buy buttons (Shop Pay/Apple Pay appear automatically).
- Add **Collapsible content** rows: "The story" (already in the description), "Shipping"
  and "Returns" (paste from the current site's accordions / policy pages).
- Add a **Complementary products** block (Search & Discovery app, free) to recreate
  "Pairs beautifully with".
- The 3 mL sample is a Size variant on every fragrance — it replaces the old
  "$5 sample add-on" idea and the Discovery Set stays its own product.

## Other pages
- **About** → new page, paste the About copy; add the heritage image.
- **Contact** → page with Shopify's contact form (finally a real working form).
- **FAQ** → page with the 6 FAQs (or the "FAQ" section if the theme has one).
- **Journal** → Shopify Blog; paste the three articles from `data/journal.js`.
- **Quiz** → page, paste `shopify/quiz-embed.html` into the HTML (code) view.
- **Policies** (Settings → Policies): paste shipping/returns/privacy/terms from the
  current site, then have them legally reviewed before launch.

## Discounts and bundles
- `IBRAHIM10` — 10% off, one use per customer (welcome code).
- `DISCOVER45` — $45 off orders over $89.99, one use per customer (discovery redemption).
- **Eid campaign** — automatic discount "EID15", 15% off everything, scheduled with
  start/end dates (Shopify discounts support scheduling natively). Add an Eid slide to
  the slideshow for the same window.
- **Bundles:** simplest free route = discount codes `DUO20` ($20 off min qty 2) and
  `TRIO40` ($40 off min qty 3), shown as homepage offer text. Polished route = a
  quantity-breaks app (e.g. "Kaching Bundles", ~$15/mo) that shows the 2/3/5 tiers on
  the product page. The "Complete Collection $369.99" can also be a fixed bundle via
  Shopify's free **Bundles** app.

## Sales channels (after the store works)
Add from the channel list, each is a guided connect: **TikTok**, **Facebook & Instagram**,
**Google & YouTube**. Products sync automatically — the CSV feeds in `marketing/feeds/`
are no longer needed once these are connected.

## What happens to the current site
Keep `zakws.github.io/IBRRAHIM-PERFUME-` as the design reference while building, then
either retire it or keep it as a portfolio piece. When the real domain is bought, point
it at Shopify (Settings → Domains), not at GitHub.
