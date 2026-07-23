/* IBRAHIM Fragrances — page builders. Each returns a complete HTML document. */
const T = require('./templates');
const { DATA, brand, C, money, u, icon, productCard } = T;
const P = DATA.products;
const families = DATA.families;
const BRAND = brand.legal; // "IBRAHIM Fragrances"
const avif = (p) => p.replace(/\.webp$/, '.avif'); // C14

/* document shell */
function page(o, main) {
  return [
    T.head(o), T.announce(o.base), T.header(o.base, o.active),
    `<main id="main">`, main, `</main>`,
    T.footer(o.base), T.overlays(o.base), T.scripts(o.base, o.scripts),
  ].join('\n');
}

/* reusable editorial image/text band */
function band(base, o) {
  return `
  <section class="section editorial-band${o.reverse ? ' is-reverse' : ''}"${o.style ? ` style="${o.style}"` : ''}>
    <div class="container band-grid">
      <div class="band-media" data-reveal="scale">
        <picture><source type="image/avif" srcset="${u(base, avif(o.img))}"><source type="image/webp" srcset="${u(base, o.img)}"><img src="${u(base, o.img)}" alt="${o.alt}" loading="lazy" decoding="async" width="${o.w || 1200}" height="${o.h || 1200}"${o.pos ? ` style="object-position:${o.pos}"` : ''}></picture>
      </div>
      <div class="band-body">
        ${o.eyebrow ? `<p class="eyebrow" data-reveal>${o.eyebrow}</p>` : ''}
        <h2 class="section-title" data-reveal>${o.title}</h2>
        <p class="lede" data-reveal>${o.body}</p>
        ${o.cta || ''}
      </div>
    </div>
  </section>`;
}

/* ============================ HOME ============================ */
function home(base) {
  // 5-slide hero carousel (one per fragrance, in collection order). Text sits over the
  // black negative space; images are the atmospheric Row-hero of each exact fragrance.
  const slides = P.map((p, i) => `
        <picture class="hero-slide-img${i === 0 ? ' is-active' : ''}" data-hero-slide="${i}">
          <source media="(max-width: 760px)" type="image/avif" srcset="${u(base, avif(p.images.heroMobile))}">
          <source media="(max-width: 760px)" type="image/webp" srcset="${u(base, p.images.heroMobile)}">
          <source type="image/avif" srcset="${u(base, avif(p.images.heroDesktop))}">
          <img src="${u(base, p.images.heroDesktop)}" alt="${p.name}, ${p.family} eau de parfum by ${BRAND}" width="1400" height="1400" decoding="async" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
        </picture>`).join('');
  const dots = P.map((p, i) => `<button class="hero-dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" role="tab" aria-selected="${i === 0}" aria-label="${p.name}, ${p.family}"><span></span></button>`).join('');
  const first = P[0];
  const hero = `
  <section class="hero hero-carousel" data-hero-carousel style="--accent:${first.color};--accent-soft:${first.colorSoft}" aria-roledescription="carousel" aria-label="IBRAHIM fragrances">
    <div class="hero-media" data-hero-media>
      ${slides}
    </div>
    <div class="hero-overlay"></div>
    <div class="container hero-inner">
      <div class="hero-content">
        <p class="eyebrow" data-hero-eyebrow>${first.family}</p>
        <h1 class="hero-title"><span class="l1">Scent is</span><span class="l2">Identity</span></h1>
        <p class="hero-copy">${brand.heroSupport}</p>
        <p class="hero-now"><span class="hn-label">Featured</span> <span data-hero-name>${first.name}</span></p>
        <div class="hero-actions">
          <a class="btn btn--primary btn--lg" data-hero-cta href="${u(base, 'products/' + first.slug + '.html')}" data-magnetic><span class="btn__label">Discover <span data-hero-cta-name>${first.name}</span> ${icon('arrowRight')}</span></a>
          <a class="btn btn--ghost btn--lg" href="#collection" data-magnetic><span class="btn__label">Shop the Collection</span></a>
        </div>
      </div>
    </div>
    <div class="hero-controls">
      <button class="hero-arrow" data-hero-prev aria-label="Previous fragrance">${icon('chevronLeft')}</button>
      <div class="hero-dots" data-hero-dots role="tablist" aria-label="Choose a fragrance">${dots}</div>
      <button class="hero-arrow" data-hero-next aria-label="Next fragrance">${icon('chevronRight')}</button>
    </div>
  </section>`;

  // H3: Eid campaign band — rendered hidden; scripts/app.js reveals it when the
  // campaign window (or ?preview=eid) is active.
  const eidBand = `
  <section class="section editorial-band is-reverse" data-campaign hidden aria-label="${'The Eid Gift Edit'}">
    <div class="container band-grid">
      <div class="band-media" data-reveal="scale">
        <picture><source type="image/avif" srcset="${u(base, avif(P[3].images.heritage))}"><source type="image/webp" srcset="${u(base, P[3].images.heritage)}"><img src="${u(base, P[3].images.heritage)}" alt="Charizma eau de parfum in a festive heritage setting" loading="lazy" decoding="async" width="1400" height="1400"></picture>
      </div>
      <div class="band-body">
        <p class="eyebrow" data-reveal>Ramadan &amp; Eid</p>
        <h2 class="section-title" data-reveal>The Eid Gift Edit</h2>
        <p class="lede" data-reveal>Gifts with presence, for the people who matter most. Enjoy 15% off with code <b class="gold-text">EID15</b>, plus gift wrapping and a handwritten card at checkout.</p>
        <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap" data-reveal>
          <a class="btn btn--primary" href="${u(base, 'pages/eid.html')}" data-magnetic><span class="btn__label">Shop the Eid Edit ${icon('arrowRight')}</span></a>
          <a class="btn btn--ghost" href="${u(base, 'pages/bundles.html')}" data-magnetic><span class="btn__label">Build a Gift Bundle</span></a>
        </div>
      </div>
    </div>
  </section>`;

  const collection = `
  <section class="section collection" id="collection">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">The Collection</p>
        <h2 class="section-title section-title--center">Five distinctive fragrances.<br>One unmistakable presence.</h2>
        <p class="section-sub">Each scent is its own world, from dark amber to ocean blue. Every bottle carries the same IBRAHIM signature.</p>
        <a class="btn btn--primary" href="${u(base, 'pages/quiz.html')}" data-magnetic style="margin-top:24px"><span class="btn__label">Not sure? Take the 30-second scent quiz ${icon('arrowRight')}</span></a>
      </div>
      <div class="filters" data-filters aria-label="Filter fragrances">
        <button class="chip is-active" data-filter="all">All</button>
        ${families.map((f) => `<button class="chip" data-filter="${f.toLowerCase()}">${f}</button>`).join('\n        ')}
      </div>
      <div class="product-grid" data-product-grid data-reveal-stagger>
        ${P.map((p) => productCard(base, p)).join('\n        ')}
      </div>
      <p data-filter-empty hidden style="text-align:center;color:var(--muted);margin-top:36px">No fragrances match that filter. <button class="link-underline" data-filter-reset type="button">Reset</button></p>
    </div>
  </section>`;

  // heritage
  const heritage = band(base, {
    img: first.images.heritage, w: 1400, h: 1400,
    alt: `${first.name} eau de parfum in an IBRAHIM heritage setting`,
    eyebrow: 'The House of IBRAHIM',
    title: 'A modern Middle Eastern fragrance house.',
    body: 'IBRAHIM Fragrances is built on presence. Each scent is composed as its own world and finished in the same recognisable bottle, so the collection reads as one identity expressed five ways. Designed, filled and shipped from Sydney, Australia.',
    cta: `<div style="margin-top:30px" data-reveal><a class="btn btn--primary" href="${u(base, 'pages/about.html')}" data-magnetic><span class="btn__label">Our Story</span></a></div>`,
  });

  // two editorial fragrance-world bands (representative; product pages carry the rest)
  const worldA = band(base, {
    reverse: true, img: P[2].images.lifestyle, w: 1400, h: 1400,
    alt: `${P[2].name} ${P[2].family} eau de parfum, lifestyle`,
    eyebrow: `${P[2].family} — ${P[2].name}`,
    title: P[2].tagline,
    body: P[2].description,
    cta: `<div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap" data-reveal><a class="btn btn--primary" href="${u(base, 'products/' + P[2].slug + '.html')}" data-magnetic><span class="btn__label">Discover ${P[2].name}</span></a><button class="btn btn--ghost" data-add-product="${P[2].slug}" data-magnetic><span class="btn__label">Add to Bag</span></button></div>`,
  });
  const worldB = band(base, {
    img: P[4].images.flatlay, w: 1200, h: 1200,
    alt: `${P[4].name} ${P[4].family} eau de parfum, flat lay`,
    eyebrow: `${P[4].family} — ${P[4].name}`,
    title: P[4].tagline,
    body: P[4].description,
    cta: `<div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap" data-reveal><a class="btn btn--primary" href="${u(base, 'products/' + P[4].slug + '.html')}" data-magnetic><span class="btn__label">Discover ${P[4].name}</span></a><button class="btn btn--ghost" data-add-product="${P[4].slug}" data-magnetic><span class="btn__label">Add to Bag</span></button></div>`,
  });

  const offers = offersSection(base);

  const stats = `
  <section class="section--tight stats">
    <div class="container">
      <div class="stats-grid" data-reveal-stagger>
        <div class="stat"><div class="stat-num" data-count="5">0</div><div class="stat-label">Signature Fragrances</div></div>
        <div class="stat"><div class="stat-num" data-count="100" data-suffix=" mL">0</div><div class="stat-label">Per Bottle</div></div>
        <div class="stat"><div class="stat-num" data-count="45" data-prefix="$">0</div><div class="stat-label">Discovery, Redeemable</div></div>
        <div class="stat"><div class="stat-num" data-count="150" data-prefix="$">0</div><div class="stat-label">Free Shipping Over</div></div>
        <div class="stat"><div class="stat-num" data-count="80" data-prefix="$">0</div><div class="stat-label">Saved On The Full Set</div></div>
      </div>
    </div>
  </section>`;

  const pillar = (ic, t, c) => `<div class="trust-item" data-reveal><span class="trust-ico">${icon(ic)}</span><h3 class="trust-title">${t}</h3><p class="trust-copy">${c}</p></div>`;
  const svc = (t) => `<span style="display:inline-flex;align-items:center;gap:8px">${icon('check', 'tk')} ${t}</span>`;
  const trust = `
  <section class="section trust" id="trust">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">Why IBRAHIM</p>
        <h2 class="section-title section-title--center">Considered, from bottle to box</h2>
      </div>
      <div class="trust-grid" data-reveal-stagger>
        ${pillar('gem', 'Eau de Parfum', 'A rich, long-wearing concentration made for real presence and stay.')}
        ${pillar('sparkle', 'One Bottle Language', 'A consistent, recognisable flacon across the entire collection.')}
        ${pillar('truck', 'Free Shipping', 'Complimentary delivery on orders over $150 and on every bundle.')}
        ${pillar('shield', 'Secure &amp; Simple', 'Easy 30-day returns and a secure, considered checkout.')}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:26px;justify-content:center;margin-top:46px;color:var(--muted);font-size:0.82rem;letter-spacing:0.06em" data-reveal>
        ${svc('Free shipping over $150')} ${svc('30-day easy returns')} ${svc('Secure checkout')} ${svc('Australian support')}
      </div>
    </div>
  </section>`;

  const newsletter = newsletterSection(base, P[1].images.heritage);

  const org = jsonldOrg(base);
  return page({
    base, active: 'home',
    title: `${BRAND} — Scent is Identity`,
    description: `${BRAND}: five distinctive eau de parfum fragrances, one unmistakable presence. Discover Sultan Oud, Glamorous, Blue Chill, Charizma and Magic Caramel.`,
    og: first.images.og,
    preload: [{ href: first.images.heroDesktop, type: 'image/webp' }],
    jsonld: org,
    scripts: ['scripts/hero.js'],
  }, [hero, eidBand, collection, heritage, worldA, offers, worldB, stats, trust, newsletter].join('\n'));
}

