# Pain Document: Amazon Imperial to Metric Chrome Extension

**Date:** 2026-03-05
**Phase:** Pain Investigation & Root Cause Analysis
**Inputs:** 5 refined personas (post-interview), comparison matrix, primary target analysis

---

## Persona 1: Lena K. (German UX Designer, Berlin)

### Pain Inventory

| # | Pain | Evidence | Source |
|---|------|----------|--------|
| P1.1 | Zero spatial intuition for imperial units | "I open the product page and it says '55 by 28 inches.' I just stare at it." Must convert every dimension before even beginning to evaluate. | Interview Q |
| P1.2 | Context-switching destroys shopping flow | "Like reading a book in a foreign language" — 10-20 conversions/session, forgets earlier ones by session end. | Interview Q |
| P1.3 | Costly return from mental math errors | Bookshelf 15cm too short, EUR 45 international return. "No more mental math." | Interview Q |
| P1.4 | Existing tools corrupt Amazon pages | Everything Metric converted review counts, addresses. "The page looked broken, like corrupted." Uninstalled after 1 week. | Interview Q |
| P1.5 | No mobile conversion solution | "On mobile I'm completely lost." Desktop has Google converter tab; phone has nothing. | Interview insight |
| P1.6 | Pain extends beyond length units | Fahrenheit (heated blankets), weight (shipping) also painful. "The problem is bigger than just inches." | Interview insight |
| P1.7 | Must build personal tooling (Notion table) | Tracks product dims manually to avoid re-converting revisited products — significant effort investment. | Interview insight |

### Severity Matrix

| | Critical | Moderate | Minor |
|---|----------|----------|-------|
| **Daily/Weekly** | P1.2 (context-switching) | P1.1 (no spatial intuition), P1.7 (Notion workaround) | P1.6 (non-length units) |
| **Per-incident** | P1.3 (costly return) | P1.4 (tool corruption) | |
| **Rare** | | P1.5 (mobile gap) | |

### Root Cause Analysis — Top 2 Pains

**P1.2: Context-switching destroys shopping flow**
1. Why does she context-switch? She must convert imperial dims to metric to understand them.
2. Why must she convert? She has zero metric intuition for imperial (grew up metric-only).
3. Why isn't conversion inline? Amazon US only shows imperial. No native metric option.
4. Why doesn't she use an extension? Existing extensions corrupt the page with false positives.
5. **Root cause:** Amazon lacks locale-aware unit display, and no existing tool converts selectively enough to avoid page corruption.

**P1.3: Costly return from mental math errors**
1. Why did she do mental math? She wanted a quick estimate without tab-switching.
2. Why was the estimate wrong? Mental inch-to-cm conversion is error-prone at larger numbers (rounding compounds).
3. Why didn't she double-check? She was fatigued from dozens of prior conversions that session.
4. Why so many conversions? Every product requires 3-6 dimension conversions, no tool automates it reliably.
5. **Root cause:** Conversion fatigue from repetitive manual work leads to shortcuts (mental math) that produce errors with financial consequences.

### HMW Statements
1. How might we help Lena evaluate product dimensions instantly without leaving the Amazon page?
2. How might we help Lena compare products across sessions without building manual tracking systems?
3. How might we help Lena trust conversion accuracy so she never resorts to mental math?

### Unmet Need
**Persistent conversion memory** — no tool remembers her previous conversions, forcing her to rebuild context every visit. Her Notion table is a symptom of this gap.

---

## Persona 2: Mateo R. (Colombian SW Engineer, Austin TX)

### Pain Inventory

