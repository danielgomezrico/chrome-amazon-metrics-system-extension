# Feature Strategy: Amazon Imperial to Metric Chrome Extension

**Date:** 2026-03-05
**Phase:** Feature Ideation & Prioritization
**Inputs:** 5 refined personas (post-interview), pain document with root cause analysis, HMW statements

---

## [QUICK WIN] Features — High Pain / Low Effort

### QW-1: Dual-Unit Inline Display

- **Pain Addressed:** P1.2 (context-switching), P2.1 (micro-context-switches), P3.2 (copy-paste workflow), P5.2 (calculator fatigue), P4.4 (source data destruction)
- **Persona(s):** All 5 — universal requirement
- **HMW:** How might we show metric conversions inline alongside original imperial values so users can evaluate products without leaving the page?
- **Description:** Display converted metric values directly next to the original imperial measurements on Amazon product pages. Both values remain visible — imperial is never replaced. A subtle visual indicator (e.g., light background or small "cm" badge) distinguishes converted values from original page content.
- **Why Now:** Every competitor that replaced original values was uninstalled. "You should never destroy the source data" (Erik). Dual-unit display is the table-stakes expectation all 5 personas independently demand. Shipping without this is shipping dead.
- **Success Signal:** 0% uninstall rate attributed to "hides original values" in feedback. 90%+ of users keep default dual-display setting enabled.
- **Risk:** Visual clutter on dimension-heavy pages (spec tables with 20+ rows). Must degrade gracefully — too many inline annotations could make pages feel as "corrupted" as false positives do.

---

### QW-2: Amazon-Only Permission Scope

- **Pain Addressed:** P4.5 (privacy/permissions), P2.7 (reputational risk of recommending)
- **Persona(s):** Mateo (primary), Erik (adoption gate), all others (trust baseline)
- **HMW:** How might we help Mateo confidently recommend tools to his community without reputational risk?
- **Description:** Restrict extension permissions exclusively to Amazon domains (amazon.com, amazon.co.uk, amazon.de, amazon.co.jp, etc.). No "read all website data" permission. Manifest V3 only. Publish a clear, concise privacy policy stating zero data collection — no telemetry, no browsing data, no cart contents leave the browser.
- **Why Now:** "Read all website data" is the #1 permission that causes instant rejection for Mateo and Erik. Narrow scope is also the product's competitive advantage — Amazon-specific means fewer false positives, tighter security surface.
- **Success Signal:** Zero permission-related 1-star reviews on Chrome Web Store. Mateo-type users share without reputational hesitation.
- **Risk:** Limits future expansion to other sites (eBay, Walmart, Home Depot). Acceptable tradeoff — solve one domain perfectly first.

---

### QW-3: Open-Source GitHub Repository

- **Pain Addressed:** P4.5 (privacy concerns), P4.3 (extension trust deficit), P2.7 (reputational risk)
- **Persona(s):** Erik (adoption gate), Mateo (GitHub > Chrome Web Store trust)
- **HMW:** How might we help Erik trust a conversion tool when four predecessors have failed him?
- **Description:** Publish the full source code on GitHub with a clear README, test suite, and contribution guidelines. Mateo weights "GitHub activity, stars, recent commits, whether the README is well-written" over Chrome Web Store ratings. Erik won't install closed-source extensions. Open source turns skeptics into contributors and advocates.
- **Why Now:** No competing converter extension has a well-maintained, tested open-source repo. This is a zero-code-cost trust differentiator that unlocks Erik as a quality gatekeeper and Mateo as a 40-person distribution channel.
- **Success Signal:** 50+ GitHub stars in first 3 months. Erik-type users file quality bug reports instead of silently uninstalling. At least 1 community PR within 6 months.
- **Risk:** Exposes code to competitors. Acceptable — execution and maintenance quality are the real moat, not secrecy.

---

## [CORE] Features — High Pain / Moderate Effort

### CORE-1: Semantic Measurement Detection Engine