/* shared offers section (uses real matched product images, no old bundle artwork) */
function offersSection(base) {
  const thumbs = (n) => `<div class="offer-bottles" aria-hidden="true">${P.slice(0, n).map((p) => `<img src="${u(base, p.images.frontThumb)}" alt="" width="60" height="60" loading="lazy">`).join('')}</div>`;
  const card = (o) => `<article class="offer-card${o.feature ? ' is-feature' : ''}" data-reveal>
          ${o.badge ? `<span class="offer-badge">${o.badge}</span>` : ''}
          <span class="offer-tier">${o.tier}</span>
          <div class="offer-price">${o.price}<small> AUD</small></div>
          <div class="offer-save">${o.save}</div>
          <p class="offer-desc">${o.desc}</p>
          ${o.media}
          ${o.action}
        </article>`;
  return `
  <section class="section offers" id="offers">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">Bundles &amp; Discovery</p>
        <h2 class="section-title section-title--center">Build your wardrobe, save more</h2>
        <p class="section-sub">Every offer adds straight to your bag, at its correct bundle price.</p>
      </div>
      <div class="offer-grid" data-reveal-stagger>
        ${card({ tier: 'Any 2 Fragrances', price: '$159.99', save: 'Save $20', desc: 'Choose any two full-size scents.', media: thumbs(2), action: `<a class="btn btn--ghost btn--block" href="${u(base, 'pages/bundles.html')}#duo" data-magnetic><span class="btn__label">Choose 2</span></a>` })}
        ${card({ tier: 'Any 3 Fragrances', price: '$229.99', save: 'Save $40', desc: 'Choose any three full-size scents.', media: thumbs(3), action: `<a class="btn btn--ghost btn--block" href="${u(base, 'pages/bundles.html')}#trio" data-magnetic><span class="btn__label">Choose 3</span></a>` })}
        ${card({ tier: 'The Discovery Set', price: '$45', save: 'Redeemable against a full bottle', desc: 'All five scents in 3 mL travel sprays.', media: thumbs(5), action: `<button class="btn btn--ghost btn--block" data-add-discovery data-magnetic><span class="btn__label">Add Discovery Set</span></button>` })}
        ${card({ feature: true, badge: 'Best Value', tier: 'The Complete Collection', price: '$369.99', save: 'Save $80', desc: 'All five full-size fragrances.', media: thumbs(5), action: `<button class="btn btn--primary btn--block" data-add-bundle="full" data-magnetic><span class="btn__label">Add All Five</span></button>` })}
      </div>
    </div>
  </section>`;
}