| # | Pain | Evidence | Source |
|---|------|----------|--------|
| P2.1 | Constant micro-context-switches across daily life | "If you're a developer you know how expensive those are." Dozens daily across Amazon, Home Depot, recipes, weather. | Interview Q |
| P2.2 | Compound conversion workflow is fragmented | 3 "Hey Siri" calls per product page. Wife interrupts mid-conversion with cooking conversions. Forgets which product he was comparing. | Interview Q |
| P2.3 | Costly purchase from rounding error | Shelf: rounded wrong on one dimension, switched width/depth mentally. $89 final-sale loss. | Interview Q |
| P2.4 | Existing tools destroy page performance | autoConvert: 8-second page loads + converted timestamp "2h30m" into centimeters. Uninstalled in <1 hour. | Interview Q |
| P2.5 | Whole-system measurement friction (not just length) | Temperature ("78 degrees means nothing viscerally"), weight, volume. "It's the whole system." | Interview insight |
| P2.6 | Cultural/identity friction from imperial immersion | "Every time I have to convert, I'm reminded this country wasn't designed for me." Wants daughter to maintain metric intuition. | Interview Q |
| P2.7 | Reputational risk of recommending bad tools | 40-person WhatsApp group — if someone has a bad experience, he looks bad. Won't recommend until tool is proven. | Interview insight |

### Severity Matrix

| | Critical | Moderate | Minor |
|---|----------|----------|-------|
| **Daily** | P2.1 (micro-context-switches), P2.2 (fragmented workflow) | P2.5 (whole-system friction), P2.6 (identity friction) | |
| **Per-incident** | P2.3 (costly rounding error) | P2.7 (reputational risk) | |
| **Rare** | | P2.4 (tool performance failure) | |

### Root Cause Analysis — Top 2 Pains

**P2.1: Constant micro-context-switches**
1. Why does he context-switch? Every imperial measurement requires active translation.
2. Why is it active, not passive? No tool converts inline without side effects.
3. Why do tools have side effects? They use naive regex, converting non-measurement numbers.
4. Why naive regex? Building semantic measurement detection is hard; most tools don't invest in it.
5. **Root cause:** No conversion tool has achieved semantic understanding of what constitutes a measurement vs. a non-measurement number on a product page.

**P2.3: Costly purchase from rounding error**
1. Why did he round? Mental math is imprecise at multi-dimension conversions.
2. Why mental math? Siri requires one-at-a-time queries — too slow for 3+ dimensions.
3. Why didn't he write it down? He was comparing products and the workflow was already fragmented.
4. Why fragmented? No tool converts all dimensions simultaneously and displays them in context.
5. **Root cause:** No tool handles compound multi-dimension conversion in-place, forcing serial manual conversion that breeds errors.

### HMW Statements
1. How might we help Mateo think in metric while browsing in an imperial country without any cognitive overhead?
2. How might we help Mateo convert compound dimensions (L x W x H) in one step without leaving the page?
3. How might we help Mateo confidently recommend tools to his community without reputational risk?

### Unmet Need
**Compound dimension parsing** — "72 x 36 x 18 inches" should be converted as a unit, not three separate numbers. No existing tool handles this.

---

## Persona 3: Priya N. (Australian Interior Designer, Melbourne)

### Pain Inventory

| # | Pain | Evidence | Source |
|---|------|----------|--------|
| P3.1 | Amazon listing data inconsistency | Same listing: "55.9 inches" in specs, "56.2 inches" in bullets. 20 min investigating + 3-day seller reply wait. | Interview Q |
| P3.2 | Manual copy-paste-convert workflow at $150/hr | 30-50 products/project, 3-6 dimensions each. Inconsistent Amazon formatting breaks CONVERT() formulas. | Interview Q |
| P3.3 | Professional reputation at stake with every measurement | "A knot in my stomach" every time she sends recommendations. Colleague lost 3 referrals over 3cm error. | Interview Q |
| P3.4 | Existing tools round aggressively | Everything Metric showed "140 cm" when actual was 141.7 cm. "That 1.7 cm matters enormously." | Interview Q |
| P3.5 | Near-miss fit errors measured in millimeters | Sideboard for 142cm alcove: conversion showed 141.986cm — 0.14cm clearance per side, before skirting boards. | Interview Q |
| P3.6 | No batch workflow for client proposals | Must convert one product at a time. Wants to flag 10 products and export all metric dims to CSV. | Interview insight |
| P3.7 | Amazon's "approximately" creates professional liability | The word "approximately" on a dimension she's recommending to a client = unacceptable uncertainty. | Surprise finding |

