/* IBRAHIM Fragrances — homepage hero carousel.
   One slide per fragrance (Row hero image), crossfade, with keyboard, dots, swipe and
   autoplay. Text updates per slide; imagery is each exact fragrance. Respects reduced motion. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  var DATA = window.IBRAHIM_DATA;
  var products = (DATA && DATA.products) || [];
  var base = document.documentElement.dataset.base || '';

  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
  var elName = root.querySelector('[data-hero-name]');
  var elEyebrow = root.querySelector('[data-hero-eyebrow]');
  var elCta = root.querySelector('[data-hero-cta]');
  var elCtaName = root.querySelector('[data-hero-cta-name]');
  var media = root.querySelector('[data-hero-media]');
  if (slides.length < 2) return;

  var n = slides.length;
  var current = 0;
  var timer = null;
  var INTERVAL = 6000;

  // A4: polite live region announcing the current slide
  var live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'visually-hidden';
  root.appendChild(live);

  function go(i, focusDot) {
    current = (i + n) % n;
    var p = products[current] || {};
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === current); s.setAttribute('aria-hidden', String(k !== current)); });
    live.textContent = 'Showing ' + (current + 1) + ' of ' + n + ': ' + (p.name || '') + ', ' + (p.family || '');
    dots.forEach(function (d, k) {
      var on = k === current;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-selected', String(on));
      d.tabIndex = on ? 0 : -1;
    });
    if (p.color) { root.style.setProperty('--accent', p.color); root.style.setProperty('--accent-soft', p.colorSoft || p.color); }
    if (elName) elName.textContent = p.name || '';
    if (elEyebrow) elEyebrow.textContent = p.family || '';
    if (elCtaName) elCtaName.textContent = p.name || '';
    if (elCta && p.slug) elCta.setAttribute('href', base + 'products/' + p.slug + '.html');
    if (focusDot && dots[current]) dots[current].focus();
  }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function play() { if (reduced) return; stop(); timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  // dots
  dots.forEach(function (d, k) {
    d.addEventListener('click', function () { go(k); play(); });
  });
  // arrows
  var prevBtn = root.querySelector('[data-hero-prev]');
  var nextBtn = root.querySelector('[data-hero-next]');
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); play(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); play(); });

  // keyboard on the dots group
  var dotsWrap = root.querySelector('[data-hero-dots]');
  if (dotsWrap) dotsWrap.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, true); play(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1, true); play(); }
  });

  // pause on hover / focus / tab hidden
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

  // swipe
  if (media) {
    var x0 = null;
    media.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    media.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
      x0 = null; play();
    }, { passive: true });
  }

  // subtle cursor-reactive glow on desktop (restrained)
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    root.addEventListener('pointermove', function (e) {
      var r = root.getBoundingClientRect();
      root.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      root.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  go(0);
  play();
})();
