/* IBRAHIM — static site generator. Emits every HTML page from data + templates. */
const fs = require('fs');
const path = require('path');
const pages = require('./pages');
const info = require('./info');
const journal = require('./journal');
const DATA = require('../data/products');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN = DATA.brand.domain.replace(/\/$/, '');
const htmlPages = [];
const canonical = (rel) => DOMAIN + '/' + (rel === 'index.html' ? '' : rel);
const write = (rel, html) => {
  if (/\.html$/.test(rel)) { html = html.replace(/__CANON__/g, canonical(rel)); htmlPages.push(rel); }
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html.trim() + '\n', 'utf8');
  return rel;
};

const out = [];
const ROOT_BASE = '';
const SUB_BASE = '../';

/* Remove any stale product pages (old range) so no dead route or old bottle remains */
const validProductFiles = DATA.products.map((p) => `${p.slug}.html`);
const productsDir = path.join(ROOT, 'products');
if (fs.existsSync(productsDir)) {
  fs.readdirSync(productsDir).forEach((f) => {
    if (f.endsWith('.html') && validProductFiles.indexOf(f) < 0) {
      fs.rmSync(path.join(productsDir, f));
      out.push('(removed) products/' + f);
    }
  });
}

/* Home */
out.push(write('index.html', pages.home(ROOT_BASE)));

/* Products */
DATA.products.forEach((p) => out.push(write(`products/${p.slug}.html`, pages.product(SUB_BASE, p))));

/* Core sub-pages */
out.push(write('pages/discovery.html', pages.discovery(SUB_BASE)));
out.push(write('pages/bundles.html', pages.bundles(SUB_BASE)));
out.push(write('pages/about.html', pages.about(SUB_BASE)));
out.push(write('pages/contact.html', pages.contact(SUB_BASE)));
out.push(write('pages/checkout.html', pages.checkout(SUB_BASE)));
out.push(write('pages/confirmation.html', pages.confirmation(SUB_BASE)));
out.push(write('pages/quiz.html', pages.quiz(SUB_BASE)));
out.push(write('pages/wishlist.html', pages.wishlist(SUB_BASE)));
out.push(write('pages/eid.html', pages.eidPage(SUB_BASE)));

/* 404 (root-absolute links so it works when served from any missing path) */
out.push(write('404.html', pages.notFound('/')));

/* Info / policy pages */
out.push(write('pages/shipping.html', info.shipping(SUB_BASE)));
out.push(write('pages/returns.html', info.returns(SUB_BASE)));
out.push(write('pages/privacy.html', info.privacy(SUB_BASE)));
out.push(write('pages/terms.html', info.terms(SUB_BASE)));
out.push(write('pages/faqs.html', info.faqs(SUB_BASE)));
out.push(write('pages/gift-cards.html', info.giftCards(SUB_BASE)));
out.push(write('pages/store-locator.html', info.storeLocator(SUB_BASE)));
out.push(write('pages/track-order.html', info.trackOrder(SUB_BASE)));

/* Journal (C12) */
out.push(write('pages/journal.html', journal.index(SUB_BASE)));
journal.POSTS.forEach((p) => out.push(write('pages/journal/' + p.slug + '.html', journal.post('../../', p))));

/* Web manifest */
write('site.webmanifest', JSON.stringify({
  name: 'IBRAHIM Fragrances', short_name: 'IBRAHIM', start_url: '.', display: 'standalone',
  background_color: '#08080a', theme_color: '#08080a',
  description: 'Five distinctive eau de parfum fragrances, one unmistakable presence.',
  categories: ['shopping', 'lifestyle'],
  icons: [
    { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
  screenshots: [
    { src: 'assets/images/hero/sultan-oud-og.jpg', sizes: '1200x630', type: 'image/jpeg', form_factor: 'wide' },
    { src: 'assets/images/hero/glamorous-og.jpg', sizes: '1200x630', type: 'image/jpeg' },
  ],
}, null, 2));

/* C1: sitemap.xml + robots.txt (exclude 404, checkout, confirmation from indexing) */
const noIndex = ['404.html', 'pages/checkout.html', 'pages/confirmation.html'];
const priorityFor = (rel) => rel === 'index.html' ? '1.0' : (/^products\//.test(rel) ? '0.9' : '0.6');
const urls = htmlPages.filter((r) => noIndex.indexOf(r) < 0).sort();
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((r) => `  <url><loc>${canonical(r)}</loc><changefreq>weekly</changefreq><priority>${priorityFor(r)}</priority></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /pages/checkout.html\nDisallow: /pages/confirmation.html\n\nSitemap: ${DOMAIN}/sitemap.xml\n`, 'utf8');
out.push('sitemap.xml', 'robots.txt');

console.log(`Rendered ${out.length} outputs (${htmlPages.length} html pages):`);
out.forEach((f) => console.log('  ' + f));