### Severity Matrix

| | Critical | Moderate | Minor |
|---|----------|----------|-------|
| **Daily/Per-project** | P3.2 (copy-paste workflow at $150/hr), P3.3 (reputation risk) | P3.1 (listing inconsistency), P3.5 (millimeter margins) | P3.6 (no batch export) |
| **Per-incident** | P3.4 (aggressive rounding) | P3.7 ("approximately" liability) | |
| **Rare** | | | |

### Root Cause Analysis — Top 2 Pains

**P3.2: Manual copy-paste-convert workflow**
1. Why manual copy-paste? Amazon has no API for dimension data; it's embedded in HTML with inconsistent formatting.
2. Why inconsistent formatting? Sellers use varied templates (L x W x H vs. W x D x H, quotation marks vs. "inches").
3. Why does this matter? Her CONVERT() formulas break on format variations, requiring manual correction.
4. Why not use an extension? Existing extensions round too aggressively (no 1+ decimal places) and create false positives.
5. **Root cause:** No tool offers professional-grade precision (1+ decimals) with format-agnostic parsing of Amazon's inconsistent dimension layouts.

**P3.3: Professional reputation at stake**
1. Why reputation risk? A wrong-size delivery to a client damages trust and loses referrals.
2. Why wrong-size deliveries? Conversion errors compound when manually processing 30-50 products per project.
3. Why so error-prone? The workflow is manual, repetitive, and fatiguing — humans make mistakes at volume.
4. Why not delegate? "That's my professional liability, not theirs." She won't trust a VA with precision work.
5. **Root cause:** The conversion workflow is high-volume, high-precision, and high-stakes — a combination that demands automation, but no automation meets her precision standard.

### HMW Statements
1. How might we help Priya verify product fit for client spaces without manual conversion workflows?
2. How might we help Priya trust automated conversions enough to eliminate her "knot in the stomach" anxiety?
3. How might we help Priya create client-ready metric spec sheets without copy-paste labor?

### Unmet Need
**Fit-check against known room dimensions** — enter room dimensions once, see green/red indicators on every product. "That would genuinely change how I work." No tool offers this.

---

## Persona 4: Erik V. (Swedish CS Student, Gothenburg) — SKEPTIC

### Pain Inventory

| # | Pain | Evidence | Source |
|---|------|----------|--------|
| P4.1 | Every converter uses naive regex (false positives) | "12V power supply" → metric nonsense. "2h24m30s" → centimeters. "No semantic understanding." | Interview Q |
| P4.2 | Low-frequency friction (2-3x/month) | 4+ terminal invocations per page, 12+ on comparison pages. "Not painful, just friction." | Interview Q |
| P4.3 | 4 extensions tried, all failed | Everything Metric, autoConvert, Imperial to Metric, Metrication — each failed differently. Bar for 5th is "extremely high." | Interview Q |
| P4.4 | Extensions destroy source data | Metrication replaced imperial values. "You should never destroy the source data." "Cardinal sin." | Interview Q |
| P4.5 | Privacy and permissions concerns | "An extension that reads page content has access to everything." Wants privacy policy, minimal permissions. | Interview insight |
| P4.6 | No Firefox support from most extensions | "I probably won't use it anyway because I use Firefox." Hard blocker. | Interview insight |
| P4.7 | Performance anxiety on heavy pages | "What's the performance impact on a 50+ item comparison page?" Benchmarks extensions. 50ms budget. | Interview insight |

### Severity Matrix

| | Critical | Moderate | Minor |
|---|----------|----------|-------|
| **Per-use** | P4.1 (false positives) | P4.4 (source data destruction), P4.7 (performance) | P4.2 (low-frequency friction) |
| **Adoption gate** | P4.5 (privacy/permissions), P4.6 (Firefox) | P4.3 (extension fatigue/trust deficit) | |
| **Rare** | | | |

