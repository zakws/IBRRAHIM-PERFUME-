/* IBRAHIM Fragrances — seasonal campaign config (H3: Ramadan & Eid).
   The campaign switches itself on between `start` and `end` (edit the dates here;
   they are set to the approximate 2027 Ramadan-to-Eid window and should be
   confirmed nearer the time). Preview any time with ?preview=eid on any page —
   the preview sticks for the browser session. */
(function (root) {
  'use strict';
  var cfg = {
    key: 'eid',
    name: 'The Eid Gift Edit',
    start: '2027-02-05T00:00:00+11:00',
    end: '2027-03-14T23:59:59+11:00',
    code: { code: 'EID15', type: 'percent', value: 15, label: 'Eid 15% off' },
  };
  try {
    var q = new URLSearchParams(root.location.search);
    if (q.get('preview') === cfg.key) root.sessionStorage.setItem('ibrahim_preview_' + cfg.key, '1');
    if (q.get('preview') === 'off') root.sessionStorage.removeItem('ibrahim_preview_' + cfg.key);
  } catch (e) {}
  cfg.isPreview = function () {
    try { return root.sessionStorage.getItem('ibrahim_preview_' + cfg.key) === '1'; } catch (e) { return false; }
  };
  cfg.isActive = function () {
    var n = Date.now();
    return (n >= Date.parse(cfg.start) && n <= Date.parse(cfg.end)) || cfg.isPreview();
  };
  root.IBRAHIM_CAMPAIGN = cfg;
})(typeof self !== 'undefined' ? self : this);