- **Pain Addressed:** #1 universal pain — P1.4 (page corruption), P2.4 (false positives), P3.4 (aggressive rounding from naive tools), P4.1 (naive regex), P5.4 (tool failure)
- **Persona(s):** All 5 — this is the foundation
- **HMW:** How might we convert only actual measurements — never model numbers, voltages, timestamps, or review counts — so users trust what they see?
- **Description:** Build a context-aware detection engine that distinguishes actual measurements from non-measurement numbers. Must correctly ignore: model numbers ("A2B-12X"), voltages ("12V"), timestamps ("2h30m"), review counts ("4,200 reviews"), prices ("$55.90"), addresses, and screen resolution ("1920x1080"). Uses DOM context (nearby labels, table headers, structured data attributes) and pattern heuristics (unit suffixes, dimension separators) rather than naive regex on all numbers.
- **Why Now:** This is why every competitor failed. Everything Metric converted review counts into kilograms. autoConvert turned timestamps into centimeters. The market has trained users to expect failure. Semantic detection is the single technical differentiator that earns the right to exist. Without it, the product is dead on arrival.
- **Success Signal:** Zero false positive reports in first 100 user reviews. Erik survives 30 days without a single false conversion. Lena doesn't uninstall within 5 minutes.
- **Risk:** Highest technical risk in the entire product. Amazon's HTML structure varies by category, seller, and A/B tests. Edge cases are infinite (e.g., "12-inch vinyl record" — is "12-inch" a measurement or a product category?). Requires ongoing maintenance as Amazon changes layouts. Must ship with a user-reportable "wrong conversion" mechanism to catch misses.

---

### CORE-2: Compound Dimension Parsing

- **Pain Addressed:** P2.3 (rounding error on multi-dim), P3.2 (format-agnostic parsing), P5.1 (cross-marketplace comparison arithmetic)
- **Persona(s):** Mateo, Priya, Yuki (3/5)
- **HMW:** How might we parse compound dimensions ("72 x 36 x 18 inches") as a single unit so multi-dimension products convert correctly?
- **Description:** Detect and convert compound dimension strings as atomic units. Handle all Amazon formatting variants: "72 x 36 x 18 inches", "72" x 36" x 18"", "L: 72 in, W: 36 in, H: 18 in", "72 x 36 x 18 in (182.9 x 91.4 x 45.7 cm)" (already-converted — don't double-convert). Preserve dimension labels (L/W/H/D) in the converted output.
- **Why Now:** "Three centimeters cost me $89 I couldn't get back" (Mateo). Compound dimensions are where purchase errors happen — users mix up width/depth, round one dimension wrong, or convert only 2 of 3 dimensions. Parsing them as a unit eliminates the class of errors that costs real money.
- **Success Signal:** Zero "dimension mismatch" purchase complaints. Priya stops using her Google Sheets CONVERT() workflow within 2 weeks of adoption.
- **Risk:** Format explosion — Amazon has no standardized dimension format. Must handle dozens of variants without false-triggering on non-dimension "x"-separated values (e.g., "Pack of 3 x 2 bottles"). Requires extensive test suite.

---

### CORE-3: Configurable Decimal Precision

- **Pain Addressed:** P3.4 (aggressive rounding — "That 1.7 cm matters enormously"), P3.5 (millimeter-margin near-misses)
- **Persona(s):** Priya (primary — dealbreaker), benefits all
- **HMW:** How might we help Priya trust automated conversions enough to eliminate her "knot in the stomach" anxiety?
- **Description:** Default to 1 decimal place (141.7 cm, not 142 cm). Allow users to configure 0, 1, or 2 decimal places via extension popup. For Priya's professional use case, 1+ decimals is the minimum — rounding to whole centimeters is an uninstall trigger. The setting persists across sessions.
- **Why Now:** Everything Metric showed "140 cm" when actual was 141.7 cm. For Priya, that 1.7 cm is the difference between a sideboard fitting an alcove and a client complaint. Building for Priya's precision standard automatically exceeds requirements for all other personas.
- **Success Signal:** Priya cross-checks 5-6 known products and gets matching values. Default precision satisfies 90%+ of users without configuration.
- **Risk:** Low. Simple implementation — the risk is in not doing it, not in doing it.

---

### CORE-4: Sub-50ms Performance Budget