function newsletterSection(base, bgImg) {
  return `
  <section class="section newsletter" id="newsletter">
    <div class="news-bg" aria-hidden="true"><img src="${u(base, bgImg)}" alt="" loading="lazy" width="1400" height="1400"></div>
    <div class="container">
      <div class="news-inner">
        <p class="eyebrow eyebrow--center" data-reveal>The IBRAHIM List</p>
        <h2 class="section-title section-title--center" data-reveal>10% off your first order</h2>
        <p class="section-sub" data-reveal>Join for early access to new releases and private previews. Your code arrives the moment you subscribe.</p>
        <form class="news-form" data-newsletter novalidate data-reveal>
          <input class="news-input" type="email" name="email" placeholder="Email address" aria-label="Email address" required>
          <button class="btn btn--primary" type="submit" data-magnetic><span class="btn__label">Subscribe</span></button>
        </form>
        <div class="news-msg" data-news-msg role="status" aria-live="polite"></div>
        <p class="news-note">No spam, unsubscribe anytime. We respect your privacy.</p>
      </div>
    </div>
  </section>`;
}

/* ============================ PRODUCT ============================ */
function product(base, p) {
  const rel = p.related.map((s) => DATA.getProduct(s)).filter(Boolean);
  const spec = (k, v) => `<div class="spec"><dt>${k}</dt><dd>${v}</dd></div>`;
  const acc = (title, body, open) => `<div class="accordion-item">
        <button class="accordion-btn" aria-expanded="${open ? 'true' : 'false'}"><span>${title}</span><span class="plus"></span></button>
        <div class="accordion-panel"${open ? ' style="max-height:600px"' : ''}><div class="inner">${body}</div></div>
      </div>`;
  const noteCol = (title, arr) => `<div class="notes-col"><h4>${title}</h4><ul>${arr.map((n) => `<li>${n}</li>`).join('')}</ul></div>`;

  // gallery views: front / alternate / three-quarter / rear (all the same bottle);
  // roles a product lacks (e.g. Charizma's three-quarter) are simply omitted
  const galleryViews = [
    { img: p.images.front, thumb: p.images.frontThumb, label: 'Front' },
    { img: p.images.alt, thumb: p.images.altThumb, label: 'Angle' },
    { img: p.images.threeQuarter, thumb: p.images.threeQuarterThumb, label: 'Three-quarter' },
    { img: p.images.rear, thumb: p.images.rearThumb, label: 'Detail' },
  ].filter((g) => g.img);
  const thumbs = galleryViews.map((g, i) => `<button class="gallery-thumb${i === 0 ? ' is-active' : ''}" data-gallery-thumb="${u(base, g.img)}" aria-label="${p.name} ${g.label} view"><img src="${u(base, g.thumb)}" alt="" width="74" height="74"></button>`).join('\n            ');

  // fragrance character: notes pyramid only if approved (Magic Caramel); else category character
  const characterBlock = p.hasNotes
    ? `<div class="pdp-notes">
            <h3 class="pdp-subhead">Fragrance Notes</h3>
            <div class="notes-cols">
              ${noteCol('Opening', p.notes.top)}
              ${noteCol('Heart', p.notes.heart)}
              ${noteCol('Base', p.notes.base)}
            </div>
          </div>`
    : `<div class="pdp-notes character-block">
            <h3 class="pdp-subhead">Character</h3>
            <div class="char-pills">${p.tagline.split(/[.\s]+/).filter(Boolean).map((w) => `<span class="char-pill">${w}</span>`).join('')}</div>
            <p class="char-note">${p.family}. ${p.shortDesc}</p>
          </div>`;

  const jsonld = jsonldProduct(base, p) + jsonldBreadcrumb([
    { name: 'Home', rel: '' },
    { name: 'Fragrances', rel: 'index.html#collection' },
    { name: p.name, rel: 'products/' + p.slug + '.html' },
  ]);

  const rel0 = rel[0];
  const inStock = p.inStock !== false;
  // B14: variant scaffold (single live variant + a "coming soon" placeholder)
  const variantsHtml = `<div class="pdp-variants" data-reveal role="group" aria-label="Format">
            <button type="button" class="pdp-variant is-active" aria-pressed="true">${p.size} &middot; EDP &middot; ${money(p.price, { aud: false })}</button>
            <button type="button" class="pdp-variant" disabled title="Coming soon">Travel 10 mL &middot; Soon</button>
          </div>`;
  // B8: in stock -> buy controls; out of stock -> notify-me capture
  const buyHtml = inStock
    ? `<div class="pdp-buy">
            <div class="qty" data-qty>
              <button type="button" data-qty-dec aria-label="Decrease quantity">${icon('minus')}</button>
              <input type="text" inputmode="numeric" value="1" aria-label="Quantity" data-qty-input>
              <button type="button" data-qty-inc aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button class="btn btn--primary" data-add-product="${p.slug}" data-from-qty data-magnetic><span class="btn__label">Add to Bag ${icon('bag')}</span></button>
            <button class="icon-btn" data-wishlist-toggle="${p.slug}" aria-label="Save to wishlist" style="border:1px solid var(--line-strong);width:52px;border-radius:4px">${icon('heart')}</button>
          </div>
          <div class="pdp-ship" data-pdp-ship hidden></div>`
    : `<div class="pdp-notify">
            <p class="pdp-oos">${icon('bell')} Currently out of stock.</p>
            <form data-notify-form="${p.slug}" novalidate>
              <input type="email" placeholder="Email address" aria-label="Email address" required>
              <button class="btn btn--primary" type="submit"><span class="btn__label">Notify me</span></button>
            </form>
            <div class="news-msg" data-notify-msg role="status" aria-live="polite"></div>
          </div>`;
  // B10: layer-it-with pairing
  const pairingHtml = rel0 ? `<div class="pdp-pairing" data-reveal style="--accent:${rel0.color}">
            <span class="pair-media"><img src="${u(base, rel0.images.thumb)}" alt="${rel0.name}" width="64" height="64" loading="lazy" decoding="async"></span>
            <span class="pair-body"><span class="pair-label">Layer it with</span><a class="pair-name" href="${u(base, 'products/' + rel0.slug + '.html')}">${rel0.name}</a> <span class="pair-fam">${rel0.familyShort}</span></span>
            <button class="btn btn--ghost btn--sm" data-add-both="${p.slug},${rel0.slug}"><span class="btn__label">Add both, ${money(p.price * 2, { aud: false })}</span></button>
          </div>` : '';
  // B2: sticky mobile add-to-bag
  const stickyHtml = inStock ? `<div class="pdp-sticky" data-pdp-sticky>
      <span class="ps-info"><span class="ps-name">${p.name}</span><span class="ps-price">${money(p.price)}</span></span>
      <button class="btn btn--primary btn--sm" data-add-product="${p.slug}"><span class="btn__label">Add to Bag</span></button>
    </div>` : '';
  // B9: reviews (no fake reviews; demo reviews stored locally, real ones drop into data later)
  const reviewsHtml = `
  <section class="section reviews" data-reviews data-slug="${p.slug}" data-name="${p.name}">
    <div class="container" style="max-width:820px">
      <div class="section-head section-head--center" data-reveal><p class="eyebrow eyebrow--center">Reviews</p><h2 class="section-title section-title--center">What people say</h2></div>
      <div class="reviews-summary" data-reviews-summary></div>
      <div class="reviews-list" data-reviews-list></div>
      <form class="reviews-form" data-review-form novalidate>
        <p class="pdp-subhead">Write a review</p>
        <div class="review-stars" data-review-stars role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" aria-label="${n} out of 5">${icon('heart')}</button>`).join('')}</div>
        <textarea placeholder="Share your experience" aria-label="Your review" data-review-text rows="3"></textarea>
        <input type="text" placeholder="Your name (optional)" aria-label="Your name" data-review-name>
        <button class="btn btn--primary btn--sm" type="submit"><span class="btn__label">Submit review</span></button>
        <p class="drawer-note">Demonstration reviews are stored in your browser only.</p>
      </form>
    </div>
  </section>`;

  const main = `
  <section class="pdp-banner" style="--accent:${p.color};--accent-soft:${p.colorSoft}">
    <div class="pdp-banner-media">
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcset="${u(base, avif(p.images.heroMobile))}">
        <source media="(max-width: 760px)" type="image/webp" srcset="${u(base, p.images.heroMobile)}">
        <source type="image/avif" srcset="${u(base, avif(p.images.heroDesktop))}">
        <img src="${u(base, p.images.heroDesktop)}" alt="${p.name} ${p.family} eau de parfum by ${BRAND}" width="1400" height="1400" fetchpriority="high" decoding="async">
      </picture>
    </div>
    <div class="pdp-banner-overlay"></div>
    <div class="container pdp-banner-inner">
      <p class="eyebrow" data-reveal>${p.family}</p>
      <h1 class="pdp-banner-title" data-reveal>${p.name}</h1>
      <p class="pdp-banner-tag" data-reveal>${p.tagline}</p>
    </div>
  </section>

  <section class="section subpage-hero pdp" style="--accent:${p.color};--accent-soft:${p.colorSoft};--accent-deep:${p.colorDeep}" data-page-product data-slug="${p.slug}">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <a href="${u(base, 'index.html#collection')}">Fragrances</a> ${icon('chevronRight')} <span>${p.name}</span>
      </nav>
      <div class="pdp-grid">
        <div class="pdp-gallery" data-gallery>
          <div class="gallery-main">
            <img class="is-active" data-gallery-main src="${u(base, p.images.front)}" alt="${p.name} eau de parfum, full bottle" width="1200" height="1200">
            <span class="gallery-glow"></span>
          </div>
          <div class="gallery-thumbs" role="tablist" aria-label="${p.name} images">
            ${thumbs}
          </div>
        </div>
        <div class="pdp-info">
          <p class="pdp-family">${p.family}</p>
          <h2 class="pdp-title">${p.name}</h2>
          <p class="pdp-tagline">${p.tagline}</p>
          <div class="pdp-price-row">
            <span class="pdp-price">${money(p.price)}</span>
            <span class="meta">${p.size} &middot; Eau de Parfum</span>
          </div>
          <p class="pdp-desc">${p.description}</p>
          ${variantsHtml}
          ${buyHtml}
          ${pairingHtml}

          ${characterBlock}

          <dl class="pdp-specs">
            ${spec('Longevity', p.longevity)}
            ${spec('Sillage', p.sillage)}
            ${spec('Concentration', 'Eau de Parfum')}
            ${spec('Size', p.size)}
            ${spec('Best For', p.mood)}
            ${spec('Season', p.season)}
          </dl>

          <div class="accordion">
            ${acc('The Story', `<p>${p.story}</p>`, true)}
            ${acc('Shipping', `<p>Complimentary standard shipping on orders over ${money(C.shipping.freeThreshold, { aud: false })}. Standard delivery is ${money(C.shipping.standard)} and arrives in 3 to 5 business days. Express is ${money(C.shipping.express)}, 1 to 2 business days. Dispatched from ${brand.city}.</p>`)}
            ${acc('Returns', `<p>Unopened fragrances can be returned within 30 days for a full refund. Opened bottles are eligible for exchange or store credit. See our <a class="link-underline" href="${u(base, 'pages/returns.html')}">returns policy</a> for details.</p>`)}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${stickyHtml}

  ${band(base, { img: p.images.flatlay, w: 1200, h: 1200, alt: `${p.name} ${p.family} eau de parfum, flat lay composition`, eyebrow: 'The World', title: `The ${p.name} world`, body: p.world + ' ' + p.description, reverse: true })}

  ${band(base, { img: p.images.macro, w: 1000, h: 1000, alt: `${p.name} bottle, macro detail`, eyebrow: 'Craftsmanship', title: 'In the detail', body: 'A tall, thick-glass flacon with a brushed cap, a fine gold rim and the IBRAHIM plaque. The same considered object across the collection, finished so it feels as good in the hand as it looks on the shelf.' })}

  ${band(base, { img: p.images.heritage, w: 1400, h: 1400, alt: `${p.name} eau de parfum in an IBRAHIM lifestyle setting`, eyebrow: 'Heritage', title: 'Made to be worn', body: p.story, reverse: true })}

  <section class="section related">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">You May Also Like</p>
        <h2 class="section-title section-title--center">Pairs beautifully with</h2>
      </div>
      <div class="related-grid" data-reveal-stagger>
        ${rel.map((r) => productCard(base, r)).join('\n        ')}
      </div>
    </div>
  </section>

  ${reviewsHtml}

  <section class="section" data-recent-section hidden>
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">Recently Viewed</p>
        <h2 class="section-title section-title--center">Pick up where you left off</h2>
      </div>
      <div class="rv-grid" data-recently-viewed></div>
    </div>
  </section>

  <section class="pdp-cta" style="--accent:${p.color};--accent-soft:${p.colorSoft}">
    <div class="pdp-cta-media"><picture><source type="image/webp" srcset="${u(base, p.images.heroDesktop)}"><img src="${u(base, p.images.heroDesktop)}" alt="" loading="lazy" width="1400" height="1400"></picture></div>
    <div class="pdp-cta-overlay"></div>
    <div class="container pdp-cta-inner">
      <p class="eyebrow eyebrow--center" data-reveal>${p.family}</p>
      <h2 class="section-title section-title--center" data-reveal>Make ${p.name} yours</h2>
      <p class="section-sub" data-reveal>${p.size} &middot; Eau de Parfum &middot; ${money(p.price)}</p>
      <div class="hero-actions" style="justify-content:center;margin-top:26px" data-reveal>
        <button class="btn btn--primary btn--lg" data-add-product="${p.slug}" data-magnetic><span class="btn__label">Add to Bag ${icon('bag')}</span></button>
        <a class="btn btn--ghost btn--lg" href="${u(base, 'pages/discovery.html')}" data-magnetic><span class="btn__label">Try the Discovery Set</span></a>
      </div>
    </div>
  </section>`;

  return page({
    base, active: 'fragrances',
    title: `${p.name} ${p.family} Eau de Parfum — ${BRAND}`,
    description: `Buy ${p.name}, a ${p.family.toLowerCase()} eau de parfum by IBRAHIM Fragrances. ${p.shortDesc} ${p.size}, ${money(p.price)}. Shop online, ships from Sydney, Australia.`,
    og: p.images.og, ogType: 'product',
    preload: [{ href: p.images.heroDesktop, type: 'image/webp' }],
    jsonld,
  }, main);
}

/* ============================ DISCOVERY ============================ */
function discovery(base) {
  // real matched product images (not fake vials); clearly labelled as 3 mL samples
  const samples = P.map((p) => `<a class="disc-sample" href="${u(base, 'products/' + p.slug + '.html')}" style="--accent:${p.color}">
          <span class="disc-sample-media"><img src="${u(base, p.images.card)}" alt="${p.name} ${p.family}" loading="lazy" width="400" height="400"></span>
          <span class="disc-sample-name">${p.name}</span>
          <span class="disc-sample-fam">${p.familyShort}</span>
        </a>`).join('\n        ');
  const step = (n, t, c) => `<div class="redeem-step" data-reveal><div class="rs-num">${n}</div><h4>${t}</h4><p>${c}</p></div>`;

  const main = `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Discovery Set</span></nav>
      <div class="discovery-hero">
        <div class="disc-samples" data-reveal="scale">
          ${samples}
        </div>
        <div>
          <p class="pdp-family" data-reveal>The Wardrobe, in Miniature</p>
          <h1 class="pdp-title" data-reveal>The Discovery Set</h1>
          <p class="pdp-tagline" data-reveal>Five worlds. One box. Find your signature.</p>
          <div class="pdp-price-row" data-reveal>
            <span class="pdp-price">${money(C.discovery.price)}</span>
            <span class="meta">${C.discovery.size} &middot; Eau de Parfum</span>
          </div>
          <p class="pdp-desc" data-reveal>All five IBRAHIM fragrances in 3 mL travel sprays: Sultan Oud, Glamorous, Blue Chill, Charizma and Magic Caramel. One of each, the considered way to find the one that reads as yours before committing to a full bottle.</p>
          <div class="pdp-buy" data-reveal>
            <button class="btn btn--primary btn--lg" data-add-discovery data-magnetic><span class="btn__label">Add Discovery Set &middot; ${money(C.discovery.price, { aud: false })}</span></button>
          </div>
          <div class="redeem-note" data-reveal>
            ${icon('sparkle')} The full ${money(C.discovery.redeemable, { aud: false })} is redeemable against your first full-size bottle.
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section related">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">How Redemption Works</p>
        <h2 class="section-title section-title--center">Try first, then commit</h2>
      </div>
      <div class="redeem-steps" data-reveal-stagger>
        ${step('01', 'Order the set', 'Add the Discovery Set for $45 and try all five fragrances at home.')}
        ${step('02', 'Find your signature', 'Live with them for a few days and see which one becomes yours.')}
        ${step('03', 'Redeem $45', 'Apply code DISCOVER45 at checkout on your first full-size bottle and take the full $45 off.')}
      </div>
    </div>
  </section>`;

  return page({
    base, active: 'discovery',
    title: `The Discovery Set — ${BRAND}`,
    description: 'All five IBRAHIM fragrances in 3 mL travel sprays for $45, fully redeemable against your first full-size bottle.',
    og: P[0].images.og,
  }, main);
}

/* ============================ BUNDLES / BUILDER ============================ */
function bundles(base) {
  const pick = (p) => `<button type="button" class="pick-card" data-pick="${p.slug}" style="--accent:${p.color}">
          <span class="pick-media"><img src="${u(base, p.images.card)}" alt="${p.name} ${p.family}" loading="lazy" width="500" height="500"><span class="pick-check">${icon('check')}</span></span>
          <span class="pick-body"><span><span class="pn">${p.name}</span><br><span class="pf">${p.familyShort}</span></span></span>
        </button>`;
  const slots = (n) => Array.from({ length: n }).map(() => `<div class="slot" data-slot>${icon('plus')}</div>`).join('');

  const main = `
  <section class="section subpage-hero" data-page-bundles>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Bundles</span></nav>
      <div class="section-head" data-reveal>
        <p class="eyebrow">Build a Bundle</p>
        <h1 class="section-title">Choose your wardrobe</h1>
        <p class="lede" style="margin-top:14px">Pick a size, choose your fragrances, and we will price the bundle instantly. Each bottle you add shows its own photograph.</p>
      </div>
      <div class="builder-grid">
        <div>
          <div class="builder-tiers" data-tiers role="tablist" aria-label="Bundle size">
            <button class="tier-btn is-active" data-tier="duo" role="tab" aria-selected="true"><span class="tb-size">2</span><span class="tb-price">${money(C.deals.duo.price, { aud: false })}</span><br><span class="tb-save">Save $30</span></button>
            <button class="tier-btn" data-tier="trio" role="tab" aria-selected="false"><span class="tb-size">3</span><span class="tb-price">${money(C.deals.trio.price, { aud: false })}</span><br><span class="tb-save">Save $70</span></button>
            <button class="tier-btn" data-tier="full" role="tab" aria-selected="false"><span class="tb-size">5</span><span class="tb-price">${money(C.deals.full.price, { aud: false })}</span><br><span class="tb-save">Save $151</span></button>
          </div>
          <div class="pick-grid" data-picks>
            ${P.map(pick).join('\n            ')}
          </div>
        </div>
        <aside class="builder-summary" data-summary aria-label="Bundle summary">
          <h3>Your Bundle</h3>
          <p class="builder-remaining" data-remaining>Select 2 fragrances</p>
          <div class="builder-slots" data-slots>${slots(2)}</div>
          <div class="sum-row"><span>Original total</span><span data-original>$0 AUD</span></div>
          <div class="sum-row"><span>Bundle price</span><span data-bundle-price>$0 AUD</span></div>
          <div class="sum-row save"><span>You save</span><span data-bundle-save>-$0 AUD</span></div>
          <p class="builder-msg" data-builder-msg role="status" aria-live="polite"></p>
          <button class="btn btn--primary btn--block" data-add-bundle-builder disabled data-magnetic><span class="btn__label">Add Bundle to Bag</span></button>
          <p class="drawer-note">Free shipping on every bundle. ${T.DEMO_NOTICE}</p>
        </aside>
      </div>
    </div>
  </section>`;

  return page({
    base, active: 'bundles',
    title: `Build a Bundle — ${BRAND}`,
    description: 'Build your IBRAHIM fragrance bundle: any 2 for $159.99, any 3 for $229.99, or all five for $369.99.',
    og: P[0].images.og,
    scripts: ['scripts/bundles.js'],
  }, main);
}

/* ============================ ABOUT ============================ */
function about(base) {
  const main = `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>About</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">The House of IBRAHIM</p>
        <h1 class="display">More than fragrance.</h1>
        <p class="section-sub">A statement of identity, confidence and timeless presence, made in ${brand.city}.</p>
      </div>
      <div class="story-grid" style="margin-top:20px">
        <div class="story-media" data-reveal="scale" data-parallax-media>
          <picture><source type="image/webp" srcset="${u(base, P[0].images.heritage)}"><img src="${u(base, P[0].images.heritage)}" alt="IBRAHIM fragrance in a heritage setting" loading="lazy" width="1400" height="1400"></picture>
        </div>
        <div class="story-body prose">
          <p class="story-lede" data-reveal>We build fragrance the way a house builds a wardrobe: one clear identity, expressed many ways.</p>
          <p data-reveal>IBRAHIM Fragrances started with a bottle before it started with a scent. We wanted a flacon you could recognise across a room and hold without reading the label: tall, thick glass, a brushed cap with a fine gold rim, and a single plaque, with nothing else competing for attention.</p>
          <p data-reveal>Then we filled it five times over. Each fragrance is composed around its own world, from the dark amber of Sultan Oud to the ocean blue of Blue Chill and the rich gourmand of Magic Caramel. Different worlds, the same unmistakable object in the hand.</p>
          <h2 id="craft" data-reveal>Our craft</h2>
          <p data-reveal>Every scent is an Eau de Parfum, concentrated for genuine longevity rather than a bright opening that fades by lunch. We work in small, considered runs and keep the bottle clean and deliberate.</p>
          <ul>
            <li data-reveal>Eau de Parfum concentration, ${brand.size} per bottle.</li>
            <li data-reveal>Five distinctive fragrances, one recognisable house.</li>
            <li data-reveal>Designed, filled and shipped from ${brand.city}.</li>
          </ul>
          <div style="margin-top:26px" data-reveal><a class="btn btn--primary" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Explore the Collection</span></a></div>
        </div>
      </div>
    </div>
  </section>`;
  return page({ base, active: 'about', title: `About — ${BRAND}`, description: 'The house of IBRAHIM Fragrances: five distinctive fragrances, one unmistakable presence, made in Sydney, Australia.', og: P[0].images.og }, main);
}

/* ============================ CONTACT ============================ */
function contact(base) {
  const info = (ic, t, v, href) => `<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:20px"><span style="color:var(--accent, var(--gold));width:22px">${icon(ic)}</span><div><div style="font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--faint);margin-bottom:4px">${t}</div>${href ? `<a class="link-underline" href="${href}">${v}</a>` : `<div>${v}</div>`}</div></div>`;
  const main = `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Contact</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">We are here to help</p>
        <h1 class="display">Contact</h1>
        <p class="section-sub">Questions about a fragrance, an order, or a bundle? Our Sydney team usually replies within one business day.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-card" data-reveal>
          ${info('mail', 'Email', brand.email, 'mailto:' + brand.email)}
          ${info('mail', 'Customer Care', brand.supportEmail, 'mailto:' + brand.supportEmail)}
          ${info('pin', 'Studio', brand.city)}
          ${info('clock', 'Hours', 'Monday to Friday, 9am to 5pm AEST')}
          ${info('instagram', 'Instagram', brand.instagram.handle, brand.instagram.url)}
          ${info('tiktok', 'TikTok', brand.tiktok.handle, brand.tiktok.url)}
        </div>
        <div class="contact-card" data-reveal>
          <form data-contact-form novalidate>
            <div class="field" style="margin-bottom:14px"><label for="c-name">Name</label><input id="c-name" name="name" type="text" required placeholder="Your name"></div>
            <div class="field" style="margin-bottom:14px"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required placeholder="you@email.com"></div>
            <div class="field" style="margin-bottom:14px"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="5" required placeholder="How can we help?"></textarea></div>
            <button class="btn btn--primary btn--block" type="submit" data-magnetic><span class="btn__label">Send Message</span></button>
            <div class="news-msg" data-contact-msg role="status" aria-live="polite"></div>
            <p class="drawer-note">This form is a front-end demonstration and does not send a real email.</p>
          </form>
        </div>
      </div>
    </div>
  </section>`;
  return page({ base, active: 'contact', title: `Contact — ${BRAND}`, description: 'Contact IBRAHIM Fragrances in Sydney, Australia. Questions about fragrances, orders and bundles.', og: P[0].images.og }, main);
}

