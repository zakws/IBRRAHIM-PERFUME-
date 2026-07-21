/*
 * IBRAHIM Fragrances — EXPLICIT, DETERMINISTIC photography mapping.
 *
 * The supplied renders arrived as flat master PNGs in the project's parent folder
 * (no Row/shot subfolders, no pre-made export variants). Each bottle is identified
 * here by the product NAME printed on its plaque (verified visually), never by colour.
 *
 * This module is the single source for the image pipeline. Each product lists, per
 * role, the EXACT source master filename. build/process-images.js renders the
 * responsive web assets (webp/jpg) from these masters into assets/images/products/
 * and assets/images/hero/. The 4K masters are never served to visitors.
 *
 * Roles (mirrors the requested 01-09 shot story):
 *   hero        atmospheric black-background hero  -> carousel + PDP banner + OG
 *   front       clean front hero                   -> card + main product + search + cart thumb
 *   alt         alternate front angle              -> gallery 2
 *   threeQuarter three-quarter angle               -> gallery 3
 *   rear        distinct alternate composition     -> gallery 4
 *   flatlay     flat lay                           -> editorial "fragrance world"
 *   macro       macro detail                       -> craftsmanship section
 *   heritage    heritage lifestyle                 -> brand/heritage band
 *   lifestyle   model / hand-held / two-bottle     -> lifestyle editorial band
 */
'use strict';
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '..', '..'); // the "IBRAHIM HELP" folder (parent of ibrahim-store)
// July 2026 client-corrected pack (black plaque lettering). MAP values that are
// strings refer to files in this folder; numbers refer to the original masters.
const CORR = path.join(SRC, 'IBRAHIM-corrected-perfume-images', 'corrected-perfume-images');

// helper to build the opaque supplied filenames
const F = (time, n) => `ChatGPT Image Jul 14, 2026, ${time} PM (${n}).png`;

// index -> filename (deterministic; from the verified inventory)
const IDX = {
  1: F('10_29_36', 1), 2: F('10_29_36', 2), 3: F('10_29_37', 3), 4: F('10_29_38', 4),
  5: F('10_29_39', 5), 6: F('10_29_41', 6), 7: F('10_29_42', 7), 8: F('10_29_43', 8),
  9: F('10_29_44', 9), 10: F('10_29_45', 1), 11: F('10_29_45', 2), 12: F('10_29_45', 3),
  13: F('10_29_45', 4), 14: F('10_29_45', 5), 15: F('10_29_45', 6), 16: F('10_29_45', 7),
  17: F('10_29_45', 8), 18: F('10_29_45', 9), 19: F('10_29_45', 10), 20: F('10_29_46', 11),
  21: F('10_29_47', 12), 22: F('10_29_48', 13), 23: F('10_29_50', 14), 24: F('10_29_51', 1),
  25: F('10_29_51', 2), 26: F('10_29_51', 3), 27: F('10_29_51', 4), 28: F('10_29_51', 5),
  29: F('10_29_51', 6), 30: F('10_29_51', 7), 31: F('10_29_51', 8), 32: F('10_29_51', 9),
  33: F('10_29_58', 15), 34: F('10_29_59', 16), 35: F('10_30_01', 17), 36: F('10_30_02', 18),
  37: F('10_30_02', 19), 38: F('10_30_02', 20), 39: F('10_30_02', 21), 40: F('10_30_02', 22),
  41: F('10_30_02', 23), 42: F('10_30_02', 24), 43: F('10_30_02', 25), 44: F('10_30_02', 26),
  45: F('10_30_02', 27), 46: F('10_30_02', 28), 47: F('10_30_02', 29), 48: F('10_30_03', 30),
  49: F('10_30_03', 31), 50: F('10_30_03', 32), 51: F('10_30_03', 33), 52: F('10_30_03', 34),
  53: F('10_30_03', 35), 54: F('10_30_03', 36), 55: F('10_30_03', 37), 56: F('10_30_03', 38),
  57: F('10_30_04', 39), 58: F('10_30_04', 40), 59: F('10_30_04', 41), 60: F('10_30_04', 42),
  61: F('10_30_04', 43), 62: F('10_30_04', 44),
};

