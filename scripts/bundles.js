/* IBRAHIM — interactive bundle builder. Depends on store.js + app.js. */
(function () {
  'use strict';
  var root = document.querySelector('[data-page-bundles]');
  if (!root) return;
  var IB = window.IBRAHIM, store = IB.store, money = IB.money, DATA = IB.data;
  var BASE = document.documentElement.dataset.base || '';
  var asset = function (p) { return BASE + p; };

  var TIERS = { duo: DATA.commerce.deals.duo, trio: DATA.commerce.deals.trio, full: DATA.commerce.deals.full };
  var tier = 'duo';
  var selected = []; // slugs, order preserved

  var tierBtns = root.querySelectorAll('[data-tier]');
  var picks = root.querySelectorAll('[data-pick]');
  var slotsWrap = root.querySelector('[data-slots]');
  var elRemaining = root.querySelector('[data-remaining]');
  var elOriginal = root.querySelector('[data-original]');
  var elPrice = root.querySelector('[data-bundle-price]');
  var elSave = root.querySelector('[data-bundle-save]');
  var elMsg = root.querySelector('[data-builder-msg]');
  var addBtn = root.querySelector('[data-add-bundle-builder]');

  function size() { return TIERS[tier].size; }
  function dealPrice() { return TIERS[tier].price; }

  function setTier(next) {
    tier = next;
    tierBtns.forEach(function (b) {
      var on = b.getAttribute('data-tier') === tier;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    if (tier === 'full') selected = DATA.products.map(function (p) { return p.slug; });
    else if (selected.length > size()) selected = selected.slice(0, size());
    renderSlots();
    syncPicks();
    update();
  }

  function toggle(slug) {
    if (tier === 'full') { flash('All five are included in this bundle.'); return; }
    var i = selected.indexOf(slug);
    if (i >= 0) selected.splice(i, 1);
    else {
      if (selected.length >= size()) { flash('That is ' + size() + ' selected. Remove one to swap, or choose a larger bundle.', 'warn'); return; }
      selected.push(slug);
    }
    renderSlots();
    syncPicks();
    update();
  }

  function syncPicks() {
    picks.forEach(function (card) {
      card.classList.toggle('is-selected', selected.indexOf(card.getAttribute('data-pick')) >= 0);
    });
  }

  function renderSlots() {
    if (!slotsWrap) return;
    var n = size();
    var html = '';
    for (var i = 0; i < n; i++) {
      var slug = selected[i];
      if (slug) {
        var p = DATA.getProduct(slug);
        html += '<div class="slot filled"><img src="' + asset(p.images.card) + '" alt="' + p.name + '"></div>';
      } else {
        html += '<div class="slot"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></div>';
      }
    }
    slotsWrap.innerHTML = html;
  }

  function update() {
    var n = size(), chosen = selected.length, remaining = n - chosen;
    var original = n * DATA.commerce.basePrice;
    var price = dealPrice();
    var save = original - price;
    elOriginal.textContent = money(original);
    elPrice.textContent = money(price);
    elSave.textContent = '-' + money(save);
    if (remaining > 0) elRemaining.textContent = 'Select ' + remaining + ' more fragrance' + (remaining > 1 ? 's' : '');
    else elRemaining.textContent = 'Bundle complete';
    var ready = chosen === n;
    addBtn.disabled = !ready;
    if (ready) { elMsg.textContent = 'Ready to add. You save ' + money(save) + '.'; elMsg.className = 'builder-msg ok'; }
    else if (!elMsg.classList.contains('warn')) { elMsg.textContent = ''; elMsg.className = 'builder-msg'; }
  }

  var flashT;
  function flash(text, kind) {
    elMsg.textContent = text;
    elMsg.className = 'builder-msg ' + (kind || 'warn');
    clearTimeout(flashT);
    flashT = setTimeout(update, 2400);
  }

  // events
  tierBtns.forEach(function (b) { b.addEventListener('click', function () { setTier(b.getAttribute('data-tier')); }); });
  picks.forEach(function (card) { card.addEventListener('click', function () { toggle(card.getAttribute('data-pick')); }); });
  addBtn.addEventListener('click', function () {
    if (selected.length !== size()) return;
    var res = store.addBundle(tier, tier === 'full' ? null : selected);
    if (res.ok) {
      IB.toast(TIERS[tier].label + ' added to bag');
      if (IB.openCart) IB.openCart();
      if (tier !== 'full') { selected = []; renderSlots(); syncPicks(); update(); }
    } else { flash(res.message); }
  });

  // preset from hash (#duo/#trio/#full)
  var hash = (location.hash || '').replace('#', '');
  if (TIERS[hash]) setTier(hash);
  else setTier('duo');
})();
