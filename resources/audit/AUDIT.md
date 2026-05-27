# I3/NYC — UI/UX Audit

**Live site:** https://i3-nyc.vercel.app
**Captured:** May 27, 2026 (desktop 1440px, mobile 375px)
**Audit framework:** `ui-ux-pro-max` design intelligence + `design:design-critique` + Chrome DevTools live inspection
**Reference design system:** Swiss Modernism 2.0 / Minimal Single Column (premium dark editorial)

---

## Overall Impression

The site has a **strong editorial mood** — dark theme, generous whitespace, light-weight Geist Sans typography, restrained purple accent. The new "Scaling the Bridge" positioning lands well. The block-based CMS is a real asset.

The biggest opportunity is **discipline in the accent system, photography, and a few surgical typography fixes** — not a redesign. The bones are right; the polish is uneven.

What works:

- ✅ Tight type hierarchy (kicker → headline → description → CTA pattern repeats consistently)
- ✅ One H1 per page, clean heading levels
- ✅ Body contrast on dark bg (`#F5F5F5` on `#1F1F24` ≈ 16.4:1 — AAA)
- ✅ Block-based CMS makes every fix here propagate cleanly through the editor
- ✅ Mobile reflow works (no horizontal scroll, all blocks stack)
- ✅ Geist Sans is on-brand and modern

---

## 🔴 Critical Issues (fix first)

### 1. Stat numbers + membership tier prices are rendered in monospace

**Where:**
- Home hero stats (`$2T+ · 25K+ · 6K+ · 300+ · $177B`)
- Membership tier prices (`$50/yr · $100/yr · Invite Only · Contact Us`)

**Root cause:** the global Tailwind classes use `font-mono` (Geist Mono) on these. DOM inspection confirmed: `fontFamily: "Geist Mono", ui-monospace, monospace`. Mono numerals on a flat dark hero read as code, not as headlines — they break the editorial mood.

**Fix:** Drop `font-mono` from those classes. Stats and tier prices should use the same Geist Sans (light or medium) as the rest of the type. Numerals will still look great — Geist's `tnum` (tabular figures) gives even spacing without the typewriter feel.

```diff
- <span className="font-mono text-5xl ...">{stat.value}</span>
+ <span className="text-5xl font-light tracking-tight tabular-nums ...">{stat.value}</span>
```

Files to touch:
- [components/sections/stats-section.tsx](components/sections/stats-section.tsx)
- [components/sections/membership-tiers.tsx](components/sections/membership-tiers.tsx)

### 2. "Admin" link is visible to anonymous visitors

**Where:** Top-right of the site header. Confirmed via DOM inspection — `<a href="/admin/login">Admin</a>` is in the nav for non-admins.

**Why it matters:** Privacy/UX hygiene. Public visitors shouldn't see an admin entry point in the primary nav. It also distracts from the actual CTAs (Become Member, Events).

**Fix:** Hide the link when not authenticated. Keep the route accessible at `/admin/login` directly.

File: [components/layout/site-header.tsx](components/layout/site-header.tsx) — wrap the admin `<Link>` in `{isAdmin ? <LogoutButton /> : null}` (currently it renders the admin link in the else branch).

### 3. Footer tagline is the old positioning

**Current:** "Empowering Italian Innovation on a Global Scale. A non-profit initiative endorsed by the Italian Consulate in New York."

**Issue:** "Empowering Italian Innovation on a Global Scale" is the **pre-revamp** tagline. The 2026 positioning is "Scaling the Bridge / The Premier Hub for Italian Innovation in the NYC Metro Area." Inconsistency between hero and footer undermines the rebrand.

**Fix:** Update the footer copy. Suggested:

> Scaling the Bridge. The premier hub for Italian innovation in the NYC metro area. A non-profit initiative endorsed by the Italian Consulate General in New York.

File: [components/layout/site-footer.tsx](components/layout/site-footer.tsx)

### 4. Placeholder text shipped to production

**Where:** `/projects-cooperation` — under "Fondazione Brodolini" and "Regione Lazio Mission," the literal string "Description and contact" appears as a subtitle. This was a content-instruction artifact from the blueprint, not real copy.

**Fix:** Either remove the field, or replace with actual contact info / website / brief subtitle (e.g. "fondazionebrodolini.it" and "regione.lazio.it").

