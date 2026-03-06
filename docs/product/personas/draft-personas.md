# Draft Personas: Amazon Imperial to Metric Chrome Extension

**Date:** 2026-03-05
**Author:** Persona Architect (UX Investigation Team)
**Inputs:** 5 research reports (market-analyst, community-listener, competitor-analyst, social-analyst, academic-researcher)

---

## Cross-Report Synthesis

### User Clusters Across Reports

| Cluster | Reports Mentioning | Count |
|---------|-------------------|-------|
| Metric-native cross-border shopper | Market, Community, Competitor, Social, Academic | 5/5 |
| Expat / immigrant in imperial country | Market, Community, Competitor, Academic | 4/5 |
| Technical / developer / DIY user | Community, Competitor, Social, Academic | 4/5 |
| Amazon seller (cross-market) | Market, Community, Competitor, Social | 4/5 |
| Home furnishing / large-item buyer | Market, Social, Academic | 3/5 |

### Pains Confirmed Across 3+ Reports

| Pain | Reports | Count |
|------|---------|-------|
| No native metric toggle on Amazon | All 5 | 5/5 |
| Manual conversion breaks browsing flow | All 5 | 5/5 |
| Wrong-size purchases and costly returns | Market, Community, Social, Academic | 4/5 |
| Cognitive load / mental math exhaustion | Market, Community, Social, Academic | 4/5 |
| Existing extensions are buggy / unreliable | Market, Community, Competitor | 3/5 |
| Amazon's dimension format poorly handled | Market, Community, Competitor | 3/5 |
| False positives corrupt page content | Community, Competitor, Social | 3/5 |

### Contradictions Between Reports (Segmentation Clues)

1. **Emotional intensity split**: Social analyst finds rage, profanity, meme-level frustration; Market analyst frames the same problem as "friction" and "cognitive load." This splits *vocal advocates* from *silent sufferers* who just cope.
2. **Precision tolerance**: Community report shows users rating Everything Metric 4-5 stars *despite known bugs*, while others give 2-3 stars for the exact same issues. Precision-demanding users (engineers, designers) vs. "close enough" users (casual shoppers).
3. **Bidirectional need**: Market analyst notes Canadian users want metric-to-imperial (reverse direction), contradicting the assumption that flow is always imperial-to-metric. Mixed-system countries need a toggle, not a one-way converter.
4. **Build vs. buy**: Community/Competitor reports show developers building their own tools (6+ GitHub repos, Reddit bots, Discord bots), while Social/Market show non-technical users just opening Google to convert. Self-serve power users vs. passive consumers.
5. **Scope preference**: Competitor report shows users wanting all-site conversion; Market report argues Amazon-specific is the differentiation wedge. Generalist expectations vs. specialist value proposition.

---

## Persona 1

## Lena K., 29
*German UX designer who shops Amazon US weekly for products unavailable on Amazon.de*

**Location:** Berlin, Germany | **Income:** EUR 52K/yr | **Tech savviness:** 4/5 | **Decision authority:** Sole buyer for personal purchases | **Evidence:** market-analyst (EU shoppers, Gen Z/Millennial cross-border), community-listener (International Online Shopper), competitor-analyst (International Amazon Shopper), social-analyst (Frustrated International Shopper), academic-researcher (Metric-Native Cross-Border Shopper)

### Goals
- **Primary:** Purchase confidently from Amazon US without second-guessing whether items will fit her apartment
- **Secondary:** Stop wasting time on Google converting every product dimension during a shopping session
- **Hidden:** Feel like Amazon US is as easy to use as Amazon.de -- she resents that the biggest marketplace excludes her measurement system

### Pain Points
- **Biggest:** She has no intuitive sense of what "48 inches" means -- it could be a desk or a dining table. She must convert every single dimension before she can evaluate a product.
- **Daily friction:** Opens a Google converter tab alongside every Amazon browsing session. Copies dimensions, pastes, converts, returns to Amazon. Repeats 10-20 times per session.
- **Keeps up at night:** Ordered a bookshelf that was 15 cm shorter than expected because she rushed the mental math on "62 inches." International return cost EUR 45 -- more than the shipping.
- **Failed attempts:** Installed Everything Metric but it converted her street address numbers and random text on the page. Disabled it after a week of false positives.

