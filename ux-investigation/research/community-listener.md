# Community Listener Report: Imperial-to-Metric Conversion on Amazon

**Research Date:** 2026-03-05
**Researcher:** community-listener (UX Research Phase 1)
**Product:** Amazon Imperial to Metric Chrome Extension

---

## Sources Investigated (8 sources)

1. **Chrome Web Store** - Reviews for Everything Metric, Amazon Weight Converter, autoConvert, Magic Convert, and other unit converter extensions
2. **Mozilla Firefox Add-ons** - Reviews for Everything Metric (Auto Unit Converter) -- 50 reviews, 4.56 avg rating
3. **Amazon Seller Central Forums** - Threads on measurement unit confusion (US, UK, EU, CA)
4. **Amazon Community Forums (CA)** - Discussions about metric/imperial display on Amazon.ca
5. **GitHub Repositories** - Issues and READMEs for imperial-to-metric-chrome-extension (esprimo), Everything-Metric (m1l), metric_units_reddit_bot (cannawen), and metric-chrome-extension (kmturley)
6. **Hacker News** - Discussions on unit conversion tools (Show HN: Online Unit Converter, imperial system debates)
7. **Bored Panda / Twitter** - Viral thread by Innes McKendrick on imperial system frustrations (high engagement)
8. **Amazon Seller Central Europe** - Seller discussions on listing in inches vs centimeters across markets

---

## Key Findings (8 bullets)

1. **Amazon does NOT offer metric toggle for buyers.** Amazon.com displays product dimensions exclusively in inches/pounds. Amazon.ca and Amazon.co.uk sometimes show metric, but inconsistently. There is no user-facing setting to switch units, forcing international buyers to convert manually every time.

