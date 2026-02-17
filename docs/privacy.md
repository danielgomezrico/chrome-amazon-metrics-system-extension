# Privacy Policy - Amazon Imperial to Metric

**Last updated:** 2026-02-16

## Overview

Amazon Imperial to Metric is an open-source Chrome extension that converts imperial measurements (feet, inches) to metric (meters, centimeters) on Amazon product pages. This extension is committed to protecting your privacy.

**Source code:** [GitHub Repository](https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension)

## Data Collection

**This extension does not collect, store, or transmit any user data.**

Specifically:

- **No personal data** is collected, stored, or transmitted
- **No browsing history** is tracked or recorded
- **No analytics or telemetry** data is gathered
- **No cookies** are set by this extension
- **No data is sent** to any external servers, APIs, or third parties
- **No data is stored locally** on your device by this extension
- **No user accounts** are required or supported

## How the Extension Works

The extension operates entirely within your browser:

1. It reads the text content of Amazon product pages to find imperial measurements
2. It performs unit conversions locally using simple arithmetic — no network requests are made
3. It displays the metric equivalents inline on the page
4. It stores a single boolean preference (enabled on/off) using Chrome's built-in `storage.sync` API, which is managed entirely by Chrome's sync infrastructure — not by the extension developer

No data ever leaves your local browser environment.

## Permissions Explained

| Permission | Why It's Needed |
|---|---|
| `storage` | Stores your on/off preference (a single boolean value). This preference syncs across your Chrome browsers via Chrome's built-in sync infrastructure. No other data is stored. |
| `host_permissions` (Amazon domains) | Required to run the content script on Amazon product pages. The extension only activates on Amazon websites and cannot access any other sites. |

## Third-Party Services

This extension does not use or communicate with any third-party services, servers, or APIs. All processing happens locally in your browser.

## Open Source

This extension is fully open source. You can review the complete source code at:
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension

## Changes to This Policy

If this privacy policy is updated, the changes will be reflected in this document with an updated date.

## Contact

For questions about this privacy policy or the extension, please open an issue on the GitHub repository:
https://github.com/Echo-Effects/chrome-amazon-metrics-system-extension/issues