- **Pain Addressed:** P2.4 (8-second page loads from autoConvert), P4.7 (Erik's 50ms benchmark)
- **Persona(s):** Erik (hard threshold), Mateo (experienced performance failure), all others (implicit expectation)
- **HMW:** How might we build conversion intelligence that Erik's technical scrutiny validates rather than rejects?
- **Description:** Engineer the DOM scanning and conversion pipeline to complete within 50ms on a standard product page. Use efficient selectors, batch DOM reads, minimize reflows. Handle lazy-loaded content via MutationObserver without re-scanning the entire page. Benchmark on worst-case pages (50+ item comparison grids). Include performance metrics in dev tools for Erik-type users to verify.
- **Why Now:** autoConvert's 8-second load times are the cautionary tale. Erik will benchmark the extension on his first install. If it fails the performance test, he uninstalls and tells Hacker News. Performance is a trust signal for technical users.
- **Success Signal:** < 50ms on product pages measured via Chrome DevTools. < 200ms on 50-item comparison pages. Zero "slow" mentions in reviews.
- **Risk:** Tension with CORE-1 (semantic detection). Smarter detection = more computation. Must find the right balance between accuracy and speed. May need to defer detection of edge cases to a secondary pass.

---

## [DIFFERENTIATOR] Features — Creates a Moat

### DIFF-1: Fit-Check Mode (Room Dimension Overlay)

- **Pain Addressed:** P3.3 (professional reputation risk), P3.5 (millimeter-margin fits), P3.2 (manual workflow)
- **Persona(s):** Priya (primary — "genuinely change how I work"), Lena (apartment furniture), Mateo (garage shelf)
- **HMW:** How might we help Priya verify product fit for client spaces without manual conversion workflows?
- **Description:** Users enter target dimensions once (e.g., "alcove: 142cm wide x 85cm tall x 45cm deep") via the extension popup. While browsing Amazon, every product with parsed dimensions gets a green checkmark (fits), yellow warning (tight — <2cm clearance), or red X (doesn't fit) badge overlaid on the listing. Clearance values shown on hover. Supports multiple saved spaces ("living room alcove", "kitchen counter", "garage shelf").
- **Why Now:** No competitor offers this. Priya's colleague pays a VA $8/hr to build metric spec sheets — this feature replaces that workflow entirely. It transforms the extension from a conversion utility into a professional fitting tool. This is the feature that justifies premium pricing.
- **Success Signal:** Priya saves 90+ minutes/week. 30%+ of active users create at least one saved space within first month. Premium conversion rate > 15% among users who try fit-check.
- **Risk:** Depends entirely on CORE-1 and CORE-2 accuracy. If dimension parsing misidentifies which value is width vs. depth, fit-check gives wrong answers — worse than no feature at all. Must handle Amazon's inconsistent L/W/H vs. W/D/H labeling. Ship only after core detection is battle-tested.

---

### DIFF-2: Multi-Marketplace Support (Amazon JP/UK/DE/AU)

- **Pain Addressed:** P5.5 (no Amazon JP support), P5.1 (cross-marketplace comparison), P5.4 (tool doesn't support workflow)
- **Persona(s):** Yuki (primary — adoption gate), Lena (Amazon.de fallback), all international shoppers
- **HMW:** How might we help Yuki compare products across Amazon marketplaces without unit arithmetic?
- **Description:** Extend the detection engine to work on all major Amazon marketplace domains: .com, .co.jp, .co.uk, .de, .com.au, .ca, .fr, .it, .es. Handle locale-specific dimension formats: millimeters on JP, mixed metric/imperial on UK, centimeters on DE. Detect already-metric values and skip them (don't convert cm to cm). Handle Japanese dimension formatting (e.g., "77 x 57 x 13 mm" with full-width characters).
- **Why Now:** Yuki's workflow starts on Amazon JP — if the extension doesn't work there, she can't adopt it. No competitor supports Amazon JP. This unlocks the entire cross-border shopping segment, which is growing as global e-commerce expands. LINE group of 40 people waiting.
- **Success Signal:** Extension works correctly on Amazon JP product pages with Japanese formatting. Yuki adopts within first session. Positive Japanese-language Chrome Web Store reviews.
- **Risk:** Multiplies testing surface by 5-10x (each marketplace has different HTML structures, different dimension conventions). Japanese full-width characters and mm-default units add parsing complexity. Must not break .com experience while adding marketplace support.

---

### DIFF-3: Batch Export to CSV

- **Pain Addressed:** P3.6 (no batch workflow for client proposals), P3.2 (copy-paste at $150/hr)
- **Persona(s):** Priya (primary — premium hook)
- **HMW:** How might we help Priya create client-ready metric spec sheets without copy-paste labor?
- **Description:** Allow users to "flag" products while browsing (click a pin icon overlaid on listings). Flagged products accumulate in the extension popup. One-click export generates a CSV with: product name, ASIN, URL, all dimensions (imperial + metric), fit-check status (if enabled), and date captured. CSV format is compatible with Google Sheets and Excel.
- **Why Now:** Priya processes 30-50 products per project. Her current workflow is copy-paste into Google Sheets with CONVERT() formulas — "My hourly rate is $150, and I'm spending it on copy-paste work." This is the premium feature that justifies $15/month pricing and differentiates from every free converter.
- **Success Signal:** Priya exports her first batch within the first project. Time savings measurable: 30+ minutes per project. Premium upgrade trigger for 10%+ of professional users.
- **Risk:** Requires reliable dimension extraction (depends on CORE-1/CORE-2). If export contains wrong dimensions, it's worse than manual — Priya sends bad data to clients. Must include a "verify" step or visual confirmation before export.

---

### DIFF-4: Firefox Extension (Cross-Browser Support)

- **Pain Addressed:** P4.6 (Erik's hard blocker — "I use Firefox")
- **Persona(s):** Erik (adoption gate), broader Firefox market (~3% desktop share but over-indexed in technical/privacy-conscious users)
- **HMW:** How might we help Erik trust a conversion tool when four predecessors have failed him?
- **Description:** Port the Chrome extension to Firefox using WebExtension APIs (Manifest V3 compatible). Maintain a single codebase with browser-specific shims where needed. Publish on Firefox Add-ons (AMO) with the same open-source repo and privacy commitments.
- **Why Now:** Erik is the skeptic/gatekeeper persona. He won't use Chrome. But if he approves the extension, he installs it on his mom's and girlfriend's browsers, files quality bug reports, and potentially contributes code. His value is as quality gatekeeper and distribution channel to non-technical users. Firefox support also signals cross-platform commitment — a trust indicator for all users.
- **Success Signal:** Erik installs and survives 30 days without uninstalling. Files bug reports instead of walking away. Installs on 2+ non-technical people's browsers.
- **Risk:** Firefox WebExtension APIs have subtle differences from Chrome (especially around MutationObserver behavior and content script injection timing). Maintaining two browser targets increases test burden. Worth it for the trust signal and gatekeeper persona access.

---

## [MOONSHOT] Features — Transformative If Pulled Off

### MOON-1: Cross-Marketplace Comparison View

- **Pain Addressed:** P5.1 (cross-marketplace arithmetic nightmare — 25+ minutes per 5 products)
- **Persona(s):** Yuki (primary — "the dream feature"), all cross-border shoppers
- **HMW:** How might we help Yuki compare products across Amazon marketplaces without unit arithmetic?
- **Description:** A side-by-side panel (popup or sidebar) where users can pin products from different Amazon marketplaces. All dimensions are normalized to the user's preferred unit system. Side-by-side display shows: product name, marketplace, price (with currency conversion link), and all dimensions in both original and normalized units. Highlights dimension differences between pinned products to help verify "is this the same product?"
- **Why Now:** Same SSD listed as "77 x 57 x 13 mm" on Amazon JP and "3.03 x 2.24 x 0.51 inches" on Amazon US — 5 minutes to verify it's the same product. No tool bridges Amazon's marketplace silos. This is the feature that transforms the extension from a utility into a cross-border shopping platform. If built, it's nearly impossible to replicate without the same semantic detection engine.
- **Success Signal:** Yuki's cross-marketplace comparison time drops from 25+ minutes to under 5. Feature drives premium upgrades at 20%+ conversion rate among cross-border shoppers.
- **Risk:** Requires scraping product data from multiple Amazon domains simultaneously — may violate Amazon ToS. Cross-origin restrictions in browser extensions complicate implementation. Amazon could break this at any time by changing page structure. Consider using Amazon Product Advertising API as a more stable (but limited) data source.

---

### MOON-2: Beyond-Length Unit Conversion

- **Pain Addressed:** P1.6, P2.5, P5.6 (temperature, weight, volume — "the whole system, not just inches")
- **Persona(s):** Mateo (daily — "78 degrees means nothing viscerally"), Lena (Fahrenheit in product descriptions), Yuki (fluid ounces, pounds)
- **HMW:** How might we help Mateo think in metric while browsing in an imperial country without any cognitive overhead?
- **Description:** Extend the semantic detection engine to handle: temperature (F to C), weight (lbs/oz to kg/g), volume (fl oz/cups/gallons to mL/L), and area (sq ft to sq m). Each unit type requires its own context-aware detection to avoid false positives (e.g., "350F" oven temp vs. "350" model number, "16 oz" weight vs. "16oz" product name). Users can toggle which unit types to convert.
- **Why Now:** "The problem is bigger than just inches to centimeters" (Lena). "It's the whole system" (Mateo). Every persona mentions non-length units as secondary pain. Solving length first proves the detection engine; extending to other units leverages the same architecture for multiplicative value.
- **Success Signal:** Users enable 2+ unit types on average. Mateo stops asking Siri about temperature. Zero false positives across new unit types.
- **Risk:** Each unit type multiplies the false-positive surface area. Temperature is especially tricky ("350" could be a price, a model number, a temperature, or a quantity). Weight overlaps with shipping information that's already in metric on some pages. Must be opt-in per unit type to manage risk.

---

### MOON-3: Mobile Companion (Safari/Kiwi Browser Extension)

- **Pain Addressed:** P1.5 (Lena — "on mobile I'm completely lost"), P5.7 (Yuki — both Amazon apps on phone)
- **Persona(s):** Lena, Yuki (2/5 — but represents a massive unsolved gap)
- **HMW:** How might we show metric conversions inline alongside original imperial values so users can evaluate products without leaving the page?
- **Description:** Build a Safari Web Extension (iOS 15+) or support Kiwi Browser (Android, supports Chrome extensions). Alternatively, explore a companion app that processes shared Amazon links and returns metric-converted product summaries. Mobile browsing is part of Lena's and Yuki's workflow, and there is zero competition in mobile unit conversion for Amazon.
- **Why Now:** Lena browses Amazon on her phone from the couch. Yuki has both Amazon JP and US apps installed. Mobile shopping is 60%+ of Amazon traffic globally, yet no conversion solution exists. First-mover advantage is massive.
- **Success Signal:** Mobile-specific installs represent 20%+ of total user base within 6 months. Positive App Store reviews citing "finally works on phone."
- **Risk:** iOS Safari extensions have severe limitations (no persistent background scripts, limited DOM access). Amazon mobile web is heavily app-redirect-optimized — users may not stay in the browser. The Amazon app itself is unreachable by extensions. May need to be a standalone app rather than an extension, which changes the product model entirely.

---

### MOON-4: Conversion Memory & Product History

- **Pain Addressed:** P1.7 (Lena's Notion table — "tracks dims manually to avoid re-converting"), P5.2 (Yuki's sticky notes)
- **Persona(s):** Lena (primary — built personal tooling for this), Yuki (sticky note workaround)
- **HMW:** How might we help Lena compare products across sessions without building manual tracking systems?
- **Description:** Automatically remember converted dimensions for products the user has viewed. When revisiting a product page, show a "Previously viewed" indicator with the stored metric dimensions. Allow users to create a "metric wishlist" — a list of products with their converted dimensions, sortable and filterable. Syncs across devices via browser sync.
- **Why Now:** Lena built a Notion table specifically for this. Yuki has sticky notes. These are manual workarounds for a feature gap. The extension already parses dimensions — storing them is an incremental step that creates sticky retention (users won't switch to a tool that doesn't remember their history).
- **Success Signal:** 40%+ of weekly-active users have 5+ products in conversion history. Retention rate 2x higher for users with stored products vs. those without.
- **Risk:** Local storage limits in extensions (~5MB). Privacy implications of storing browsing/product history. Must be local-only (no cloud sync) to maintain privacy promise — but this limits cross-device value. Could conflict with QW-2's zero-data-collection promise if not architected carefully.

---

## Priority Matrix

| Feature | Tier | Personas | Severity (1-10) | Effort (1-10) | Score |
|---------|------|----------|-----------------|----------------|-------|
| **CORE-1: Semantic Measurement Detection** | CORE | All 5 | 10 | 8 | 6.25 |
| **QW-1: Dual-Unit Inline Display** | QUICK WIN | All 5 | 9 | 3 | 15.00 |
| **CORE-2: Compound Dimension Parsing** | CORE | Mateo, Priya, Yuki | 8 | 5 | 4.80 |
| **QW-2: Amazon-Only Permission Scope** | QUICK WIN | All 5 | 7 | 1 | 35.00 |
| **QW-3: Open-Source GitHub Repo** | QUICK WIN | Erik, Mateo (+all) | 6 | 1 | 30.00 |
| **CORE-3: Configurable Decimal Precision** | CORE | Priya (+all) | 8 | 2 | 20.00 |
| **CORE-4: Sub-50ms Performance** | CORE | Erik, Mateo (+all) | 7 | 5 | 7.00 |
| **DIFF-1: Fit-Check Mode** | DIFFERENTIATOR | Priya, Lena, Mateo | 9 | 7 | 3.86 |
| **DIFF-2: Multi-Marketplace Support** | DIFFERENTIATOR | Yuki, Lena | 8 | 7 | 2.29 |
| **DIFF-3: Batch Export to CSV** | DIFFERENTIATOR | Priya | 7 | 4 | 1.75 |
| **DIFF-4: Firefox Extension** | DIFFERENTIATOR | Erik | 6 | 5 | 1.20 |
| **MOON-1: Cross-Marketplace Comparison** | MOONSHOT | Yuki | 9 | 9 | 1.00 |
| **MOON-2: Beyond-Length Units** | MOONSHOT | Mateo, Lena, Yuki | 6 | 7 | 2.57 |
| **MOON-3: Mobile Companion** | MOONSHOT | Lena, Yuki | 7 | 9 | 1.56 |
| **MOON-4: Conversion Memory** | MOONSHOT | Lena, Yuki | 5 | 6 | 1.67 |

**Score formula:** (Severity x Persona Count) / Effort

### Recommended Build Order

1. **QW-2** (Amazon-only permissions) + **QW-3** (open-source) — Day 1 decisions, zero code cost
2. **CORE-1** (semantic detection) — The foundation. Nothing works without this.
3. **QW-1** (dual-unit display) + **CORE-2** (compound dimensions) — First visible value to users
4. **CORE-3** (decimal precision) — Unlocks primary persona (Priya)
5. **CORE-4** (performance) — Validates with skeptic persona (Erik)
6. **DIFF-1** (fit-check) — Premium differentiator, moat feature
7. **DIFF-2** (multi-marketplace) — Unlocks cross-border segment
8. **DIFF-3** (batch export) — Premium conversion hook
9. Everything else based on user demand signals

---

## Summary

**The product wins or dies on CORE-1 (semantic detection).** Every competitor failed because they converted everything instead of converting only measurements. The Quick Wins (permissions, open-source, dual-display) establish trust. The Core features (detection, compound parsing, precision, performance) earn the right to retain users. The Differentiators (fit-check, multi-marketplace, batch export) create a moat no weekend project can replicate. The Moonshots (cross-marketplace view, beyond-length, mobile, memory) transform the product from a utility into a platform — but only after the foundation is unbreakable.

**One-line strategy:** Be the converter that never gets it wrong, then become the tool that makes measurements disappear entirely.
