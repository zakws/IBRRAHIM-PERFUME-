/* IBRAHIM — shared UI + motion. Depends on store.js. Framework-free. */
(function () {
  'use strict';
  var IB = window.IBRAHIM || {};
  var store = IB.store, money = IB.money, DATA = IB.data;
  if (!store) { console.error('IBRAHIM store missing'); return; }

  var BASE = document.documentElement.dataset.base || '';
  var asset = function (p) { return BASE + p; };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initAnnounce();
    initOverlays();
    initCart();
    initAddActions();
    initReveals();
    initParallax();
    initCountUp();
    initMagnetic();
    initFilters();
    initSearch();
    initGallery();
    initPdpQty();
    initLightbox();
    initPdpExtras();
    initReviews();
    initForms();
    initAccordions();
    initWishlist();
    initWishlistPage();
    initRecentlyViewed();
    initExitIntent();
    initConsent();
    initCampaign();
    store.emit(); // initial paint of cart-dependent UI
  });

  /* ---------- H3: seasonal campaign — unhide campaign UI when the window (or preview) is on ---------- */
  function initCampaign() {
    var camp = window.IBRAHIM_CAMPAIGN;
    if (!camp || !camp.isActive()) return;
    $$('[data-campaign]').forEach(function (el) { el.hidden = false; });
    if (camp.isPreview()) {
      var chip = document.createElement('div');
      chip.className = 'campaign-preview-chip';
      chip.innerHTML = 'Previewing ' + camp.name + ' &middot; <a href="?preview=off">exit</a>';
      document.body.appendChild(chip);
    }
  }

  /* ---------- C6: cookie consent, gates analytics ---------- */
  function loadAnalytics() {
    var a = (DATA && DATA.analytics) || {};
    if (a.ga4) {
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + a.ga4; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', a.ga4);
    }
    // Meta / TikTok pixels initialise here once their IDs are set in data/products.js.
  }
  function initConsent() {
    var el = $('[data-consent]'); if (!el) return;
    var choice = null; try { choice = localStorage.getItem('ibrahim_consent'); } catch (e) {}
    if (choice === 'accept') { loadAnalytics(); return; }
    if (choice === 'decline') { return; }
    var remember = function (v) { try { localStorage.setItem('ibrahim_consent', v); } catch (e) {} };
    var hide = function () { el.classList.remove('show'); setTimeout(function () { el.hidden = true; }, 300); };
    setTimeout(function () { el.hidden = false; requestAnimationFrame(function () { el.classList.add('show'); }); }, 1200);
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-consent-accept]')) { remember('accept'); loadAnalytics(); hide(); }
      else if (e.target.closest('[data-consent-decline]')) { remember('decline'); hide(); }
    });
  }

  /* ---------- A3: restrained image parallax ---------- */
  function initParallax() {
    if (reduced) return;
    var nodes = $$('[data-parallax-media] img, .band-media img');
    if (!nodes.length) return;
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      nodes.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5 across viewport
        var shift = Math.max(-18, Math.min(18, -progress * 26));
        img.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(1.08)';
      });
      ticking = false;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- B4: recently viewed ---------- */
  function initRecentlyViewed() {
    var KEY = 'ibrahim_recent';
    var get = function () { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
    var set = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
    var page = $('[data-page-product]');
    var current = page ? page.getAttribute('data-slug') : null;
    if (current) { var l = get().filter(function (s) { return s !== current; }); l.unshift(current); set(l.slice(0, 8)); }
    var host = $('[data-recently-viewed]'); if (!host) return;
    var section = host.closest('[data-recent-section]');
    var list = get().filter(function (s) { return s !== current && DATA.getProduct(s); }).slice(0, 4);
    if (list.length < 1) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    host.innerHTML = list.map(function (slug) {
      var p = DATA.getProduct(slug);
      return '<a class="rv-card" href="' + asset('products/' + p.slug + '.html') + '" style="--accent:' + p.color + '">' +
        '<span class="rv-media"><img src="' + asset(p.images.card) + '" alt="' + p.name + '" width="300" height="300" loading="lazy" decoding="async"></span>' +
        '<span class="rv-name">' + p.name + '</span><span class="rv-fam">' + p.familyShort + '</span></a>';
    }).join('');
  }

  /* ---------- B20: tasteful exit-intent (desktop, once per session) ---------- */
  function initExitIntent() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if ($('[data-page-checkout]') || $('[data-page-confirmation]')) return;
    try { if (sessionStorage.getItem('ibrahim_exit')) return; } catch (e) {}
    var shown = false;
    var show = function () {
      if (shown || openStack.length) return; shown = true;
      try { sessionStorage.setItem('ibrahim_exit', '1'); } catch (e) {}
      var el = document.createElement('div');
      el.className = 'exit-modal'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Discovery set offer');
      el.innerHTML = '<div class="exit-card"><button class="exit-close drawer-close" aria-label="Close">&times;</button>' +
        '<p class="eyebrow eyebrow--center">Before you go</p><h3 style="font-family:var(--serif);font-size:1.9rem;margin:6px 0 10px">Not sure where to start?</h3>' +
        '<p style="color:var(--muted);margin:0 0 22px">Try all five in the Discovery Set for $45, fully redeemable against your first full-size bottle.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn--primary" href="' + asset('pages/discovery.html') + '"><span class="btn__label">Try the Discovery Set</span></a>' +
        '<button class="btn btn--ghost exit-dismiss">No thanks</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('show'); });
      var close = function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 300); };
      el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('.exit-close') || e.target.closest('.exit-dismiss')) close(); });
      document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    };
    document.addEventListener('mouseout', function (e) { if (e.clientY <= 0 && !e.relatedTarget) show(); });
  }

  /* ---------- B3: PDP gallery lightbox with zoom ---------- */
  function initLightbox() {
    var main = $('[data-gallery-main]'); if (!main) return;
    var box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML = '<button class="lightbox-close drawer-close" aria-label="Close">&times;</button><div class="lightbox-stage" data-lb-stage><img alt="" data-lb-img></div>';
    document.body.appendChild(box);
    var lbImg = box.querySelector('[data-lb-img]');
    var stage = box.querySelector('[data-lb-stage]');
    var zoomed = false;
    var open = function (src) {
      lbImg.src = src; zoomed = false; stage.classList.remove('is-zoom');
      box.classList.add('is-open'); document.body.style.overflow = 'hidden';
    };
    var close = function () { box.classList.remove('is-open'); document.body.style.overflow = ''; };
    main.style.cursor = 'zoom-in';
    main.addEventListener('click', function () { open(main.getAttribute('src')); });
    // keep lightbox in sync when a thumbnail changes the main image handled by initGallery
    stage.addEventListener('click', function (e) {
      if (e.target !== lbImg) return;
      zoomed = !zoomed; stage.classList.toggle('is-zoom', zoomed);
    });
    stage.addEventListener('mousemove', function (e) {
      if (!zoomed) return;
      var r = stage.getBoundingClientRect();
      lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
    });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.lightbox-close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-open')) close(); });
  }

  /* ---------- B5 ship progress on PDP, B2 sticky bar, B8 notify ---------- */
  function initPdpExtras() {
    var pdp = $('[data-page-product]'); if (!pdp) return;
    // B5: free-shipping progress on the product page
    var ship = $('[data-pdp-ship]');
    if (ship) {
      var paintShip = function (st, t) {
        ship.hidden = false;
        if (t.count === 0) ship.innerHTML = '<span>' + money(DATA.commerce.shipping.freeThreshold) + ' away from free shipping.</span>';
        else if (t.freeShip) ship.innerHTML = '<span class="ok">' + iconCheck() + ' Your order ships free.</span>';
        else ship.innerHTML = '<span>Add <b>' + money(t.shipRemaining) + '</b> more for free shipping.</span>';
      };
      store.on(paintShip); paintShip(store.state, store.totals());
    }
    // B2: reveal sticky add-to-bag once the main add button scrolls away (mobile via CSS)
    var sticky = $('[data-pdp-sticky]');
    var addBtn = $('.pdp-buy [data-add-product]', pdp);
    if (sticky && addBtn && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        sticky.classList.toggle('show', !en[0].isIntersecting);
      }, { rootMargin: '-10px' }).observe(addBtn);
    }
    // B8: notify-me when out of stock
    var nf = $('[data-notify-form]');
    if (nf) {
      nf.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = nf.querySelector('input[type=email]');
        var msg = $('[data-notify-msg]');
        if (!validEmail(input.value.trim())) { if (msg) { msg.textContent = 'Enter a valid email.'; msg.className = 'news-msg err'; } return; }
        try { localStorage.setItem('ibrahim_notify_' + nf.getAttribute('data-notify-form'), input.value.trim()); } catch (er) {}
        if (msg) { msg.textContent = 'Thanks. We will email you the moment it is back.'; msg.className = 'news-msg ok'; }
        nf.reset();
      });
    }
  }
  function iconCheck() { return '<svg class="icon tk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12l5 5 9-11" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  /* ---------- B9: reviews (demo, stored locally; no fake reviews shipped) ---------- */
  function initReviews() {
    var host = $('[data-reviews]'); if (!host) return;
    var slug = host.getAttribute('data-slug');
    var KEY = 'ibrahim_reviews_' + slug;
    var listEl = $('[data-reviews-list]', host);
    var sumEl = $('[data-reviews-summary]', host);
    var form = $('[data-review-form]', host);
    var starsWrap = $('[data-review-stars]', host);
    var rating = 0;
    var get = function () { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
    var set = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
    var starRow = function (n) { var s = ''; for (var i = 1; i <= 5; i++) s += '<span class="rv-star' + (i <= n ? ' on' : '') + '">' + iconHeart() + '</span>'; return s; };
    var render = function () {
      var list = get();
      if (!list.length) {
        sumEl.innerHTML = '<p class="reviews-empty">No reviews yet. Be the first to review ' + host.getAttribute('data-name') + '.</p>';
        listEl.innerHTML = '';
        return;
      }
      var avg = list.reduce(function (a, r) { return a + r.rating; }, 0) / list.length;
      sumEl.innerHTML = '<div class="reviews-avg"><span class="reviews-avg-num">' + avg.toFixed(1) + '</span><span class="reviews-stars">' + starRow(Math.round(avg)) + '</span><span class="reviews-count">' + list.length + ' review' + (list.length > 1 ? 's' : '') + '</span></div>';
      listEl.innerHTML = list.slice().reverse().map(function (r) {
        return '<div class="review-item"><div class="reviews-stars">' + starRow(r.rating) + '</div><p class="review-text">' + escapeHtml(r.text) + '</p><p class="review-by">' + escapeHtml(r.name || 'Anonymous') + '</p></div>';
      }).join('');
    };
    if (starsWrap) starsWrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-star]'); if (!b) return;
      rating = parseInt(b.getAttribute('data-star'), 10);
      $$('[data-star]', starsWrap).forEach(function (s) { s.classList.toggle('on', parseInt(s.getAttribute('data-star'), 10) <= rating); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = $('[data-review-text]', form).value.trim();
      var name = $('[data-review-name]', form).value.trim();
      if (!rating) { toast('Pick a rating first', 'err'); return; }
      if (!text) { toast('Add a short review', 'err'); return; }
      var list = get(); list.push({ rating: rating, text: text, name: name, at: Date.now() }); set(list);
      form.reset(); rating = 0; $$('[data-star]', starsWrap).forEach(function (s) { s.classList.remove('on'); });
      render(); toast('Thanks for your review');
    });
    render();
  }
  function iconHeart() { return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 20s-7-4.6-9.3-9C1 7.5 3 4.5 6.2 4.5c1.9 0 3.2 1 3.8 2 .6-1 1.9-2 3.8-2C17 4.5 19 7.5 17.3 11 15 15.4 12 20 12 20Z"/></svg>'; }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- B19: wishlist page (localStorage + shareable ?w=) ---------- */
  function initWishlistPage() {
    var page = $('[data-page-wishlist]'); if (!page) return;
    var grid = $('[data-wishlist-grid]');
    var empty = $('[data-wishlist-empty]');
    var barWrap = $('[data-wishlist-bar-wrap]');
    var params = new URLSearchParams(location.search);
    var shared = params.get('w');
    if (shared) { var sub = $('[data-wishlist-sub]'); if (sub) sub.textContent = 'A shared wishlist. Save any of these to your own list with the heart.'; }
    var renderGrid = function () {
      var slugs = shared
        ? shared.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return DATA.getProduct(s); })
        : getWishlist().filter(function (s) { return DATA.getProduct(s); });
      if (!slugs.length) { if (empty) empty.hidden = false; if (barWrap) barWrap.hidden = true; grid.innerHTML = ''; return; }
      if (empty) empty.hidden = true;
      if (barWrap && !shared) barWrap.hidden = false;
      grid.innerHTML = slugs.map(function (s) { return productCardHtml(s); }).join('');
    };
    renderGrid();
    if (!shared) grid.addEventListener('click', function (e) { if (e.target.closest('[data-wishlist-toggle]')) setTimeout(renderGrid, 0); });
    var copyBtn = $('[data-copy-wishlist]');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var url = location.origin + location.pathname + '?w=' + getWishlist().join(',');
      var msg = $('[data-wishlist-msg]');
      var done = function (ok) { if (msg) { msg.textContent = ok ? 'Link copied. Share it anywhere.' : url; msg.className = 'news-msg ok'; } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  }
  function productCardHtml(slug) {
    var p = DATA.getProduct(slug);
    return '<article class="product-card" style="--accent:' + p.color + ';--accent-soft:' + p.colorSoft + '">' +
      '<span class="pcard-glow"></span>' +
      '<a class="pcard-media" href="' + asset('products/' + p.slug + '.html') + '"><picture><source type="image/webp" srcset="' + asset(p.images.card) + '"><img src="' + asset(p.images.cardJpg) + '" alt="' + p.name + '" loading="lazy" decoding="async" width="900" height="900"></picture></a>' +
      '<div class="pcard-body"><span class="pcard-family">' + p.familyShort + '</span><h3 class="pcard-name"><a href="' + asset('products/' + p.slug + '.html') + '">' + p.name + '</a></h3>' +
      '<p class="pcard-desc">' + p.tagline + '</p><p class="pcard-meta"><span>' + p.size + '</span><span>Eau de Parfum</span></p>' +
      '<div class="pcard-foot"><span class="pcard-price">' + money(p.price, { aud: false }) + ' <small>AUD</small></span></div>' +
      '<div class="pcard-actions"><button class="btn btn--sm btn--ghost" data-wishlist-toggle="' + p.slug + '">Remove</button><button class="btn btn--sm btn--primary" data-add-product="' + p.slug + '"><span class="btn__label">Shop Now</span></button></div></div></article>';
  }

  /* ---------- header ---------- */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- announcement rotation (A1: pause on hover/focus/hidden tab) ---------- */
  function initAnnounce() {
    var bar = $('.announce');
    var track = $('[data-announce]');
    if (!track) return;
    var items = $$('.announce-item', track);
    if (items.length < 2) return;
    var i = 0, timer = null;
    var advance = function () {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    };
    var play = function () { stop(); timer = setInterval(advance, 4200); };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    if (bar) {
      bar.addEventListener('mouseenter', stop);
      bar.addEventListener('mouseleave', play);
      bar.addEventListener('focusin', stop);
      bar.addEventListener('focusout', play);
    }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    play();
  }

  /* ---------- overlays (cart / account / search / menu) ---------- */
  var openStack = [];
  function map() {
    return {
      cart: $('[data-cart-drawer]'), account: $('[data-account-drawer]'),
      search: $('[data-search-overlay]'), menu: $('[data-mobile-nav]'),
    };
  }
  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
  var lastFocus = null;
  function openOverlay(key) {
    var el = map()[key]; if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    var scrim = $('[data-scrim]'); if (scrim && key !== 'search') scrim.classList.add('is-open');
    if (openStack.indexOf(key) < 0) openStack.push(key);
    lockScroll(true);
    var focusEl = key === 'search' ? $('[data-search-input]', el) : el.querySelector('input, button, a, [tabindex]');
    if (focusEl) setTimeout(function () { focusEl.focus(); }, 60);
    if (key === 'menu') { var t = $('[data-menu-toggle]'); if (t) t.setAttribute('aria-expanded', 'true'); }
  }
  function closeOverlay(key) {
    var el = map()[key]; if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    openStack = openStack.filter(function (k) { return k !== key; });
    if (!openStack.length) { var scrim = $('[data-scrim]'); if (scrim) scrim.classList.remove('is-open'); lockScroll(false); }
    if (key === 'menu') { var t = $('[data-menu-toggle]'); if (t) t.setAttribute('aria-expanded', 'false'); }
    if (lastFocus && !openStack.length) { try { lastFocus.focus(); } catch (e) {} }
  }
  function closeAll() { openStack.slice().forEach(closeOverlay); }

  function initOverlays() {
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); openOverlay(o.getAttribute('data-open')); return; }
      var c = e.target.closest('[data-close]'); if (c) { e.preventDefault(); closeOverlay(c.getAttribute('data-close')); return; }
      var mt = e.target.closest('[data-menu-toggle]'); if (mt) { e.preventDefault(); (openStack.indexOf('menu') < 0 ? openOverlay : closeOverlay)('menu'); return; }
      var mc = e.target.closest('[data-menu-close]'); if (mc) { e.preventDefault(); closeOverlay('menu'); return; }
      if (e.target.closest('[data-scrim]')) { closeAll(); return; }
      // A11: click the dimmed search backdrop (outside the inner panel) to dismiss
      var so = $('[data-search-overlay]');
      if (so && so.classList.contains('is-open') && e.target === so) { closeOverlay('search'); return; }
      // close mobile menu when a nav link is tapped
      var ml = e.target.closest('.mobile-nav .nav-link'); if (ml) closeOverlay('menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openStack.length) { closeOverlay(openStack[openStack.length - 1]); }
      if (e.key === 'Tab' && openStack.length) trapFocus(e);
    });
  }
  function trapFocus(e) {
    var key = openStack[openStack.length - 1];
    var el = map()[key]; if (!el) return;
    var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  IB.openCart = function () { openOverlay('cart'); };

  /* ---------- cart rendering ---------- */
  function initCart() {
    store.on(renderCart);
    var lines = $('[data-cart-lines]');
    if (lines) {
      lines.addEventListener('click', function (e) {
        var line = e.target.closest('.cart-line'); if (!line) return;
        var idx = parseInt(line.getAttribute('data-index'), 10);
        if (e.target.closest('[data-inc]')) { store.inc(idx); maybeBundleHint(); }
        else if (e.target.closest('[data-dec]')) store.dec(idx);
        else if (e.target.closest('[data-remove]')) { store.remove(idx); toast('Removed from bag'); }
      });
    }
    $$('[data-code-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input');
        var res = store.applyCode(input.value);
        toast(res.message, res.ok ? 'ok' : 'err');
        if (res.ok) input.value = '';
      });
    });
  }

  function renderCart(st, t) {
    // badges
    $$('[data-cart-count]').forEach(function (b) {
      b.textContent = t.count;
      b.classList.toggle('is-visible', t.count > 0);
    });
    $$('[data-cart-count-label]').forEach(function (l) { l.textContent = '(' + t.count + ')'; });

    var lines = $('[data-cart-lines]');
    var empty = $('[data-cart-empty]');
    var foot = $('[data-cart-foot]');
    if (lines) {
      if (!st.items.length) {
        lines.innerHTML = '';
        if (empty) empty.hidden = false;
        if (foot) foot.hidden = true;
        var recs = $('[data-empty-recs]');
        if (recs && !recs.getAttribute('data-filled')) {
          recs.innerHTML = DATA.products.slice(0, 3).map(function (p) {
            return '<a href="' + asset('products/' + p.slug + '.html') + '" data-close="cart"><img src="' + asset(p.images.thumb) + '" alt="' + p.name + '" width="56" height="56" loading="lazy" decoding="async"><span>' + p.name + '</span></a>';
          }).join('');
          recs.setAttribute('data-filled', '1');
        }
      } else {
        if (empty) empty.hidden = true;
        if (foot) foot.hidden = false;
        lines.innerHTML = st.items.map(function (line, i) { return cartLineHtml(line, i); }).join('');
      }
    }
    // ship progress
    var msg = $('[data-ship-msg]'), bar = $('[data-ship-bar]');
    if (msg && bar) {
      if (t.freeShip) msg.innerHTML = 'You have unlocked <b>free shipping</b>.';
      else msg.innerHTML = 'You are <b>' + money(t.shipRemaining) + '</b> away from free shipping.';
      var pct = Math.min(100, (t.subtotal / DATA.commerce.shipping.freeThreshold) * 100);
      bar.style.width = pct + '%';
    }
    // B6: complete-the-collection nudge
    var nudge = $('[data-cart-nudge]');
    if (nudge) {
      var distinct = {}, hasFull = false;
      st.items.forEach(function (l) {
        if (l.type === 'product') distinct[l.slug] = 1;
        if (l.type === 'bundle') { if (l.key === 'full') hasFull = true; l.slugs.forEach(function (s) { distinct[s] = 1; }); }
      });
      var n = Object.keys(distinct).length;
      if (!hasFull && n >= 1 && n < 5) {
        nudge.hidden = false;
        var fullSave = 5 * DATA.commerce.basePrice - DATA.commerce.deals.full.price;
        nudge.innerHTML = '<div class="cart-nudge-in"><span>Add ' + (5 - n) + ' more to complete the collection and save ' + money(fullSave) + '.</span>' +
          '<button class="btn btn--ghost btn--sm" data-add-bundle="full"><span class="btn__label">Add all five, ' + money(DATA.commerce.deals.full.price, { aud: false }) + '</span></button></div>';
      } else { nudge.hidden = true; nudge.innerHTML = ''; }
    }
    // totals (cart drawer + checkout summary share these hooks)
    paintTotals(t, 'standard');
  }

  // B18: one-time hint when the shopper adds a second loose bottle
  var bundleHintShown = false;
  function maybeBundleHint() {
    if (bundleHintShown) return;
    var loose = 0, hasBundle = false;
    store.state.items.forEach(function (l) { if (l.type === 'product') loose += l.qty; if (l.type === 'bundle') hasBundle = true; });
    if (!hasBundle && loose >= 2) {
      bundleHintShown = true;
      toast('Buying 2 or more? Any 2 is ' + money(DATA.commerce.deals.duo.price, { aud: false }) + ', a bundle saves you money.');
    }
  }

  function cartLineHtml(line, i) {
    var v = store.lineView(line);
    var qty = line.qty;
    var priceHtml = (v.was ? '<span class="was">' + money(v.was * qty, { aud: false }) + '</span>' : '') + money(v.unit * qty, { aud: false });
    var saveTag = v.bundle ? ' <span class="save">save ' + money((v.was - v.unit) * qty, { aud: false }) + '</span>' : (v.discovery ? ' <span class="save">redeemable</span>' : '');
    return '' +
      '<div class="cart-line" data-index="' + i + '">' +
        '<a class="cl-media" href="' + asset(v.href) + '"><img src="' + asset(v.image) + '" alt="' + v.title + '" width="66" height="82"></a>' +
        '<div class="cl-body">' +
          '<h3 class="cl-name">' + v.title + '</h3>' +
          '<span class="cl-variant">' + v.variant + saveTag + '</span>' +
          '<div class="cl-qty">' +
            '<button type="button" data-dec aria-label="Decrease quantity">−</button>' +
            '<span aria-label="Quantity">' + qty + '</span>' +
            '<button type="button" data-inc aria-label="Increase quantity">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="cl-right">' +
          '<div class="cl-price">' + priceHtml + '</div>' +
          '<button class="cl-remove" type="button" data-remove>Remove</button>' +
        '</div>' +
      '</div>';
  }

  // Shared totals painter used by cart drawer AND checkout summary
  function paintTotals(t, method) {
    var set = function (sel, val) { $$(sel).forEach(function (n) { n.textContent = val; }); };
    var show = function (sel, on) { $$(sel).forEach(function (n) { n.hidden = !on; }); };
    set('[data-sum-subtotal]', money(t.subtotal));
    show('[data-row-savings]', t.bundleSavings > 0);
    set('[data-sum-savings]', '-' + money(t.bundleSavings));
    show('[data-row-discount]', t.codeDiscount > 0 && t.codeLabel && t.codeLabel.indexOf('Discovery') < 0);
    $$('[data-discount-label]').forEach(function (n) { n.textContent = t.codeLabel || 'Discount'; });
    set('[data-sum-discount]', '-' + money(t.codeDiscount));
    // discovery credit: either auto or via DISCOVER45 code
    var credit = t.discoveryCredit + (t.codeLabel && t.codeLabel.indexOf('Discovery') === 0 ? t.codeDiscount : 0);
    show('[data-row-credit]', credit > 0);
    set('[data-sum-credit]', '-' + money(credit));
    // B7: gift wrapping
    show('[data-row-gift]', t.giftWrap > 0);
    set('[data-sum-gift]', '+' + money(t.giftWrap));
    // shipping
    var shipTxt = t.freeShip && method !== 'express' ? 'Free' : money(t.shipping);
    set('[data-sum-shipping]', shipTxt);
    set('[data-sum-total]', money(t.total));
  }
  IB.paintTotals = paintTotals;

  /* ---------- add-to-bag actions ---------- */
  function initAddActions() {
    document.addEventListener('click', function (e) {
      var ap = e.target.closest('[data-add-product]');
      if (ap) {
        e.preventDefault();
        var slug = ap.getAttribute('data-add-product');
        var qty = 1;
        if (ap.hasAttribute('data-from-qty')) { var qi = $('[data-qty-input]'); if (qi) qty = Math.max(1, parseInt(qi.value, 10) || 1); }
        store.addProduct(slug, qty);
        var p = DATA.getProduct(slug);
        toast((p ? p.name : 'Fragrance') + ' added to bag');
        openOverlay('cart');
        return;
      }
      var ad = e.target.closest('[data-add-discovery]');
      if (ad) { e.preventDefault(); store.addDiscovery(1); toast('Discovery Set added to bag'); openOverlay('cart'); return; }
      var ab = e.target.closest('[data-add-bundle]');
      if (ab) {
        e.preventDefault();
        var key = ab.getAttribute('data-add-bundle');
        var res = store.addBundle(key, null);
        if (res.ok) { toast('The Complete Collection added to bag'); openOverlay('cart'); }
        else toast(res.message, 'err');
        return;
      }
      // B10: layer-it-with, add both fragrances
      var a2 = e.target.closest('[data-add-both]');
      if (a2) {
        e.preventDefault();
        a2.getAttribute('data-add-both').split(',').forEach(function (s) { store.addProduct(s.trim(), 1); });
        toast('Both fragrances added to bag'); openOverlay('cart');
        return;
      }
    });
  }

  /* ---------- reveals ---------- */
  function initReveals() {
    var els = $$('[data-reveal], [data-reveal-stagger]');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-reveal-stagger')) {
          $$(':scope > *', el).forEach(function (child, i) { child.style.transitionDelay = (i * 70) + 'ms'; });
        }
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up ---------- */
  function initCountUp() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var fmt = function (v) { return prefix + Math.round(v).toLocaleString('en-AU') + suffix; };
      if (reduced) { el.textContent = fmt(target); return; }
      var dur = 1600, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * e);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('[data-magnetic]').forEach(function (btn) {
      var label = btn.querySelector('.btn__label') || btn;
      var strength = 0.28;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transition = 'transform 0.06s linear';
        btn.style.transform = 'translate(' + dx * strength + 'px,' + dy * strength + 'px)';
        label.style.transform = 'translate(' + dx * strength * 0.4 + 'px,' + dy * strength * 0.4 + 'px)';
      });
      var reset = function () {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.22,0.61,0.36,1)';
        btn.style.transform = '';
        label.style.transform = '';
      };
      btn.addEventListener('pointerleave', reset);
      btn.addEventListener('blur', reset);
    });
  }

  /* ---------- collection filters ---------- */
  function initFilters() {
    var wrap = $('[data-filters]'); if (!wrap) return;
    var cards = $$('[data-product-grid] .product-card');
    var empty = $('[data-filter-empty]');
    var apply = function (filter) {
      var visible = 0;
      cards.forEach(function (card) {
        var tags = card.getAttribute('data-tags') || '';
        var match = filter === 'all' || tags.split(' ').indexOf(filter) >= 0;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (empty) empty.hidden = visible > 0;
    };
    wrap.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-filter]'); if (!chip) return;
      $$('[data-filter]', wrap).forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      apply(chip.getAttribute('data-filter'));
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-filter-reset]')) {
        $$('[data-filter]', wrap).forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-filter') === 'all'); });
        apply('all');
      }
    });
  }

  /* ---------- search overlay (A5 keyboard nav, B15 bundles + discovery) ---------- */
  function initSearch() {
    var overlay = $('[data-search-overlay]'); if (!overlay) return;
    var input = $('[data-search-input]', overlay);
    var results = $('[data-search-results]', overlay);
    var activeFilter = null;
    var hi = -1;
    var thumb0 = DATA.products[0].images.thumb;
    // B15: non-product destinations searchable by keyword
    var specials = [
      { name: 'The Discovery Set', sub: 'Five 3 mL samples', price: money(DATA.commerce.discovery.price, { aud: false }), href: 'pages/discovery.html', img: thumb0, kw: 'discovery set sample samples try travel 45 miniature' },
      { name: 'Any 2 Fragrances', sub: 'Bundle, save $30', price: money(DATA.commerce.deals.duo.price, { aud: false }), href: 'pages/bundles.html#duo', img: thumb0, kw: 'bundle duo two 2 save deal offer collection' },
      { name: 'Any 3 Fragrances', sub: 'Bundle, save $70', price: money(DATA.commerce.deals.trio.price, { aud: false }), href: 'pages/bundles.html#trio', img: thumb0, kw: 'bundle trio three 3 save deal offer collection' },
      { name: 'The Complete Collection', sub: 'All five, save $151', price: money(DATA.commerce.deals.full.price, { aud: false }), href: 'pages/bundles.html#full', img: thumb0, kw: 'bundle five 5 all complete collection set save deal offer' },
    ];
    var build = function () {
      var q = (input.value || '').trim().toLowerCase();
      var out = [];
      DATA.products.forEach(function (p) {
        var notesText = (p.hasNotes && p.notes) ? p.notes.top.concat(p.notes.heart, p.notes.base).join(' ') : '';
        var hay = (p.name + ' ' + p.family + ' ' + p.tags.join(' ') + ' ' + notesText + ' ' + (p.tagline || '') + ' ' + p.mood).toLowerCase();
        var okQ = !q || hay.indexOf(q) >= 0;
        var okF = !activeFilter || p.tags.indexOf(activeFilter) >= 0 || p.family.toLowerCase().indexOf(activeFilter) >= 0;
        if (okQ && okF) out.push({ name: p.name, sub: p.familyShort, price: money(p.price, { aud: false }), href: 'products/' + p.slug + '.html', img: p.images.thumb });
      });
      if (!activeFilter) specials.forEach(function (s) { if (!q || (s.name + ' ' + s.kw).toLowerCase().indexOf(q) >= 0) out.push(s); });
      return out;
    };
    var render = function () {
      hi = -1;
      var list = build();
      if (!list.length) { results.innerHTML = '<p class="search-empty">Nothing matches. Try another note, mood, or "discovery".</p>'; return; }
      results.innerHTML = list.map(function (r, i) {
        return '<a class="search-result" role="option" id="sr-' + i + '" href="' + asset(r.href) + '">' +
          '<img src="' + asset(r.img) + '" alt="" width="60" height="72">' +
          '<div><div class="sr-name">' + r.name + '</div><div class="sr-fam">' + r.sub + '</div></div>' +
          '<div class="sr-price">' + r.price + '</div></a>';
      }).join('');
    };
    var move = function (dir) {
      var opts = $$('.search-result', results); if (!opts.length) return;
      if (hi >= 0 && opts[hi]) opts[hi].classList.remove('is-highlight');
      hi = (hi + dir + opts.length) % opts.length;
      opts[hi].classList.add('is-highlight');
      opts[hi].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', 'sr-' + hi);
    };
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        var opts = $$('.search-result', results);
        if (hi >= 0 && opts[hi]) { window.location.href = opts[hi].getAttribute('href'); }
        else if (opts.length === 1) { window.location.href = opts[0].getAttribute('href'); }
      }
    });
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', results.id || 'search-results');
    input.setAttribute('aria-autocomplete', 'list');
    $$('[data-search-filter]', overlay).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-search-filter');
        if (activeFilter === f) { activeFilter = null; chip.classList.remove('is-active'); }
        else { activeFilter = f; $$('[data-search-filter]', overlay).forEach(function (c) { c.classList.remove('is-active'); }); chip.classList.add('is-active'); }
        render();
      });
    });
    render();
  }

  /* ---------- PDP gallery ---------- */
  function initGallery() {
    var gal = $('[data-gallery]'); if (!gal) return;
    var mainImg = $('[data-gallery-main]', gal);
    $$('[data-gallery-thumb]', gal).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-gallery-thumb');
        mainImg.classList.remove('is-active');
        setTimeout(function () { mainImg.src = src; mainImg.classList.add('is-active'); }, 120);
        $$('[data-gallery-thumb]', gal).forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  }

  /* ---------- PDP quantity stepper ---------- */
  function initPdpQty() {
    var q = $('[data-qty]'); if (!q) return;
    var input = $('[data-qty-input]', q);
    var clamp = function (v) { return Math.max(1, Math.min(99, v || 1)); };
    $('[data-qty-dec]', q).addEventListener('click', function () { input.value = clamp(parseInt(input.value, 10) - 1); });
    $('[data-qty-inc]', q).addEventListener('click', function () { input.value = clamp(parseInt(input.value, 10) + 1); });
    input.addEventListener('change', function () { input.value = clamp(parseInt(input.value, 10)); });
  }

  /* ---------- forms (newsletter / contact / track) ---------- */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function initForms() {
    $$('[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var msg = form.parentNode.querySelector('[data-news-msg]') || $('[data-news-msg]');
        var email = input.value.trim();
        if (!validEmail(email)) { if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.className = 'news-msg err'; } return; }
        form.classList.add('is-loading');
        var btn = form.querySelector('button');
        var original = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span>';
        // F1: when a Klaviyo list ID is configured, really subscribe (fire-and-forget)
        var nl = DATA.newsletter;
        if (nl && nl.action && nl.listId && window.fetch) {
          var fd = new FormData(); fd.append('g', nl.listId); fd.append('email', email);
          fetch(nl.action, { method: 'POST', mode: 'no-cors', body: fd }).catch(function () {});
        }
        setTimeout(function () {
          form.classList.remove('is-loading');
          btn.innerHTML = original;
          try { localStorage.setItem('ibrahim_subscribed', email); } catch (er) {}
          if (msg) { msg.innerHTML = 'You are on the list. Use code <b>IBRAHIM10</b> for 10% off your first order.'; msg.className = 'news-msg ok'; }
          form.reset();
          toast('Welcome to IBRAHIM');
        }, 1100);
      });
    });
    var contact = $('[data-contact-form]');
    if (contact) contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('[data-contact-msg]');
      var email = contact.querySelector('#c-email').value.trim();
      var name = contact.querySelector('#c-name').value.trim();
      var body = contact.querySelector('#c-msg').value.trim();
      if (!name || !validEmail(email) || !body) { if (msg) { msg.textContent = 'Please complete all fields with a valid email.'; msg.className = 'news-msg err'; } return; }
      if (msg) { msg.textContent = 'Thank you. We will be in touch within one business day.'; msg.className = 'news-msg ok'; }
      contact.reset();
      toast('Message sent');
    });
    var track = $('[data-track-form]');
    if (track) track.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('[data-track-msg]');
      var num = track.querySelector('#t-order').value.trim();
      if (!num) { if (msg) { msg.textContent = 'Enter your order number.'; msg.className = 'news-msg err'; } return; }
      var last = null;
      try { last = JSON.parse(localStorage.getItem('ibrahim_last_order') || 'null'); } catch (er) {}
      if (last && last.number && num.toUpperCase() === last.number) {
        if (msg) { msg.innerHTML = 'Order <b>' + last.number + '</b>: packed and dispatched from Sydney. Estimated delivery ' + last.eta + '.'; msg.className = 'news-msg ok'; }
      } else {
        if (msg) { msg.innerHTML = 'Order <b>' + num.toUpperCase() + '</b>: in transit. Estimated delivery in 3 to 5 business days.'; msg.className = 'news-msg ok'; }
      }
    });
  }

  /* ---------- accordions ---------- */
  function initAccordions() {
    $$('.accordion-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        var panel = btn.nextElementSibling;
        panel.style.maxHeight = open ? '0px' : (panel.querySelector('.inner').scrollHeight + 40) + 'px';
      });
    });
  }

  /* ---------- account tabs + wishlist ---------- */
  function initWishlist() {
    // account tabs
    $$('[data-acct-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-acct-tab');
        $$('[data-acct-tab]').forEach(function (t) { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
        $$('[data-acct-panel]').forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-acct-panel') === key); });
        if (key === 'saved') renderWishlist();
      });
    });
    $$('[data-demo-action]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); toast('Demo only, no account is created'); }); });
    $$('[data-demo-link]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); toast('Demo only'); }); });

    document.addEventListener('click', function (e) {
      var w = e.target.closest('[data-wishlist-toggle]'); if (!w) return;
      var slug = w.getAttribute('data-wishlist-toggle');
      var list = getWishlist();
      var idx = list.indexOf(slug);
      if (idx >= 0) { list.splice(idx, 1); toast('Removed from saved'); w.classList.remove('is-active'); w.style.color = ''; }
      else { list.push(slug); toast('Saved to wishlist'); w.classList.add('is-active'); w.style.color = 'var(--gold)'; }
      setWishlist(list);
    });
    // reflect saved state on load
    var saved = getWishlist();
    $$('[data-wishlist-toggle]').forEach(function (w) { if (saved.indexOf(w.getAttribute('data-wishlist-toggle')) >= 0) w.style.color = 'var(--gold)'; });
  }
  function getWishlist() { try { return JSON.parse(localStorage.getItem('ibrahim_wishlist') || '[]'); } catch (e) { return []; } }
  function setWishlist(l) { try { localStorage.setItem('ibrahim_wishlist', JSON.stringify(l)); } catch (e) {} }
  function renderWishlist() {
    var host = $('[data-wishlist]'); if (!host) return;
    var list = getWishlist();
    if (!list.length) { host.innerHTML = '<p class="acct-note">No saved fragrances yet.</p>'; return; }
    host.innerHTML = list.map(function (slug) {
      var p = DATA.getProduct(slug); if (!p) return '';
      return '<a class="search-result" style="grid-template-columns:52px 1fr auto;margin-bottom:10px" href="' + asset('products/' + p.slug + '.html') + '">' +
        '<img src="' + asset(p.images.thumb) + '" alt="" width="52" height="64">' +
        '<div><div class="sr-name">' + p.name + '</div><div class="sr-fam">' + p.familyShort + '</div></div>' +
        '<div class="sr-price">' + money(p.price, { aud: false }) + '</div></a>';
    }).join('');
  }

  /* ---------- toast ---------- */
  var toastHost;
  function toast(text, kind) {
    toastHost = toastHost || $('[data-toasts]');
    if (!toastHost) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="tk">' + (kind === 'err' ? '' : '&#10003;') + '</span>' + text;
    toastHost.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 400); }, 2600);
  }
  IB.toast = toast;

  /* ---------- A9: register the service worker (scope resolves to site root) ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(BASE + 'sw.js').catch(function () {});
    });
  }

  window.IBRAHIM = IB;
})();
