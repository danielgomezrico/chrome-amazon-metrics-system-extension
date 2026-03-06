# Refined User Personas: Amazon Imperial to Metric Chrome Extension

**Date:** 2026-03-05
**Phase:** Post-Interview Refinement
**Inputs:** 5 draft personas + 5 simulated interviews (10 questions each)

---

## Executive Summary

- **Primary audience:** Metric-native adults who shop Amazon US regularly (weekly+) and experience cumulative cognitive fatigue from manual unit conversion — not a one-time annoyance but a chronic workflow tax.
- **Primary target persona:** Priya N. (interior designer) — highest WTP ($5-8/mo), most acute pain (professional reputation at stake), strongest word-of-mouth potential (industry networks), and conversion accuracy is a matter of career survival, not convenience.
- **This product is NOT for:** Low-frequency shoppers who convert 2-3x/month (Erik V. profile), users who have already built reliable personal workflows (terminal, macros), or users who simply avoid cross-border shopping entirely.
- **Biggest finding:** The pain is emotional, not just functional. Every persona independently raised the emotional dimension unprompted (Q10). Lena feels like a "second-class customer," Mateo ties it to immigrant identity, Priya carries professional anxiety, and Yuki says it turns "treasure hunting into stress." Trust is the #1 adoption gate — one false positive kills the product.
- **Critical design constraint:** All 5 personas demand dual-unit display (original + converted). Replacing imperial values is a dealbreaker across the board. Erik calls it a "cardinal sin."

---

## Persona 1

## Lena K., 29
*German UX designer who shops Amazon US weekly for products unavailable on Amazon.de*

**Location:** Berlin, Germany | **Income:** EUR 52K/yr | **Tech savviness:** 4/5 | **Decision authority:** Sole buyer for personal purchases | **Evidence:** market-analyst, community-listener, competitor-analyst, social-analyst, academic-researcher

### Goals
- **Primary:** Purchase confidently from Amazon US without second-guessing whether items will fit her apartment
- **Secondary:** Eliminate the context-switching overhead of tab-switching to Google converter 10-20 times per session
- **Hidden:** She wants Amazon US to feel as natural as Amazon.de. The measurement gap makes her feel like a second-class customer on the world's biggest marketplace.

### Pain Points
- **Biggest:** Zero spatial intuition for imperial. "I open the product page and it says '55 by 28 inches.' I just stare at it. I have zero intuition for what that means in my apartment." She must convert every dimension before she can even begin evaluating a product.
- **Daily friction:** Context-switching destroys her shopping flow. "It's like reading a book in a foreign language and you have to look up a word every other sentence. You lose the story." She converts 10-20 dimensions per session, forgetting earlier conversions by the time she finishes.
- **Costly mistake:** Ordered a bookshelf, rushed mental math on "62 inches," ended up 15 cm too short. International return cost EUR 45 — more than the shipping. "That mistake cost me 45 euro in return shipping. So no more mental math."
- **Tool failure:** Everything Metric converted review counts ("4,200 reviews" became "1,905 kg") and street addresses. "The Amazon product pages looked broken, like corrupted almost. I'm a designer — I notice these things and they drive me insane." Gave it a week, then disabled.

### Interview Insights
1. **Retention system exists:** She built a Notion table called "Amazon Wishlist" with columns for product name, imperial dims, converted dims, and "fits?" — because she got tired of re-converting products she revisited. This is a hack the extension could eliminate.
2. **Social amplification is immediate:** Has a WhatsApp group called "US Shopping Finds" with 8 people all experiencing the same pain. "I would message my friend group immediately" upon finding a working tool.
3. **Mobile is an unsolved gap:** "I sometimes browse Amazon on my phone and there's absolutely no solution for converting measurements there. At least on desktop I can have my Google converter tab. On mobile I'm completely lost."
4. **Scope beyond length:** Fahrenheit in product descriptions (heated blankets, coolers) and weight (shipping estimates) are also painful. "The problem is bigger than just inches to centimeters."
5. **One-time payment preferred:** "I hate subscriptions for small tools." Would prefer EUR 10-15 one-time over EUR 2-3/month subscription.

