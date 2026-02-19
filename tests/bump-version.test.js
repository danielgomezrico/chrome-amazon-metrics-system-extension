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
