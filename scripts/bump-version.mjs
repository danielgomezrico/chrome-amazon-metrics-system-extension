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
