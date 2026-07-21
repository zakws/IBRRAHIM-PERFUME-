/* IBRAHIM Fragrances — product catalog feeds (G9/G12 prep).
   Generates upload-ready catalog files for Meta (Facebook/Instagram Shop),
   TikTok Shop and Google Merchant Center from data/products.js.
   Run:  npm run feeds     Output: marketing/feeds/
   NOTE: links use brand.domain — set the real domain in data/products.js
   (or edit the CSVs) before uploading. */
const fs = require('fs');
const path = require('path');
const DATA = require('../data/products');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'marketing', 'feeds');
fs.mkdirSync(OUT, { recursive: true });

const DOMAIN = DATA.brand.domain.replace(/\/$/, '');
const CATEGORY = 'Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne';

const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
const rows = DATA.products.map((p) => ({
  id: 'IBR-' + p.slug.toUpperCase().replace(/-/g, ''),
  title: `${p.name} Eau de Parfum ${p.size} — IBRAHIM Fragrances`,
  description: `${p.description} ${p.size} Eau de Parfum. Ships from Sydney, Australia.`,
  availability: 'in stock',
  condition: 'new',
  price: `${p.price.toFixed(2)} AUD`,
  link: `${DOMAIN}/products/${p.slug}.html`,
  image_link: `${DOMAIN}/${p.images.cardJpg}`,
  brand: 'IBRAHIM Fragrances',
  category: CATEGORY,
}));

function csv(headerMap, dest) {
  const headers = Object.keys(headerMap);
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => q(r[headerMap[h]])).join(',')));
  fs.writeFileSync(path.join(OUT, dest), lines.join('\n') + '\n', 'utf8');
  console.log('  marketing/feeds/' + dest + ' (' + rows.length + ' products)');
}

console.log('Generating catalog feeds:');
// Meta (Facebook + Instagram Shop)
csv({ id: 'id', title: 'title', description: 'description', availability: 'availability', condition: 'condition', price: 'price', link: 'link', image_link: 'image_link', brand: 'brand', google_product_category: 'category' }, 'meta-catalog.csv');
// TikTok Shop / TikTok catalog
csv({ sku_id: 'id', title: 'title', description: 'description', availability: 'availability', condition: 'condition', price: 'price', link: 'link', image_link: 'image_link', brand: 'brand' }, 'tiktok-catalog.csv');
// Google Merchant Center (free listings)
csv({ id: 'id', title: 'title', description: 'description', link: 'link', image_link: 'image_link', availability: 'availability', price: 'price', brand: 'brand', condition: 'condition', google_product_category: 'category' }, 'google-merchant.csv');
console.log('Done. Set the real domain in data/products.js and re-run before uploading.');
