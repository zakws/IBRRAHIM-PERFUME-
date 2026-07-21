# Klaviyo setup guide — IBRAHIM Fragrances

Everything is prepared. This guide takes about 30 minutes and needs no coding.

## 1. Create the account
1. Go to klaviyo.com and click "Sign up" (free plan is fine to start).
2. Company: IBRAHIM Fragrances. Country: Australia. Currency: AUD.
3. Skip the platform-integration step (the site is custom, not Shopify).

## 2. Connect the website signup form
1. In Klaviyo go to **Audience → Lists & segments**. Open the list called **Newsletter** (or create one).
2. Copy the **List ID** (a 6-character code shown in the list settings / URL).
3. Open the site file `data/products.js`, find `newsletter: { action: ..., listId: '' }` and paste the code into `listId`.
4. Re-upload `data/products.js` to the website. From then on, every signup on the site goes straight into Klaviyo.

## 3. Import the email templates
In Klaviyo: **Content → Templates → Create template → Import HTML**, then paste each file from `marketing/emails/`:
- `welcome-1-your-code.html`
- `welcome-2-find-your-scent.html`
- `abandoned-cart.html`
- `post-purchase.html`
- `winback.html`

Each template already contains the Klaviyo name tag and unsubscribe link.

## 4. Build the five flows
Create each in **Flows → Create flow → Build your own**:

| Flow | Trigger | Steps |
| --- | --- | --- |
| Welcome | Joins list "Newsletter" | Send `welcome-1-your-code` immediately → wait 2 days → send `welcome-2-find-your-scent` |
| Abandoned cart | Started Checkout (needs the payment platform connected later; until then trigger on "Active on Site" + no order, or leave paused) | Wait 4 hours → send `abandoned-cart` |
| Post-purchase | Placed Order (available once real payments exist) | Wait 1 day → send `post-purchase` |
| Win-back | Placed Order zero times in last 60 days AND was engaged before | Send `winback` |
| SMS offers | Manual campaigns (see `sms-copy.md`) | Send at drops, Eid, and sales |

Note: the two flows that depend on real orders (abandoned cart, post-purchase) become fully automatic
once real payments are added to the site. Until then they can sit paused — nothing breaks.

## 5. SMS
1. In Klaviyo: **Settings → SMS** → enable for Australia (sender ID or shared number).
2. Add an SMS consent tick-box to the signup form inside Klaviyo (drag-and-drop).
3. Use the ready-made messages in `sms-copy.md`. Always keep the "Reply STOP to opt out" line — it is required by Australian spam law.

## 6. Before sending anything
- Replace the placeholder domain in the emails if the site address changes (re-run `npm run emails` after editing `data/products.js`, or find-and-replace in the HTML).
- Send every template to yourself first with **Preview → Send test**.
- Australian law (Spam Act): only email/SMS people who signed up, always include the unsubscribe link (already in the templates), and identify the business (already in the footer).
