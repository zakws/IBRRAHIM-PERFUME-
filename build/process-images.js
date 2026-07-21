/*
 * IBRAHIM Fragrances — image pipeline.
 * Renders responsive web assets from the verified master photographs described in
 * build/photo-map.js. Deterministic: every output derives from an explicitly mapped
 * master, identified by the product name on the bottle (never by colour).
 * The 4K masters are never copied to the site; only optimised webp/jpg renditions.
 *
 * Run:  npm run images
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const PM = require('./photo-map');

const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'assets', 'images');

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function wipe(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  ensure(dir);
}

async function webp(input, dest, width, opts = {}) {
  ensure(path.dirname(dest));
  await sharp(input)
    .resize(width, opts.height || null, {
      withoutEnlargement: !opts.allowEnlarge,
      fit: opts.fit || 'inside',
      position: opts.position || 'centre',
      background: opts.bg || { r: 8, g: 8, b: 10, alpha: 1 },
    })
    .webp({ quality: opts.q || 82, effort: 5 })
    .toFile(dest);
  return dest;
}
async function jpg(input, dest, width, opts = {}) {
  ensure(path.dirname(dest));
  await sharp(input)
    .resize(width, opts.height || null, {
      withoutEnlargement: !opts.allowEnlarge,
      fit: opts.fit || 'inside',
      position: opts.position || 'centre',
      background: opts.bg || { r: 8, g: 8, b: 10, alpha: 1 },
    })
    .jpeg({ quality: opts.q || 82, mozjpeg: true })
    .toFile(dest);
  return dest;
}

async function run() {
  // Fail loudly if any mapped master is missing (report, never substitute)
  const missing = PM.verify();
  if (missing.length) {
    console.error('MISSING MASTERS (aborting, not substituting):');
    missing.forEach((m) => console.error('  ' + m));
    process.exit(1);
  }

  // purge old product imagery so no stale bottle can remain
  wipe(path.join(IMG, 'products'));
  wipe(path.join(IMG, 'hero'));
  wipe(path.join(IMG, 'product-details'));
  wipe(path.join(IMG, 'brand-story'));
  wipe(path.join(IMG, 'discovery'));
  wipe(path.join(IMG, 'bundles'));
  wipe(path.join(IMG, 'references'));

  const made = [];
  const P = (...p) => path.join(IMG, ...p);
  const track = (d) => made.push(path.relative(ROOT, d).replace(/\\/g, '/'));

  for (const slug of PM.ORDER) {
    const src = (role) => PM.srcFor(slug, role).abs;

    // FRONT — card, main product, search, cart thumb source
    track(await webp(src('front'), P('products', `${slug}-front-1200.webp`), 1200));
    track(await webp(src('front'), P('products', `${slug}-front-card.webp`), 900, { height: 900, fit: 'cover' }));
    track(await jpg(src('front'), P('products', `${slug}-front-card.jpg`), 900, { height: 900, fit: 'cover' }));
    track(await webp(src('front'), P('products', `${slug}-front-160.webp`), 200, { height: 200, fit: 'cover' }));

    // GALLERY alternates + their thumbnails (roles absent from the map are skipped)
    for (const role of ['alt', 'threeQuarter', 'rear']) {
      if (!PM.MAP[slug][role]) continue;
      track(await webp(src(role), P('products', `${slug}-${lc(role)}-1000.webp`), 1000));
      track(await webp(src(role), P('products', `${slug}-${lc(role)}-160.webp`), 200, { height: 200, fit: 'cover' }));
    }

    // EDITORIAL sections
    track(await webp(src('flatlay'), P('products', `${slug}-flatlay-1200.webp`), 1200));
    track(await webp(src('macro'), P('products', `${slug}-macro-1000.webp`), 1000));
    track(await webp(src('heritage'), P('products', `${slug}-heritage-1400.webp`), 1400));
    track(await webp(src('lifestyle'), P('products', `${slug}-lifestyle-1400.webp`), 1400));

    // HERO (atmospheric) — desktop panel (cover in tall container trims side space, keeps centred bottle)
    track(await webp(src('hero'), P('hero', `${slug}-hero-1600.webp`), 1400, { height: 1400, fit: 'inside', q: 84 }));
    // mobile portrait 4:5 — trims side negative space only (bottle stays intact)
    track(await webp(src('hero'), P('hero', `${slug}-hero-mobile.webp`), 900, { height: 1125, fit: 'cover', position: 'centre', q: 82 }));
    // social share — full bottle letterboxed on black (never crops the bottle)
    track(await jpg(src('hero'), P('hero', `${slug}-og.jpg`), 1200, { height: 630, fit: 'contain', q: 84 }));
  }

  // C14: AVIF siblings for every generated webp (modern browsers, ~20% smaller)
  let avifCount = 0;
  for (const dir of ['products', 'hero']) {
    const d = path.join(IMG, dir);
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.webp')) continue;
      const dest = path.join(d, f.replace(/\.webp$/, '.avif'));
      await sharp(path.join(d, f)).avif({ quality: 55, effort: 4 }).toFile(dest);
      avifCount++;
    }
  }
  made.push(`assets/images/(+${avifCount} avif)`);

  // favicons / touch icons from the monogram tile (brand mark unchanged)
  const favSvg = path.join(ROOT, 'assets', 'icons', 'favicon.svg');
  if (fs.existsSync(favSvg)) {
    const svg = fs.readFileSync(favSvg);
    const icoDir = path.join(ROOT, 'assets', 'icons');
    await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(path.join(icoDir, 'apple-touch-icon.png'));
    await sharp(svg, { density: 384 }).resize(512, 512).png().toFile(path.join(icoDir, 'icon-512.png'));
    await sharp(svg, { density: 384 }).resize(192, 192).png().toFile(path.join(icoDir, 'icon-192.png'));
    await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(path.join(icoDir, 'favicon-32.png'));
    made.push('assets/icons/(favicons)');
  }

  console.log(`Generated ${made.length} assets for ${PM.ORDER.length} fragrances.`);
  if (PM.UNRESOLVED.length) console.log(`Note: ${PM.UNRESOLVED.length} supplied image(s) unidentified and intentionally unused: #${PM.UNRESOLVED.join(', #')}`);
}

// role -> lowercase asset token
function lc(role) {
  return role === 'threeQuarter' ? 'threequarter' : role.toLowerCase();
}

run().catch((e) => { console.error(e); process.exit(1); });
