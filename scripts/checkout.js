/* IBRAHIM — checkout + confirmation logic. Depends on store.js + app.js. */
(function () {
  'use strict';
  var IB = window.IBRAHIM, store = IB.store, money = IB.money, DATA = IB.data;
  var BASE = document.documentElement.dataset.base || '';
  var asset = function (p) { return BASE + p; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ORDER_KEY = 'ibrahim_last_order';

  function lineRow(v, qty, opts) {
    opts = opts || {};
    var price = money(v.unit * qty, { aud: false });
    return '<div class="co-line">' +
      '<img src="' + asset(v.image) + '" alt="' + v.title + '" width="54" height="66">' +
      '<div><div class="cln">' + v.title + '</div><div class="clv">' + (opts.short ? '' : v.variant + ' &middot; ') + 'Qty ' + qty + '</div></div>' +
      '<div class="clp">' + price + '</div></div>';
  }

  /* ============ CHECKOUT ============ */
  var checkout = $('[data-page-checkout]');
  if (checkout) {
    var form = $('[data-checkout-form]', checkout);
    var linesHost = $('[data-co-lines]', checkout);
    var method = 'standard';

    function currentMethod() {
      var r = $('input[name="shipping"]:checked', checkout);
      return r ? r.value : 'standard';
    }

    function renderSummary() {
      method = currentMethod();
      var st = store.state;
      if (!st.items.length) {
        linesHost.innerHTML = '<p class="acct-note">Your bag is empty. <a class="link-underline" href="' + asset('index.html#collection') + '">Explore the collection</a>.</p>';
      } else {
        linesHost.innerHTML = st.items.map(function (l) { return lineRow(store.lineView(l), l.qty); }).join('');
      }
      var t = store.totals(method);
      IB.paintTotals(t, method);
      // standard option label: Free when qualifies
      var stdPrice = $('[data-standard-price]', checkout);
      if (stdPrice) stdPrice.textContent = t.freeShip ? 'Free' : money(DATA.commerce.shipping.standard, { aud: false });
      var place = $('[data-place-order]', checkout);
      if (place) place.disabled = !st.items.length;
    }

    $$('input[name="shipping"]', checkout).forEach(function (r) { r.addEventListener('change', renderSummary); });
    store.on(renderSummary); // reflect code applies / qty edits elsewhere
    renderSummary();

    // B7: gift options
    var giftWrap = $('[data-gift-wrap]', checkout);
    var giftMsg = $('[data-gift-message]', checkout);
    if (giftWrap) { giftWrap.checked = !!(store.state.gift && store.state.gift.wrap); giftWrap.addEventListener('change', function () { store.setGiftWrap(giftWrap.checked); }); }
    if (giftMsg) { giftMsg.value = (store.state.gift && store.state.gift.message) || ''; giftMsg.addEventListener('input', function () { store.setGiftMessage(giftMsg.value); }); }

    // B11: sample add-on
    var addSampleBtn = $('[data-add-sample]', checkout);
    if (addSampleBtn) addSampleBtn.addEventListener('click', function () {
      var sel = $('[data-sample-select]', checkout);
      var res = store.addSample(sel.value, 1);
      if (res.ok) { var p = DATA.getProduct(sel.value); IB.toast((p ? p.name : 'Sample') + ' sample added'); }
    });

    // validation
    var REQUIRED = ['email', 'phone', 'first', 'last', 'address', 'city', 'postcode', 'card', 'expiry', 'cvc'];
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validate() {
      var ok = true; var firstBad = null;
      REQUIRED.forEach(function (id) {
        var input = $('#' + id, checkout); if (!input) return;
        var field = input.closest('.field');
        var val = (input.value || '').trim();
        var bad = !val || (id === 'email' && !validEmail(val));
        if (field) {
          field.classList.toggle('invalid', bad);
          var err = $('[data-err]', field);
          if (err) err.textContent = bad ? (id === 'email' && val ? 'Enter a valid email.' : 'Required.') : '';
        }
        if (bad && !firstBad) firstBad = input;
        if (bad) ok = false;
      });
      if (firstBad) firstBad.focus();
      return ok;
    }

    function orderNumber() {
      var n = Math.floor(100000 + Math.random() * 900000);
      return 'IB-' + n;
    }
    function etaString(m) {
      var days = m === 'express' ? 2 : 5;
      var d = new Date(); var added = 0;
      while (added < days) { d.setDate(d.getDate() + 1); var wd = d.getDay(); if (wd !== 0 && wd !== 6) added++; }
      return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!store.state.items.length) { IB.toast('Your bag is empty', 'err'); return; }
      if (!validate()) { IB.toast('Please complete the highlighted fields', 'err'); return; }
      var m = currentMethod();
      var t = store.totals(m);
      var items = store.state.items.map(function (l) {
        var v = store.lineView(l);
        return { title: v.title, variant: v.variant, image: v.image, href: v.href, qty: l.qty, unit: v.unit, was: v.was || null };
      });
      var order = {
        number: orderNumber(),
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
        eta: etaString(m),
        method: m === 'express' ? DATA.commerce.shipping.expressLabel : DATA.commerce.shipping.standardLabel,
        email: $('#email', checkout).value.trim(),
        name: ($('#first', checkout).value.trim() + ' ' + $('#last', checkout).value.trim()).trim(),
        address: [
          $('#address', checkout).value.trim(),
          $('#address2', checkout).value.trim(),
          [$('#city', checkout).value.trim(), $('#state', checkout).value, $('#postcode', checkout).value.trim()].filter(Boolean).join(' '),
          'Australia',
        ].filter(Boolean).join('<br>'),
        items: items,
        gift: { wrap: t.giftWrap > 0, fee: t.giftWrap, message: t.giftMessage || '' },
        totals: { subtotal: t.subtotal, bundleSavings: t.bundleSavings, discoveryCredit: t.discoveryCredit, codeDiscount: t.codeDiscount, giftWrap: t.giftWrap, shipping: t.shipping, total: t.total, freeShip: t.freeShip },
      };
      try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (er) {}
      store.clear();
      window.location.href = asset('pages/confirmation.html');
    });

    // live-clear invalid state on input
    $$('.field input, .field select', checkout).forEach(function (input) {
      input.addEventListener('input', function () {
        var f = input.closest('.field'); if (f) { f.classList.remove('invalid'); var e2 = $('[data-err]', f); if (e2) e2.textContent = ''; }
      });
    });
  }

  /* ============ CONFIRMATION ============ */
  var confirm = $('[data-page-confirmation]');
  if (confirm) {
    var order = null;
    try { order = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null'); } catch (er) {}
    if (!order) {
      $('[data-confirm-heading]', confirm).textContent = 'No recent order';
      $('[data-confirm-sub]', confirm).textContent = 'We could not find a recent order in this browser. Everything you need is back in the store.';
      var panel = $('[data-confirm-panel]', confirm); if (panel) panel.style.display = 'none';
      var num = $('[data-order-number]', confirm); if (num) num.style.display = 'none';
      return;
    }
    var set = function (sel, val) { var n = $(sel, confirm); if (n) n.innerHTML = val; };
    set('[data-confirm-heading]', 'Thank you, ' + (order.name.split(' ')[0] || 'friend') + '.');
    set('[data-confirm-sub]', 'Your IBRAHIM order is confirmed. A confirmation has been sent to <b>' + order.email + '</b>.');
    set('[data-order-number]', 'Order ' + order.number);
    $('[data-confirm-lines]', confirm).innerHTML = order.items.map(function (it) {
      return lineRow({ title: it.title, variant: it.variant, image: it.image, unit: it.unit }, it.qty);
    }).join('');
    set('[data-c-subtotal]', money(order.totals.subtotal));
    var savings = (order.totals.bundleSavings || 0) + (order.totals.discoveryCredit || 0) + (order.totals.codeDiscount || 0);
    if (savings > 0) { var row = $('[data-c-row-savings]', confirm); if (row) row.hidden = false; set('[data-c-savings]', '-' + money(savings)); }
    set('[data-c-shipping]', order.totals.freeShip && order.method.indexOf('Express') < 0 ? 'Free' : money(order.totals.shipping));
    set('[data-c-total]', money(order.totals.total));
    set('[data-confirm-address]', order.name + '<br>' + order.address + (order.gift && order.gift.wrap ? '<br><span style="color:var(--gold-soft)">Gift wrapped' + (order.gift.message ? ', with message' : '') + '</span>' : ''));
    set('[data-confirm-eta]', order.method + '<br>' + order.eta);

    // B17: shareable confirmation card
    var shareWrap = $('[data-confirm-share]', confirm);
    if (shareWrap) {
      shareWrap.hidden = false;
      var names = order.items.map(function (it) { return it.title; }).filter(function (n) { return n.indexOf('Sample') < 0; });
      var signature = names[0] || 'IBRAHIM';
      var shareText = 'My signature is ' + signature + ' by IBRAHIM Fragrances.';
      var shareUrl = location.origin + '/';
      var btn = $('[data-share-order]', shareWrap);
      var msg = $('[data-share-msg]', shareWrap);
      btn.addEventListener('click', function () {
        if (navigator.share) {
          navigator.share({ title: 'IBRAHIM Fragrances', text: shareText, url: shareUrl }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(function () { if (msg) { msg.textContent = 'Copied to clipboard.'; msg.style.color = 'var(--gold-soft)'; } });
        } else if (msg) { msg.textContent = shareText; }
      });
    }
  }
})();
