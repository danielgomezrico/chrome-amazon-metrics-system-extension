# Amazon Imperial to Metric

[![codecov](https://codecov.io/gh/danielgomezrico/chrome-amazon-metrics-system-extension/graph/badge.svg)](https://codecov.io/gh/dan/chrome-metrics-changer)

Chrome extension that automatically converts feet and inches to meters and centimeters on Amazon product pages.

![Hero](screenshots/screenshot-1-hero.png)
![In Action](screenshots/screenshot-2-in-action.png)
![Supported Formats](screenshots/screenshot-3-formats.png)
![Simple Toggle & Privacy](screenshots/screenshot-4-simple-private.png)
![Global Amazon Support](screenshots/screenshot-5-global.png)

## Install locally

1. Clone and build:
   ```sh
   git clone https://github.com/dan/chrome-metrics-changer.git
   cd chrome-metrics-changer
   npm install
   npm run build
   ```

2. Open `chrome://extensions` in Chrome, enable **Developer mode**, click **Load unpacked**, and select this folder.

## Releasing a New Version

Releases are automated via GitHub Actions. The workflow fires on any `v*` tag push, runs tests, builds the ZIP, creates a GitHub Release (with generated changelog), and publishes to the Chrome Web Store.

### Prerequisites

Set up GitHub Secrets per `docs/chrome-store-credentials.md` (one-time setup).

### Conventional Commits

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for hectares
fix: correct ounce conversion factor
chore: update dependencies
docs: improve README
```

The changelog is generated automatically from these commit messages.

### Release Steps

1. Make your changes with conventional commit messages
2. Bump the version and tag:
   ```sh
   npm run release:patch   # bug fixes (1.0.0 → 1.0.1)
   npm run release:minor   # new features (1.0.0 → 1.1.0)
   npm run release:major   # breaking changes (1.0.0 → 2.0.0)
   ```
3. Push the commit and tag:
   ```sh
   git push && git push --tags
   ```
4. GitHub Actions handles the rest — check the Actions tab for status.

### Store Listing Metadata

The Chrome Web Store API does not support updating the store description or screenshots programmatically. If you change the listing text, update `docs/store-listing.md` and apply changes manually in the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole).
