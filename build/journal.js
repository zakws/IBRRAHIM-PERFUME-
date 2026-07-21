/* IBRAHIM Fragrances — Journal (C12): index + post pages, generated from data/journal.js. */
const T = require('./templates');
const { brand, u, icon } = T;
const { page } = require('./pages');
const POSTS = require('../data/journal');
const BRAND = brand.legal;
const avif = (p) => p.replace(/\.webp$/, '.avif');

function fmtDate(s) {
  try { return new Date(s + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch (e) { return s; }
}
function postHref(base, p) { return u(base, 'pages/journal/' + p.slug + '.html'); }

function card(base, p) {
  return `<a class="jr-card" href="${postHref(base, p)}" data-reveal>
        <span class="jr-media"><picture><source type="image/avif" srcset="${u(base, avif(p.image))}"><source type="image/webp" srcset="${u(base, p.image)}"><img src="${u(base, p.image)}" alt="${p.title}" loading="lazy" decoding="async" width="1200" height="1200"></picture></span>
        <span class="jr-body"><span class="jr-tag">${p.tag} &middot; ${fmtDate(p.date)}</span><span class="jr-title">${p.title}</span><span class="jr-excerpt">${p.excerpt}</span><span class="link-underline">Read more</span></span>
      </a>`;
}

function index(base) {
  const main = `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Journal</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">The Journal</p>
        <h1 class="display">Notes on scent</h1>
        <p class="section-sub">Guides, pairings and a look behind the bottle.</p>
      </div>
      <div class="jr-grid" data-reveal-stagger>
        ${POSTS.map((p) => card(base, p)).join('\n        ')}
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `Journal — ${BRAND}`, description: 'Fragrance guides, layering tips and brand stories from IBRAHIM Fragrances.', og: require('../data/products').products[0].images.og }, main);
}

function post(base, p) {
  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 2);
  const ld = '<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.date,
    image: brand.domain.replace(/\/$/, '') + '/' + p.image, author: { '@type': 'Organization', name: BRAND },
    publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: brand.domain.replace(/\/$/, '') + '/assets/icons/icon-512.png' } },
  }) + '</script>';
  const main = `
  <section class="section subpage-hero">
    <div class="container" style="max-width:820px">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <a href="${u(base, 'pages/journal.html')}">Journal</a> ${icon('chevronRight')} <span>${p.title}</span></nav>
      <article class="jr-article" data-reveal>
        <p class="eyebrow">${p.tag} &middot; ${fmtDate(p.date)}</p>
        <h1 class="display" style="font-size:clamp(2.2rem,5vw,3.6rem);margin-bottom:22px">${p.title}</h1>
        <div class="jr-hero"><picture><source type="image/avif" srcset="${u(base, avif(p.image))}"><source type="image/webp" srcset="${u(base, p.image)}"><img src="${u(base, p.image)}" alt="${p.title}" width="1200" height="1200" fetchpriority="high" decoding="async"></picture></div>
        <div class="prose">${p.body}</div>
        <div style="margin-top:36px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn btn--primary" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Shop the Collection</span></a>
          <a class="btn btn--ghost" href="${u(base, 'pages/discovery.html')}" data-magnetic><span class="btn__label">Try the Discovery Set</span></a>
        </div>
      </article>
    </div>
  </section>
  <section class="section related">
    <div class="container">
      <div class="section-head section-head--center" data-reveal><p class="eyebrow eyebrow--center">More from the Journal</p></div>
      <div class="jr-grid" data-reveal-stagger>
        ${others.map((o) => card(base, o)).join('\n        ')}
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `${p.title} — ${BRAND}`, description: p.excerpt, ogType: 'article', og: require('../data/products').products[0].images.og, jsonld: ld }, main);
}

module.exports = { index, post, POSTS };
