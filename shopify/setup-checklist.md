# Shopify setup checklist — IBRAHIM Fragrances

Follow top to bottom. No coding needed except one copy-paste (the quiz).
Time: roughly one afternoon. Have ready: the business email, ABN, and bank details.

## 1. Create the store (15 min)
1. Go to shopify.com → Start free trial → sign up with the business email.
2. Store name: **IBRAHIM Fragrances**. Country: **Australia** (this sets AUD + GST).
3. Skip the questionnaire steps — they change nothing.
4. Pick the **Basic** plan when the trial banner asks (about $56 AUD/month).

## 2. Import the products (10 min)
1. Admin → **Products** → **Import** → choose `shopify/products-import.csv` → Import.
2. Shopify fetches all bottle photos automatically from the live site (they are already
   verified working). Wait for the import email, then spot-check the five fragrances:
   each should show its photo gallery, $130 price, and a "2 mL Sample" $5 size option.
3. **Products → Collections → Create collection**: title **Fragrances**, add the five
   fragrances (not the Discovery Set or Gift Wrapping). This collection powers the
   homepage grid and the main menu.
4. Replace the Discovery Set's placeholder photo when a real set photo exists.

## 3. Payments and legal basics (20 min)
1. **Settings → Payments** → activate **Shopify Payments** (needs ABN + bank account).
   Apple Pay, Google Pay and Shop Pay switch on automatically.
2. Same screen: enable **Afterpay** if wanted.
3. **Settings → Taxes** → confirm GST 10% is on and prices include tax.
4. **Settings → Policies** → paste the shipping, returns, privacy and terms text from
   the current site's pages, then have them legally reviewed before real launch.
5. **Settings → Store details** → business address (needed for labels and receipts).

## 4. Shipping (15 min)
1. **Settings → Shipping and delivery** → edit the General profile:
   - Standard: **$12**, free over **$180** (add a "Free over $180" rate condition)
   - Express: **$22**
2. Important, before real orders: agree perfume (dangerous goods) posting with the
   carrier — Australia Post allows limited quantities domestically but the account may
   need approval. This is a phone call, not a Shopify setting.

## 5. Theme (the longest step, 2-3 hours)
Follow `shopify/theme-plan.md` section by section. It maps every part of the current
site onto Shopify's free Dawn theme: colors, fonts, the five-slide hero, the collection
grid, offers, editorial bands, trust strip and footer.

## 6. Pages, menus, blog (45 min)
1. Pages: **About**, **Contact** (use the contact-form template), **FAQ**, and
   **Find Your Scent** — for the quiz page open the code view (the `<>` button) and
   paste everything from `shopify/quiz-embed.html`.
2. Blog: create "Journal" and paste the three articles.
3. **Navigation**: main menu = Home, Fragrances (collection), Find Your Scent,
   Discovery Set (product), About, Journal, Contact. Footer menu = policies + FAQ.

## 7. Discounts (15 min)
Create in **Discounts**:
| Code | What | Settings |
| --- | --- | --- |
| IBRAHIM10 | 10% off | One use per customer |
| DISCOVER35 | $35 off | Minimum purchase $130, one use per customer |
| DUO230 | $30 off | Minimum quantity 2 (fragrances collection) |
| TRIO320 | $70 off | Minimum quantity 3 (fragrances collection) |
| EID15 (automatic) | 15% off | Set start/end dates for the Ramadan-Eid window |

For tier-style bundle pricing shown on product pages, add a quantity-breaks app later
(about $15/month). Not needed for launch.

## 8. Email (15 min)
- Quick start: Shopify's built-in **abandoned checkout** email is on by default —
  just check the wording in Settings → Notifications.
- Proper flows: connect **Klaviyo** (app store) and follow
  `marketing/klaviyo-setup-guide.md` — the five branded templates in
  `marketing/emails/` import as-is.

## 9. Sales channels (when ready to push marketing)
Apps → add **TikTok**, **Facebook & Instagram**, **Google & YouTube** channels.
Products sync automatically. Also add **Judge.me** (free) for reviews.

## 10. Before taking the first real order
- [ ] Place a test order with Shopify's test mode, then a real $1 test, refund it
- [ ] Check the store on a phone
- [ ] Bottle size confirmed and matching everywhere (site says 90 mL)
- [ ] Arabic plaque text verified by a native reader
- [ ] Real product photography ordered (AI renders are placeholders)
- [ ] Dangerous-goods shipping confirmed with the carrier
- [ ] Product liability insurance in place
- [ ] Domain purchased and connected (Settings → Domains), business email set up

## Money summary
- Shopify Basic ≈ **$56 AUD/month** (cheaper paid annually)
- Card fees ≈ 1.75% + 30¢ per order (Shopify Payments, domestic)
- Optional later: bundle app ~$15/mo, Klaviyo free tier to start, Judge.me free