### Root Cause Analysis — Top 2 Pains

**P4.1: Every converter uses naive regex**
1. Why naive regex? Measurement detection is treated as a simple text-matching problem.
2. Why simple text-matching? Building semantic context analysis (is "12" a measurement or a voltage?) requires understanding the surrounding DOM/text.
3. Why don't extensions do this? It's significantly harder to build and most are weekend projects.
4. Why weekend projects? Low monetization potential for converter extensions doesn't justify deep engineering investment.
5. **Root cause:** The converter extension market lacks economic incentive for deep semantic engineering, resulting in tools that optimize for coverage (convert everything) over precision (convert only measurements).

**P4.5: Privacy and permissions concerns**
1. Why privacy concern? Extension has access to full page content including cart, browsing behavior.
2. Why full page access? Most extensions request "all websites" for broader coverage.
3. Why not scope to Amazon? Lazy permission requests; scoping requires more development work.
4. Why does this matter to Erik? He's technically aware of what permissions enable and has been burned by extensions before.
5. **Root cause:** Extensions over-request permissions for convenience, eroding trust among technically sophisticated users who understand the real access implications.

### HMW Statements
1. How might we help Erik trust a conversion tool when four predecessors have failed him?
2. How might we build conversion intelligence that Erik's technical scrutiny validates rather than rejects?

### Unmet Need
**Semantic measurement detection** — context-aware conversion that understands "12V" is voltage, "2h30m" is time, and "12 inches" is length. No existing tool achieves this.

---

## Persona 5: Yuki S. (Japanese Product Researcher, Osaka)

### Pain Inventory

| # | Pain | Evidence | Source |
|---|------|----------|--------|
| P5.1 | Cross-marketplace comparison is arithmetic nightmare | Same SSD: "77 x 57 x 13 mm" (JP) vs. "3.03 x 2.24 x 0.51 inches" (US). 5 min/product x 5 products = 25+ min. | Interview Q |
| P5.2 | Calculator fatigue from volume of conversions | 50-60 calculator ops per session. "By the end I have a headache." Sticky notes with converted dims. | Interview Q |
| P5.3 | Costly mistake from unit context error | Monitor arm "up to 27 inches" = screen diagonal, not width. Didn't fit 32" monitor. 8,000 yen return. | Interview Q |
| P5.4 | Existing tools don't support multi-marketplace workflow | FlyUnits: select → right-click → submenu per conversion (unworkable at 50+). "Unit Converter" didn't work on Amazon JP at all. | Interview Q |
| P5.5 | No Amazon JP support in any tool | "If there are zero Japanese reviews, I worry Amazon JP won't work." Her workflow starts on JP. | Interview insight |
| P5.6 | Pain extends beyond length (fl oz, lbs, screen diagonals) | "The inch-based screen diagonal convention is honestly one of the most confusing things in global electronics." | Interview insight |
| P5.7 | Mobile is part of workflow but unsolved | Has both Amazon JP and US apps on phone. No mobile conversion solution. | Surprise finding |
| P5.8 | "Multiply or divide?" directional anxiety | Made mistakes both ways (in→mm and mm→in). Every conversion carries doubt. | Interview Q |

### Severity Matrix

| | Critical | Moderate | Minor |
|---|----------|----------|-------|
| **Weekly** | P5.1 (cross-marketplace comparison), P5.2 (calculator fatigue) | P5.8 (directional anxiety) | P5.6 (non-length units) |
| **Per-incident** | P5.3 (unit context error) | P5.4 (tool workflow mismatch) | |
| **Adoption gate** | P5.5 (no Amazon JP support) | P5.7 (no mobile solution) | |

### Root Cause Analysis — Top 2 Pains

**P5.1: Cross-marketplace comparison is arithmetic nightmare**
1. Why arithmetic? Same product uses different units on different Amazon marketplaces.
2. Why different units? Each marketplace localizes to its country's measurement system.
3. Why no unified view? Amazon has no cross-marketplace product comparison feature.
4. Why doesn't a tool normalize this? No extension operates across multiple Amazon domains simultaneously.
5. **Root cause:** Amazon marketplaces are isolated measurement silos with no cross-marketplace normalization, and no extension has bridged this gap.

