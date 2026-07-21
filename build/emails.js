/* IBRAHIM Fragrances — branded email template pack (F1/F2/F5/F7).
   Generates Klaviyo-ready HTML emails into marketing/emails/.
   Uses Klaviyo tags ({{ first_name|default:"there" }}); [SITE_URL] is replaced
   with brand.domain — re-run after setting the real domain.
   Run:  npm run emails */
const fs = require('fs');
const path = require('path');
const DATA = require('../data/products');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'marketing', 'emails');
fs.mkdirSync(OUT, { recursive: true });
const SITE = DATA.brand.domain.replace(/\/$/, '');

const GOLD = '#c79a4e', INK = '#1c1a17', PAPER = '#faf7f2', MUTED = '#6f6a62';

function btn(label, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto"><tr><td style="background:${GOLD};border-radius:4px"><a href="${href}" style="display:inline-block;padding:14px 34px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#17110a;text-decoration:none;font-weight:bold">${label}</a></td></tr></table>`;
}
function layout(preheader, bodyHtml) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IBRAHIM Fragrances</title></head>
<body style="margin:0;padding:0;background:#efe9e0">
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe9e0"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${PAPER};border-radius:8px;overflow:hidden">
  <tr><td align="center" style="background:#0b0b0d;padding:30px 20px">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:10px;color:#f4f1ea">IBRAHIM</div>
    <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:4px;color:${GOLD};margin-top:6px">FRAGRANCES</div>
  </td></tr>
  <tr><td style="padding:40px 36px;font-family:Georgia,serif;color:${INK}">${bodyHtml}</td></tr>
  <tr><td align="center" style="padding:24px 30px;border-top:1px solid #e3dccf;font-family:Arial,sans-serif;font-size:11px;color:${MUTED}">
    IBRAHIM Fragrances &middot; Sydney, Australia<br>
    <a href="${SITE}" style="color:${MUTED}">${SITE.replace('https://', '')}</a> &middot; <a href="{% unsubscribe_link %}" style="color:${MUTED}">Unsubscribe</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
const h = (t) => `<h1 style="font-size:26px;font-weight:normal;margin:0 0 18px;line-height:1.25">${t}</h1>`;
const p = (t) => `<p style="font-size:15px;line-height:1.7;color:#3c3833;margin:0 0 16px">${t}</p>`;
const hi = `${p('Salaam {{ first_name|default:"there" }},')}`;

const EMAILS = {
  'welcome-1-your-code.html': layout('Your 10% welcome code is inside.',
    h('Welcome to the house.') + hi +
    p('Thank you for joining IBRAHIM Fragrances. We make five distinctive eau de parfums, each its own world, all carrying one unmistakable signature.') +
    p('Here is your welcome gift: <b>10% off your first order</b> with the code below.') +
    `<div style="text-align:center;margin:26px 0"><span style="display:inline-block;border:1px dashed ${GOLD};border-radius:6px;padding:12px 30px;font-family:Arial,sans-serif;font-size:20px;letter-spacing:4px;color:${INK}">IBRAHIM10</span></div>` +
    btn('Shop the Collection', SITE + '/index.html#collection') +
    p('Not sure where to start? The Discovery Set gives you all five scents for $35, fully redeemable against your first full bottle.')),
  'welcome-2-find-your-scent.html': layout('Five worlds. Which one is yours?',
    h('Five worlds. One signature.') + hi +
    p('<b>Sultan Oud</b> is deep and commanding. <b>Glamorous</b> is radiant rose gold. <b>Blue Chill</b> is crisp ocean freshness. <b>Charizma</b> is warm and magnetic. <b>Magic Caramel</b> is sweet, rich and unforgettable.') +
    p('Answer three quick questions and we will point you to yours.') +
    btn('Find Your Scent', SITE + '/pages/quiz.html') +
    p('Your welcome code <b>IBRAHIM10</b> is still waiting, 10% off your first order.')),
  'abandoned-cart.html': layout('Your bag is waiting for you.',
    h('Still thinking it over?') + hi +
    p('You left something beautiful in your bag. It is saved and ready whenever you are.') +
    p('A small reminder: shipping is free over $180, and every bundle ships free.') +
    btn('Return to Your Bag', SITE + '/index.html') +
    p('Questions about a scent? Just reply to this email, a real person in Sydney reads these.')),
  'post-purchase.html': layout('Thank you. Here is how to wear it well.',
    h('Thank you. It is on its way.') + hi +
    p('Your IBRAHIM order is being prepared in Sydney. While it travels, three ways to get the most from your fragrance:') +
    p('<b>1.</b> Spray on warm skin, neck and wrists, and let it dry without rubbing.<br><b>2.</b> One or two sprays is enough, our eau de parfums are concentrated.<br><b>3.</b> Store the bottle away from direct sun to protect the scent.') +
    p('When it arrives and you have lived with it for a few days, we would love to hear what you think.') +
    btn('Leave a Review', SITE + '/index.html#collection')),
  'winback.html': layout('It has been a while. Here is 15% to come back.',
    h('We kept your place.') + hi +
    p('It has been a while since your last visit. The house has been busy, and your next signature might already be waiting.') +
    p('Here is <b>15% off</b> to welcome you back:') +
    `<div style="text-align:center;margin:26px 0"><span style="display:inline-block;border:1px dashed ${GOLD};border-radius:6px;padding:12px 30px;font-family:Arial,sans-serif;font-size:20px;letter-spacing:4px;color:${INK}">SCENT15</span></div>` +
    btn('See What Is New', SITE + '/index.html')),
};

console.log('Generating Klaviyo email templates:');
Object.keys(EMAILS).forEach((name) => {
  fs.writeFileSync(path.join(OUT, name), EMAILS[name], 'utf8');
  console.log('  marketing/emails/' + name);
});
console.log('Done. Import each file in Klaviyo (guide: marketing/klaviyo-setup-guide.md).');