2. **Existing extensions have significant gaps.** Everything Metric (the market leader at 4.56 stars, ~50 Firefox reviews) suffers from false positives, failure to parse ranges like "2-3 feet," NaN errors on negative temperatures, and no way to see original values after conversion. Multiple extensions are archived/abandoned (esprimo's extension archived Feb 2023).

3. **The demand is real and persistent.** Multiple independent developers have built the same tool: at least 6 separate GitHub repos for imperial-to-metric Chrome extensions exist, plus Reddit bots (metric_units_reddit_bot with 76 stars, 24 contributors), Discord bots (DiscordUnitCorrector), and Firefox add-ons -- all solving the same unmet need.

4. **Recipes and shopping are the two killer use cases.** Users specifically mention cooking/recipe sites and Amazon/shopping as the primary contexts where imperial units cause friction. SpitFire-666: "My partner will appreciate it too as she comes across many yankee recipes."

5. **Amazon sellers face the reverse problem.** EU/UK sellers must list in cm but serve US customers who expect inches. One seller noted: "I've always listed in mm with cms in brackets. Seems to work well for the UK, European and most other countries. I only ever seem to run into some issues with customers in the US."

6. **Frustration is emotionally charged.** Language across sources is strong: "freedumb units," "stupid imperial units," "sadistic horrorshow," "utter shitshow." This isn't mild inconvenience -- users feel genuine anger at being forced to mentally convert.

7. **Manual Google conversion is the dominant workaround.** Users report opening Google or calculator apps to convert units mid-shopping. HN user eitally expressed the gap: "I'd love this as a browser extension. Cloudy Calculator can do a lot of it but was recently deprecated."

8. **Amazon's inconsistent unit handling creates seller-side chaos too.** Amazon's system has been reported mixing up kg/lbs (entering 500g as 50KG), switching seller dashboards from imperial to metric "without warning," and using different unit standards across regional marketplaces with no clear documentation.

---

## User Types Observed

### 1. The International Online Shopper
- **Location:** Europe, Australia, Canada, most of the world
- **Behavior:** Shops on Amazon.com (largest selection/best prices) despite being in a metric country
- **Pain:** Every product dimension, weight, and measurement is in inches/feet/pounds
- **Frequency:** Encounters this friction on virtually every product page

### 2. The Recipe/DIY Browser
- **Location:** Metric countries
- **Behavior:** Browses US cooking sites, sewing patterns, DIY guides
- **Pain:** Cups, ounces, Fahrenheit, inches in fabric/craft measurements
- **Frequency:** Multiple times per week

### 3. The Expat / Bilingual Unit User
- **Location:** US-based from metric country, or metric-country-based consuming US content
- **Behavior:** Understands both systems but prefers metric for precision
- **Pain:** Cognitive load of constant mental conversion; making purchase mistakes

### 4. The Technical/Developer User
- **Location:** Global
- **Behavior:** Builds or uses browser extensions to solve the problem
- **Pain:** Existing solutions are buggy, abandoned, or have too many false positives
- **Frequency:** Power user who wants a reliable, always-on solution

### 5. The Amazon Seller (Cross-Market)
- **Location:** EU/UK/CA selling on Amazon.com or vice versa
- **Behavior:** Needs to list products across marketplaces with different unit expectations
- **Pain:** Amazon's inconsistent unit handling, surprise metric/imperial switches

---

## Top Pain Points (from real people)

1. **No native metric option on Amazon.com** -- Users cannot toggle units on product pages. This is the root cause of all friction.

2. **Existing conversion extensions are unreliable** -- False positives corrupt page content; range formats ("2-3 feet") break; negative values produce NaN; no way to see original values.

3. **Cognitive overhead of manual conversion** -- Every shopping session requires pulling up Google/calculator to convert dimensions, breaking the browsing flow.

4. **Wrong-size purchases due to unit confusion** -- Users misjudge product dimensions when mentally converting, leading to returns and frustration.

5. **Extension abandonment** -- The most popular open-source extensions are archived or unmaintained, leaving users without updated solutions (especially post-Manifest v3 migration).

6. **Amazon's cross-marketplace inconsistency** -- Different Amazon domains use different unit systems with no clear conversion, confusing both buyers and sellers.

---

## Recurring Workarounds People Use Today

| Workaround | Source | Prevalence |
|---|---|---|
| **Google "X inches in cm"** | Multiple forums, HN | Very common -- the default behavior |
| **Install Everything Metric extension** | Firefox Add-ons, Chrome Web Store | Moderate -- ~50 reviews on Firefox, niche audience |
| **Mental math / estimation** | Implied across all sources | Universal but error-prone |
| **Use Amazon Weight Converter** | Chrome Web Store | Low -- Amazon-specific but 0 reviews |
| **Ask in product Q&A** | Amazon.ca, Amazon.co.uk | Occasional -- users ask "what is this in cm?" |
| **Maintain a physical conversion chart** | Amazon product listings (conversion magnet charts are bestsellers) | Niche -- people literally buy fridge magnets for this |
| **Use Reddit bots** | Reddit (metric_units_reddit_bot) | Common on Reddit -- bot had 76 stars, 24 contributors |

---

## Verbatim Quotes (with sources)

### Quote 1
> "Must-have, because too much of the internet is written in freedumb units."
>
> -- **BLKHS**, Firefox Add-ons review for Everything Metric (May 15, 2025)

### Quote 2
> "Works well 95% of the time with a few exceptions... is a life saver when trying to deal with stupid imperial units."
>
> -- **Ben Dover**, Firefox Add-ons review for Everything Metric (Sep 8, 2022)

### Quote 3
> "This is a lifesaver! My partner will appreciate it too as she comes across many yankee recipes."
>
> -- **SpitFire-666**, Firefox Add-ons review for Everything Metric (Sep 29, 2021)

### Quote 4
> "The utility provided by the extension is overshadowed by the amount of false positive noise."
>
> -- **Klaster_1**, Firefox Add-ons review for Everything Metric (Mar 11, 2024) [2-star review]

### Quote 5
> "When there's units like '2-3 feet' it will only convert the '3 feet' part."
>
> -- **Dark Thoughts**, Firefox Add-ons review for Everything Metric (Jan 22, 2025) [3-star review]

### Quote 6
> "I'd love this as a browser extension. Cloudy Calculator can do a lot of it but was recently deprecated as a result of the Manifest v2->v3 requirement from Google."
>
> -- **eitally**, Hacker News (Nov 12, 2024)

### Quote 7
> "Really good, I just wish there was a way to see the original measurements... and that it was available on android!"
>
> -- **cach_dies**, Firefox Add-ons review for Everything Metric (Aug 31, 2024) [4-star review]

### Quote 8
> "I've always listed in mm with cms in brackets. Seems to work well for the UK, European and most other countries. I only ever seem to run into some issues with customers in the US."
>
> -- **Seller_ANpkhFl1uuWCA**, Amazon Seller Central Europe Forum

### Quote 9
> "Has many many false positives... could be made much smarter... Disabled for now."
>
> -- **Firefox user 12667795**, Firefox Add-ons review for Everything Metric (Aug 29, 2024) [3-star review]

### Quote 10
> "Just look at the imperial system. Look at it. I would say, if anything, my reaction was not strong enough... imperial is an utter shitshow."
>
> -- **Innes McKendrick**, viral Twitter thread (Nov 2018, covered by Bored Panda)

---

## Competitive Landscape Summary

| Extension | Platform | Status | Rating | Key Weakness |
|---|---|---|---|---|
| Everything Metric | Chrome + Firefox | Active | 4.56/5 | False positives, range parsing, no original value display |
| autoConvert | Chrome | Active | Mixed | Odd behavior on some pages, tooltip-only display |
| Amazon Weight Converter | Chrome | Active | 0 reviews | Amazon-only, weight-only (no dimensions) |
| Imperial to Metric (esprimo) | Chrome | Archived 2023 | N/A | Abandoned, missing ft2, mph, temperature |
| Metrication | Firefox | Active | Unknown | Replaces original text (no way to see imperial) |
| Magic Convert | Chrome | Active | Unknown | Requires highlight/click, not automatic |

---

## Key Opportunity for Our Extension

The gap is clear: **no existing extension reliably converts imperial units to metric specifically on Amazon product pages without false positives.** Generic "all websites" converters struggle with Amazon's structured product data (dimensions tables, weight specs, bullet points). An Amazon-focused extension can:

1. Target known DOM elements (product dimensions, weight, bullet points)
2. Avoid false positives by understanding Amazon's page structure
3. Show both units (original + converted) without corrupting the page
4. Handle Amazon-specific formats (ranges, compound dimensions like "10 x 8 x 3 inches")
5. Work across Amazon domains (.com, .co.uk, .ca, .de, .com.au)
