/* Inline SVG icon set — custom line icons, stroke = currentColor. */
const P = 'stroke-linecap="round" stroke-linejoin="round"';
const RAW = {
  search: `<circle cx="11" cy="11" r="7" ${P}/><path d="M21 21l-4.3-4.3" ${P}/>`,
  user: `<path d="M20 21a8 8 0 0 0-16 0" ${P}/><circle cx="12" cy="8" r="4" ${P}/>`,
  bag: `<path d="M6 8h12l1 12H5L6 8Z" ${P}/><path d="M9 8V6a3 3 0 0 1 6 0v2" ${P}/>`,
  close: `<path d="M6 6l12 12M18 6L6 18" ${P}/>`,
  arrowRight: `<path d="M4 12h16M14 6l6 6-6 6" ${P}/>`,
  arrowUpRight: `<path d="M7 17 17 7M8 7h9v9" ${P}/>`,
  chevronDown: `<path d="M6 9l6 6 6-6" ${P}/>`,
  chevronLeft: `<path d="M15 6l-6 6 6 6" ${P}/>`,
  chevronRight: `<path d="M9 6l6 6-6 6" ${P}/>`,
  plus: `<path d="M12 5v14M5 12h14" ${P}/>`,
  minus: `<path d="M5 12h14" ${P}/>`,
  check: `<path d="M5 12l5 5 9-11" ${P}/>`,
  checkCircle: `<circle cx="12" cy="12" r="9" ${P}/><path d="M8.5 12.5l2.5 2.5 4.5-5.5" ${P}/>`,
  truck: `<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" ${P}/><circle cx="7" cy="18" r="1.6" ${P}/><circle cx="17.5" cy="18" r="1.6" ${P}/>`,
  clock: `<circle cx="12" cy="12" r="9" ${P}/><path d="M12 7v5l3 2" ${P}/>`,
  gem: `<path d="M6 4h12l3 5-9 11L3 9l3-5Z" ${P}/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5" ${P}/>`,
  shield: `<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" ${P}/><path d="M9 12l2 2 4-4" ${P}/>`,
  sparkle: `<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" ${P}/>`,
  leaf: `<path d="M20 4C9 4 4 10 4 20c8 0 16-4 16-16Z" ${P}/><path d="M4 20C8 14 12 10 18 7" ${P}/>`,
  lock: `<rect x="5" y="11" width="14" height="9" rx="2" ${P}/><path d="M8 11V8a4 4 0 0 1 8 0v3" ${P}/>`,
  refresh: `<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" ${P}/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16m0 4v-4h4" ${P}/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="2" ${P}/><path d="M4 7l8 6 8-6" ${P}/>`,
  phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" ${P}/>`,
  pin: `<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" ${P}/><circle cx="12" cy="10" r="2.5" ${P}/>`,
  heart: `<path d="M12 20s-7-4.6-9.3-9C1 7.5 3 4.5 6.2 4.5c1.9 0 3.2 1 3.8 2 0.6-1 1.9-2 3.8-2C17 4.5 19 7.5 17.3 11 15 15.4 12 20 12 20Z" ${P}/>`,
  play: `<path d="M9 7.5v9l7-4.5-7-4.5Z" ${P}/>`,
  instagram: `<rect x="4" y="4" width="16" height="16" rx="4.5" ${P}/><circle cx="12" cy="12" r="3.6" ${P}/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>`,
  tiktok: `<path d="M14 4c.4 2.4 1.9 4 4 4.3v2.6c-1.5 0-2.9-.5-4-1.3v5.2A5.4 5.4 0 1 1 9 9.4v2.8a2.7 2.7 0 1 0 2.4 2.7V4H14Z" ${P}/>`,
  facebook: `<path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.3c0-.8.3-1.4 1.5-1.4h1.4V5.4c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2H8v2.8h2.6V21" ${P}/>`,
  youtube: `<rect x="3" y="6" width="18" height="12" rx="3.5" ${P}/><path d="M11 9.5l4 2.5-4 2.5v-5Z" ${P}/>`,
  wand: `<path d="M5 19 16 8M15 5l1 1M19 9l1 1M18 4l.7-2M21 7l2-.7" ${P}/><path d="M4 21l1-3 3-1-3-1-1-3-1 3-3 1 3 1 1 3Z" ${P}/>`,
};
function icon(name, cls) {
  const body = RAW[name];
  if (!body) return '';
  return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${body}</svg>`;
}
module.exports = { icon, RAW };