/* ============================ CHECKOUT ============================ */
function checkout(base) {
  const field = (id, label, type, opts) => {
    opts = opts || {};
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}"${opts.ph ? ` placeholder="${opts.ph}"` : ''}${opts.req ? ' required' : ''}${opts.ac ? ` autocomplete="${opts.ac}"` : ''}${opts.im ? ` inputmode="${opts.im}"` : ''}><div class="err-text" data-err></div></div>`;
  };
  const main = `
  <section class="section subpage-hero" data-page-checkout>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Checkout</span></nav>
      <div class="section-head" data-reveal><h1 class="section-title">Checkout</h1></div>
      <div class="co-notice" data-reveal>${icon('lock')} <span>${T.DEMO_NOTICE} Use any details, no card is charged.</span></div>
      <div class="express-row" data-reveal aria-label="Express checkout (demonstration)">
        <button type="button" class="express-btn" disabled> Pay</button>
        <button type="button" class="express-btn" disabled>G Pay</button>
        <button type="button" class="express-btn" disabled>PayPal</button>
        <span class="express-or">Express checkout coming soon, or pay by card below</span>
      </div>
      <form class="checkout-grid" data-checkout-form novalidate>
        <div>
          <div class="co-section">
            <h3><span class="n">01</span> Contact</h3>
            <p class="co-sub">We will send your order confirmation here.</p>
            <div class="form-row one">${field('email', 'Email', 'email', { ph: 'you@email.com', req: true, ac: 'email' })}</div>
            <div class="form-row one">${field('phone', 'Phone', 'tel', { ph: '04xx xxx xxx', req: true, ac: 'tel', im: 'tel' })}</div>
          </div>
          <div class="co-section">
            <h3><span class="n">02</span> Delivery</h3>
            <p class="co-sub">Where should we send it?</p>
            <div class="form-row">${field('first', 'First name', 'text', { req: true, ac: 'given-name' })}${field('last', 'Last name', 'text', { req: true, ac: 'family-name' })}</div>
            <div class="form-row one">${field('address', 'Address', 'text', { ph: 'Street address', req: true, ac: 'address-line1' })}</div>
            <div class="form-row one">${field('address2', 'Apartment, suite (optional)', 'text', { ac: 'address-line2' })}</div>
            <div class="form-row thirds">${field('city', 'Suburb', 'text', { req: true, ac: 'address-level2' })}
              <div class="field"><label for="state">State</label><select id="state" name="state"><option>NSW</option><option>VIC</option><option>QLD</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option></select><div class="err-text"></div></div>
              ${field('postcode', 'Postcode', 'text', { req: true, ac: 'postal-code', im: 'numeric' })}</div>
          </div>
          <div class="co-section">
            <h3><span class="n">03</span> Shipping</h3>
            <div class="ship-options" data-ship-options>
              <label class="ship-option"><input type="radio" name="shipping" value="standard" checked><span class="so-main"><span class="so-name">${C.shipping.standardLabel}</span><span class="so-desc">Free over ${money(C.shipping.freeThreshold, { aud: false })}</span></span><span class="so-price" data-standard-price>${money(C.shipping.standard, { aud: false })}</span></label>
              <label class="ship-option"><input type="radio" name="shipping" value="express"><span class="so-main"><span class="so-name">${C.shipping.expressLabel}</span><span class="so-desc">Priority dispatch</span></span><span class="so-price">${money(C.shipping.express, { aud: false })}</span></label>
            </div>
          </div>
          <div class="co-section">
            <h3><span class="n">04</span> Payment</h3>
            <p class="co-sub">${icon('lock')} Demonstration only. Do not enter real card details.</p>
            <div class="form-row one">${field('card', 'Card number', 'text', { ph: '4242 4242 4242 4242', im: 'numeric' })}</div>
            <div class="form-row">${field('expiry', 'Expiry', 'text', { ph: 'MM / YY' })}${field('cvc', 'CVC', 'text', { ph: '123', im: 'numeric' })}</div>
            <label class="checkbox-row"><input type="checkbox" data-billing-same checked> Billing address same as delivery</label>
          </div>
          <div class="co-section">
            <h3><span class="n">05</span> Gift options</h3>
            <p class="co-sub">Make it a gift. Prices are never shown on gift orders.</p>
            <label class="checkbox-row"><input type="checkbox" data-gift-wrap> Add premium gift wrapping (${money(C.giftWrap.price)})</label>
            <div class="field" style="margin-top:12px"><label for="gift-msg">Gift message (optional)</label><textarea id="gift-msg" data-gift-message rows="2" placeholder="Handwritten on a card"></textarea></div>
          </div>
        </div>
        <aside class="co-summary" data-checkout-summary>
          <h3>Order Summary</h3>
          <div class="co-lines" data-co-lines></div>
          <div class="co-upsell" data-reveal>
            <span class="co-upsell-label">Add a ${C.sample.size} sample (${money(C.sample.price, { aud: false })})</span>
            <div class="co-upsell-row">
              <select data-sample-select aria-label="Sample fragrance">${P.map((p) => `<option value="${p.slug}">${p.name}</option>`).join('')}</select>
              <button class="btn btn--ghost btn--sm" type="button" data-add-sample><span class="btn__label">Add</span></button>
            </div>
          </div>
          <form class="cart-code" data-code-form novalidate style="margin:6px 0 16px">
            <input type="text" name="code" placeholder="Discount code" aria-label="Discount code" autocomplete="off">
            <button class="btn btn--ghost btn--sm" type="submit">Apply</button>
          </form>
          <div class="sum-row"><span>Subtotal</span><span data-sum-subtotal>$0 AUD</span></div>
          <div class="sum-row save" data-row-savings hidden><span>Bundle savings</span><span data-sum-savings>-$0 AUD</span></div>
          <div class="sum-row discount" data-row-discount hidden><span data-discount-label>Discount</span><span data-sum-discount>-$0 AUD</span></div>
          <div class="sum-row" data-row-credit hidden><span>Discovery credit</span><span class="save" data-sum-credit>-$45 AUD</span></div>
          <div class="sum-row" data-row-gift hidden><span>Gift wrapping</span><span data-sum-gift>+$6 AUD</span></div>
          <div class="sum-row"><span>Shipping</span><span data-sum-shipping>$0 AUD</span></div>
          <div class="sum-row total"><span>Total</span><span data-sum-total>$0 AUD</span></div>
          <button class="btn btn--primary btn--block btn--lg" type="submit" data-place-order data-magnetic><span class="btn__label">Place Demo Order</span></button>
          <p class="drawer-note">${icon('lock')} ${T.DEMO_NOTICE}</p>
        </aside>
      </form>
    </div>
  </section>`;
  return page({ base, active: '', title: `Checkout — ${BRAND}`, description: 'Secure demonstration checkout for IBRAHIM Fragrances.', scripts: ['scripts/checkout.js'] }, main);
}

