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
const versionArg = args.find(a => a.startsWith('--version='));
const version = versionArg ? versionArg.split('=')[1] : null;

// Get the previous tag (if any)
let previousTag = null;
try {
  previousTag = execSync('git describe --tags --abbrev=0 HEAD^', {
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
  console.log('No new commits since last release.');
  if (shouldWrite) {
    const changelogPath = resolve(root, 'CHANGELOG.md');
    const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '';
    writeFileSync(changelogPath, existing || '');
    console.error('\nNo changes to write to CHANGELOG.md');
  }
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

const CONVENTIONAL_RE = /^([a-z]+)(?:\(([^)]+)\))?!?: (.+)$/;

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
  const heading = version
    ? `## v${version} — ${new Date().toISOString().slice(0, 10)}`
    : '## Changes';
  const newContent = `${heading}\n\n${changelog}\n\n---\n\n${existing}`;
  writeFileSync(changelogPath, newContent);
  console.error(`\nWritten to ${changelogPath}`);
}
