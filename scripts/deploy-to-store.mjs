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

// Only run when executed directly, not when imported (e.g. by tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  deploy().catch(err => {
    console.error('Deploy failed:', err.message);
    process.exit(1);
  });
}
