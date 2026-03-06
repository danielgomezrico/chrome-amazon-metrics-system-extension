# Chrome Store Deploy Automation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automate releasing the Chrome extension to the Chrome Web Store — including conventional commit enforcement, changelog generation from git history, and automated upload/publish via GitHub Actions on tag push.

**Architecture:** A release script bumps the version in `manifest.json`, generates a changelog from conventional commits since the last tag, commits and tags. A GitHub Actions workflow then fires on that tag, builds the ZIP, creates a GitHub Release (with changelog body), uploads to Chrome Web Store via the Publish API, and submits for review.

**Tech Stack:** Node.js ESM scripts, `chrome-webstore-upload` (npm), `@commitlint/cli` + `@commitlint/config-conventional`, `conventional-changelog-cli`, GitHub Actions, Chrome Web Store Publish API (OAuth2)

**What IS automated:** Version bump, changelog, GitHub Release creation, ZIP upload to Chrome Web Store, publish/submit for review.

**What is NOT automated:** Updating the store listing description text or screenshots — the Chrome Web Store API doesn't support this. Those remain managed via `docs/store-listing.md` and the dashboard.

---

## Prerequisites

- Node.js 22+ with npm
- GitHub repo with push access
- A Chrome Web Store developer account (one-time $5 fee)
- Extension already published once manually (so it has an Extension ID)

---

### Task 1: Install commitlint

**Files:**
- Modify: `package.json`
- Create: `commitlint.config.js`

**Step 1: Install dependencies**

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**Step 2: Create `commitlint.config.js`**

```js
export default {
  extends: ['@commitlint/config-conventional'],
};
```

**Step 3: Verify commitlint works**

Run: `echo "feat: test" | npx commitlint`
Expected: exits 0, no output

Run: `echo "bad commit" | npx commitlint`
Expected: exits non-zero with an error message about commit format

**Step 4: Commit**

```bash
git add package.json package-lock.json commitlint.config.js
git commit -m "chore: add commitlint for conventional commits enforcement"
```

---

### Task 2: Install commit-msg git hook

This enforces the commitlint rule on every local commit.

**Files:**
- Create: `scripts/setup-hooks.sh`
- Modify: `package.json`

**Step 1: Create `scripts/setup-hooks.sh`**

```bash
#!/bin/sh
HOOK=.git/hooks/commit-msg
cat > "$HOOK" << 'EOF'
#!/bin/sh
npx --no -- commitlint --edit "$1"
EOF
chmod +x "$HOOK"
echo "Git hooks installed."
```

**Step 2: Make it executable**

```bash
chmod +x scripts/setup-hooks.sh
```

**Step 3: Add `prepare` script to `package.json`**

In the `"scripts"` block:
```json
"prepare": "node -e \"if(process.env.CI !== 'true') { require('child_process').execSync('sh scripts/setup-hooks.sh', {stdio:'inherit'}) }\""
```

> `CI !== 'true'` check prevents the hook install from running in GitHub Actions (where `.git/hooks` is irrelevant).

**Step 4: Run prepare to install the hook**

```bash
npm run prepare
```

Expected: prints "Git hooks installed."

**Step 5: Verify the hook blocks bad commits**

```bash
git commit --allow-empty -m "this is wrong"
```
Expected: commits fails with commitlint error.

```bash
git commit --allow-empty -m "feat: test message"
```
Expected: succeeds (then reset it: `git reset HEAD~1`)

**Step 6: Commit**

```bash
git add scripts/setup-hooks.sh package.json
git commit -m "chore: install commit-msg hook for commitlint"
```

---

### Task 3: Install changelog generation

**Files:**
- Modify: `package.json`
- Create: `scripts/generate-changelog.mjs`

**Step 1: Install `conventional-changelog-cli`**

```bash
npm install --save-dev conventional-changelog-cli
```

**Step 2: Create `scripts/generate-changelog.mjs`**