/* ============================ CONFIRMATION ============================ */
function confirmation(base) {
  const main = `
  <section class="section confirm" data-page-confirmation>
    <div class="container">
      <div class="confirm-card">
        <div class="confirm-mark">${icon('checkCircle')}</div>
        <p class="eyebrow eyebrow--center">Order Confirmed</p>
        <h1 class="display" data-confirm-heading>Thank you.</h1>
        <p class="section-sub" data-confirm-sub>Your IBRAHIM order is confirmed. A confirmation has been sent to your email.</p>
        <p class="confirm-num" data-order-number>IB-000000</p>

        <div class="confirm-panel" data-confirm-panel>
          <h3>Order Summary</h3>
          <div class="confirm-lines co-lines" data-confirm-lines></div>
          <div class="sum-row" style="margin-top:14px"><span>Subtotal</span><span data-c-subtotal>$0 AUD</span></div>
          <div class="sum-row save" data-c-row-savings hidden><span>Savings</span><span data-c-savings>-$0 AUD</span></div>
          <div class="sum-row"><span>Shipping</span><span data-c-shipping>$0 AUD</span></div>
          <div class="sum-row total"><span>Total Paid</span><span data-c-total>$0 AUD</span></div>
          <div class="confirm-details">
            <div><h4>Delivery To</h4><p data-confirm-address>—</p></div>
            <div><h4>Estimated Delivery</h4><p data-confirm-eta>—</p></div>
          </div>
        </div>

        <div class="confirm-share" data-confirm-share hidden>
          <p class="pdp-subhead" style="margin-bottom:12px">Share your signature</p>
          <button class="btn btn--ghost" type="button" data-share-order><span class="btn__label">${icon('arrowUpRight')} Share my order</span></button>
          <p class="drawer-note" data-share-msg role="status" aria-live="polite"></p>
        </div>

        <div class="hero-actions" style="justify-content:center;margin-top:34px">
          <a class="btn btn--primary btn--lg" href="${u(base, 'index.html')}" data-magnetic><span class="btn__label">Return to Store</span></a>
          <a class="btn btn--ghost btn--lg" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Continue Shopping</span></a>
        </div>
        <p class="drawer-note" style="margin-top:20px">${T.DEMO_NOTICE}</p>
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `Order Confirmed — ${BRAND}`, description: 'Your IBRAHIM Fragrances order is confirmed.', scripts: ['scripts/checkout.js'] }, main);
}

/* ============================ EID GIFT EDIT (H3) ============================ */
function eidPage(base) {
  const pick = (p, label, note) => `<a class="gift-card" href="${u(base, 'products/' + p.slug + '.html')}" style="--accent:${p.color};--accent-soft:${p.colorSoft}" data-reveal>
        <span class="gift-media"><picture><source type="image/avif" srcset="${u(base, avif(p.images.card))}"><source type="image/webp" srcset="${u(base, p.images.card)}"><img src="${u(base, p.images.cardJpg)}" alt="${p.name} ${p.family} eau de parfum" loading="lazy" decoding="async" width="900" height="900"></picture></span>
        <span class="gift-body">
          <span class="gift-label">${label}</span>
          <span class="gift-name">${p.name}</span>
          <span class="gift-note">${note}</span>
          <span class="gift-price">${money(p.price, { aud: false })} AUD</span>
        </span>
      </a>`;
  const main = `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>The Eid Gift Edit</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">Ramadan &amp; Eid</p>
        <h1 class="display">The Eid Gift Edit</h1>
        <p class="section-sub">Eid Mubarak. A considered edit of gifts with presence, wrapped and carded, ready to give.</p>
      </div>
      <div class="redeem-note" data-reveal style="max-width:640px;margin:0 auto 40px">
        ${icon('sparkle')} <span>During the Eid window, take <b>15% off everything</b> with code <b>EID15</b> at checkout. Gift wrapping and a handwritten card are available on every order.</span>
      </div>
      <div class="gift-grid" data-reveal-stagger>
        ${pick(P[0], 'For him', 'Deep, refined and commanding. The gift that reads as respect.')}
        ${pick(P[1], 'For her', 'Radiant and elegant. A rose-gold signature she will keep.')}
        ${pick(P[4], 'For the host', 'Warm, sweet and generous. The scent of an open door.')}
        ${pick(P[3], 'For the brother', 'Bold, charismatic warmth. Charm you can wrap.')}
      </div>
    </div>
  </section>

  <section class="section related">
    <div class="container">
      <div class="section-head section-head--center" data-reveal>
        <p class="eyebrow eyebrow--center">Give More, Save More</p>
        <h2 class="section-title section-title--center">Gifting for the whole family</h2>
        <p class="section-sub">Any 2 fragrances for ${money(C.deals.duo.price)}, any 3 for ${money(C.deals.trio.price)}, or all five for ${money(C.deals.full.price)}. Every bundle ships free.</p>
      </div>
      <div class="hero-actions" style="justify-content:center" data-reveal>
        <a class="btn btn--primary btn--lg" href="${u(base, 'pages/bundles.html')}" data-magnetic><span class="btn__label">Build a Gift Bundle</span></a>
        <a class="btn btn--ghost btn--lg" href="${u(base, 'pages/discovery.html')}" data-magnetic><span class="btn__label">Discovery Set, ${money(C.discovery.price, { aud: false })}</span></a>
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `The Eid Gift Edit — ${BRAND}`, description: 'Eid gifting by IBRAHIM Fragrances: a considered edit of fragrances for him, for her and for the host, with gift wrapping on every order.', og: P[3].images.og }, main);
}

