# Chrome Web Store Listing - Amazon Imperial to Metric

This document contains all text content needed for the Chrome Web Store listing.

---

## Store Category

**Category:** Shopping

---

## Store Description

> Paste this into the "Description" field on the Chrome Web Store dashboard.

```
Instantly convert imperial measurements to metric on Amazon product pages.

Amazon Imperial to Metric automatically detects feet, inches, and dimension formats on Amazon product listings and displays the metric equivalents (meters, centimeters) right next to the original measurements. No more mental math or switching to a calculator.

FEATURES:
• Converts feet, inches, and combined feet+inches to meters/centimeters
• Handles 2D and 3D dimension formats (e.g., 10 x 5 x 2 inches)
• Supports fractional measurements (e.g., 5' 3 1/2")
• Works on 15 Amazon regional sites (US, UK, CA, AU, IN, DE, FR, ES, IT, JP, BR, NL, SE, PL, MX)
• Clean inline display with subtle green text
• Simple on/off toggle in the popup
• Lightweight with zero performance impact

PRIVACY FIRST:
• No data is collected or transmitted — ever
• No data is stored locally on your device
• No analytics, no tracking, no accounts
• All conversions happen locally in your browser
• The only stored data is your on/off preference via Chrome's built-in sync
• Fully open source — review every line of code on GitHub

OPEN SOURCE:
This extension is fully open source and community-driven. The complete source code is available at:
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension

Report bugs or request features on GitHub. Contributions are welcome.

HOW IT WORKS:
The extension scans Amazon product pages for imperial measurements and appends the metric conversion in parentheses. It uses a MutationObserver to handle dynamically loaded content, so conversions appear even as Amazon loads additional product details.

SUPPORTED FORMATS:
• 5'3" or 5 ft 3 in → feet and inches
• 36 inches or 36" or 36 in → inches
• 6.5 feet or 6.5 ft or 6.5' → feet
• 10 x 5 x 2 inches → 3D dimensions
• 10 x 5 inches → 2D dimensions
• Fractional formats like 5-1/2"

SUPPORTED AMAZON SITES:
amazon.com, amazon.co.uk, amazon.ca, amazon.com.au, amazon.in, amazon.de, amazon.fr, amazon.es, amazon.it, amazon.co.jp, amazon.com.br, amazon.nl, amazon.se, amazon.pl, amazon.com.mx
```

---

## Single Purpose Description

> Paste this into the "Single purpose" field (max 132 characters).

```
Converts imperial measurements (feet, inches) to metric (meters, centimeters) on Amazon product pages.
```

---

## Permission Justifications

> Enter these in the "Permissions" section of the Chrome Web Store privacy tab.

### `storage` permission

```
The storage permission saves the user's on/off preference for the extension. It stores a single boolean value (enabled: true/false) using chrome.storage.sync so the preference persists across browser sessions and syncs across the user's Chrome browsers. No other data is stored.
```

### Host permissions (Amazon domains)

```
Host permissions for 15 Amazon domains are required to inject the content script that reads product page text, identifies imperial measurements, and displays metric conversions inline. The extension only runs on Amazon product pages and does not access any other websites. No page content or user data is transmitted outside the browser.
```

---

## Data Use Certification

> Use these answers for the "Privacy practices" tab on the Chrome Web Store developer dashboard.

### Does your extension collect or use any user data?

**No.** The extension does not collect, transmit, or store any user data. The only data persisted is a single user preference (enabled on/off) via Chrome's storage.sync API, which is managed entirely by Chrome's sync infrastructure.

### Data Use Disclosures

Select **none** of the following categories:
- [ ] Personally identifiable information
- [ ] Health information
- [ ] Financial and payment information
- [ ] Authentication information
- [ ] Personal communications
- [ ] Location
- [ ] Web history
- [ ] User activity
- [ ] Website content

### Certifications

Check all of the following:
- [x] I certify that my extension's use of data complies with the Chrome Web Store Developer Program Policies
- [x] I certify that my extension does not sell user data to third parties
- [x] I certify that my extension does not use or transfer user data for purposes unrelated to the extension's single purpose
- [x] I certify that my extension does not use or transfer user data to determine creditworthiness or for lending purposes

---

## Privacy Policy URL

```
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension/blob/main/docs/privacy.md
```

> Note: The repository must be public for this URL to work.

---

## Homepage URL

```
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension
```

---

## Support URL

```
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension/issues
```