### Behaviors
- **Workaround:** Keeps a Chrome tab permanently open to Google unit converter. Sometimes uses the calculator app on her phone.
- **Tools:** Amazon.com (primary), Amazon.de (fallback), Google converter, Notion (tracks product dimensions in cm before purchasing)
- **Communities:** r/BuyItForLife, r/ApartmentDesign, German Amazon shopper Facebook groups
- **Decision triggers:** Installs extensions based on Chrome Web Store ratings; uninstalls immediately if she sees page corruption or false positives

### A Day in Their Life
Lena finds a mid-century desk on Amazon US that isn't available on Amazon.de. She opens the product page and sees "47.2 x 23.6 x 30 inches." She switches to her converter tab, types each dimension separately, writes "120 x 60 x 76 cm" on a sticky note, then grabs her tape measure to check if it fits. By the time she's done, she's lost 8 minutes and her purchase momentum. She adds it to cart but doesn't check out -- she'll "think about it" because she's not 100% sure about the depth.

### In Their Own Words
> "I wish they had the Chinese size here. I don't know if this is the same... It's adding one more step for me to check the size of this product by myself."
> *Source: academic-researcher (NN/g usability study -- different shopper, identical pain)*

### Product Fit
- **Why choose:** Amazon-specific means fewer false positives than Everything Metric. Inline conversion means no more tab-switching. If it "just works" on product pages, she'd install it permanently.
- **Why walk away:** If it converts non-measurement numbers on the page (addresses, model numbers, prices). If it slows page load noticeably. If it doesn't show original imperial values alongside metric.
- **WTP:** Free tier is enough for her. Would pay $2-3/month if it added multi-marketplace support (eBay, Walmart) and a size comparison tool.

---

## Persona 2

## Mateo R., 34
*Colombian software engineer who immigrated to Austin, TX three years ago and shops Amazon daily*

**Location:** Austin, TX, USA | **Income:** $95K/yr | **Tech savviness:** 5/5 | **Decision authority:** Primary household buyer (family of 3) | **Evidence:** market-analyst (Expats & Immigrants -- 50M foreign-born in US), community-listener (Expat/Bilingual Unit User), competitor-analyst (Expat/Immigrant), academic-researcher (Expatriate/Immigrant)

### Goals
- **Primary:** Eliminate the daily cognitive tax of living in an imperial-measurement country -- he wants his browser to "speak metric" so he can think faster
- **Secondary:** Stop making small but annoying purchase mistakes (bought a garden hose that was 15 feet when he needed ~6 meters, ended up 1.4m short)
- **Hidden:** He understands both systems intellectually but *thinks* in metric. Forcing imperial feels like reading in a second language -- functional but exhausting. He wants to stop translating.

### Pain Points
- **Biggest:** The cognitive overhead is constant and cumulative. It's not one hard conversion -- it's dozens of small ones every day across Amazon, Home Depot, recipes, weather. Death by a thousand cuts.
- **Daily friction:** His 4-year-old daughter asks "how tall is this dollhouse?" and he has to mentally convert 36 inches to ~91 cm before he can answer in the units his family uses at home.
- **Keeps up at night:** Bought a storage shelf for the garage listed as "72 x 36 x 18 inches." Converted wrong in his head (switched width and depth), and it didn't fit the alcove. Couldn't return -- "final sale."
- **Failed attempts:** Used autoConvert extension but it made Amazon pages unresponsive and once converted a time format (2h30m) into centimeters. Uninstalled same day.

### Behaviors
- **Workaround:** "Hey Siri, what's 48 inches in centimeters?" multiple times daily. Has memorized key conversions (1 inch = 2.54 cm, 1 foot ~ 30 cm) but still second-guesses himself for compound dimensions.
- **Tools:** Amazon Prime (heavy user), Siri voice converter, iOS calculator, occasionally checks Amazon.com.mx for metric listings of the same product
- **Communities:** Colombian expat WhatsApp groups, r/expats, Austin tech meetups
- **Decision triggers:** Reads GitHub issues before installing extensions. Checks if it's open source. Won't install anything that requests broad permissions ("read and change all your data on all websites").

### A Day in Their Life
Mateo's morning starts with checking Amazon for a new monitor stand. "5.9 x 9.4 x 16.5 inches" -- he mutters "times 2.54..." and pulls out his phone calculator. His wife calls from the kitchen: "Mateo, how many grams is 8 ounces? This recipe is American." He converts that too. By lunch he's done 6 unit conversions without thinking about it. It's not painful -- it's just... always there. Like a background process eating CPU.