// product -> role -> source (verified by the printed plaque on each bottle).
// Numbers = original masters; strings = files from the client-corrected pack (all
// verified to carry BLACK plaque lettering). The strict July-2026 audit found the
// original flat-lay and close-up compositions render the calligraphy embossed
// gold/silver tone-on-tone, so every such role now uses a corrected file.
// Charizma's threeQuarter stays absent (gallery shows 3 views) until one more
// corrected close-up arrives — its two corrected shots fill flatlay and macro.
const MAP = {
  'sultan-oud':    { hero: 58, front: 10, alt: 26, threeQuarter: '08-sultan-oud-closeup-b.png', rear: 25, flatlay: '03-sultan-oud-wide-a.png', macro: '04-sultan-oud-closeup-a.png', heritage: 30, lifestyle: 17 },
  'glamorous':     { hero: 59, front: 2,  alt: 3,  threeQuarter: 9,  rear: 1,  flatlay: '01-glamorous-wide.png', macro: '02-glamorous-closeup.png', heritage: 7,  lifestyle: 8  },
  'blue-chill':    { hero: 60, front: 19, alt: 20, threeQuarter: '10-blue-chill-closeup-alt.png', rear: 21, flatlay: '05-blue-chill-water-lime.png', macro: '06-blue-chill-closeup.png', heritage: 34, lifestyle: 35 },
  'charizma':      { hero: 61, front: 61, alt: 42,                   rear: 40, flatlay: '11-charizma-wide.png', macro: '12-charizma-closeup.png', heritage: 46, lifestyle: 48 },
  'magic-caramel': { hero: 62, front: 62, alt: 51, threeQuarter: 57, rear: 50, flatlay: '13-magic-caramel-wide.png', macro: '14-magic-caramel-closeup.png', heritage: 55, lifestyle: 56 },
};

// image that could not be positively identified from its plaque (do NOT assign to a product)
const UNRESOLVED = [47];
// original masters excluded because the plaque lettering is embossed gold/silver, not black
const EXCLUDED_GOLD_LETTERING = [4, 5, 13, 14, 22, 23, 24, 27, 28, 37, 41, 43, 44, 49, 52, 53];
// studio shots excluded because they show a DIFFERENT bottle design (black printed
// label, "50 ML / 1.7 FL. OZ.") that is not the stocked gold-plaque product.
// Charizma and Magic Caramel therefore reuse their hero shot as the canonical front
// until the client supplies dedicated front shots of the real bottle.
const EXCLUDED_WRONG_BOTTLE = [6, 29, 33, 45, 54];

function srcFor(slug, role) {
  const idx = MAP[slug] && MAP[slug][role];
  if (!idx) throw new Error(`No mapping for ${slug}/${role}`);
  if (typeof idx === 'string') return { index: idx, file: idx, abs: path.join(CORR, idx) };
  const file = IDX[idx];
  return { index: idx, file, abs: path.join(SRC, file) };
}

// verify every referenced master exists on disk; report (not substitute) if missing
function verify() {
  const missing = [];
  Object.keys(MAP).forEach((slug) => {
    Object.keys(MAP[slug]).forEach((role) => {
      const { file, abs, index } = srcFor(slug, role);
      if (!fs.existsSync(abs)) missing.push(`${slug}/${role} -> #${index} ${file}`);
    });
  });
  return missing;
}

module.exports = { SRC, CORR, IDX, MAP, UNRESOLVED, EXCLUDED_GOLD_LETTERING, EXCLUDED_WRONG_BOTTLE, srcFor, verify, ORDER: ['sultan-oud', 'glamorous', 'blue-chill', 'charizma', 'magic-caramel'] };
