# TikTok Shop + Instagram Shop — setup guide

The product catalogs are ready in `marketing/feeds/`. Upload them once the accounts exist.

**Important first:** a shop can only take real orders once the website has real payments.
Until then, both platforms can still show the products with a "View on website" link,
which is a good first step. When real payments are added, the same catalogs upgrade to
full in-app checkout.

**Before uploading:** set the real website address in `data/products.js` (`brand.domain`)
and run `npm run feeds` again, so every product link in the files points at the live site.

## Instagram Shop (via Meta)
1. Make sure the business has: a Facebook Page, an Instagram Business account, and both linked.
2. Go to **business.facebook.com → Commerce Manager → Add catalog → E-commerce**.
3. Choose **Data feed upload** and upload `marketing/feeds/meta-catalog.csv`.
4. In Instagram: **Settings → Business → Shopping** → select the catalog → submit for review (takes a few days).
5. Once approved, tag products in every post and story.

## TikTok Shop
1. Register at **seller.tiktok.com** (TikTok Shop Australia) with the business details (ABN needed).
2. In Seller Center: **Products → Batch upload** and use `marketing/feeds/tiktok-catalog.csv` as the base
   (TikTok may ask to map columns — they match their template names).
3. Link the TikTok account so videos can tag products.
4. TikTok Shop requires shipping settings and a return address — use the business address.

## What is in each file
- `meta-catalog.csv` — Facebook + Instagram Shop
- `tiktok-catalog.csv` — TikTok Shop / TikTok ads catalog
- `google-merchant.csv` — Google free shopping listings (see the Google guide)

All three are generated from the website's own product data (`npm run feeds`), so names,
prices and photos always match the site exactly.
