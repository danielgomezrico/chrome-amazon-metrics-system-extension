import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { replaceWithMetric } from '../replacer.js';

describe('replaceWithMetric', () => {
  it('appends metric to feet measurement', () => {
    assert.equal(
      replaceWithMetric('6.6 feet'),
      '6.6 feet (2.01 m)'
    );
  });

  it('appends metric to inches measurement', () => {
    assert.equal(
      replaceWithMetric('36 inches'),
      '36 inches (91.44 cm)'
    );
  });

  it('appends metric to combined feet+inches', () => {
    assert.equal(
      replaceWithMetric('5 feet 3 inches'),
      '5 feet 3 inches (1.60 m)'
    );
  });

  it('appends metric to 3D dimensions', () => {
    assert.equal(
      replaceWithMetric('10 x 5 x 2 inches'),
      '10 x 5 x 2 inches (25.40 x 12.70 x 5.08 cm)'
    );
  });

  it('appends metric to 2D dimensions', () => {
    assert.equal(
      replaceWithMetric('10 x 5 inches'),
      '10 x 5 inches (25.40 x 12.70 cm)'
    );
  });

  it('appends metric to fractional feet+inches', () => {
    const result = replaceWithMetric(`5' 3 1/2"`);
    assert.equal(result, `5' 3 1/2" (1.61 m)`);
  });

  it('handles no-space uppercase FT in titles', () => {
    assert.equal(
      replaceWithMetric('USB Cable 6.6FT'),
      'USB Cable 6.6FT (2.01 m)'
    );
  });

  it('does not modify text without measurements', () => {
    assert.equal(
      replaceWithMetric('Great product, 5 stars'),
      'Great product, 5 stars'
    );
  });

  it('does not modify already-metric text', () => {
    assert.equal(
      replaceWithMetric('25.4 cm wide'),
      '25.4 cm wide'
    );
  });

  it('handles multiple measurements in one string', () => {
    const result = replaceWithMetric('Width: 10 inches, Height: 5 inches');
    assert.equal(result, 'Width: 10 inches (25.40 cm), Height: 5 inches (12.70 cm)');
  });

  it('does not modify prices', () => {
    assert.equal(
      replaceWithMetric('Only $10 in stock'),
      'Only $10 in stock'
    );
  });

  it('does not double-convert when metric already follows in parens', () => {
    assert.equal(
      replaceWithMetric('6.6FT (2.01 m)'),
      '6.6FT (2.01 m)'
    );
  });

  it('converts "36 in" with bare in', () => {
    assert.equal(
      replaceWithMetric('36 in'),
      '36 in (91.44 cm)'
    );
  });

  it('does not double-convert dimensions with existing metric', () => {
    assert.equal(
      replaceWithMetric('10 x 5 x 2 inches (25.40 \u00D7 12.70 \u00D7 5.08 cm)'),
      '10 x 5 x 2 inches (25.40 \u00D7 12.70 \u00D7 5.08 cm)'
    );
  });
});
