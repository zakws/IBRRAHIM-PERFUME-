/* IBRAHIM Fragrances — Shopify product-import CSV generator.
   Builds shopify/products-import.csv from data/products.js. Image URLs point at the
   live GitHub Pages site so Shopify fetches them automatically during import.
   Run:  npm run shopify */
const fs = require('fs');
const path = require('path');
const DATA = require('../data/products');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'shopify');
fs.mkdirSync(OUT, { recursive: true });

// live site that hosts the images today (switch to the real domain later and re-run)
const IMG_BASE = 'https://zakws.github.io/IBRRAHIM-PERFUME-';

const HEADERS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker',
  'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service',
  'Variant Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Image Src', 'Image Position', 'Image Alt Text', 'SEO Title', 'SEO Description', 'Status',
];
const CATEGORY = 'Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne';

const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
const row = (obj) => HEADERS.map((h) => q(obj[h] || '')).join(',');

function bodyHtml(p) {
  const character = p.hasNotes && p.notes
    ? `<h4>Fragrance notes</h4><ul><li><strong>Opening:</strong> ${p.notes.top.join(', ')}</li><li><strong>Heart:</strong> ${p.notes.heart.join(', ')}</li><li><strong>Base:</strong> ${p.notes.base.join(', ')}</li></ul>`
    : `<h4>Character</h4><p>${p.tagline}</p>`;
  return [
    `<p>${p.description}</p>`,
    character,
    `<h4>The story</h4><p>${p.story}</p>`,
    `<ul><li><strong>Longevity:</strong> ${p.longevity}</li><li><strong>Sillage:</strong> ${p.sillage}</li><li><strong>Best for:</strong> ${p.mood}</li><li><strong>Season:</strong> ${p.season}</li><li><strong>Size:</strong> ${p.size} Eau de Parfum</li></ul>`,
  ].join('\n');
}

// image roles per product, in gallery order (skips roles a product lacks)
function imageList(p) {
  const im = p.images;
  const picks = [
    [im.front, `${p.name} eau de parfum, front`],
    [im.alt, `${p.name}, alternate angle`],
    [im.threeQuarter, `${p.name}, three-quarter view`],
    [im.rear, `${p.name}, detail view`],
    [im.flatlay, `${p.name}, flat lay with ingredients`],
    [im.macro, `${p.name}, plaque close-up`],
    [im.heritage, `${p.name}, heritage setting`],
    [im.lifestyle, `${p.name}, lifestyle`],
  ].filter((x) => x[0]);
  return picks.map((x) => [IMG_BASE + '/' + x[0], x[1]]);
}

const lines = [HEADERS.join(',')];

DATA.products.forEach((p) => {
  const skuBase = 'IBR-' + p.slug.toUpperCase().replace(/-/g, '');
  const imgs = imageList(p);
  // main row: product + 100 mL variant + first image
  lines.push(row({
    Handle: p.slug,
    Title: `${p.name} Eau de Parfum`,
    'Body (HTML)': bodyHtml(p),
    Vendor: 'IBRAHIM Fragrances',
    'Product Category': CATEGORY,
    Type: 'Eau de Parfum',
    Tags: [p.familyShort].concat(p.tags).join(', '),
    Published: 'TRUE',
    'Option1 Name': 'Size',
    'Option1 Value': p.size,
    'Variant SKU': skuBase + '-90',
    'Variant Grams': '500',
    'Variant Inventory Tracker': 'shopify',
    'Variant Inventory Qty': '100',
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Price': String(p.price),
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Image Src': imgs[0][0],
    'Image Position': '1',
    'Image Alt Text': imgs[0][1],
    'SEO Title': `${p.name} ${p.family} Eau de Parfum — IBRAHIM Fragrances`,
    'SEO Description': `Buy ${p.name}, a ${p.family.toLowerCase()} eau de parfum by IBRAHIM Fragrances. ${p.shortDesc} ${p.size}, $${p.price} AUD. Ships from Sydney.`,
    Status: 'active',
  }));
  // second variant: 3 mL sample
  lines.push(row({
    Handle: p.slug,
    'Option1 Value': '3 mL Sample',
    'Variant SKU': skuBase + '-2',
    'Variant Grams': '20',
    'Variant Inventory Tracker': 'shopify',
    'Variant Inventory Qty': '200',
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Price': String(DATA.commerce.sample.price),
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
  }));
  // remaining images
  imgs.slice(1).forEach((img, i) => {
    lines.push(row({ Handle: p.slug, 'Image Src': img[0], 'Image Position': String(i + 2), 'Image Alt Text': img[1] }));
  });
});