/* ============================ QUIZ (B1) ============================ */
function quiz(base) {
  const main = `
  <section class="section subpage-hero" data-page-quiz>
    <div class="container" style="max-width:760px">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Find Your Scent</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">Scent Finder</p>
        <h1 class="display">Find your signature</h1>
        <p class="section-sub">Three quick questions. We will point you to the IBRAHIM fragrance that fits.</p>
      </div>
      <div class="quiz" data-quiz>
        <div class="quiz-progress" aria-hidden="true"><span data-quiz-bar></span></div>
        <div data-quiz-stage aria-live="polite"></div>
      </div>
      <div class="quiz-result" data-quiz-result hidden></div>
    </div>
  </section>`;
  return page({ base, active: 'quiz', title: `Find Your Scent — ${BRAND}`, description: 'Take the IBRAHIM scent finder quiz and discover the fragrance that fits you.', og: P[0].images.og, scripts: ['scripts/quiz.js'] }, main);
}

/* ============================ WISHLIST (B19) ============================ */
function wishlist(base) {
  const main = `
  <section class="section subpage-hero" data-page-wishlist>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>Wishlist</span></nav>
      <div class="page-hero" data-reveal>
        <p class="eyebrow eyebrow--center">Saved</p>
        <h1 class="display">Your wishlist</h1>
        <p class="section-sub" data-wishlist-sub>The fragrances you have saved. Share the link so someone knows exactly what you love.</p>
      </div>
      <div class="wishlist-bar" data-wishlist-bar-wrap hidden>
        <button class="btn btn--ghost btn--sm" type="button" data-copy-wishlist><span class="btn__label">${icon('arrowUpRight')} Copy shareable link</span></button>
        <span class="news-msg" data-wishlist-msg role="status" aria-live="polite"></span>
      </div>
      <div class="product-grid" data-wishlist-grid data-reveal-stagger></div>
      <div class="wishlist-empty" data-wishlist-empty hidden>
        <p>Nothing saved yet. Tap the heart on any fragrance to save it here.</p>
        <a class="btn btn--primary" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Explore the Collection</span></a>
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `Wishlist — ${BRAND}`, description: 'Your saved IBRAHIM fragrances.', og: P[0].images.og }, main);
}

/* ============================ 404 ============================ */
function notFound(base) {
  const main = `
  <section class="section" style="min-height:58vh;display:flex;align-items:center;text-align:center">
    <div class="container">
      <p class="eyebrow eyebrow--center">Error 404</p>
      <h1 class="display">This page has drifted.</h1>
      <p class="section-sub">The page you are looking for does not exist or has moved. Your next signature is a click away.</p>
      <div class="hero-actions" style="justify-content:center;margin-top:30px">
        <a class="btn btn--primary btn--lg" href="${u(base, 'index.html')}" data-magnetic><span class="btn__label">Return Home</span></a>
        <a class="btn btn--ghost btn--lg" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Shop the Collection</span></a>
      </div>
      <div class="product-grid" style="margin-top:52px">
        ${P.map((p) => productCard(base, p)).join('\n        ')}
      </div>
    </div>
  </section>`;
  return page({ base, active: '', title: `Page not found — ${BRAND}`, description: 'The page you are looking for could not be found.', og: P[0].images.og }, main);
}

/* ---------- JSON-LD (C3 breadcrumbs, C5 product schema) ---------- */
const DOMAIN = brand.domain.replace(/\/$/, '');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
function jsonldOrg() {
  return ld({
    '@context': 'https://schema.org', '@type': 'Organization',
    name: BRAND, url: DOMAIN + '/', email: brand.email, logo: DOMAIN + '/assets/icons/icon-512.png',
    address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressCountry: 'AU' },
    sameAs: [brand.instagram.url, brand.tiktok.url, brand.facebook.url, brand.youtube.url],
  });
}
function jsonldBreadcrumb(trail) {
  return ld({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: DOMAIN + '/' + t.rel })),
  });
}
function jsonldProduct(base, p) {
  const url = DOMAIN + '/products/' + p.slug + '.html';
  return ld({
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.name + ' Eau de Parfum', brand: { '@type': 'Brand', name: BRAND },
    category: p.family, description: p.shortDesc, url: url,
    image: [DOMAIN + '/' + p.images.og, DOMAIN + '/' + p.images.front],
    sku: 'IBR-' + p.slug.toUpperCase().replace(/-/g, ''),
    offers: { '@type': 'Offer', url: url, price: p.price, priceCurrency: 'AUD', availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' },
  });
}

module.exports = { page, home, product, discovery, bundles, about, contact, checkout, confirmation, notFound, quiz, wishlist, eidPage };
