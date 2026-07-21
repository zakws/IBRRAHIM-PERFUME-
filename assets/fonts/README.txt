IBRAHIM Fragrances — self-hosted display serif (C8)

The design uses a serif display face for headings. To ship the same face on every device
(instead of the platform-fallback stack), drop a LICENSED web font here:

  assets/fonts/ibrahim-serif.woff2          (regular, weights 400-600)
  assets/fonts/ibrahim-serif-italic.woff2   (italic)

The @font-face rules are already wired in styles/main.css (family name "Ibrahim Serif"),
with font-display: swap and a full fallback stack, so the site looks correct even before
you add the files. Once added, also preload the regular weight for faster first paint:

  <link rel="preload" as="font" type="font/woff2"
        href="/assets/fonts/ibrahim-serif.woff2" crossorigin>

Suggested faces to license: Cormorant Garamond, a Didone (e.g. Playfair Display for a
free option), or a bought display serif. Do not ship an unlicensed font.
