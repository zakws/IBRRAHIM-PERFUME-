/* IBRAHIM Fragrances — scent finder quiz (B1). Self-contained; reads window.IBRAHIM_DATA. */
(function () {
  'use strict';
  var root = document.querySelector('[data-quiz]');
  if (!root) return;
  var DATA = window.IBRAHIM_DATA;
  var base = document.documentElement.dataset.base || '';
  var stage = root.querySelector('[data-quiz-stage]');
  var bar = root.querySelector('[data-quiz-bar]');
  var resultEl = document.querySelector('[data-quiz-result]');

  var QUESTIONS = [
    { q: 'How do you want to feel?', a: [
      { t: 'Warm and bold', w: { 'charizma': 2, 'sultan-oud': 1 } },
      { t: 'Fresh and clean', w: { 'blue-chill': 3 } },
      { t: 'Radiant and elegant', w: { 'glamorous': 3 } },
      { t: 'Deep and mysterious', w: { 'sultan-oud': 3 } },
      { t: 'Sweet and comforting', w: { 'magic-caramel': 3 } },
    ] },
    { q: 'When will you wear it?', a: [
      { t: 'Everyday', w: { 'blue-chill': 2, 'glamorous': 1 } },
      { t: 'Evenings out', w: { 'charizma': 2, 'magic-caramel': 1 } },
      { t: 'Special occasions', w: { 'sultan-oud': 2, 'glamorous': 1 } },
    ] },
    { q: 'Which world draws you in?', a: [
      { t: 'Amber and oud wood', w: { 'sultan-oud': 2 } },
      { t: 'Ocean and citrus', w: { 'blue-chill': 2 } },
      { t: 'Rose and soft petals', w: { 'glamorous': 2 } },
      { t: 'Spice and warm resin', w: { 'charizma': 2 } },
      { t: 'Caramel and vanilla', w: { 'magic-caramel': 2 } },
    ] },
  ];

  var idx = 0;
  var scores = {};

  function renderQuestion() {
    var qq = QUESTIONS[idx];
    if (bar) bar.style.width = Math.round((idx / QUESTIONS.length) * 100) + '%';
    stage.innerHTML = '<p class="quiz-step">Question ' + (idx + 1) + ' of ' + QUESTIONS.length + '</p>' +
      '<h2 class="quiz-q">' + qq.q + '</h2>' +
      '<div class="quiz-options">' + qq.a.map(function (o, i) {
        return '<button type="button" class="quiz-option" data-opt="' + i + '">' + o.t + '</button>';
      }).join('') + '</div>' +
      (idx > 0 ? '<button type="button" class="link-underline quiz-back" style="margin-top:18px">Back</button>' : '');
  }

  function choose(i) {
    var w = QUESTIONS[idx].a[i].w;
    for (var s in w) scores[s] = (scores[s] || 0) + w[s];
    idx++;
    if (idx >= QUESTIONS.length) showResult(); else renderQuestion();
  }

  function best() {
    var order = DATA.products.map(function (p) { return p.slug; });
    var top = null, topScore = -1;
    order.forEach(function (slug) {
      var sc = scores[slug] || 0;
      if (sc > topScore) { topScore = sc; top = slug; }
    });
    return DATA.getProduct(top) || DATA.products[0];
  }

  function showResult() {
    if (bar) bar.style.width = '100%';
    stage.hidden = true;
    var p = best();
    var money = (window.IBRAHIM && window.IBRAHIM.money) ? window.IBRAHIM.money : function (n) { return '$' + n; };
    resultEl.hidden = false;
    resultEl.innerHTML =
      '<div class="quiz-result-card" style="--accent:' + p.color + ';--accent-soft:' + p.colorSoft + '">' +
        '<span class="quiz-result-media"><picture><source type="image/avif" srcset="' + base + p.images.card.replace(/\.webp$/, '.avif') + '"><source type="image/webp" srcset="' + base + p.images.card + '"><img src="' + base + p.images.cardJpg + '" alt="' + p.name + '" width="600" height="600"></picture></span>' +
        '<div class="quiz-result-body">' +
          '<p class="eyebrow">Your match</p>' +
          '<h2 class="quiz-result-name">' + p.name + '</h2>' +
          '<p class="quiz-result-fam">' + p.family + ' &middot; ' + p.tagline + '</p>' +
          '<p class="quiz-result-desc">' + p.shortDesc + '</p>' +
          '<div class="quiz-result-actions">' +
            '<a class="btn btn--primary" href="' + base + 'products/' + p.slug + '.html"><span class="btn__label">Discover ' + p.name + '</span></a>' +
            '<button class="btn btn--ghost" data-add-product="' + p.slug + '"><span class="btn__label">Add to Bag</span></button>' +
          '</div>' +
          '<p class="quiz-retry"><a class="link-underline" href="' + base + 'pages/discovery.html">Not sure? Try all five for $35</a> &middot; <button type="button" class="link-underline" data-quiz-retake>Retake</button></p>' +
        '</div>' +
      '</div>';
  }

  root.addEventListener('click', function (e) {
    var opt = e.target.closest('[data-opt]');
    if (opt) { choose(parseInt(opt.getAttribute('data-opt'), 10)); return; }
    if (e.target.closest('.quiz-back')) { idx = Math.max(0, idx - 1); scores = {}; recompute(); renderQuestion(); }
  });
  if (resultEl) resultEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-quiz-retake]')) { idx = 0; scores = {}; resultEl.hidden = true; stage.hidden = false; renderQuestion(); }
  });
  // going back rebuilds scores from scratch to stay correct (answers are re-chosen)
  function recompute() { scores = {}; }

  renderQuestion();
})();