**P5.2: Calculator fatigue from conversion volume**
1. Why so many conversions? She compares 5+ products across 2-4 marketplaces, each with 3-6 dimensions.
2. Why manual calculator? No tool converts inline on Amazon pages across marketplaces.
3. Why doesn't she use a spreadsheet? She does, but input is still manual copy-paste.
4. Why so many products? Cross-border shopping requires comparing availability, price, and specs across marketplaces to find the best deal.
5. **Root cause:** Cross-border shopping inherently multiplies conversion volume by the number of marketplaces compared, and no tool automates this high-volume workflow.

### HMW Statements
1. How might we help Yuki compare products across Amazon marketplaces without unit arithmetic?
2. How might we help Yuki shop cross-border with the joy of treasure hunting instead of the stress of calculation?
3. How might we help Yuki feel confident about conversion direction (multiply vs. divide) without checking twice?

### Unmet Need
**Cross-marketplace unit normalization** — standardize dimensions across Amazon US/JP/UK/DE into one unit system for direct comparison. No tool offers this.

---

## Cross-Persona Analysis

### Cross-Persona Pain Ranking

Pains ranked by **(Frequency x Severity x Persona Count)**. Persona count = number of personas experiencing this pain.

| Rank | Pain | Personas | Freq x Sev | Score |
|------|------|----------|------------|-------|
| 1 | **False positives / page corruption from naive conversion** | Lena, Mateo, Erik, Priya, Yuki (5/5) | Weekly x Critical | **TOP** |
| 2 | **Context-switching / cognitive overhead from manual conversion** | Lena, Mateo, Priya, Yuki (4/5) | Daily-Weekly x Critical | High |
| 3 | **Costly purchase mistakes from conversion errors** | Lena, Mateo, Priya, Yuki (4/5) | Per-incident x Critical | High |
| 4 | **Compound dimension parsing failure (L x W x H)** | Mateo, Priya, Yuki (3/5) | Weekly x Moderate | Medium-High |
| 5 | **Source data destruction (replacing original values)** | Lena, Erik, Priya (3/5) | Adoption gate x Critical | Medium-High |
| 6 | **Pain extends beyond length units (temp, weight, volume)** | Lena, Mateo, Yuki (3/5) | Daily x Minor | Medium |
| 7 | **No mobile conversion solution** | Lena, Yuki (2/5) | Weekly x Moderate | Medium |
| 8 | **Performance degradation on Amazon pages** | Mateo, Erik (2/5) | Per-use x Moderate | Medium-Low |
| 9 | **Excessive permissions / privacy concerns** | Mateo, Erik (2/5) | Adoption gate x Critical | Medium-Low |
| 10 | **No multi-marketplace support** | Yuki (1/5) | Weekly x Critical | Segment-specific |
| 11 | **Insufficient precision (rounding)** | Priya (1/5) | Per-use x Critical | Segment-specific |

### Universal Pains vs. Segment-Specific Pains

**Universal Pains** (3+ personas — solve these first):

| Pain | Type | Personas |
|------|------|----------|
| False positives / page corruption | Trust blocker | All 5 |
| Context-switching from manual conversion | Core workflow | Lena, Mateo, Priya, Yuki |
| Costly purchase mistakes from errors | Financial consequence | Lena, Mateo, Priya, Yuki |
| Compound dimension parsing (L x W x H) | Feature gap | Mateo, Priya, Yuki |
| Source data destruction (replacing imperial) | Adoption dealbreaker | Lena, Erik, Priya |
| Pain beyond length units (temp, weight, vol) | Scope expansion | Lena, Mateo, Yuki |

**Segment-Specific Pains** (1-2 personas — solve later or use for differentiation):