// Discovery Set (single variant; swap in a real set photo when available)
lines.push(row({
  Handle: 'discovery-set',
  Title: 'The Discovery Set',
  'Body (HTML)': `<p>All five IBRAHIM fragrances in 3 mL travel sprays: Sultan Oud, Glamorous, Blue Chill, Charizma and Magic Caramel. The considered way to find your signature before committing to a full bottle.</p><p><strong>The full $45 is redeemable against your first full-size bottle</strong> — use code DISCOVER45 at checkout on a later order.</p>`,
  Vendor: 'IBRAHIM Fragrances',
  'Product Category': CATEGORY,
  Type: 'Discovery Set',
  Tags: 'discovery, samples, gift',
  Published: 'TRUE',
  'Option1 Name': 'Title',
  'Option1 Value': 'Default Title',
  'Variant SKU': 'IBR-DISCOVERY',
  'Variant Grams': '120',
  'Variant Inventory Tracker': 'shopify',
  'Variant Inventory Qty': '100',
  'Variant Inventory Policy': 'deny',
  'Variant Fulfillment Service': 'manual',
  'Variant Price': String(DATA.commerce.discovery.price),
  'Variant Requires Shipping': 'TRUE',
  'Variant Taxable': 'TRUE',
  'Image Src': IMG_BASE + '/' + DATA.products[0].images.front,
  'Image Position': '1',
  'Image Alt Text': 'IBRAHIM Discovery Set (placeholder image, replace with set photo)',
  'SEO Title': 'The Discovery Set — IBRAHIM Fragrances',
  'SEO Description': 'All five IBRAHIM fragrances in 3 mL travel sprays for $45, fully redeemable against your first full-size bottle.',
  Status: 'active',
}));

// Gift wrapping add-on
lines.push(row({
  Handle: 'gift-wrapping',
  Title: 'Premium Gift Wrapping',
  'Body (HTML)': '<p>Premium gift wrapping with a handwritten card. Add your message in the cart note at checkout. Prices are never shown on gift orders.</p>',
  Vendor: 'IBRAHIM Fragrances',
  Type: 'Gift',
  Tags: 'gift',
  Published: 'TRUE',
  'Option1 Name': 'Title',
  'Option1 Value': 'Default Title',
  'Variant SKU': 'IBR-GIFTWRAP',
  'Variant Grams': '10',
  'Variant Inventory Tracker': '',
  'Variant Inventory Qty': '',
  'Variant Inventory Policy': 'deny',
  'Variant Fulfillment Service': 'manual',
  'Variant Price': String(DATA.commerce.giftWrap.price),
  'Variant Requires Shipping': 'FALSE',
  'Variant Taxable': 'TRUE',
  'SEO Title': 'Gift Wrapping — IBRAHIM Fragrances',
  'SEO Description': 'Premium gift wrapping with a handwritten card.',
  Status: 'active',
}));

fs.writeFileSync(path.join(OUT, 'products-import.csv'), lines.join('\n') + '\n', 'utf8');
console.log('Wrote shopify/products-import.csv (' + (lines.length - 1) + ' rows, ' + DATA.products.length + ' fragrances + discovery set + gift wrap)');