Files: [app/projects-cooperation/page.tsx](app/projects-cooperation/page.tsx) DEFAULT_DATA + the corresponding Vercel Blob content entry.

### 5. Raw URLs rendered as visible content

**Where:** `/reports-insights-media` knowledge-hub tiles — two tiles show raw URLs as content:
- `/reports-insights-media/innovation-tech-march-2026`
- `https://www.linkedin.com/company/i3-italian-innovators-initiative`

These are the `href` values being printed inside the card body. The whole card should already be a link; the URL line is duplicative and looks unfinished.

**Fix:** In [components/sections/knowledge-hub.tsx](components/sections/knowledge-hub.tsx), don't render the `href` in the visible card body unless it's the admin editor. Add a small "→" arrow on hover instead.

```diff
- {fieldPrefix && (
-   <EditableText fieldKey={`${fieldPrefix}.items.${idx}.href`} value={tile.href || ""} ... />
- )}
+ {/* URL is the card href, no need to render it as content */}
```

### 6. No "skip to main content" link

**Issue:** DOM inspection confirmed first focusable element is the logo link, not a skip link. WCAG 2.1 AA requirement for keyboard users.

**Fix:** Add a visually-hidden-until-focused `<a href="#main">Skip to main content</a>` as the first element in `<body>`, and `id="main"` on the `<main>` in [app/layout.tsx](app/layout.tsx).

```tsx
// app/layout.tsx
<body className="...">
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
  >
    Skip to main content
  </a>
  ...
  <main id="main" className="flex-1 pt-20 pb-16 md:pb-0">{children}</main>
</body>
```

---

## 🟡 Moderate — UI Polish (modern web standards)

### 7. Accent color overuse — purple is everywhere

**Pattern observed:**
- All 5 home stats in vivid purple (visually heavy)
- Headline accent lines often span 40-70% of the headline (defeats the purpose of an accent)
- Numbered pillars (`01 02 03 04`) in purple
- Kickers in purple
- Stats numbers in purple
- Hairlines and tile borders in purple on hover
- Bottom CTA accent text in purple

The 60-30-10 color rule (60% dominant, 30% secondary, 10% accent) is being violated — purple is closer to 30-40% on most pages.

**Fix:** Establish two grades of accent:
- **Hot accent** (`#7337E1` purple) — reserve for: kickers, ONE accent word per headline, primary button, single-tile category badge
- **Cool accent** (suggested: `#A78BFA` lavender or `oklch(0.78 0.10 295)` — same hue, more muted) — for stats numbers, numbered list markers, hairlines

Concretely:
- Make stat numbers **foreground-color** (off-white) with the unit/+ in muted purple — number reads as the hero, accent supports
- Limit each headline to **one** colored phrase, never two adjacent lines

### 8. Headline accent spans are too wide

**Examples (color span in `[brackets]`):**
- Home: "Scaling the Bridge: [The Premier Hub for Italian Innovation] in the NYC Metro Area."
- Events: "Dual-track programming for [knowledge and community.]"
- Projects: "Global innovation flows and [institutional advisory.]"
- Membership: "A contribution to a [public-interest mission.]"

In each case the purple span carries 40-70% of the headline. Visual emphasis disappears when most of the type is emphasized.

**Fix:** Drop the accent to one word or one short phrase per headline. Examples:
- Home: "Scaling the [Bridge]: the premier hub for Italian innovation in the NYC Metro Area."
- Events: "Dual-track programming for knowledge and [community]."
- Projects: "Global innovation flows and institutional [advisory]."
- Membership: "A contribution to a [public-interest] mission."

This is a content-only fix — done via the admin editor, no code change.

### 9. Orphan rows in grids

**Where:**
- About → Operating Committee: 4 + 4 + 1 (Andrea De Castiglioni alone in row 3)
- Membership → tiers: 3 + 1 (Institutional Partner alone in row 2)
- Reports → knowledge-hub: 2 + 2 + 1 (Follow us on LinkedIn alone in row 3)

**Fix:** Either set the grid to a width that fills cleanly, or constrain the row to align. Options:
- About Operating Committee → `lg:grid-cols-3` (3+3+3) instead of 4
- Membership tiers → `lg:grid-cols-4` (4 in a row, single line) or `lg:grid-cols-2` (2+2)
- Knowledge-hub tiles → consider `lg:grid-cols-3` once you have 6+ tiles, or keep 2 columns but bias the SOCIAL tile to be smaller / inline

