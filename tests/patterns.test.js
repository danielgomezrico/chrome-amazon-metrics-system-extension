import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findMeasurements } from '../patterns.js';

describe('findMeasurements', () => {
  describe('fractional feet+inches', () => {
    it('matches 5\' 3 1/2"', () => {
      const results = findMeasurements(`5' 3 1/2"`);
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fractional_ft_in');
      assert.equal(results[0].feet, 5);
      assert.equal(results[0].inches, 3.5);
    });
  });

  describe('combined feet+inches', () => {
    it('matches 5 feet 3 inches', () => {
      const results = findMeasurements('5 feet 3 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
      assert.equal(results[0].feet, 5);
      assert.equal(results[0].inches, 3);
    });
    it('matches 5\'3"', () => {
      const results = findMeasurements('5\'3"');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
    });
    it('matches 10ft 6in', () => {
      const results = findMeasurements('10ft 6in');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
      assert.equal(results[0].feet, 10);
      assert.equal(results[0].inches, 6);
    });
  });

  describe('3D dimensions', () => {
    it('matches 10 x 5 x 2 inches', () => {
      const results = findMeasurements('10 x 5 x 2 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'dimensions_3d');
      assert.deepEqual(results[0].values, [10, 5, 2]);
    });
    it('matches 10.5 x 5.25 x 2.1 in.', () => {
      const results = findMeasurements('10.5 x 5.25 x 2.1 in.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'dimensions_3d');
    });
    it('matches unicode multiply sign', () => {
      const results = findMeasurements('10 \u00D7 5 \u00D7 2 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'dimensions_3d');
    });
  });

  describe('2D dimensions', () => {
    it('matches 10 x 5 inches', () => {
      const results = findMeasurements('10 x 5 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'dimensions_2d');
      assert.deepEqual(results[0].values, [10, 5]);
    });
  });

  describe('feet only', () => {
    it('matches 6.6 feet', () => {
      const results = findMeasurements('6.6 feet');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 6.6);
    });
    it('matches 10 ft', () => {
      const results = findMeasurements('10 ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
    });
    it('matches 6.6FT (no space, uppercase)', () => {
      const results = findMeasurements('6.6FT');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 6.6);
    });
    it('does not match feet when followed by inches digit (combined pattern)', () => {
      const results = findMeasurements('5 feet 3 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
    });
  });

  describe('inches (safe forms)', () => {
    it('matches 36 inches', () => {
      const results = findMeasurements('36 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
      assert.equal(results[0].value, 36);
    });
    it('matches 12"', () => {
      const results = findMeasurements('He said 12" is enough');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
    });
    it('matches 6 in.', () => {
      const results = findMeasurements('6 in.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
    });
  });

  describe('no false positives', () => {
    it('ignores prices like $10', () => {
      const results = findMeasurements('Only $10 in stock');
      assert.equal(results.length, 0);
    });
    it('ignores "in the box"', () => {
      const results = findMeasurements('Included in the box');
      assert.equal(results.length, 0);
    });
    it('ignores "in stock"', () => {
      const results = findMeasurements('5 in stock');
      assert.equal(results.length, 0);
    });
    it('ignores already-metric values', () => {
      const results = findMeasurements('25.4 x 12.7 x 5.08 cm');
      assert.equal(results.length, 0);
    });
    it('ignores "in a"', () => {
      const results = findMeasurements('comes in a box');
      assert.equal(results.length, 0);
    });
  });

  describe('already-converted (metric follows in parens)', () => {
    it('skips feet already followed by metric conversion', () => {
      const results = findMeasurements('6.6FT (2.01 m)');
      assert.equal(results.length, 0);
    });
    it('skips inches already followed by metric conversion', () => {
      const results = findMeasurements('36 inches (91.44 cm)');
      assert.equal(results.length, 0);
    });
    it('skips dimensions already followed by metric conversion', () => {
      const results = findMeasurements('10 x 5 x 2 inches (25.40 \u00D7 12.70 \u00D7 5.08 cm)');
      assert.equal(results.length, 0);
    });
    it('still converts when no metric follows', () => {
      const results = findMeasurements('6.6FT cable');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
    });
    it('still converts in text that has metric elsewhere', () => {
      // "m)" appears later but not immediately after the match
      const results = findMeasurements('Cable is 6.6FT and rated 5m bandwidth');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
    });
  });

  describe('smart/curly quotes', () => {
    it('matches feet with right single quote \u2019', () => {
      const results = findMeasurements('6\u2019');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
    });
    it('matches inches with right double quote \u201D', () => {
      const results = findMeasurements('12\u201D');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
    });
    it('matches combined with curly quotes 5\u20193\u201D', () => {
      const results = findMeasurements('5\u20193\u201D');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
    });
  });

  describe('priority ordering', () => {
    it('matches combined before standalone when text has both patterns', () => {
      const results = findMeasurements('The cable is 5 feet 3 inches long');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_ft_in');
    });
  });

  describe('unicode handling', () => {
    it('strips LTR/RTL markers before matching', () => {
      const results = findMeasurements('\u200e6.6 feet\u200f');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
    });
  });
});
