/* IBRAHIM — HTML templates (Node build only). Every page is assembled here
   from shared partials so header/footer/cart live in exactly one place. */
const { icon } = require('./icons');
const DATA = require('../data/products');

const brand = DATA.brand;
const C = DATA.commerce;

/* ---------- helpers ---------- */
function money(n, opts) {
  opts = opts || {};
  const neg = n < 0;
  n = Math.abs(n);
  const cents = opts.cents || (n % 1 !== 0);
  const s = n.toLocaleString('en-AU', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
  return (neg ? '-' : '') + '$' + s + (opts.aud === false ? '' : ' AUD');
}
const u = (base, p) => base + p;           // internal URL with correct relative base
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const NAV = [
  { label: 'Home', href: 'index.html', key: 'home' },
  { label: 'Fragrances', href: 'index.html#collection', key: 'fragrances' },
  { label: 'Quiz', href: 'pages/quiz.html', key: 'quiz' },
  { label: 'Discovery Set', href: 'pages/discovery.html', key: 'discovery' },
  { label: 'Bundles', href: 'pages/bundles.html', key: 'bundles' },
  { label: 'About', href: 'pages/about.html', key: 'about' },
  { label: 'Contact', href: 'pages/contact.html', key: 'contact' },
];

const DEMO_NOTICE = 'Demo checkout only. No payment is processed or stored.';

/* ---------- head + document shell ---------- */
function head(o) {
  const base = o.base;
  const preload = (o.preload || []).map((p) =>
    `<link rel="preload" as="image" href="${u(base, p.href)}"${p.type ? ` type="${p.type}"` : ''}${p.media ? ` media="${p.media}"` : ''}>`
  ).join('\n  ');
  const ogAbs = brand.domain + '/' + (o.og || DATA.products[0].images.og);
  return `<!doctype html>
<html lang="${brand.lang}" data-base="${base}"${o.pageAttr || ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="IBRAHIM">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <meta name="theme-color" content="#08080a">
  <link rel="canonical" href="__CANON__">
  <link rel="alternate" hreflang="${brand.lang.toLowerCase()}" href="__CANON__">
  <link rel="alternate" hreflang="x-default" href="__CANON__">
  <meta property="og:site_name" content="${esc(brand.legal)}">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.description)}">
  <meta property="og:type" content="${o.ogType || 'website'}">
  <meta property="og:url" content="__CANON__">
  <meta property="og:image" content="${ogAbs}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${ogAbs}">
  <link rel="icon" href="${u(base, 'assets/icons/favicon.svg')}" type="image/svg+xml">
  <link rel="icon" href="${u(base, 'assets/icons/favicon-32.png')}" sizes="32x32">
  <link rel="apple-touch-icon" href="${u(base, 'assets/icons/apple-touch-icon.png')}">
  <link rel="manifest" href="${u(base, 'site.webmanifest')}">
  <link rel="stylesheet" href="${u(base, 'styles/main.css')}">
  ${preload}
  ${o.jsonld || ''}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>`;
}

/* ---------- announcement bar (B13: each message links to its offer) ---------- */
function announce(base) {
  base = base || '';
  const items = DATA.announcements.map((a, i) =>
    `<a class="announce-item${i === 0 ? ' is-active' : ''}" href="${u(base, a.href)}">${esc(a.t)}</a>`).join('\n    ');
  return `<div class="announce" aria-label="Store announcements">
    <div class="announce-track" data-announce>
    ${items}
    </div>
  </div>`;
}

/* ---------- brand mark ---------- */
function mark(base, cls) {
  return `<span class="brand-mark${cls ? ' ' + cls : ''}"><img src="${u(base, 'assets/icons/monogram.svg')}" alt="" width="30" height="30"></span>`;
}

/* ---------- header ---------- */
function header(base, active) {
  const links = NAV.map((n) =>
    `<li><a class="nav-link" href="${u(base, n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`
  ).join('\n        ');
  return `<header class="site-header" data-header>
    <div class="container nav-inner">
      <div class="nav-left">
        <button class="menu-toggle" data-menu-toggle aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          <span></span><span></span><span></span>
        </button>
        <nav aria-label="Primary"><ul class="nav-links">
        ${links}
        </ul></nav>
      </div>
      <a class="nav-brand" href="${u(base, 'index.html')}" aria-label="IBRAHIM home">
        ${mark(base)}<span class="brand-word">IBRAHIM</span>
      </a>
      <div class="nav-right">
        <button class="icon-btn" data-open="search" aria-label="Search fragrances">${icon('search')}</button>
        <button class="icon-btn" data-open="account" aria-label="Account">${icon('user')}</button>
        <button class="icon-btn" data-open="cart" aria-label="Open cart">
          ${icon('bag')}<span class="cart-badge" data-cart-count aria-hidden="true">0</span>
        </button>
      </div>
    </div>
  </header>
  ${mobileNav(base, active)}`;
}

function mobileNav(base, active) {
  const links = NAV.map((n) =>
    `<a class="nav-link" href="${u(base, n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`
  ).join('\n      ');
  return `<nav class="mobile-nav" id="mobile-nav" data-mobile-nav aria-label="Mobile" aria-hidden="true">
    <div class="mnav-head">
      <span class="brand-word">IBRAHIM</span>
      <button class="drawer-close" data-menu-close aria-label="Close menu">${icon('close')}</button>
    </div>
    <div class="mnav-links">
      ${links}
    </div>
    <div class="mnav-foot">
      <p>${brand.email}</p>
      <p>${brand.city}</p>
    </div>
  </nav>`;
}

/* ---------- footer ---------- */
function footer(base) {
  const col = (title, links) => `<div class="footer-col">
        <h5>${title}</h5>
        <ul class="footer-links">
          ${links.map((l) => `<li><a href="${u(base, l[1])}">${l[0]}</a></li>`).join('\n          ')}
        </ul>
      </div>`;
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="nav-brand" href="${u(base, 'index.html')}" aria-label="IBRAHIM home">${mark(base)}<span class="brand-word">IBRAHIM</span></a>
          <p>Five distinctive fragrances. One unmistakable presence. Made and shipped from ${brand.city}.</p>
          <div class="social">
            <a href="${brand.instagram.url}" aria-label="Instagram" rel="noopener" target="_blank">${icon('instagram')}</a>
            <a href="${brand.tiktok.url}" aria-label="TikTok" rel="noopener" target="_blank">${icon('tiktok')}</a>
            <a href="${brand.facebook.url}" aria-label="Facebook" rel="noopener" target="_blank">${icon('facebook')}</a>
            <a href="${brand.youtube.url}" aria-label="YouTube" rel="noopener" target="_blank">${icon('youtube')}</a>
          </div>
        </div>
        ${col('Shop', [['All Fragrances', 'index.html#collection'], ['Find Your Scent', 'pages/quiz.html'], ['Discovery Set', 'pages/discovery.html'], ['Bundles &amp; Offers', 'pages/bundles.html'], ['Gift Cards', 'pages/gift-cards.html']])}
        ${col('Customer Care', [['Shipping &amp; Delivery', 'pages/shipping.html'], ['Returns &amp; Exchanges', 'pages/returns.html'], ['Wishlist', 'pages/wishlist.html'], ['FAQs', 'pages/faqs.html'], ['Track Order', 'pages/track-order.html']])}
        ${col('Company', [['About IBRAHIM', 'pages/about.html'], ['Journal', 'pages/journal.html'], ['Contact', 'pages/contact.html'], ['Store Locator', 'pages/store-locator.html']])}
        <div class="footer-col footer-news">
          <h5>Stay Connected</h5>
          <p>Be the first to know about new releases and private previews. 10% off your first order.</p>
          <form class="news-form" data-newsletter novalidate>
            <input class="news-input" type="email" name="email" placeholder="Email address" aria-label="Email address" required>
            <button class="btn btn--primary btn--sm" type="submit" data-magnetic><span class="btn__label">Join</span></button>
          </form>
          <div class="news-msg" data-news-msg role="status" aria-live="polite"></div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${brand.year} ${brand.legal}. All rights reserved.</span>
        <div class="fb-links">
          <a href="${u(base, 'pages/terms.html')}">Terms</a>
          <a href="${u(base, 'pages/privacy.html')}">Privacy</a>
          <a href="${u(base, 'pages/faqs.html')}">FAQs</a>
          <span>Demonstration store. No real transactions.</span>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ---------- cart drawer, search, account (shared UI shells) ---------- */
function cartDrawer(base) {
  return `<aside class="drawer" id="cart-drawer" data-cart-drawer aria-label="Shopping bag" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="drawer-head">
      <h2 class="drawer-title">Your Bag <small data-cart-count-label>(0)</small></h2>
      <button class="drawer-close" data-close="cart" aria-label="Close bag">${icon('close')}</button>
    </div>
    <div class="ship-progress" data-ship-progress>
      <div class="ship-msg" data-ship-msg></div>
      <div class="ship-bar"><span data-ship-bar></span></div>
    </div>
    <div class="cart-nudge" data-cart-nudge hidden></div>
    <div class="cart-lines" data-cart-lines></div>
    <div class="cart-empty" data-cart-empty hidden>
      <span class="ce-mark">${icon('bag')}</span>
      <p>Your bag is empty.</p>
      <div data-empty-recs></div>
      <a class="btn btn--ghost btn--sm" href="${u(base, 'index.html#collection')}" data-close="cart">Explore the collection</a>
    </div>
    <div class="drawer-foot" data-cart-foot hidden>
      <form class="cart-code" data-code-form novalidate>
        <input type="text" name="code" placeholder="Discount code" aria-label="Discount code" autocomplete="off">
        <button class="btn btn--ghost btn--sm" type="submit">Apply</button>
      </form>
      <div class="sum-row"><span>Subtotal</span><span data-sum-subtotal>$0 AUD</span></div>
      <div class="sum-row save" data-row-savings hidden><span>Bundle savings</span><span data-sum-savings>-$0 AUD</span></div>
      <div class="sum-row discount" data-row-discount hidden><span data-discount-label>Discount</span><span data-sum-discount>-$0 AUD</span></div>
      <div class="sum-row" data-row-credit hidden><span>Discovery credit</span><span class="save" data-sum-credit>-$45 AUD</span></div>
      <div class="sum-row"><span>Shipping</span><span data-sum-shipping>Calculated at checkout</span></div>
      <div class="sum-row total"><span>Total</span><span data-sum-total>$0 AUD</span></div>
      <a class="btn btn--primary btn--block" href="${u(base, 'pages/checkout.html')}" data-magnetic data-checkout-link><span class="btn__label">Checkout</span></a>
      <p class="drawer-note">${DEMO_NOTICE}</p>
    </div>
  </aside>`;
}

function searchOverlay(base) {
  const chips = DATA.families.map((f) => `<button class="chip" data-search-filter="${f.toLowerCase()}">${f}</button>`).join('\n        ');
  return `<div class="search-overlay" data-search-overlay aria-hidden="true" role="dialog" aria-modal="true" aria-label="Search">
    <div class="search-inner">
      <div class="search-top">
        ${icon('search')}
        <input class="search-input" type="search" placeholder="Search fragrances, notes, moods" data-search-input aria-label="Search fragrances">
        <button class="drawer-close" data-close="search" aria-label="Close search">${icon('close')}</button>
      </div>
      <div class="search-filters">
        ${chips}
      </div>
      <div class="search-results" data-search-results></div>
    </div>
  </div>`;
}

function accountPanel(base) {
  return `<aside class="drawer drawer--account" id="account-drawer" data-account-drawer aria-label="Account" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="drawer-head">
      <h2 class="drawer-title">Account</h2>
      <button class="drawer-close" data-close="account" aria-label="Close account">${icon('close')}</button>
    </div>
    <div class="acct-tabs" role="tablist">
      <button class="acct-tab is-active" data-acct-tab="signin" role="tab" aria-selected="true">Sign In</button>
      <button class="acct-tab" data-acct-tab="register" role="tab" aria-selected="false">Create</button>
      <button class="acct-tab" data-acct-tab="track" role="tab" aria-selected="false">Track</button>
      <button class="acct-tab" data-acct-tab="saved" role="tab" aria-selected="false">Saved</button>
    </div>
    <div class="acct-body">
      <div class="acct-panel is-active" data-acct-panel="signin">
        <p class="acct-note">Demonstration only. Sign-in is not connected to a real account system.</p>
        <div class="field"><label for="ac-email">Email</label><input id="ac-email" type="email" placeholder="you@email.com"></div>
        <div class="field"><label for="ac-pass">Password</label><input id="ac-pass" type="password" placeholder="Your password"></div>
        <button class="btn btn--primary btn--block" data-demo-action>Sign In</button>
        <a class="link-underline" href="#" data-demo-link style="text-align:center">Forgot your password?</a>
      </div>
      <div class="acct-panel" data-acct-panel="register">
        <p class="acct-note">Create an account to save fragrances and track orders. Front-end demo only.</p>
        <div class="field"><label for="ac-name">Name</label><input id="ac-name" type="text" placeholder="Full name"></div>
        <div class="field"><label for="ac-email2">Email</label><input id="ac-email2" type="email" placeholder="you@email.com"></div>
        <div class="field"><label for="ac-pass2">Password</label><input id="ac-pass2" type="password" placeholder="Create a password"></div>
        <button class="btn btn--primary btn--block" data-demo-action>Create Account</button>
      </div>
      <div class="acct-panel" data-acct-panel="track">
        <p class="acct-note">Enter an order number to see its demo status.</p>
        <div class="field"><label for="ac-order">Order number</label><input id="ac-order" type="text" placeholder="IB-000000"></div>
        <button class="btn btn--primary btn--block" data-demo-action>Track Order</button>
      </div>
      <div class="acct-panel" data-acct-panel="saved">
        <p class="acct-note">Your saved fragrances (wishlist) appear here. Add some from any product.</p>
        <div data-wishlist></div>
      </div>
    </div>
  </aside>`;
}

/* ---------- product card (collection / related / bundles) ---------- */
function productCard(base, p, opts) {
  opts = opts || {};
  const style = `--accent:${p.color};--accent-soft:${p.colorSoft};`;
  return `<article class="product-card" data-reveal style="${style}" data-tags="${p.tags.join(' ')} ${p.name.toLowerCase()} ${p.familyShort.toLowerCase()}">
        <span class="pcard-glow"></span>
        <a class="pcard-media" href="${u(base, 'products/' + p.slug + '.html')}" aria-label="${p.name} details">
          <picture>
            <source type="image/avif" srcset="${u(base, p.images.card.replace('.webp', '.avif'))}">
            <source type="image/webp" srcset="${u(base, p.images.card)}">
            <img src="${u(base, p.images.cardJpg)}" alt="${p.name} ${p.family} eau de parfum bottle by IBRAHIM Fragrances" loading="lazy" decoding="async" width="900" height="900">
          </picture>
        </a>
        <div class="pcard-body">
          <span class="pcard-family">${p.familyShort}</span>
          <h3 class="pcard-name"><a href="${u(base, 'products/' + p.slug + '.html')}">${p.name}</a></h3>
          <p class="pcard-desc">${p.tagline}</p>
          <p class="pcard-meta"><span>${p.size}</span><span>Eau de Parfum</span></p>
          <div class="pcard-foot">
            <span class="pcard-price">${money(p.price, { aud: false })} <small>AUD</small></span>
          </div>
          <div class="pcard-actions">
            <a class="btn btn--sm btn--ghost" href="${u(base, 'products/' + p.slug + '.html')}">Details</a>
            <button class="btn btn--sm btn--primary" data-add-product="${p.slug}"><span class="btn__label">Shop Now</span></button>
          </div>
        </div>
      </article>`;
}

/* ---------- global overlays block appended to every page ---------- */
function overlays(base) {
  return `${cartDrawer(base)}
  ${accountPanel(base)}
  ${searchOverlay(base)}
  <div class="scrim" data-scrim></div>
  <div class="toasts" data-toasts aria-live="polite"></div>
  <div class="consent" data-consent hidden role="dialog" aria-label="Cookie consent">
    <p>We use privacy-friendly analytics to improve the store. Nothing loads until you agree. See our <a href="${u(base, 'pages/privacy.html')}">privacy policy</a>.</p>
    <div class="consent-actions">
      <button class="btn btn--ghost btn--sm" data-consent-decline>Decline</button>
      <button class="btn btn--primary btn--sm" data-consent-accept><span class="btn__label">Accept</span></button>
    </div>
  </div>`;
}

/* ---------- scripts ---------- */
function scripts(base, pageScripts) {
  const extra = (pageScripts || []).map((s) => `<script defer src="${u(base, s)}"></script>`).join('\n  ');
  return `<script defer src="${u(base, 'data/products.js')}"></script>
  <script defer src="${u(base, 'data/campaign.js')}"></script>
  <script defer src="${u(base, 'scripts/store.js')}"></script>
  <script defer src="${u(base, 'scripts/app.js')}"></script>
  ${extra}
</body>
</html>`;
}

module.exports = {
  DATA, brand, C, money, u, esc, head, announce, header, footer, mark,
  cartDrawer, searchOverlay, accountPanel, productCard, overlays, scripts,
  NAV, DEMO_NOTICE, icon,
};