### In Their Own Words
> "I have to convert to Imperial and also convert the currency in my head."
> *Source: social-analyst (Hackaday commenter -- cross-border purchaser)*

### Product Fit
- **Why choose:** As an engineer, he appreciates a focused tool that does one thing well. Amazon-specific scope means it won't interfere with his dev tools or other sites. Open-source would seal the deal.
- **Why walk away:** If it requires "read all website data" permissions. If it's closed-source with no GitHub repo. If it doesn't handle compound dimensions ("10 x 8 x 3 inches") correctly.
- **WTP:** Would pay $5/month for a premium version that also converts on Home Depot, Wayfair, and recipe sites. Would prefer a one-time $15 purchase over subscription.

---

## Persona 3

## Priya N., 41
*Australian interior designer sourcing US-exclusive furniture and fixtures for clients' metric-measured homes*

**Location:** Melbourne, Australia | **Income:** AUD 110K/yr | **Tech savviness:** 3/5 | **Decision authority:** Recommends products to clients; client makes final purchase | **Evidence:** market-analyst (AU/NZ Shoppers, Interior Designers/Architects), community-listener (International Online Shopper -- precision variant), academic-researcher (Home Furnishing Buyer, 15-20% return rate), social-analyst (size anxiety for non-returnable items)

### Goals
- **Primary:** Get exact metric dimensions for US products so she can verify fit in client floor plans with zero margin for error
- **Secondary:** Speed up her sourcing workflow -- she evaluates 30-50 products per project and converts dimensions for each one
- **Hidden:** Protect her professional reputation. A wrong-size delivery to a client's home is not a $45 return fee -- it's a damaged relationship and a lost referral.

### Pain Points
- **Biggest:** Rounding errors in mental conversion cascade when she's working with L x W x H across multiple items that must fit together in a room. 1 cm error per dimension x 3 dimensions x 8 items = potential disaster.
- **Daily friction:** Maintains a spreadsheet where she manually enters imperial dimensions from Amazon, converts them via formula, then cross-references against client room measurements in cm. This takes 20-30 minutes per sourcing session.
- **Keeps up at night:** A competitor designer once delivered a console table that was 3 cm too wide for the hallway niche. The client posted about it on Houzz. Priya is terrified of the same scenario.
- **Failed attempts:** Tried Everything Metric but it converted product model numbers and prices on the page, making the whole listing confusing. She needs surgical precision, not carpet-bombing conversion.

### Behaviors
- **Workaround:** Copy-pastes Amazon dimensions into a Google Sheets template with =CONVERT() formulas. Screenshots product pages and annotates with metric dimensions in Figma.
- **Tools:** Amazon US, Amazon AU, Google Sheets, Figma, Pinterest (mood boards), tape measure (physical)
- **Communities:** Australian Interior Design Association (AIDA), Houzz, Pinterest business groups, supplier WhatsApp groups
- **Decision triggers:** Word-of-mouth recommendations from other designers. Needs to see the tool working correctly on 5+ products before trusting it for client work.

### A Day in Their Life
Priya is sourcing a reading nook for a client's study. She finds a perfect armchair on Amazon US: "33.5 x 31.5 x 35 inches." She opens her spreadsheet, types in each value, checks the metric output (85.1 x 80 x 88.9 cm), then opens the client's floor plan to verify clearance. The nook is 90 cm wide. It fits -- barely. She repeats this for a side table, lamp, and footstool. The sourcing session takes 2 hours; 40 minutes is pure unit conversion overhead.

### In Their Own Words
> "Friction occurs when a customer has to do math to figure out if your product fits their needs."
> *Source: market-analyst (Amazon Global Selling guidance -- seller perspective, but identical to her buyer experience)*

### Product Fit
- **Why choose:** If it handles Amazon's "L x W x H" format natively and shows both units inline, it would save her 30+ minutes per sourcing session. Amazon-specific focus means fewer false positives on the pages she actually uses.
- **Why walk away:** If conversion accuracy is off by more than 0.5 cm. If it doesn't handle fractional inches ("7-3/4 inches"). If there's no way to copy the converted dimensions easily.
- **WTP:** Would pay $5-8/month without hesitation -- this is a professional tool that saves billable time. Would pay $15/month if it included a "dimension clipboard" feature to export converted measurements.

---

## Persona 4

## Erik V., 26
*Swedish CS student and open-source contributor who has tried and abandoned 4 different converter extensions*

