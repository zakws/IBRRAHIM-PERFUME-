/* IBRAHIM — cart + pricing engine. Framework-free, persisted to localStorage.
   Exposes window.IBRAHIM.store and window.IBRAHIM.money. Emits 'change'. */
(function () {
  'use strict';
  var DATA = window.IBRAHIM_DATA;
  if (!DATA) { console.error('IBRAHIM data not loaded'); return; }
  var C = DATA.commerce;
  var KEY = 'ibrahim_cart_v1';

  function money(n, opts) {
    opts = opts || {};
    var neg = n < 0; n = Math.abs(Math.round(n * 100) / 100);
    var cents = opts.cents || (n % 1 !== 0);
    var s = n.toLocaleString('en-AU', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
    return (neg ? '-' : '') + '$' + s + (opts.aud === false ? '' : ' AUD');
  }

  function dealBy(key) {
    var d = C.deals;
    for (var k in d) if (d[k].key === key) return d[k];
    return null;
  }

  /* ---------- state ---------- */
  var state = load();
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var s = JSON.parse(raw); if (s && Array.isArray(s.items)) return sanitise(s); }
    } catch (e) {}
    return { items: [], code: null, gift: { wrap: false, message: '' } };
  }
  // Drop any line that references a product/bundle that no longer exists, so a cart
  // saved before the range changed cannot break the updated store.
  function sanitise(s) {
    var validSlug = function (slug) { return !!DATA.getProduct(slug); };
    var before = s.items.length;
    s.items = s.items.filter(function (l) {
      if (l.type === 'product') return validSlug(l.slug);
      if (l.type === 'sample') return validSlug(l.slug);
      if (l.type === 'discovery') return true;
      if (l.type === 'bundle') return dealBy(l.key) && Array.isArray(l.slugs) && l.slugs.every(validSlug);
      return false;
    });
    if (s.code && !(s.code === 'DISCOVER35' || C.codes[s.code] || (campaign() && campaign().code && s.code === campaign().code.code))) s.code = null;
    if (!s.gift || typeof s.gift !== 'object') s.gift = { wrap: false, message: '' };
    if (s.items.length !== before) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
    return s;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    emit();
  }

  /* ---------- listeners ---------- */
  var listeners = [];
  function on(cb) { listeners.push(cb); }
  function emit() { var t = totals(); listeners.forEach(function (cb) { try { cb(state, t); } catch (e) { console.error(e); } }); }

  /* ---------- mutations ---------- */
  function findProduct(slug) {
    return state.items.find(function (l) { return l.type === 'product' && l.slug === slug; });
  }
  function addProduct(slug, qty) {
    qty = Math.max(1, qty || 1);
    var line = findProduct(slug);
    if (line) line.qty += qty; else state.items.push({ type: 'product', slug: slug, qty: qty });
    save();
  }
  function addDiscovery(qty) {
    qty = Math.max(1, qty || 1);
    var line = state.items.find(function (l) { return l.type === 'discovery'; });
    if (line) line.qty += qty; else state.items.push({ type: 'discovery', qty: qty });
    save();
  }
  function addBundle(key, slugs) {
    var deal = dealBy(key);
    if (!deal) return { ok: false, message: 'Unknown bundle.' };
    if (key === 'full') slugs = DATA.products.map(function (p) { return p.slug; });
    if (!slugs || slugs.length !== deal.size) return { ok: false, message: 'Select ' + deal.size + ' fragrances.' };
    state.items.push({ type: 'bundle', key: key, slugs: slugs.slice(), qty: 1 });
    save();
    return { ok: true };
  }
  // B11: 2 mL sample add-on
  function addSample(slug, qty) {
    if (!DATA.getProduct(slug)) return { ok: false };
    qty = Math.max(1, qty || 1);
    var line = state.items.find(function (l) { return l.type === 'sample' && l.slug === slug; });
    if (line) line.qty += qty; else state.items.push({ type: 'sample', slug: slug, qty: qty });
    save();
    return { ok: true };
  }
  // B7: gift options
  function setGiftWrap(on) { state.gift = state.gift || {}; state.gift.wrap = !!on; save(); }
  function setGiftMessage(msg) { state.gift = state.gift || {}; state.gift.message = (msg || '').slice(0, 200); save(); }
  function setQty(index, qty) {
    var l = state.items[index]; if (!l) return;
    qty = Math.max(0, qty);
    if (qty === 0) state.items.splice(index, 1); else l.qty = qty;
    save();
  }
  function inc(index) { var l = state.items[index]; if (l) setQty(index, l.qty + 1); }
  function dec(index) { var l = state.items[index]; if (l) setQty(index, l.qty - 1); }
  function remove(index) { state.items.splice(index, 1); save(); }
  function clear() { state.items = []; state.code = null; save(); }

  /* ---------- discount codes ---------- */
  // H3: seasonal campaign code (data/campaign.js), only valid inside its window or preview
  function campaign() {
    return (typeof window !== 'undefined' && window.IBRAHIM_CAMPAIGN) || null;
  }
  function applyCode(raw) {
    var code = (raw || '').trim().toUpperCase();
    if (!code) return { ok: false, message: 'Enter a code.' };
    var camp = campaign();
    if (camp && camp.code && code === camp.code.code) {
      if (camp.isActive()) { state.code = code; save(); return { ok: true, message: camp.code.label + ' applied.' }; }
      return { ok: false, message: 'That code is not active yet. It unlocks during ' + camp.name + '.' };
    }
    var t0 = rawTotals();
    if (code === 'DISCOVER35') {
      if (t0.hasDiscovery) return { ok: false, message: 'Your discovery credit is already applied.' };
      if (!t0.hasFull) return { ok: false, message: 'Add a full-size fragrance to redeem this.' };
      state.code = code; save(); return { ok: true, message: 'Discovery credit applied: $35 off.' };
    }
    if (C.codes[code]) { state.code = code; save(); return { ok: true, message: C.codes[code].label + ' applied.' }; }
    return { ok: false, message: 'That code is not valid.' };
  }
  function clearCode() { state.code = null; save(); }

  /* ---------- pricing ---------- */
  function rawTotals() {
    var subtotal = 0, original = 0, bundleSavings = 0, count = 0;
    var hasDiscovery = false, hasFull = false, hasBundle = false;
    state.items.forEach(function (l) {
      if (l.type === 'product') { subtotal += C.basePrice * l.qty; original += C.basePrice * l.qty; count += l.qty; hasFull = true; }
      else if (l.type === 'discovery') { subtotal += C.discovery.price * l.qty; original += C.discovery.price * l.qty; count += l.qty; hasDiscovery = true; }
      else if (l.type === 'sample') { subtotal += C.sample.price * l.qty; original += C.sample.price * l.qty; count += l.qty; }
      else if (l.type === 'bundle') {
        var deal = dealBy(l.key); if (!deal) return;
        var std = deal.size * C.basePrice;
        subtotal += deal.price * l.qty; original += std * l.qty; bundleSavings += (std - deal.price) * l.qty; count += l.qty;
        hasFull = true; hasBundle = true;
      }
    });
    return { subtotal: subtotal, original: original, bundleSavings: bundleSavings, count: count, hasDiscovery: hasDiscovery, hasFull: hasFull, hasBundle: hasBundle };
  }

  function totals(method) {
    method = method || 'standard';
    var t = rawTotals();
    var discoveryCredit = (t.hasDiscovery && t.hasFull) ? C.discovery.redeemable : 0;
    var afterCredit = Math.max(0, t.subtotal - discoveryCredit);

    var codeDiscount = 0, codeLabel = '';
    if (state.code) {
      if (state.code === 'DISCOVER35') {
        if (!t.hasDiscovery && t.hasFull) { codeDiscount = C.discovery.redeemable; codeLabel = 'Discovery credit'; }
        else { state.code = null; }
      } else if (C.codes[state.code]) {
        var def = C.codes[state.code];
        if (def.type === 'percent') { codeDiscount = Math.round(afterCredit * def.value) / 100; codeLabel = def.value + '% off (' + state.code + ')'; }
      } else {
        var camp2 = campaign();
        if (camp2 && camp2.code && state.code === camp2.code.code && camp2.isActive()) {
          codeDiscount = Math.round(afterCredit * camp2.code.value) / 100;
          codeLabel = camp2.code.value + '% off (' + state.code + ')';
        } else { state.code = null; }
      }
    }
    var payable = Math.max(0, t.subtotal - discoveryCredit - codeDiscount);
    var freeShip = t.hasBundle || t.subtotal >= C.shipping.freeThreshold;
    var shipping = method === 'express' ? C.shipping.express : (freeShip ? 0 : C.shipping.standard);
    var shipRemaining = Math.max(0, C.shipping.freeThreshold - t.subtotal);
    var giftWrap = (state.gift && state.gift.wrap) ? C.giftWrap.price : 0;

    return {
      subtotal: t.subtotal, original: t.original, bundleSavings: t.bundleSavings,
      discoveryCredit: discoveryCredit, codeDiscount: codeDiscount, codeLabel: codeLabel, code: state.code,
      payable: payable, shipping: shipping, freeShip: freeShip, shipRemaining: shipRemaining,
      giftWrap: giftWrap, giftMessage: (state.gift && state.gift.message) || '',
      total: payable + shipping + giftWrap, count: t.count, method: method,
      hasItems: state.items.length > 0,
    };
  }

  /* ---------- line views (for rendering) ---------- */
  function lineView(line) {
    if (line.type === 'product') {
      var p = DATA.getProduct(line.slug);
      return { title: p.name, variant: p.size + ' &middot; Eau de Parfum', image: p.images.thumb, href: 'products/' + p.slug + '.html', unit: C.basePrice, was: null };
    }
    if (line.type === 'sample') {
      var sp = DATA.getProduct(line.slug);
      return { title: sp.name + ' Sample', variant: C.sample.size + ' &middot; travel spray', image: sp.images.thumb, href: 'products/' + sp.slug + '.html', unit: C.sample.price, was: null, sample: true };
    }
    if (line.type === 'discovery') {
      return { title: DATA.commerce.discovery.name, variant: C.discovery.size + ' &middot; 5 fragrances', image: DATA.products[0].images.thumb, href: 'pages/discovery.html', unit: C.discovery.price, was: null, discovery: true };
    }
    if (line.type === 'bundle') {
      var deal = dealBy(line.key);
      var names = line.slugs.map(function (s) { var pp = DATA.getProduct(s); return pp ? pp.name : s; });
      var std = deal.size * C.basePrice;
      var img = DATA.getProduct(line.slugs[0]);
      return { title: deal.label, variant: names.join(', '), image: img ? img.images.thumb : DATA.products[0].images.thumb, href: 'pages/bundles.html', unit: deal.price, was: std, bundle: true, count: deal.size };
    }
    return {};
  }

  window.IBRAHIM = window.IBRAHIM || {};
  window.IBRAHIM.store = {
    get state() { return state; },
    on: on, emit: emit,
    addProduct: addProduct, addDiscovery: addDiscovery, addBundle: addBundle,
    addSample: addSample, setGiftWrap: setGiftWrap, setGiftMessage: setGiftMessage,
    setQty: setQty, inc: inc, dec: dec, remove: remove, clear: clear,
    applyCode: applyCode, clearCode: clearCode,
    totals: totals, lineView: lineView, count: function () { return rawTotals().count; },
    dealBy: dealBy,
  };
  window.IBRAHIM.money = money;
  window.IBRAHIM.data = DATA;
})();
