/*
 * IBRAHIM Fragrances — single source of truth for products, deals and brand config.
 * UMD-style: usable both in the Node build (require) and the browser (window.IBRAHIM_DATA).
 *
 * Photography is mapped explicitly (see build/photo-map.js). Each fragrance uses ONLY
 * photographs of that exact bottle, identified by the name printed on its plaque.
 * Detailed fragrance notes are only asserted for Magic Caramel (approved copy). The other
 * four use their approved category and character wording, with no invented ingredient claims.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.IBRAHIM_DATA = data;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var BASE_PRICE = 130;
  var SIZE = '90 mL';

  var brand = {
    name: 'IBRAHIM',
    legal: 'IBRAHIM Fragrances',
    tagline: 'Scent is identity.',
    heroSupport: 'Five distinctive fragrances. One unmistakable presence.',
    // Set this to your real domain before launch (drives canonical, sitemap and absolute social images).
    domain: 'https://www.ibrahimfragrances.com.au',
    lang: 'en-AU',
    city: 'Sydney, Australia',
    email: 'hello@ibrahimfragrances.com.au',
    supportEmail: 'care@ibrahimfragrances.com.au',
    phone: '+61 2 8000 0000',
    instagram: { handle: '@ibrahim.fragrances', url: 'https://instagram.com' },
    tiktok: { handle: '@ibrahim.fragrances', url: 'https://tiktok.com' },
    facebook: { handle: 'IBRAHIM Fragrances', url: 'https://facebook.com' },
    youtube: { handle: 'IBRAHIM Fragrances', url: 'https://youtube.com' },
    year: 2026,
    concentration: 'Eau de Parfum',
    size: SIZE,
  };

  var commerce = {
    basePrice: BASE_PRICE,
    currency: 'AUD',
    shipping: {
      freeThreshold: 180,
      standard: 12,
      express: 22,
      standardLabel: 'Standard (3-5 business days)',
      expressLabel: 'Express (1-2 business days)',
    },
    firstOrder: { percent: 10, code: 'IBRAHIM10' },
    codes: {
      IBRAHIM10: { type: 'percent', value: 10, label: '10% off your first order' },
      WELCOME10: { type: 'percent', value: 10, label: '10% welcome discount' },
      SCENT15: { type: 'percent', value: 15, label: '15% members preview' },
    },
    deals: {
      duo: { id: 'bundle-duo', key: 'duo', size: 2, price: 230, label: 'Any 2 Fragrances' },
      trio: { id: 'bundle-trio', key: 'trio', size: 3, price: 320, label: 'Any 3 Fragrances' },
      full: { id: 'bundle-full', key: 'full', size: 5, price: 499, label: 'The Complete Collection' },
    },
    discovery: {
      id: 'discovery-set',
      name: 'The Discovery Set',
      price: 35,
      redeemable: 35,
      size: '5 x 2 mL',
      concentration: 'Eau de Parfum',
    },
    sample: { price: 5, size: '2 mL' },   // B11: single-sample add-on
    giftWrap: { price: 6 },               // B7: optional gift wrapping
  };

  // Filter vocabulary derived from the approved categories (no invented scent notes).
  var families = ['Amber', 'Woody', 'Fresh', 'Floral', 'Warm', 'Gourmand'];

  function imgs(slug) {
    var b = 'assets/images/';
    return {
      card: b + 'products/' + slug + '-front-card.webp',
      cardJpg: b + 'products/' + slug + '-front-card.jpg',
      front: b + 'products/' + slug + '-front-1200.webp',
      frontThumb: b + 'products/' + slug + '-front-160.webp',
      thumb: b + 'products/' + slug + '-front-160.webp',
      alt: b + 'products/' + slug + '-alt-1000.webp',
      altThumb: b + 'products/' + slug + '-alt-160.webp',
      threeQuarter: b + 'products/' + slug + '-threequarter-1000.webp',
      threeQuarterThumb: b + 'products/' + slug + '-threequarter-160.webp',
      rear: b + 'products/' + slug + '-rear-1000.webp',
      rearThumb: b + 'products/' + slug + '-rear-160.webp',
      flatlay: b + 'products/' + slug + '-flatlay-1200.webp',
      macro: b + 'products/' + slug + '-macro-1000.webp',
      heritage: b + 'products/' + slug + '-heritage-1400.webp',
      lifestyle: b + 'products/' + slug + '-lifestyle-1400.webp',
      heroDesktop: b + 'hero/' + slug + '-hero-1600.webp',
      heroMobile: b + 'hero/' + slug + '-hero-mobile.webp',
      og: b + 'hero/' + slug + '-og.jpg',
    };
  }

  var products = [
    {
      id: 'sultan-oud', slug: 'sultan-oud', name: 'Sultan Oud', order: 1,
      price: BASE_PRICE, size: SIZE, concentration: brand.concentration,
      family: 'Dark Amber', familyShort: 'Dark Amber',
      tagline: 'Deep. Refined. Commanding.',
      shortDesc: 'A dark amber signature, deep and quietly commanding.',
      description:
        'Sultan Oud is a dark amber fragrance built for presence. Deep, refined and commanding, it carries a rich, resonant warmth that lingers with quiet authority. A scent for those who prefer to be remembered rather than announced.',
      story:
        'Sultan Oud is the anchor of the collection: the most serious, the most nocturnal. It was composed around the idea of restrained power, a fragrance that feels expensive without ever raising its voice.',
      hasNotes: false, notes: null,
      longevity: '8 to 10 hours', sillage: 'Strong',
      mood: 'Evening, cool weather, commanding', season: 'Autumn and Winter',
      tags: ['amber', 'woody', 'warm'],
      color: '#b98a3d', colorDeep: '#241708', colorSoft: '#e2b96a',
      world: 'Deep amber glass, oud wood and warm smoke.',
      images: imgs('sultan-oud'),
      related: ['charizma', 'magic-caramel'],
    },
    {
      id: 'glamorous', slug: 'glamorous', name: 'Glamorous', order: 2,
      price: BASE_PRICE, size: SIZE, concentration: brand.concentration,
      family: 'Rose Gold', familyShort: 'Rose Gold',
      tagline: 'Radiant. Elegant. Magnetic.',
      shortDesc: 'A radiant rose-gold signature, elegant and magnetic.',
      description:
        'Glamorous is radiant, elegant and magnetic. A rose-gold composition that feels luminous and refined, it carries a soft, confident glow from first impression to lasting trail. Made to turn quiet rooms.',
      story:
        'Glamorous is the collection at its most luminous, designed to feel like light itself: polished, graceful and self-assured.',
      hasNotes: false, notes: null,
      longevity: '6 to 8 hours', sillage: 'Moderate',
      mood: 'Day to evening, radiant and romantic', season: 'Spring and Summer',
      tags: ['floral', 'rose', 'warm'],
      color: '#d68a9f', colorDeep: '#2a121b', colorSoft: '#f0b6c6',
      world: 'Rose-gold glass, soft petals and luminous pink light.',
      images: imgs('glamorous'),
      related: ['magic-caramel', 'charizma'],
    },
    {
      id: 'blue-chill', slug: 'blue-chill', name: 'Blue Chill', order: 3,
      price: BASE_PRICE, size: SIZE, concentration: brand.concentration,
      family: 'Ocean Blue', familyShort: 'Ocean Blue',
      tagline: 'Crisp. Cool. Energising.',
      shortDesc: 'A crisp ocean-blue signature, cool and energising.',
      description:
        'Blue Chill is crisp, cool and energising. An ocean-blue fragrance that feels clean and alive, it delivers a fresh, invigorating lift that stays close and effortless throughout the day. Cool air, bottled.',
      story:
        'Blue Chill is the collection’s breath of fresh air, composed around clarity and movement for an easy, everyday confidence.',
      hasNotes: false, notes: null,
      longevity: '6 to 8 hours', sillage: 'Moderate',
      mood: 'Daytime, warm weather, effortless', season: 'Spring and Summer',
      tags: ['fresh', 'cool'],
      color: '#4d90c8', colorDeep: '#0b1f30', colorSoft: '#8ac6ee',
      world: 'Ocean-blue glass, water, ice and cool light.',
      images: imgs('blue-chill'),
      related: ['sultan-oud', 'charizma'],
    },
    {
      id: 'charizma', slug: 'charizma', name: 'Charizma', order: 4,
      price: BASE_PRICE, size: SIZE, concentration: brand.concentration,
      family: 'Warm Amber', familyShort: 'Warm Amber',
      tagline: 'Warm. Bold. Charismatic.',
      shortDesc: 'A warm amber signature, bold and charismatic.',
      description:
        'Charizma is warm, bold and charismatic. A warm-amber composition with real presence, it opens with confidence and settles into a rich, magnetic warmth that draws people in. Charm you can wear.',
      story:
        'Charizma is the extrovert of the range, built for warmth and magnetism: the scent that seems to arrive a moment before you do.',
      hasNotes: false, notes: null,
      longevity: '8 to 10 hours', sillage: 'Strong',
      mood: 'Day to evening, warm and magnetic', season: 'Autumn and Winter',
      tags: ['amber', 'warm', 'woody'],
      color: '#cc7d33', colorDeep: '#2a1808', colorSoft: '#edb066',
      world: 'Warm amber glass, resin, spice and glowing light.',
      images: imgs('charizma'),
      related: ['sultan-oud', 'magic-caramel'],
    },
    {
      id: 'magic-caramel', slug: 'magic-caramel', name: 'Magic Caramel', order: 5,
      price: BASE_PRICE, size: SIZE, concentration: brand.concentration,
      family: 'Rich Amber Gourmand', familyShort: 'Amber Gourmand',
      tagline: 'Warm. Addictive. Unforgettable.',
      shortDesc: 'A rich amber gourmand, warm, addictive and unforgettable.',
      description:
        'Magic Caramel is a rich amber gourmand built to feel warm, addictive, and unforgettable. It opens with a sweet burst of caramelized warmth, instantly drawing you in, before revealing a heart of soft spice and creamy sweetness that adds depth and sensuality. As it settles, smooth vanilla, amber, and woody notes create a bold, comforting trail that feels both luxurious and seductive. It’s the kind of scent that feels intense, magnetic, and effortlessly confident.',
      story:
        'Magic Caramel is the collection’s indulgence: a warm gourmand that trades restraint for comfort and pull. It is the scent people lean in to place.',
      hasNotes: true,
      notes: {
        top: ['Caramelized warmth'],
        heart: ['Soft spice', 'Creamy sweetness'],
        base: ['Vanilla', 'Amber', 'Woody notes'],
      },
      longevity: '8 to 10 hours', sillage: 'Strong',
      mood: 'Evening, cool weather, magnetic', season: 'Autumn and Winter',
      tags: ['amber', 'gourmand', 'warm', 'sweet'],
      color: '#b47030', colorDeep: '#241205', colorSoft: '#dd9c57',
      world: 'Rich amber glass, caramel, vanilla and warm resin.',
      images: imgs('magic-caramel'),
      related: ['sultan-oud', 'charizma'],
    },
  ];

  // Charizma has no clean three-quarter photograph (its spare has unreadable lettering),
  // so that gallery view is absent until a replacement shot is supplied.
  for (var pi = 0; pi < products.length; pi++) {
    if (products[pi].slug === 'charizma') {
      products[pi].images.threeQuarter = null;
      products[pi].images.threeQuarterThumb = null;
    }
  }

  var announcements = [
    { t: 'Complimentary shipping on orders over $180', href: 'pages/shipping.html' },
    { t: '10% off your first order with code IBRAHIM10', href: 'index.html#newsletter' },
    { t: 'The Discovery Set, five scents for $35', href: 'pages/discovery.html' },
    { t: 'Any 2 full-size fragrances for $230', href: 'pages/bundles.html#duo' },
    { t: 'Any 3 full-size fragrances for $320', href: 'pages/bundles.html#trio' },
  ];

  function getProduct(slug) {
    for (var i = 0; i < products.length; i++) if (products[i].slug === slug) return products[i];
    return null;
  }
  function validSlug(slug) { return !!getProduct(slug); }

  return {
    brand: brand,
    commerce: commerce,
    families: families,
    products: products,
    announcements: announcements,
    getProduct: getProduct,
    validSlug: validSlug,
    // C6: add your IDs to switch analytics on (only load after consent is given).
    analytics: { ga4: '', meta: '', tiktok: '' },
    // F1: Klaviyo hookup for the newsletter forms. Set listId to the Klaviyo list ID
    // (guide: marketing/klaviyo-setup-guide.md); the form then really subscribes people.
    newsletter: { action: 'https://manage.kmail-lists.com/ajax/subscriptions/subscribe', listId: '' },
    // exposed so a stale cart can be sanitised on load
    slugs: products.map(function (p) { return p.slug; }),
    bundleKeys: ['duo', 'trio', 'full'],
  };
});