This script generates markdown changelog text between the last tag and HEAD — suitable for use in a GitHub Release body.

```js
#!/usr/bin/env node
/**
 * Generates a conventional changelog between the previous git tag and HEAD.
 * Usage:
 *   node scripts/generate-changelog.mjs            # prints to stdout
 *   node scripts/generate-changelog.mjs --write    # appends to CHANGELOG.md
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');

// Get the previous tag (if any)
let previousTag = null;
try {
  previousTag = execSync('git describe --tags --abbrev=0', {
    cwd: root,
    encoding: 'utf8',
  }).trim();
} catch {
  // No previous tag — changelog covers all commits
}

// Get commits since last tag (or all commits if no tag)
const range = previousTag ? `${previousTag}..HEAD` : 'HEAD';
const gitLog = execSync(
  `git log ${range} --pretty=format:"%s" --no-merges`,
  { cwd: root, encoding: 'utf8' }
).trim();

if (!gitLog) {
  const msg = 'No new commits since last release.';
  console.log(msg);
  process.exit(0);
}

// Parse conventional commits
const commits = gitLog.split('\n').map(line => line.trim()).filter(Boolean);

const sections = {
  feat: [],
  fix: [],
  perf: [],
  refactor: [],
  docs: [],
  chore: [],
  other: [],
};

const CONVENTIONAL_RE = /^(\w+)(?:\(([^)]+)\))?!?: (.+)$/;

for (const commit of commits) {
  const match = commit.match(CONVENTIONAL_RE);
  if (!match) {
    sections.other.push(commit);
    continue;
  }
  const [, type, scope, subject] = match;
  const entry = scope ? `**${scope}:** ${subject}` : subject;
  if (sections[type]) {
    sections[type].push(entry);
  } else {
    sections.other.push(entry);
  }
}

const sectionLabels = {
  feat: '### Features',
  fix: '### Bug Fixes',
  perf: '### Performance Improvements',
  refactor: '### Refactoring',
  docs: '### Documentation',
  chore: '### Chores',
  other: '### Other Changes',
};

const lines = [];
for (const [key, label] of Object.entries(sectionLabels)) {
  if (sections[key].length === 0) continue;
  lines.push(label);
  for (const entry of sections[key]) {
    lines.push(`- ${entry}`);
  }
  lines.push('');
}

const changelog = lines.join('\n').trimEnd();
console.log(changelog);

if (shouldWrite) {
  const changelogPath = resolve(root, 'CHANGELOG.md');
  const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '';
  const newContent = `## Changes\n\n${changelog}\n\n---\n\n${existing}`;
  writeFileSync(changelogPath, newContent);
  console.error(`\nWritten to ${changelogPath}`);
}
```

**Step 3: Add `changelog` npm script to `package.json`**

```json
"changelog": "node scripts/generate-changelog.mjs"
```

**Step 4: Run to verify output**

```bash
npm run changelog
```
Expected: prints something like:
```
### Chores
- add commitlint for conventional commits enforcement
- install commit-msg hook for commitlint
```

**Step 5: Commit**

```bash
git add package.json package-lock.json scripts/generate-changelog.mjs
git commit -m "feat: add changelog generation from conventional commits"
```

---

### Task 4: Create version bump + release script

This script bumps the version in `manifest.json` and `package.json`, generates changelog, commits and tags.

**Files:**
- Create: `scripts/bump-version.mjs`
- Modify: `package.json`

**Step 1: Create `scripts/bump-version.mjs`**

```js
#!/usr/bin/env node
/**
 * Bumps the extension version, updates manifest.json and package.json,
 * generates changelog, creates a release commit and git tag.
 *
 * Usage:
 *   node scripts/bump-version.mjs patch    # 1.0.0 -> 1.0.1
 *   node scripts/bump-version.mjs minor    # 1.0.0 -> 1.1.0
 *   node scripts/bump-version.mjs major    # 1.0.0 -> 2.0.0
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(fileURLToPath(import.meta.url), '../..');

function bumpVersion(current, type) {
  const parts = current.split('.').map(Number);
  if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
  else if (type === 'minor') { parts[1]++; parts[2] = 0; }
  else if (type === 'patch') { parts[2]++; }
  else throw new Error(`Unknown version type: ${type}. Use patch, minor, or major.`);
  return parts.join('.');
}

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
}

const bumpType = process.argv[2];
if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: node scripts/bump-version.mjs <patch|minor|major>');
  process.exit(1);
}

// Read current version from manifest.json
const manifestPath = resolve(root, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const currentVersion = manifest.version;
const newVersion = bumpVersion(currentVersion, bumpType);

console.log(`Bumping version: ${currentVersion} -> ${newVersion}`);

// Update manifest.json
manifest.version = newVersion;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// Update package.json
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Generate and write changelog
console.log('Generating changelog...');
run(`node scripts/generate-changelog.mjs --write`);

// Stage everything
run(`git add manifest.json package.json CHANGELOG.md`);

// Create release commit
run(`git commit -m "chore(release): v${newVersion}"`);

// Create annotated tag
run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);

console.log(`\nRelease v${newVersion} tagged. Push with:\n  git push && git push --tags`);
```

**Step 2: Make it executable**

```bash
chmod +x scripts/bump-version.mjs
```

**Step 3: Add `release` npm scripts to `package.json`**

```json
"release:patch": "node scripts/bump-version.mjs patch",
"release:minor": "node scripts/bump-version.mjs minor",
"release:major": "node scripts/bump-version.mjs major"
```

**Step 4: Write tests for `bumpVersion` logic**

Create `tests/bump-version.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Copy the bumpVersion function here for unit testing
function bumpVersion(current, type) {
  const parts = current.split('.').map(Number);
  if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
  else if (type === 'minor') { parts[1]++; parts[2] = 0; }
  else if (type === 'patch') { parts[2]++; }
  else throw new Error(`Unknown version type: ${type}. Use patch, minor, or major.`);
  return parts.join('.');
}

describe('bumpVersion', () => {
  it('bumps patch version', () => {
    assert.equal(bumpVersion('1.0.0', 'patch'), '1.0.1');
    assert.equal(bumpVersion('1.0.9', 'patch'), '1.0.10');
  });

  it('bumps minor version and resets patch', () => {
    assert.equal(bumpVersion('1.0.5', 'minor'), '1.1.0');
  });

  it('bumps major version and resets minor and patch', () => {
    assert.equal(bumpVersion('1.2.3', 'major'), '2.0.0');
  });

  it('throws on unknown type', () => {
    assert.throws(() => bumpVersion('1.0.0', 'nano'), /Unknown version type/);
  });
});
```

**Step 5: Run the tests**

```bash
node --test tests/bump-version.test.js
```
Expected: all 4 tests pass

**Step 6: Commit**

```bash
git add scripts/bump-version.mjs package.json tests/bump-version.test.js
git commit -m "feat: add version bump and release script"
```

---

### Task 5: Create Chrome Web Store credentials guide

This is a documentation-only task explaining how to obtain OAuth2 credentials needed for automated publishing.

**Files:**
- Create: `docs/chrome-store-credentials.md`

**Step 1: Create `docs/chrome-store-credentials.md`**

```markdown
# Chrome Web Store API Credentials Setup

Follow these steps once to obtain the OAuth2 credentials needed for automated deployment.

## Step 1: Get the Extension ID

After your first manual publish, your extension has a permanent ID.
Find it at: https://chrome.google.com/webstore/devconsole
It looks like: `abcdefghijklmnopqrstuvwxyz123456`

## Step 2: Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g., "chrome-extension-deploy")
3. Enable the **Chrome Web Store API**:
   - APIs & Services → Library → search "Chrome Web Store API" → Enable

## Step 3: Create OAuth2 Credentials

1. APIs & Services → Credentials → Create Credentials → OAuth client ID
2. Application type: **Web application**
3. Name: "chrome-deploy"
4. Authorized redirect URIs: add `https://developers.google.com/oauthplayground`
5. Save — note the **Client ID** and **Client Secret**

## Step 4: Get a Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click the settings gear (top right) → check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In "Step 1", scroll to "Chrome Web Store API v1.1" → select the `...webstore` scope → Authorize
5. In "Step 2", click "Exchange authorization code for tokens"
6. Copy the **Refresh token**

## Step 5: Add GitHub Secrets

In your GitHub repo: Settings → Secrets and variables → Actions → New repository secret

| Secret Name              | Value                     |
|--------------------------|---------------------------|
| `CHROME_EXTENSION_ID`    | Your extension ID         |
| `GOOGLE_CLIENT_ID`       | OAuth Client ID           |
| `GOOGLE_CLIENT_SECRET`   | OAuth Client Secret       |
| `GOOGLE_REFRESH_TOKEN`   | OAuth Refresh Token       |

These secrets are used by the deploy workflow automatically.
```

**Step 2: Commit**

```bash
git add docs/chrome-store-credentials.md
git commit -m "docs: add Chrome Web Store OAuth credentials setup guide"
```

---

### Task 6: Create the deploy script

**Files:**
- Modify: `package.json`
- Create: `scripts/deploy-to-store.mjs`
- Create: `tests/deploy-config.test.js`

**Step 1: Install `chrome-webstore-upload`**

```bash
npm install --save-dev chrome-webstore-upload
```

**Step 2: Write the failing test first**

Create `tests/deploy-config.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Extract and test the config validation logic separately from the deploy script
function validateConfig(env) {
  const required = [
    'CHROME_EXTENSION_ID',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
  ];
  const missing = required.filter(key => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return {
    extensionId: env.CHROME_EXTENSION_ID,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
  };
}

describe('validateConfig', () => {
  const validEnv = {
    CHROME_EXTENSION_ID: 'abcdef',
    GOOGLE_CLIENT_ID: 'client',
    GOOGLE_CLIENT_SECRET: 'secret',
    GOOGLE_REFRESH_TOKEN: 'token',
  };

  it('returns config when all env vars are present', () => {
    const config = validateConfig(validEnv);
    assert.equal(config.extensionId, 'abcdef');
    assert.equal(config.clientId, 'client');
  });

  it('throws when any env var is missing', () => {
    const env = { ...validEnv };
    delete env.GOOGLE_REFRESH_TOKEN;
    assert.throws(
      () => validateConfig(env),
      /Missing required environment variables: GOOGLE_REFRESH_TOKEN/
    );
  });

  it('throws listing all missing vars', () => {
    assert.throws(
      () => validateConfig({}),
      /CHROME_EXTENSION_ID.*GOOGLE_CLIENT_ID/
    );
  });
});
```

**Step 3: Run test to verify it fails**

```bash
node --test tests/deploy-config.test.js
```
Expected: FAIL — `validateConfig is not defined` or similar (since we haven't created the module yet)

> Note: The test is self-contained with a local copy of `validateConfig`. It will actually pass. Run it — if it passes, proceed. The "failing first" check here is about the integration test we'll add after the script exists.

**Step 4: Create `scripts/deploy-to-store.mjs`**

```js
#!/usr/bin/env node
/**
 * Deploys the extension ZIP to the Chrome Web Store.
 *
 * Usage:
 *   node scripts/deploy-to-store.mjs [--dry-run]
 *
 * Required env vars:
 *   CHROME_EXTENSION_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 *
 * Optional env vars:
 *   ZIP_PATH  (default: dist/amazon-imperial-to-metric.zip)
 */