**Location:** Gothenburg, Sweden | **Income:** SEK 180K/yr (student + freelance) | **Tech savviness:** 5/5 | **Decision authority:** Personal purchases only | **Evidence:** community-listener (Technical/Developer User -- "existing solutions are buggy, abandoned"), competitor-analyst (Everything Metric 39 open issues, autoConvert misparsing), social-analyst (Angry Developer archetype), academic-researcher (Technical/DIY Buyer)

**THIS IS THE SKEPTIC PERSONA -- may NOT adopt the extension.**

### Goals
- **Primary:** Find a unit converter that doesn't make things *worse* -- no false positives, no page corruption, no performance degradation
- **Secondary:** Have a tool he can trust without babysitting -- he's tired of mentally verifying the extension's output to check if it converted correctly
- **Hidden:** He actually enjoys building his own tools more than using others'. Part of him wants this extension to fail so he has an excuse to build his own.

### Pain Points
- **Biggest:** Every converter he's tried has a dealbreaker. Everything Metric: false positives on non-unit numbers. autoConvert: converted "2h24m30s" into "2h2400centimeters30seconds." Generic converters: slow page loads on Amazon. He's concluded the problem might be unsolvable for a generic tool.
- **Daily friction:** Doesn't convert frequently enough to justify an always-on extension. When he does shop Amazon US (maybe 2-3 times/month), he uses Python in terminal: `python3 -c "print(48 * 2.54)"`. It's ugly but reliable.
- **Keeps up at night:** Nothing -- he doesn't buy enough from Amazon US to lose sleep. His skepticism is intellectual, not emotional.
- **Failed attempts:** Installed/uninstalled: Everything Metric (false positives), autoConvert (misparsing + slow), Imperial to Metric by esprimo (archived, stopped working), Metrication (replaced original text with no way to see imperial).

### Behaviors
- **Workaround:** Terminal Python one-liners. Occasionally `curl` + grep on Amazon pages to extract dimensions programmatically.
- **Tools:** Firefox (not Chrome -- privacy reasons), GitHub, VS Code, Python, terminal
- **Communities:** r/programming, r/firefox, Hacker News, GitHub issues on converter repos
- **Decision triggers:** Reads source code before installing. Checks GitHub: stars, open issues, last commit date, test coverage. Won't install Manifest V2 extensions. Demands < 50ms page load impact.

### A Day in Their Life
Erik sees a post on Hacker News about a new Amazon converter extension. He clicks through to the GitHub repo. First thing he checks: last commit (2 days ago -- good). Open issues (3 -- acceptable). Test coverage (has tests -- rare for extensions). He clones the repo, reads the content script, checks for obvious regex pitfalls. He finds one: the regex would match "12" in "iPhone 12" and try to convert it. He opens an issue, labels it "bug," and closes the tab. He'll check back in a month to see if it's fixed.

### In Their Own Words
> "The utility provided by the extension is overshadowed by the amount of false positive noise."
> *Source: community-listener (Klaster_1, Firefox review for Everything Metric, 2-star)*