| Pain | Persona | Segment |
|------|---------|---------|
| No multi-marketplace support (JP/UK/DE) | Yuki | Cross-border power shoppers |
| Insufficient decimal precision | Priya | Professional/precision users |
| No mobile conversion solution | Lena, Yuki | Mobile shoppers |
| Firefox-only browser | Erik | Technical/open-source users |
| Batch export to CSV | Priya | Professional workflow users |
| Fit-check against room dimensions | Priya | Interior design professionals |
| No Amazon JP/format support | Yuki | Japanese market users |
| Cultural/identity friction from imperial | Mateo | Immigrants in imperial countries |

### The One Pain to Solve First

**False positives / page corruption from naive conversion.**

**Why this one:**

1. **It's the universal adoption gate.** All 5 personas — including the skeptic — cite false positives as the #1 reason they abandoned previous tools. Lena uninstalled after 1 week. Mateo uninstalled within 1 hour. Erik's bar is zero false positives in 30 days. Priya went back to spreadsheets. Yuki gave up entirely. Every persona has been burned.

2. **It blocks all other value.** Even perfect precision, great UI, and fast performance are worthless if the extension converts "12V" into metric, turns review counts into kilograms, or mangles model numbers. Trust is prerequisite to retention.

3. **It's the root cause of competing tool failure.** Every competitor failed here: Everything Metric (review counts, addresses, model numbers), autoConvert (timestamps), Metrication (source data replacement). The market has trained users to expect failure. Solving this is the only way to overcome learned distrust.

4. **It's technically foundational.** Semantic measurement detection (knowing what IS a measurement) must be built before any feature that displays conversions. It's not a feature — it's the foundation.

5. **One false positive = product death.** Erik: "One false positive in 30 days = uninstall." Lena: "Uninstalls within 5 minutes of any visual glitch." The tolerance is zero. Getting this wrong makes everything else irrelevant.

**Solve this, and the product earns the right to solve everything else.**

---

### HMW Summary — Top 5 Statements Ranked by Impact

| Rank | HMW Statement | Impact Rationale |
|------|---------------|------------------|
| 1 | **How might we convert only actual measurements — never model numbers, voltages, timestamps, or review counts — so users trust what they see?** | Solves #1 universal pain (false positives). Prerequisite for adoption across all 5 personas. |
| 2 | **How might we show metric conversions inline alongside original imperial values so users can evaluate products without leaving the page?** | Solves #2 universal pain (context-switching) while respecting #5 universal requirement (dual-unit display). Benefits 4/5 personas daily. |
| 3 | **How might we parse compound dimensions ("72 x 36 x 18 inches") as a single unit so multi-dimension products convert correctly?** | Solves #4 universal pain. Prevents the purchase errors that cost Mateo $89 and Yuki 8,000 yen. Enables Priya's professional workflow. |
| 4 | **How might we help Priya verify product fit for client spaces without manual conversion so her reputation is never at risk?** | Targets primary persona directly. Highest WTP, strongest word-of-mouth, biggest time savings ($200/week). |
| 5 | **How might we help Yuki compare the same product across Amazon US, JP, and UK in normalized units so cross-border shopping feels like treasure hunting again?** | Unlocks cross-border segment. Unique differentiator no competitor offers. Premium feature with clear WTP. |

---

## Summary of Critical Findings

1. **Trust before features.** False positives killed every competitor. Semantic measurement detection is the #1 technical challenge and the #1 product requirement.

2. **Dual-unit display is non-negotiable.** All 5 personas demand original + converted values shown together. Replacing imperial values is a universal dealbreaker.

3. **The pain is emotional, not just functional.** Lena feels like a "second-class customer." Mateo ties it to immigrant identity. Priya carries professional anxiety. Yuki loses the joy of shopping. The product must address the emotional dimension, not just the arithmetic.

4. **Compound dimensions are the hidden complexity.** "72 x 36 x 18 inches" must be parsed as one unit. Most tools fail here, causing the exact purchase errors personas describe.

5. **One-time payment preferred universally.** All 5 personas (including $0 Erik) prefer one-time purchase over subscription. Pricing model should lead with one-time, not monthly.