import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import chromeWebstoreUpload from 'chrome-webstore-upload';

const root = resolve(fileURLToPath(import.meta.url), '../..');

export function validateConfig(env) {
  const required = [
    'CHROME_EXTENSION_ID',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
  ];
  const missing = required.filter(key => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return {
    extensionId: env.CHROME_EXTENSION_ID,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
  };
}

async function deploy() {
  const isDryRun = process.argv.includes('--dry-run');
  const config = validateConfig(process.env);

  const zipPath = process.env.ZIP_PATH ?? resolve(root, 'dist/amazon-imperial-to-metric.zip');
  if (!existsSync(zipPath)) {
    throw new Error(`ZIP not found at ${zipPath}. Run 'npm run package' first.`);
  }

  console.log(`ZIP: ${zipPath}`);
  console.log(`Extension ID: ${config.extensionId}`);

  if (isDryRun) {
    console.log('[DRY RUN] Would upload and publish. Skipping API calls.');
    return;
  }

  const store = chromeWebstoreUpload({
    extensionId: config.extensionId,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken,
  });

  console.log('Fetching access token...');
  const token = await store.fetchToken();

  console.log('Uploading ZIP...');
  const uploadResult = await store.uploadExisting(createReadStream(zipPath), token);
  console.log('Upload result:', uploadResult.uploadState);

  if (uploadResult.uploadState !== 'SUCCESS') {
    const errors = uploadResult.itemError?.map(e => e.error_detail).join(', ');
    throw new Error(`Upload failed: ${errors}`);
  }

  console.log('Publishing (submitting for review)...');
  const publishResult = await store.publish('default', token);
  console.log('Publish result:', publishResult.status?.join(', '));

  console.log('Done! Extension submitted for review.');
}

deploy().catch(err => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
```

**Step 5: Add `deploy` npm script to `package.json`**

```json
"deploy": "node scripts/deploy-to-store.mjs",
"deploy:dry-run": "node scripts/deploy-to-store.mjs --dry-run"
```

**Step 6: Update the test to import from the script**

Update `tests/deploy-config.test.js` to import from the script:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig } from '../scripts/deploy-to-store.mjs';

describe('validateConfig', () => {
  const validEnv = {
    CHROME_EXTENSION_ID: 'abcdef',
    GOOGLE_CLIENT_ID: 'client',
    GOOGLE_CLIENT_SECRET: 'secret',
    GOOGLE_REFRESH_TOKEN: 'token',
  };

  it('returns config when all env vars are present', () => {
    const config = validateConfig(validEnv);
    assert.equal(config.extensionId, 'abcdef');
    assert.equal(config.clientId, 'client');
  });

  it('throws when any env var is missing', () => {
    const env = { ...validEnv };
    delete env.GOOGLE_REFRESH_TOKEN;
    assert.throws(
      () => validateConfig(env),
      /Missing required environment variables: GOOGLE_REFRESH_TOKEN/
    );
  });

  it('throws listing all missing vars', () => {
    assert.throws(
      () => validateConfig({}),
      /CHROME_EXTENSION_ID.*GOOGLE_CLIENT_ID/
    );
  });
});
```

**Step 7: Run the tests**

```bash
node --test tests/deploy-config.test.js
```
Expected: all 3 tests pass

**Step 8: Run all tests**

```bash
node --test
```
Expected: all tests pass

**Step 9: Commit**

```bash
git add package.json package-lock.json scripts/deploy-to-store.mjs tests/deploy-config.test.js
git commit -m "feat: add Chrome Web Store deploy script with dry-run support"
```

---

### Task 7: Create the GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**

This workflow triggers when a `v*` tag is pushed. It:
1. Validates the tag matches `manifest.json` version
2. Runs tests
3. Builds the ZIP
4. Generates the release changelog
5. Creates a GitHub Release (with ZIP attached and changelog as body)
6. Uploads and publishes to Chrome Web Store

```yaml
name: Deploy to Chrome Web Store

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # needed to create GitHub Releases

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # full history for changelog generation

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm

      - name: Install dependencies
        run: npm ci
        env:
          PUPPETEER_SKIP_DOWNLOAD: true

      - name: Extract version from tag
        id: version
        run: echo "version=${GITHUB_REF_NAME#v}" >> "$GITHUB_OUTPUT"

      - name: Validate tag matches manifest.json version
        run: |
          MANIFEST_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync('manifest.json','utf8')).version)")
          TAG_VERSION="${{ steps.version.outputs.version }}"
          if [ "$MANIFEST_VERSION" != "$TAG_VERSION" ]; then
            echo "ERROR: manifest.json version ($MANIFEST_VERSION) does not match tag ($TAG_VERSION)"
            exit 1
          fi
          echo "Version check passed: $MANIFEST_VERSION"

      - name: Run tests
        run: node --test
        env:
          PUPPETEER_SKIP_DOWNLOAD: true

      - name: Build and package extension
        run: npm run package

      - name: Generate changelog
        id: changelog
        run: |
          CHANGELOG=$(node scripts/generate-changelog.mjs)
          echo "changelog<<CHANGELOG_EOF" >> "$GITHUB_OUTPUT"
          echo "$CHANGELOG" >> "$GITHUB_OUTPUT"
          echo "CHANGELOG_EOF" >> "$GITHUB_OUTPUT"

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.ref_name }}
          name: Release ${{ github.ref_name }}
          body: ${{ steps.changelog.outputs.changelog }}
          files: dist/amazon-imperial-to-metric.zip

      - name: Upload and publish to Chrome Web Store
        run: node scripts/deploy-to-store.mjs
        env:
          CHROME_EXTENSION_ID: ${{ secrets.CHROME_EXTENSION_ID }}
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          GOOGLE_REFRESH_TOKEN: ${{ secrets.GOOGLE_REFRESH_TOKEN }}
          ZIP_PATH: dist/amazon-imperial-to-metric.zip
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deploy workflow for Chrome Web Store"
```

---

### Task 8: Update README with release process

**Files:**
- Modify: `README.md`

**Step 1: Append release section to `README.md`**

Add this after the existing content:

```markdown
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
```

**Step 2: Run all tests one final time**

```bash
node --test
```
Expected: all tests pass

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document release process with conventional commits and automated deploy"
```

---

## Verification: Full End-to-End Test (Dry Run)

Once all tasks are complete, do a dry run to confirm the whole pipeline works:

```bash
# Simulate a release
npm run release:patch
# Undo the commit and tag (don't push)
git reset HEAD~1
git tag -d $(git tag --sort=-creatordate | head -1)
```

Then test the deploy script in dry-run mode:
```bash
CHROME_EXTENSION_ID=fake GOOGLE_CLIENT_ID=fake GOOGLE_CLIENT_SECRET=fake GOOGLE_REFRESH_TOKEN=fake \
  node scripts/deploy-to-store.mjs --dry-run
```
Expected:
```
ZIP: .../dist/amazon-imperial-to-metric.zip
Extension ID: fake
[DRY RUN] Would upload and publish. Skipping API calls.
```

---

## Summary of New Files

| File | Purpose |
|------|---------|
| `commitlint.config.js` | Commitlint configuration |
| `scripts/setup-hooks.sh` | Installs git commit-msg hook |
| `scripts/generate-changelog.mjs` | Generates changelog from conventional commits |
| `scripts/bump-version.mjs` | Bumps version, generates changelog, commits and tags |
| `scripts/deploy-to-store.mjs` | Uploads and publishes ZIP to Chrome Web Store |
| `docs/chrome-store-credentials.md` | One-time OAuth setup guide |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow |
| `tests/bump-version.test.js` | Unit tests for version bumping |
| `tests/deploy-config.test.js` | Unit tests for deploy config validation |
| `CHANGELOG.md` | Auto-generated on first release |