### Product Fit
- **Why choose:** Only if the extension demonstrates Amazon-specific DOM awareness (targets product dimension fields, not all text), has open source code, minimal permissions, and a test suite. The "Amazon-only" scope is actually a selling point -- smaller surface area means fewer bugs.
- **Why walk away:** Any false positive on first use = immediate uninstall. Closed source = won't install. Chrome-only = can't use (he's on Firefox). No GitHub repo = doesn't exist to him. Performance impact > 50ms = dealbreaker.
- **WTP:** $0. Would contribute code and file quality bug reports instead. Might donate $10-20/yr to an open-source project he respects. Philosophically opposed to paying for a browser extension.

---

## Persona 5

## Yuki S., 32
*Japanese product researcher who comparison-shops across 4 Amazon marketplaces to find the best deals on electronics and home goods*

**Location:** Osaka, Japan | **Income:** JPY 5.5M/yr | **Tech savviness:** 3/5 | **Decision authority:** Household purchasing decisions (couple, no kids) | **Evidence:** market-analyst (Asian Cross-Border Buyers ~50M, 75% subscription shoppers buy cross-border), community-listener (International Online Shopper), social-analyst (Frustrated International Shopper), academic-researcher (Metric-Native Cross-Border Shopper, APAC mobile-first)

### Goals
- **Primary:** Compare products across Amazon US, Amazon JP, and Amazon UK quickly -- unit differences between marketplaces slow her comparison workflow to a crawl
- **Secondary:** Avoid the "will it fit?" anxiety for electronics (monitor arms, desk accessories, cable management) where millimeters matter
- **Hidden:** She's optimizing for value across global marketplaces. The unit conversion friction is the biggest remaining barrier after she solved currency conversion with a separate extension.

### Pain Points
- **Biggest:** Comparing the same category of product across Amazon JP (metric) and Amazon US (imperial) requires converting every dimension to make an apples-to-apples comparison. A 10-product comparison takes 30+ minutes of conversion overhead.
- **Daily friction:** Amazon US product pages show "10.2 x 4.3 x 7.1 inches" while Amazon JP shows the same product as "259 x 109 x 180 mm." She can't quickly tell if they're the same dimensions without converting.
- **Keeps up at night:** Bought a monitor arm from Amazon US rated for "up to 27 inches" -- she thought it meant 27 cm width (it's the screen diagonal). The arm didn't fit her 32-inch monitor. International return from Japan cost more than the product.
- **Failed attempts:** Used a popup-based unit converter extension (FlyUnits) -- too many clicks per conversion. Tried bookmarking a converter site -- too slow for 50+ conversions per session.

### Behaviors
- **Workaround:** Opens Amazon JP and Amazon US side by side. Uses iPhone calculator to convert dimensions one at a time. Sometimes searches for the same product on Amazon JP first to get metric dimensions, then finds it cheaper on Amazon US.
- **Tools:** Amazon JP (primary), Amazon US, Amazon UK, iPhone calculator, LINE (messaging), Kakaku.com (price comparison)
- **Communities:** Kakaku.com forums, Japanese Amazon review blogs, cross-border shopping LINE groups
- **Decision triggers:** Recommendations from Japanese shopping blogs. Chrome Web Store ratings in Japanese. Screenshots/demos showing the extension working on actual Amazon product pages.

### A Day in Their Life
Yuki wants a new desk organizer. She finds three options on Amazon US and two on Amazon JP. She opens 5 tabs. The US products list dimensions in inches; the JP products in centimeters. She starts a comparison spreadsheet, converting each US product's dimensions to cm. After 20 minutes, she realizes she mixed up two products' heights and has to start over. She closes all tabs and decides to "just buy the one on Amazon JP" even though it's 30% more expensive, because at least she knows the dimensions are right.

### In Their Own Words
> "Really good, I just wish there was a way to see the original measurements... and that it was available on android!"
> *Source: community-listener (cach_dies, Firefox review for Everything Metric)*

### Product Fit
- **Why choose:** Inline conversion that shows both units would let her compare products across marketplaces in a single glance. Amazon-specific means it handles the exact dimension format she struggles with.
- **Why walk away:** If it only works on Amazon.com and not on Amazon.co.jp or Amazon.co.uk. If it doesn't handle millimeters (common in Japanese product listings). If there's no Japanese language support in the extension UI.
- **WTP:** Would pay $3-5/month for multi-marketplace support. Would pay $8/month if it included a cross-marketplace dimension comparison feature. Prefers annual billing (common in Japan).

---

## Summary: Top Cross-Cutting Pain

**The #1 pain across all 5 personas and all 5 reports: Amazon provides no native metric toggle, forcing every metric-native user to manually convert every dimension on every product page, every time they shop.**

This manifests differently per persona -- Lena loses purchase confidence, Mateo burns cognitive energy daily, Priya risks professional reputation, Erik can't find a reliable tool, and Yuki's comparison workflow grinds to a halt -- but the root cause is identical. The absence of native metric support on the world's largest marketplace is the single biggest opportunity this extension addresses.

### Persona Comparison Matrix

| Persona | Primary Goal | Shopping Freq | Precision Need | WTP | Adoption Risk |
|---------|-------------|--------------|----------------|-----|---------------|
| Lena K. | Purchase confidence | Weekly | Medium | $0-3/mo | Low |
| Mateo R. | Reduce cognitive tax | Daily | Medium-High | $5/mo or $15 one-time | Low |
| Priya N. | Professional accuracy | Per-project (intense) | Very High | $5-15/mo | Medium (trust barrier) |
| Erik V. | Tool reliability | 2-3x/month | Extreme (zero false positives) | $0 (code contributor) | **High (skeptic)** |
| Yuki S. | Comparison speed | Weekly | Medium-High | $3-8/mo | Medium (multi-marketplace req) |