### Behaviors
- **Workaround:** Permanent Google converter tab open alongside Amazon. Sometimes uses phone calculator from the couch. Built a Notion table to avoid re-converting products.
- **Tools:** Amazon.com, Amazon.de (fallback), Google converter, Notion, iOS Measure app (for apartment spaces)
- **Communities:** r/BuyItForLife, r/ApartmentDesign, German Amazon shopper Facebook groups, WhatsApp "US Shopping Finds" (8 members)
- **Decision triggers:** Chrome Web Store ratings (below 4 stars = won't install). Needs screenshots of real Amazon pages, not generic demos. Uninstalls within 5 minutes of any visual glitch.

### In Their Own Words
> "It's like reading a book in a foreign language and you have to look up a word every other sentence. You lose the story. That's what happens to me with Amazon US. I lose the shopping experience."

> "The page looked broken, like corrupted almost. I'm a designer — I notice these things and they drive me insane."

> "There's this feeling of being a second-class customer on Amazon US. The whole site is built for Americans and the rest of us just have to deal with it."

### Product Fit
- **Why choose:** Amazon-specific scope means fewer false positives than Everything Metric. Inline dual-unit display eliminates tab-switching entirely. If it "just works" without page corruption, she installs permanently and tells 8 people immediately.
- **Why walk away:** Any non-measurement number converted (addresses, model numbers, prices, review counts). Page load slowdown. Original imperial values hidden instead of shown alongside metric. Broad permissions ("all websites" = spyware fear from past bad experience).
- **WTP:** Free tier to start. EUR 2-3/month or preferably EUR 10-15 one-time purchase. Would upgrade for multi-marketplace (eBay, Walmart) or weight/temperature conversion.

### Surprises
- She already invested significant effort building a Notion-based conversion tracking system — the pain is severe enough to justify building personal tooling, even for a non-technical user.
- Her mother's response is to simply refuse to buy from Amazon US entirely: "If they can't show me centimeters, I don't need the product." This represents lost market demand Amazon never sees.
- She wants a visual indicator (subtle highlight or "cm" badge) showing which numbers were converted — her UX designer instincts demand conversion feel native to the page, not overlaid.

---

## Persona 2

## Mateo R., 34
*Colombian software engineer who immigrated to Austin, TX three years ago and shops Amazon daily*

**Location:** Austin, TX, USA | **Income:** $95K/yr | **Tech savviness:** 5/5 | **Decision authority:** Primary household buyer (family of 3) | **Evidence:** market-analyst, community-listener, competitor-analyst, academic-researcher

### Goals
- **Primary:** Eliminate the daily cognitive tax of living in an imperial country — he wants his browser to "speak metric" so he can think in his native measurement language
- **Secondary:** Stop making purchase mistakes from rushed mental math — the $89 shelf that didn't fit the garage alcove because he rounded wrong on one dimension
- **Hidden:** Measurement conversion is an identity friction. "Every time I have to convert inches to centimeters, I'm reminded that this country wasn't designed for me." He wants to preserve his metric intuition for himself and his daughter.

### Pain Points
- **Biggest:** Constant micro-context-switches. "It's like a micro-context-switch, and if you're a developer you know how expensive those are." Not one hard conversion — dozens of small ones daily across Amazon, Home Depot, recipes, weather. Death by a thousand cuts.
- **Daily friction:** Three separate "Hey Siri" calls for one product page. His wife asks him to convert cups and ounces while he's mid-conversion on Amazon. The interruptions compound. "By the time I've converted three dimensions, I've forgotten which product I was comparing against."
- **Costly mistake:** Shelf listed as "72 x 36 x 18 inches." Rounded wrong on one dimension, switched width and depth mentally. Didn't fit the alcove. Final sale — $89 lost. "Three centimeters cost me $89 I couldn't get back."
- **Tool failure:** autoConvert made Amazon pages take 8 seconds to load. Then converted a timestamp "2h30m" into centimeters. "Qué es esta vaina" — uninstalled within an hour.

### Interview Insights
1. **Trust hierarchy: GitHub > Chrome Web Store.** "I weigh the GitHub activity more. Stars, recent commits, whether the README is well-written — that tells me if a real developer maintains it." He checks code quality before install.
2. **Price anchor is $0.** "Siri is free. Calculator apps are free. The broken extensions I tried were free. So the bar for paid is very high." Would pay $2-3 one-time max, not subscription. Draft persona's "$5/month" was too high.
3. **WhatsApp distribution channel:** ~40 people in his Colombian expat group who share the exact same pain. "I would send it to my WhatsApp group that same day." But reputational risk: if one person has a bad experience, he looks bad.
4. **Whole-system problem:** Temperature ("78 degrees means nothing to me viscerally"), weight (pounds for body weight, ounces for food), volume. "It's the whole system, not just inches."
5. **Immigrant identity dimension:** His daughter is becoming "bi-measurement" — he wants her to maintain metric intuition. This is about cultural preservation, not just convenience.

### Behaviors
- **Workaround:** "Hey Siri" multiple times daily. iOS Calculator for compound conversions. Notes app cheat sheet with common conversions. Occasionally checks Amazon Mexico for metric listings.
- **Tools:** Amazon Prime (heavy user), Siri, iOS Calculator, Amazon.com.mx (metric fallback), Notes app
- **Communities:** Colombian expat WhatsApp group (~40 members), r/expats, Austin tech meetups
- **Decision triggers:** GitHub repo is mandatory. Checks permissions carefully — "read all website data" = instant close. Open source strongly preferred. Needs minimal permissions scoped to Amazon only.

### In Their Own Words
> "It's like reading a book through Google Translate. You get the meaning, but you lose the feel."

> "Three centimeters cost me $89 I couldn't get back."

> "Every time I have to convert inches to centimeters, I'm reminded that this country wasn't designed for me. It's small, but it accumulates."

### Product Fit
- **Why choose:** Focused tool that does one thing well. Amazon-specific scope won't interfere with dev tools. If open source with narrow permissions and fast page loads, he'd adopt immediately.
- **Why walk away:** "Read all website data" permissions. Closed source with no GitHub repo. Doesn't handle compound dimensions ("10 x 8 x 3 inches"). Any false positive (timestamp, model number, voltage). Page load impact.
- **WTP:** Expects free if open source. Max $2-3 one-time purchase. Subscription is a hard no — "Subscriptions for a browser extension? No way." Draft's "$5/mo" was aspirational, not real.

### Surprises
- His wife Laura is a non-technical metric user who asks him to convert cooking measurements daily — she represents a large silent-sufferer segment with no workaround beyond asking someone.
- He explicitly compares measurement conversion friction to context-switching cost in programming — the metaphor reveals how seriously he views the cognitive overhead.
- Amazon Mexico is his "metric fallback" — he sometimes navigates to .com.mx just to see dimensions in cm, even when the price and shipping are worse. This reveals the severity of the pain.

---

## Persona 3

## Priya N., 41
*Australian interior designer sourcing US-exclusive furniture and fixtures for clients' metric-measured homes*

**Location:** Melbourne, Australia | **Income:** AUD 110K/yr (~$150/hr billable) | **Tech savviness:** 3/5 | **Decision authority:** Recommends products to clients; client makes final purchase | **Evidence:** market-analyst, community-listener, competitor-analyst, academic-researcher, social-analyst

### Goals
- **Primary:** Get exact metric dimensions (1+ decimal places) for US products to verify fit in client floor plans with zero margin for error
- **Secondary:** Reclaim 90+ minutes/week of billable time currently spent on manual copy-paste-convert workflows
- **Hidden:** Protect her professional reputation. A wrong-size delivery to a client doesn't cost a return fee — it costs referrals. "That designer lost three referrals over it. Three. In this industry, your reputation is everything."

### Pain Points
- **Biggest:** The data trust problem. Amazon listings have inconsistent dimensions — one listing showed "55.9 inches" in the specs table and "56.2 inches" in the bullet points. She spent 20 minutes investigating, then waited 3 days for a seller reply while her client asked "have you found the sideboard yet?"
- **Daily friction:** Manual copy-paste from Amazon into a Google Sheets template with CONVERT() formulas. 30-50 products per project, 3-6 dimensions each. "My hourly rate is $150, and I'm spending it on copy-paste work that a computer should handle." Amazon's inconsistent formatting (L x W x H vs. W x D x H, quotation marks vs. spelled out "inches") breaks her formulas.
- **Costly mistake (near-miss):** Found a sideboard for a 142cm alcove. Conversion showed 141.986 cm — 0.14 cm clearance per side, before accounting for skirting boards. The margin for error in her work is measured in millimeters.
- **Tool failure:** Everything Metric rounded aggressively — showed "140 cm" when actual was 141.7 cm. "That 1.7 cm matters enormously when you're fitting furniture into an alcove." Also converted model numbers and prices, making listings unreadable. Spreadsheet is clunky but she trusts it because she controls precision.

### Interview Insights
1. **Competitor hired a VA to do conversions.** Colleague Sarah (kitchen/bath designer) pays a VA $8/hr to build metric spec sheets. Priya considered it but won't delegate precision — "that's my professional liability, not theirs." This shows willingness to pay real money to solve this pain.
2. **The anxiety is physical.** "Every time I send a client a product recommendation with dimensions, I feel a knot in my stomach. Did I copy the right number? Did I convert it correctly? Did Amazon list it wrong?" This is not a convenience problem — it's a stress problem.
3. **The killer feature is "fit check."** She wants to enter room dimensions once and see green tick / red cross on every product as she browses. Nobody's built this. It would "genuinely change how I work."
4. **Batch export is the premium hook.** Flag 10 products, export all metric dimensions to CSV for client proposals. "That would save me another hour per project."
5. **One-time purchase preferred over subscription.** "Subscription fatigue is real." AUD 25-30 one-time > $5-8/month, even though both are affordable.

### Behaviors
- **Workaround:** Google Sheets template (2+ years refined) with CONVERT() formulas. Screenshots Amazon pages and annotates in Figma with metric values. Laser measure (Bosch Bluetooth) for room dimensions — ironic precision gap between her millimeter-accurate room data and Amazon's "approximately 22 inches."
- **Tools:** Amazon US, Amazon AU, Google Sheets, Figma, Pinterest, Bosch laser measure app
- **Communities:** Australian Interior Design Association (AIDA), Houzz, Pinterest business groups, supplier WhatsApp groups
- **Decision triggers:** Must see it working correctly on 5-6 known products she can cross-check. Word-of-mouth from other designers. Needs 1+ decimal places — rounding to whole cm is a dealbreaker.

### In Their Own Words
> "My hourly rate is $150, and I'm spending it on copy-paste work that a computer should handle."

> "Every time I send a client a product recommendation with dimensions, I feel a knot in my stomach."

> "That designer lost three referrals over it. Three. In this industry, your reputation is everything, and it can be undone by 3 centimetres."

### Product Fit
- **Why choose:** If it handles Amazon's L x W x H format natively, shows both units inline with 1+ decimal places, and works reliably for weeks without breaking on a single page — she'd adopt and recommend through AIDA networks.
- **Why walk away:** Rounding to nearest cm (needs 1+ decimal). Replacing original values (needs both shown). Asking for permissions beyond Amazon domains. No visible update history (abandoned extension fear). Mockup screenshots instead of real Amazon pages.
- **WTP:** $5-8/month or preferably AUD 25-30 one-time. Would pay $15/month if it included fit-check and batch CSV export. Free tier must be functional, not crippled.

### Surprises
- Her husband (civil engineer) wrote her a Python script once — it broke the first time Amazon changed their page layout. This highlights the fragility of custom solutions and the need for maintained tooling.
- She calls Amazon's "approximately" in dimension listings a direct professional threat. The word "approximately" on a product she's recommending to a client creates liability.
- A colleague's competitor lost 3 client referrals over a 3cm measurement error. The stakes in her world are real career damage, not just return shipping fees.

---

## Persona 4

## Erik V., 26
*Swedish CS student and open-source contributor who has tried and abandoned 4 different converter extensions*

**THIS IS THE SKEPTIC PERSONA — may NOT adopt the extension.**

**Location:** Gothenburg, Sweden | **Income:** SEK 180K/yr (student + freelance) | **Tech savviness:** 5/5 | **Decision authority:** Personal purchases only | **Evidence:** community-listener, competitor-analyst, social-analyst, academic-researcher

### Goals
- **Primary:** Find a unit converter that doesn't make things *worse* — zero false positives, zero page corruption, zero performance degradation
- **Secondary:** Stop babysitting conversion tools — if he has to verify the extension's output, it's adding work, not removing it
- **Hidden:** He enjoys building tools more than using others'. Part of him wants extensions to fail so he has an excuse to build his own. He has a shell alias (`ic 48`) that's faster than any extension he's tried.

### Pain Points
- **Biggest:** Every converter uses naive regex with no semantic understanding. "It converted a '12V power supply' description into some metric nonsense." And autoConvert turned "2h24m30s" into centimeters. "That's when I realized these tools are just running regex patterns with no semantic understanding of what they're matching."
- **Daily friction:** Low frequency (shops Amazon US 2-3x/month), but when he does, it's 4+ terminal invocations per product page — and on comparison pages, 12+ conversions. "It's not painful, it's just... friction."
- **No financial loss:** Doesn't buy enough to have costly mistakes. His skepticism is technical, not emotional. The bar for trying a 5th extension is "extremely high."
- **Tool failure history:** 4 extensions tried and uninstalled: Everything Metric (false positives on model numbers/voltages), autoConvert (timestamp-to-cm conversion + slow), Imperial to Metric by esprimo (archived, stopped working), Metrication (destroyed original values — "cardinal sin").

### Interview Insights
1. **Firefox user — Chrome is excluded.** "I probably won't use it anyway because I use Firefox." This was not in the draft. The extension must support Firefox (or at minimum work via Firefox extension compat) to reach him.
2. **"Zero false positives" is the literal threshold.** "It would have to survive a month on my browser without a single false positive. That's my bar." One false positive in 30 days = uninstall.
3. **Performance budget is 50ms.** "What's the performance impact on a product comparison page with 50+ items?" He's thinking about worst-case DOM scanning, lazy-loaded content, MutationObserver patterns. He'd benchmark the extension.
4. **Privacy is a dealbreaker.** "An extension that reads page content has access to everything on that page — my browsing behavior, what I'm shopping for, my cart contents. What data does it collect? Does it phone home?" Needs a privacy policy.
5. **Would recommend to non-technical people first.** "I'd recommend it to my mom's setup and my girlfriend before I'd recommend it to my programmer friends." His role is gatekeeper — if he approves it, he becomes an installer/advocate for his non-technical circle.

### Behaviors
- **Workaround:** Shell alias `ic 48` → `python3 -c "import sys; print(float(sys.argv[1]) * 2.54)"`. Has Pythonista on phone. Considered writing a Tampermonkey script but "the effort-to-benefit ratio doesn't justify it."
- **Tools:** Firefox (not Chrome), GitHub, VS Code, Python, terminal, Tampermonkey
- **Communities:** r/programming, r/firefox, Hacker News, GitHub issues on converter repos
- **Decision triggers:** Reads source code. Checks: last commit date, open issues (specifically false positive reports), test coverage, Manifest version, permission scope. Won't install Manifest V2. Won't install without GitHub repo.

### In Their Own Words
> "These tools are just running regex patterns with no semantic understanding of what they're matching."

> "You should never destroy the source data." (On extensions that replace imperial values)

> "At this point my bar for trying a fifth extension is extremely high."

> "What data does it collect? Does it phone home? Does it have a privacy policy? These are dealbreakers."

### Product Fit
- **Why choose:** Only if: open source, GitHub with tests, minimal permissions (Amazon-only), < 50ms page load impact, zero false positives on first use, Manifest V3, and active maintenance (recent commits). The Amazon-only scope is a selling point — "smaller surface area means fewer bugs."
- **Why walk away:** Any false positive on first use = instant uninstall. Closed source = won't install. Chrome-only = can't use. No test suite = doesn't trust. Broad permissions = won't consider. "AI-powered" marketing without algorithm explanation = instant distrust.
- **WTP:** $0. Might donate EUR 5 one-time to an open-source project he respects. Philosophically opposed to paying for browser extensions. Would contribute code and quality bug reports instead.

### Surprises
- His roommate Axel has developed "intuitive inch sense" — he doesn't convert at all, just guesses, and sometimes gets it wrong but doesn't care. This is a non-user archetype: people who absorb the loss rather than deal with conversion.
- He's on Firefox, not Chrome. This is a hard blocker — not a preference. The extension needs cross-browser strategy.
- He would be a force multiplier despite $0 WTP: he'd install it on his mom's and girlfriend's browsers, file quality bug reports, and potentially contribute code. His value is as quality gatekeeper and organic distribution channel, not revenue.

---

## Persona 5

## Yuki S., 32
*Japanese product researcher who comparison-shops across 4 Amazon marketplaces to find the best deals*

**Location:** Osaka, Japan | **Income:** JPY 5.5M/yr | **Tech savviness:** 3/5 | **Decision authority:** Household purchasing decisions (couple, no kids) | **Evidence:** market-analyst, community-listener, social-analyst, academic-researcher

### Goals
- **Primary:** Compare products across Amazon US, JP, and UK quickly — unit differences between marketplaces are the #1 remaining barrier after she solved currency conversion
- **Secondary:** Eliminate the "did I multiply or divide?" anxiety on every conversion — she's made mistakes both ways (inches-to-mm and mm-to-inches)
- **Hidden:** Cross-border shopping should be fun — "treasure hunting." The unit friction turns it into stress. She wants the joy back.

### Pain Points
- **Biggest:** Cross-marketplace comparison is a multi-dimensional nightmare. Same SSD listed as "77 x 57 x 13 mm" on Amazon JP and "3.03 x 2.24 x 0.51 inches" on Amazon US. Five minutes to verify it's the same product. Multiply by 5 products = 25+ minutes of pure arithmetic.
- **Daily friction:** 50-60 calculator operations per shopping session. "By the end I have a headache and I'm not even sure my spreadsheet is right." Sticky notes next to laptop with converted dimensions. Her partner Kenji "looks at me like I'm crazy."
- **Costly mistake:** Bought a monitor arm rated for "up to 27 inches" — thought it meant width, it was screen diagonal. Didn't fit her 32-inch monitor. International return from Japan cost ~8,000 yen (~$53). "Every time I buy something from Amazon US now, there's this little voice saying 'Did you check the dimensions? Are you sure?'"
- **Tool failure:** FlyUnits required select → right-click → submenu per conversion — unworkable for 50+ conversions. Bookmarked converter site was slower than calculator. "Unit Converter" extension didn't work on Amazon JP at all. Nothing handles her actual workflow.

### Interview Insights
1. **Amazon JP support is the #1 requirement.** "If there are zero Japanese reviews, I worry it wasn't built with Japanese users in mind and Amazon JP won't work properly." Her workflow starts on Amazon JP — if the extension doesn't work there, it's useless.
2. **The dream feature is cross-marketplace comparison.** "A side-by-side comparison mode where I can pin two products from different Amazon marketplaces and see their dimensions normalized." This is the premium feature that would unlock maximum WTP.
3. **LINE group = 40-person distribution channel.** "I would immediately share it in my LINE shopping group. That's forty people right there." But same reputational risk as Mateo — one broken page and she warns everyone away.
4. **Japanese payment norms matter.** One-time 1,000-1,500 yen (JPY) strongly preferred over monthly. "Most people I know won't pay for extensions at all." Annual billing if subscription.
5. **The pain extends beyond length.** Fluid ounces vs. milliliters (kitchen products), pounds vs. kilograms (luggage), screen diagonals in inches. "The inch-based screen diagonal convention is honestly one of the most confusing things in global electronics."

### Behaviors
- **Workaround:** iPhone Calculator for one-by-one conversions. Notes file "よく使う変換" (frequently used conversions) as cheat sheet. Opens Amazon JP and US side by side. Sometimes searches Amazon JP first just to get metric dimensions, then finds same product cheaper on Amazon US.
- **Tools:** Amazon JP (primary), Amazon US, Amazon UK, iPhone Calculator, LINE, Kakaku.com, "Tansui" converter app (barely used)
- **Communities:** Kakaku.com forums, Japanese Amazon review blogs, cross-border shopping LINE group (~40 members)
- **Decision triggers:** Japanese Chrome Web Store reviews. Real Amazon screenshots (not mockups). Must show Amazon JP working. Abandoned extensions (1+ year without update) = won't install.

### In Their Own Words
> "I stared at it thinking, 'Is this the same product or a different size variant?'"

> "By the end I have a headache and I'm not even sure my spreadsheet is right."

> "Shopping cross-border should be fun — it's like treasure hunting. But the unit conversion friction makes it stressful instead of fun."

### Product Fit
- **Why choose:** Inline dual-unit display on Amazon product pages without clicks. If it works on Amazon JP with Japanese dimension formats + Amazon US + Amazon UK, it directly solves her core comparison workflow.
- **Why walk away:** If it only works on Amazon.com (not .co.jp or .co.uk). If it doesn't handle millimeters (Japanese listings use mm, not cm). If there's no Japanese language support. If the "Add to Cart" button breaks or images load weird. If conversions pop in with visible delay (must feel instant).
- **WTP:** Free for basic. 300-500 yen/month (~$2-3) or preferably 1,000-1,500 yen one-time (~$7-10). Would pay more for cross-marketplace comparison feature. Annual billing preferred.

### Surprises
- Her partner Kenji avoids cross-border shopping entirely because of unit/complexity friction — he pays more on Amazon JP for the same products. This is a "lost buyer" the extension could unlock.
- She has both Amazon JP and Amazon US apps installed side by side on her phone — mobile is part of her workflow, and there's no mobile solution.
- The monitor arm mistake wasn't a conversion error — it was a unit *context* error (screen diagonal inches vs. width). This suggests the extension could add value through contextual annotations, not just raw conversion.

---

## Comparison Matrix

| Dimension | Lena K. | Mateo R. | Priya N. | Erik V. | Yuki S. |
|-----------|---------|----------|----------|---------|---------|
| **Urgency** | High (weekly pain) | Very High (daily pain) | Very High (per-project, career stakes) | Low (2-3x/month) | High (weekly, multi-marketplace) |
| **WTP** | EUR 2-3/mo or 10-15 one-time | $2-3 one-time max | $5-8/mo or AUD 25-30 one-time | $0 (code contributions) | 300-500 JPY/mo or 1,000-1,500 one-time |
| **Tech comfort** | 4/5 | 5/5 | 3/5 | 5/5 | 3/5 |
| **Decision authority** | Sole (personal) | Primary (household of 3) | Recommender (client decides) | Sole (personal) | Household (couple) |
| **Distribution channel** | WhatsApp group (8 people) | WhatsApp group (~40 people) | AIDA network + designer WhatsApp | GitHub/HN (developer circles) | LINE group (~40 people) |
| **Top objection** | False positives / page corruption | Broad permissions / closed source | Rounding / insufficient precision | Any false positive / no source code / Chrome-only | No Amazon JP support / no mm |
| **Adoption likelihood** | High | High (if open source) | High (if precision proven) | Low (skeptic, Firefox) | Medium-High (if multi-marketplace) |

---

## Primary Target Persona: Priya N.

### Reasoning

1. **Highest willingness to pay.** $5-8/month without hesitation, or AUD 25-30 one-time. Her competitor pays a VA $8/hr for the same task. The economic value is clear and defensible.

2. **Strongest pain severity.** Her pain is professional, not personal. A measurement error doesn't cost a return fee — it costs client relationships and referrals. The emotional weight ("knot in my stomach") is the highest of any persona.

3. **Most time recovered.** 90+ minutes/week at $150/hr billable rate = ~$200/week of reclaimed value. The ROI story writes itself.

4. **Best word-of-mouth network.** AIDA (industry association), Houzz, Pinterest business groups, designer WhatsApp. One converted Priya spreads to an entire professional community with shared, validated pain.

5. **Precision requirement drives quality.** Building for Priya's 1+ decimal place standard means the product exceeds the needs of all other personas. Designing for the most demanding user (besides the skeptic) ensures quality for everyone.

6. **Clear upgrade path.** Fit-check feature and batch CSV export are natural premium features she'd pay $15/month for — they're impossible to build as workarounds.

### Secondary Priorities
- **Lena K.** — easiest to convert (lowest adoption barrier, immediate social amplification)
- **Mateo R.** — highest frequency use (daily), largest organic distribution (40-person WhatsApp)
- **Yuki S.** — strong if multi-marketplace is built; deferred until Amazon JP support exists
- **Erik V.** — don't build for him, but ensure the codebase survives his scrutiny (open source, tested, performant). He's the quality gatekeeper, not the customer.