Most surgical fix: in [team-grid.tsx](components/sections/team-grid.tsx) change `lg:grid-cols-4` to `lg:grid-cols-3` for the Operating Committee. In [membership-tiers.tsx](components/sections/membership-tiers.tsx), use `lg:grid-cols-4` to fit all 4 tiers in one row at the same scale.

### 10. Zero photography across the entire site

**Observation:** DOM scan returned only **one** `<img>` — the logo. Every team member, every event, every report, every partner is text or a monogram initial circle.

For a 501(c)(3) nonprofit positioning itself as a credible institution, the absence of any humanity (faces, the Consulate, NYC, event photos) reads as either pre-launch or AI-generated. Modern editorial / institutional sites (Stripe, Linear, Brown, MoMA, NYT) mix:
1. Pure type heroes ✓ (you have this)
2. Selective full-bleed editorial photography (you don't have this)
3. Subtle motion / gradient / texture moments (you don't have this)

**Recommendation:** Introduce three controlled image moments:
- **Home hero:** a single full-bleed evocative still (NYC bridge at dusk, Brooklyn Bridge close-up, or an Italian-NYC architectural detail) at 30% opacity behind the headline. Keeps the type-led mood, adds atmosphere.
- **About → Board members:** actual portrait photos (B&W or muted color, consistent treatment). Monograms only as fallback.
- **Events → Track A entries:** small thumbnail per event (venue or speaker).

Even one image — the hero — would dramatically lift perceived quality.

### 11. Focus rings are too subtle

**DOM-confirmed:** primary CTA computed outline = `1.5px solid oklab(... 0.5 alpha)`. At 1.5px width and 50% opacity, focus rings are barely visible — particularly bad on the purple button (similar hue) and the underlined link CTA.

**Fix:** Bump to a 2-3px ring with full opacity and use a contrast-color ring (not the same purple as the button):

```css
/* tailwind config or globals.css */
.focus-visible\:ring-2 {
  outline: 3px solid white;
  outline-offset: 2px;
}
```

Or via Tailwind utility on each interactive element: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`.

### 12. Hover states are color-only on most cards/links

The knowledge-hub tile cards add a `hover:border-primary/40` change — subtle and correct. But most other interactive elements (footer links, nav links, footer category labels) have no hover feedback at all. UX-Pro-Max guideline `hover-feedback` requires visible indication of interactivity.

**Fix:** Audit all links and add `transition-colors hover:text-foreground` (already used in places) consistently, plus subtle underline-on-hover for footer links.

### 13. No micro-interactions or subtle motion

Modern 2026 sites use restrained motion to:
- Fade in content on scroll (200-300ms, opacity + 4px translate)
- Animate the underline on link hover (200ms)
- Subtle parallax or grain on the hero
- A barely-perceptible vertical drift on the hero kicker

Right now the site is fully static. Adding **one** scroll-fade animation (with `prefers-reduced-motion` opt-out) would lift perceived modernity without changing the calm editorial mood.

**Suggested approach:** Use Framer Motion's `motion.div` with `whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} viewport={{ once: true }} transition={{ duration: 0.4 }}` on section wrappers.

Respect `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`.

### 14. CTA copy inconsistency

**Variants spotted:**
- Header: "Become Member"
- Mobile sticky bar: "Become Member"
- Home + About bottom CTA: "Become Member"
- Membership tiers section button: "Become **a** Member"
- Reports/Events bottom CTA: "Become Member"
- Membership footer CTA: "Become Member"

**Fix:** Canonical CTA = "**Become Member**" (no article). Update the one stray "Become a Member" in [membership-tiers.tsx](components/sections/membership-tiers.tsx) or in the page DEFAULT_DATA.

### 15. Stale `"NY"` vs `"NYC"` mixing

The home stat block has `"NY Metro economy"` and `"Italian innovators in NY"` while elsewhere the copy says "NYC" / "New York City." Pick one and normalize. Recommend **NYC** (matches the brand: I3/**NYC**).

### 16. Inconsistent kicker casing

- Hero kickers: "Italian Innovators Initiative" (Title Case)
- Section kickers within pages: "Value Proposition", "Tiers", "Track A", "Member Spotlights" (Title Case)
- Footer columns: "NAVIGATE", "CONNECT" (ALL CAPS tracked)

Three different micro-styles for what is conceptually the same element (small purple label). Pick one — recommend **ALL CAPS tracked** for every kicker:

> `text-xs font-medium tracking-[0.2em] uppercase text-primary`

Already partially used (footer columns, Operating Committee labels). Normalize everywhere.

---

## 🟢 Minor — UX Polish

### 17. Empty-state copy is too dry

"Member spotlights coming soon." — functional but inert.

**Suggested:** "Member spotlights launching with our first cohort. Join the community to be featured."

### 18. Event spotlight headline is generic

"Don't miss what's next." — generic. The event itself (May 11 Spring Member Summit) is more specific and would land harder.

**Suggested:** Replace the standalone H2 with the date as the kicker and the event title as the H2:

```
May 11 · Spring Summit
What's next on the bridge.
```

### 19. Events page is too sparse

Track B has 1 event, Track A has 4. Visually unbalanced.

**Fix options:**
- Add 2-3 upcoming aperitivo events to Track B (May, June, July happy hours)
- Add a "Past events" section showing 2024-2025 highlights (gives the page weight + social proof)
- Add a small image per Knowledge Series anchor (speaker headshot or venue)

### 20. Mobile sticky CTA bar can obscure content

The fixed bottom bar (`components/layout/cta-bar.tsx`) adds `pb-16` on `<main>` for mobile, which works at most scroll positions. But on pages with shorter content (e.g., `/projects-cooperation`), the bar may sit very close to the actual page-bottom CTA, creating two competing "Become Member" buttons stacked.

**Fix:** When the page-end CTA is in view, fade the sticky bar to 0 opacity. Use `IntersectionObserver` on the final CTA section.

### 21. URL `i3-nyc.vercel.app` reads as pre-launch

Once you're using the site in print (banner) or external promo, the Vercel preview URL signals "not launched yet." Wire a custom domain (`i3nyc.org` — already used in the banner footer) before any external rollout.

---

## ♿ Accessibility — beyond what's already noted

### What's passing
- ✅ `<html lang="en">` set
- ✅ Single H1 per page, no skipped heading levels
- ✅ Body contrast 16.4:1 (AAA)
- ✅ Muted text contrast `#96969E` on `#1F1F24` ≈ 5.6:1 (passes AA for normal text)
- ✅ No unlabeled icon-only buttons found
- ✅ Logo `<img>` has descriptive alt
- ✅ Mobile nav uses proper Sheet component with SheetTitle (sr-only)

### Worth adding
- 🔴 **Skip link** (covered above — #6)
- 🟡 **Focus rings** (covered above — #11)
- 🟢 **`prefers-reduced-motion` opt-out** — when adding the suggested motion in #13, gate it on `useReducedMotion()` from Framer Motion, or wrap in `@media` query
- 🟢 **`aria-current="page"` on the active nav link** — helps screen reader users know where they are. Add in [site-header.tsx](components/layout/site-header.tsx) using `usePathname()`
- 🟢 **Decorative SVGs** (the numbered `01/02/03/04` markers) — add `aria-hidden="true"` so screen readers don't read them as alt text

---

## 🎨 Design System Refinements

Based on the `ui-ux-pro-max` Swiss Modernism 2.0 + `shadcn` guidance:

### Tokens to add to [app/globals.css](app/globals.css)

```css
:root {
  /* existing tokens... */

  /* New: cool accent for secondary purple usage */
  --primary-muted: oklch(0.72 0.13 296);   /* lavender — for stats, hairlines, decorative numbers */

  /* New: surface elevation */
  --surface-1: rgb(36 36 41);   /* slightly lighter than bg, for cards */
  --surface-2: rgb(42 42 48);   /* for elevated cards on hover */

  /* New: motion easings */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

### Type scale — already good, two tweaks
- Body line-height is fine
- Hero size `72px` light is correct
- **Action**: tighten `tracking-tight` to `tracking-[-0.02em]` on hero only (Geist already has tight defaults — verify before changing)

### Hairlines
- All hairlines currently use `border-border` (varies). Pick one weight (1px) and one color (`border-white/10`). The "short anchor hairline" used above the home pillars is a nice editorial touch — could be reused as a repeated motif before each section heading.

---

## Priority Recommendations (do these, in order)

| # | What | Severity | Effort | File |
|---|---|---|---|---|
| 1 | Drop `font-mono` from stats + tier prices | 🔴 | XS (5 min) | [stats-section.tsx](components/sections/stats-section.tsx), [membership-tiers.tsx](components/sections/membership-tiers.tsx) |
| 2 | Hide "Admin" link from anon users | 🔴 | XS (2 min) | [site-header.tsx](components/layout/site-header.tsx) |
| 3 | Update footer tagline to "Scaling the Bridge…" | 🔴 | XS (1 min) | [site-footer.tsx](components/layout/site-footer.tsx) |
| 4 | Remove "Description and contact" placeholders | 🔴 | XS (1 min) | [projects-cooperation/page.tsx](app/projects-cooperation/page.tsx) + Blob |
| 5 | Hide raw `href` in knowledge-hub tiles | 🔴 | S (10 min) | [knowledge-hub.tsx](components/sections/knowledge-hub.tsx) |
| 6 | Add skip link | 🔴 | S (10 min) | [app/layout.tsx](app/layout.tsx) |
| 7 | Reduce accent span in every headline (one word only) | 🟡 | S (15 min) | Content via admin editor |
| 8 | Normalize CTA copy to "Become Member" | 🟡 | XS (2 min) | [membership-tiers.tsx](components/sections/membership-tiers.tsx) |
| 9 | Normalize all kickers to ALL CAPS tracked | 🟡 | M (30 min) | All section components — single shared kicker style |
| 10 | Fix orphan rows (Operating Committee → 3 cols, tiers → 4 cols) | 🟡 | S (15 min) | [team-grid.tsx](components/sections/team-grid.tsx), [membership-tiers.tsx](components/sections/membership-tiers.tsx) |
| 11 | Stronger focus rings (3px outline, white) | 🟡 | S (15 min) | [globals.css](app/globals.css) |
| 12 | Normalize "NY" → "NYC" in stats | 🟡 | XS (2 min) | Content via admin editor |
| 13 | Add `aria-current="page"` to active nav link | 🟢 | S (10 min) | [site-header.tsx](components/layout/site-header.tsx) |
| 14 | Add one full-bleed hero atmosphere image (30% opacity) | 🟡 | M (1-2 hrs incl. image sourcing) | [home-hero.tsx](components/sections/home-hero.tsx) + asset |
| 15 | Add scroll-fade motion on section entry | 🟢 | M (1 hr) | Section wrappers + framer-motion install |
| 16 | Wire `i3nyc.org` custom domain | 🟡 | S (15 min in Vercel) | Vercel dashboard |
| 17 | Replace board monograms with real portrait photos | 🟢 | M (asset gathering) | [team-grid.tsx](components/sections/team-grid.tsx) + assets |
| 18 | Fill out Track B + add past events | 🟢 | S (10 min content) | Admin editor |
| 19 | Stronger empty-state copy for Member Spotlights | 🟢 | XS (2 min) | [member-spotlight.tsx](components/sections/member-spotlight.tsx) |
| 20 | Replace "Don't miss what's next" with specific event title | 🟢 | XS (2 min) | Content via admin editor |

**Estimated total**: items 1-13 ≈ **2-3 hours of focused work**. Items 14-20 ≈ another **3-4 hours** plus asset sourcing.

The first 6 (all critical) are about **trust**: removing the marks of an unfinished site (mono numbers, admin link, stale footer, placeholder text, raw URLs, missing skip link). After that you're polishing a competently-launched site.

---

## What I would NOT change

To protect what works:

- Don't touch the dark theme or the Geist Sans choice
- Don't add a second accent color outside the purple family — discipline within one hue is the brand
- Don't add iconography to section blocks (you're not Stripe; the editorial type IS the visual)
- Don't add testimonials/social proof until they're real
- Don't add a hero carousel — the static type approach is right for a serious institutional site
- Don't shorten section padding — the breathing room is a feature

---

## Appendix: Captured artifacts

In [resources/audit/](resources/audit/):
- `01-home-desktop.jpeg` — 1440px home
- `02-about-desktop.jpeg` — 1440px about
- `03-membership-desktop.jpeg` — 1440px membership
- `04-events-desktop.jpeg` — 1440px events
- `05-projects-desktop.jpeg` — 1440px projects
- `06-reports-desktop.jpeg` — 1440px reports
- `07-home-mobile.jpeg` — 375px home
- `08-membership-mobile.jpeg` — 375px membership
- `AUDIT.md` — this file
