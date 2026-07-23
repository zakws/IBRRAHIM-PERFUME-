/* IBRAHIM — informational / policy pages (prose, FAQ, track-order). */
const T = require('./templates');
const { brand, C, money, u, icon } = T;
const { page } = require('./pages');

function shell(base, o, main) {
  return page({ base, active: o.active || '', title: o.title, description: o.description, jsonld: o.jsonld, og: o.og }, `
  <section class="section subpage-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${u(base, 'index.html')}">Home</a> ${icon('chevronRight')} <span>${o.crumb}</span></nav>
      <div class="page-hero" data-reveal style="text-align:left;align-items:flex-start">
        <p class="eyebrow">${o.eyebrow}</p>
        <h1 class="display" style="font-size:clamp(2.4rem,6vw,4rem)">${o.h1}</h1>
        ${o.sub ? `<p class="lede" style="margin-top:14px">${o.sub}</p>` : ''}
      </div>
      ${main}
    </div>
  </section>`);
}

const prose = (blocks) => `<div class="prose" data-reveal>${blocks}</div>`;
const h2 = (t) => `<h2>${t}</h2>`;
const p = (t) => `<p>${t}</p>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

function shipping(base) {
  return shell(base, { crumb: 'Shipping', eyebrow: 'Customer Care', h1: 'Shipping &amp; Delivery', title: 'Shipping & Delivery — IBRAHIM Fragrances', description: 'IBRAHIM shipping options, timings and free-shipping threshold.', sub: 'Dispatched from ' + brand.city + '. Timings below are estimates.' },
    prose([
      h2('Rates'),
      ul([
        `Standard: ${money(C.shipping.standard)}, 3 to 5 business days.`,
        `Express: ${money(C.shipping.express)}, 1 to 2 business days.`,
        `Free standard shipping on all orders over ${money(C.shipping.freeThreshold)} and on every bundle.`,
      ]),
      h2('Processing'),
      p('Orders placed before 1pm AEST on a business day are usually dispatched the same day. Orders placed on weekends and public holidays are dispatched the next business day.'),
      h2('Tracking'),
      p('You will receive a tracking link by email once your order ships. You can also use the Track Order page at any time.'),
      h2('International'),
      p('We currently ship within Australia. International shipping is coming soon; join the newsletter to be notified.'),
      p(`<em>This is a demonstration store. No real orders are dispatched.</em>`),
    ].join('')));
}

function returns(base) {
  return shell(base, { crumb: 'Returns', eyebrow: 'Customer Care', h1: 'Returns &amp; Exchanges', title: 'Returns & Exchanges — IBRAHIM Fragrances', description: 'IBRAHIM returns and exchanges policy.', sub: 'We want you to love what you wear.' },
    prose([
      h2('30-day returns'),
      p('Unopened fragrances in their original packaging can be returned within 30 days of delivery for a full refund to your original payment method.'),
      h2('Opened bottles'),
      p('If you have opened a bottle and it is not right for you, we offer an exchange or store credit within 30 days. Fragrance is personal, and the Discovery Set is the best way to try before committing.'),
      h2('How to start a return'),
      ul([
        'Contact ' + brand.supportEmail + ' with your order number.',
        'We will email a prepaid return label.',
        'Refunds are processed within 5 business days of us receiving the return.',
      ]),
      h2('Damaged or incorrect items'),
      p('If anything arrives damaged or incorrect, contact us within 7 days and we will make it right at no cost to you.'),
      p(`<em>Demonstration store. Policies are illustrative.</em>`),
    ].join('')));
}

function privacy(base) {
  return shell(base, { crumb: 'Privacy', eyebrow: 'Legal', h1: 'Privacy Policy', title: 'Privacy Policy — IBRAHIM Fragrances', description: 'How IBRAHIM handles your information.', sub: 'A plain-language summary of how we would handle your information.' },
    prose([
      p('This demonstration store does not collect, store or transmit personal information to any server. Anything you enter, such as cart contents or a newsletter email, is kept only in your own browser using local storage and never leaves your device.'),
      h2('What a live version would collect'),
      ul(['Contact and delivery details to fulfil orders.', 'Order history to provide support.', 'Optional marketing preferences.']),
      h2('What we would never do'),
      ul(['Sell your data.', 'Store card details on our own servers.', 'Email you without consent.']),
      h2('Your choices'),
      p('You would be able to access, correct or delete your information at any time by contacting ' + brand.supportEmail + '.'),
    ].join('')));
}

function terms(base) {
  return shell(base, { crumb: 'Terms', eyebrow: 'Legal', h1: 'Terms &amp; Conditions', title: 'Terms & Conditions — IBRAHIM Fragrances', description: 'Terms for using the IBRAHIM store.', sub: 'The basics of using this store.' },
    prose([
      h2('This is a demonstration'),
      p('This website is a front-end demonstration of an online fragrance store. No real products are sold, no payments are processed, and no orders are fulfilled. Prices, offers and stock are illustrative.'),
      h2('Pricing and offers'),
      p('All prices are shown in Australian dollars. Bundle and promotional pricing applies as described at the point of sale in this demo.'),
      h2('Intellectual property'),
      p('The IBRAHIM name, bottle design and imagery are used here for the purpose of this demonstration project.'),
      h2('Contact'),
      p('Questions about these terms can be sent to ' + brand.email + '.'),
    ].join('')));
}

function giftCards(base) {
  return shell(base, { crumb: 'Gift Cards', eyebrow: 'Shop', h1: 'Gift Cards', title: 'Gift Cards — IBRAHIM Fragrances', description: 'IBRAHIM digital gift cards.', sub: 'The elegant way to let someone choose their own signature.' },
    prose([
      p('Digital IBRAHIM gift cards are delivered by email and can be used on any fragrance, bundle or the Discovery Set. Available in $50, $90, $180 and $370 denominations.'),
      h2('How it works'),
      ul(['Choose an amount and enter the recipient details.', 'The card arrives by email with a unique code.', 'It never expires and can be used across multiple orders.']),
      p('<em>Gift card purchasing is not enabled in this demonstration.</em>'),
      `<div style="margin-top:24px"><a class="btn btn--primary" href="${u(base, 'index.html#collection')}" data-magnetic><span class="btn__label">Shop the Collection</span></a></div>`,
    ].join('')));
}

function storeLocator(base) {
  return shell(base, { crumb: 'Store Locator', eyebrow: 'Company', h1: 'Store Locator', title: 'Store Locator — IBRAHIM Fragrances', description: 'Where to find IBRAHIM.', sub: 'IBRAHIM is online-first, with select stockists.' },
    prose([
      p('IBRAHIM is primarily an online house, shipping Australia-wide from ' + brand.city + '. We appear at select pop-ups and stockists through the year.'),
      h2('Flagship studio'),
      p(brand.city + '. Private appointments only, by request through ' + brand.supportEmail + '.'),
      h2('Stockists'),
      p('Stockist locations are announced to the newsletter first. A live store would show an interactive map here.'),
    ].join('')));
}

function trackOrder(base) {
  return shell(base, { crumb: 'Track Order', eyebrow: 'Customer Care', h1: 'Track Your Order', title: 'Track Order — IBRAHIM Fragrances', description: 'Track an IBRAHIM order.', sub: 'Enter your order number to see its status.' },
    `<div class="contact-card" style="max-width:520px" data-reveal>
      <form data-track-form novalidate>
        <div class="field" style="margin-bottom:14px"><label for="t-order">Order number</label><input id="t-order" name="order" type="text" placeholder="IB-000000" required></div>
        <div class="field" style="margin-bottom:14px"><label for="t-email">Email</label><input id="t-email" name="email" type="email" placeholder="you@email.com" required></div>
        <button class="btn btn--primary btn--block" type="submit" data-magnetic><span class="btn__label">Track Order</span></button>
        <div class="news-msg" data-track-msg role="status" aria-live="polite"></div>
      </form>
      <p class="drawer-note" style="margin-top:14px;text-align:left">Demonstration tracking. Any recent demo order placed in this browser can be looked up; other numbers return a sample status.</p>
    </div>`);
}

function faqs(base) {
  const items = [
    ['How long do the fragrances last?', 'All IBRAHIM scents are Eau de Parfum, composed for 6 to 11 hours of wear depending on the fragrance and your skin. Longevity is listed on every product page.'],
    ['What is the Discovery Set?', `All five fragrances in 3 mL travel sprays for ${money(C.discovery.price)}. The full ${money(C.discovery.redeemable)} is redeemable against your first full-size bottle with code DISCOVER45.`],
    ['How do the bundles work?', `Any 2 full-size fragrances are ${money(C.deals.duo.price)}, any 3 are ${money(C.deals.trio.price)}, and all five are ${money(C.deals.full.price)}. Build one on the Bundles page and it adds to your bag at the bundle price.`],
    ['When is shipping free?', `Standard shipping is complimentary on all orders over ${money(C.shipping.freeThreshold)} and on every bundle.`],
    ['Are the bottles the same size?', 'Yes. Every full-size fragrance is 100 mL Eau de Parfum. What changes between scents is the fragrance and the world it belongs to.'],
    ['Is this a real store?', 'This is a front-end demonstration. You can browse, build bundles, and complete a demo checkout, but no payment is taken and no order is shipped.'],
  ];
  const acc = items.map(([q, a], i) => `<div class="accordion-item">
        <button class="accordion-btn" aria-expanded="${i === 0 ? 'true' : 'false'}"><span>${q}</span><span class="plus"></span></button>
        <div class="accordion-panel"${i === 0 ? ' style="max-height:400px"' : ''}><div class="inner">${a}</div></div>
      </div>`).join('\n      ');
  // C4: FAQPage structured data (answers stripped of markup)
  const faqLd = '<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it[0], acceptedAnswer: { '@type': 'Answer', text: it[1].replace(/<[^>]+>/g, '') } })),
  }) + '</script>';
  return shell(base, { crumb: 'FAQs', eyebrow: 'Customer Care', h1: 'Frequently Asked', title: 'FAQs — IBRAHIM Fragrances', description: 'Answers to common questions about IBRAHIM fragrances, bundles and shipping.', sub: 'Everything you need to know before you buy.', jsonld: faqLd },
    `<div class="prose" style="max-width:820px" data-reveal><div class="accordion">${acc}</div></div>`);
}

module.exports = { shipping, returns, privacy, terms, giftCards, storeLocator, trackOrder, faqs };
