import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  inchesToCm,
  feetToM,
  formatMetric,
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
} from '../conversion.js';

describe('inchesToCm', () => {
  it('converts 1 inch to 2.54 cm', () => {
    assert.equal(inchesToCm(1), 2.54);
  });
  it('converts 12 inches to 30.48 cm', () => {
    assert.equal(inchesToCm(12), 30.48);
  });
  it('converts 0 inches to 0 cm', () => {
    assert.equal(inchesToCm(0), 0);
  });
  it('converts decimal inches', () => {
    assert.equal(inchesToCm(6.5), 16.51);
  });
});

describe('feetToM', () => {
  it('converts 1 foot to 0.3048 m', () => {
    assert.equal(feetToM(1), 0.3048);
  });
  it('converts 6.6 feet to 2.0117 m (raw)', () => {
    assert.equal(feetToM(6.6), 2.01168);
  });
  it('converts 0 feet to 0 m', () => {
    assert.equal(feetToM(0), 0);
  });
});

describe('formatMetric', () => {
  it('formats cm < 100 as cm with 2 decimal places', () => {
    assert.equal(formatMetric(50.123), '50.12 cm');
  });
  it('formats cm >= 100 as meters with 2 decimal places', () => {
    assert.equal(formatMetric(200.567), '2.01 m');
  });
  it('formats exactly 100 cm as meters', () => {
    assert.equal(formatMetric(100), '1.00 m');
  });
  it('formats 0 as 0.00 cm', () => {
    assert.equal(formatMetric(0), '0.00 cm');
  });
  it('strips trailing zeros when whole number', () => {
    assert.equal(formatMetric(254), '2.54 m');
  });
});

describe('convertInches', () => {
  it('converts 36 inches', () => {
    assert.equal(convertInches(36), '91.44 cm');
  });
  it('converts 48 inches to meters', () => {
    assert.equal(convertInches(48), '1.22 m');
  });
});

describe('convertFeet', () => {
  it('converts 6.6 feet', () => {
    assert.equal(convertFeet(6.6), '2.01 m');
  });
  it('converts 2 feet', () => {
    assert.equal(convertFeet(2), '60.96 cm');
  });
});

describe('convertFeetInches', () => {
  it('converts 5 feet 3 inches', () => {
    assert.equal(convertFeetInches(5, 3), '1.60 m');
  });
  it('converts 6 feet 0 inches', () => {
    assert.equal(convertFeetInches(6, 0), '1.83 m');
  });
});

describe('convertDimensions2D', () => {
  it('converts 10 x 5 inches', () => {
    assert.equal(convertDimensions2D(10, 5), '25.40 x 12.70 cm');
  });
});

describe('convertDimensions3D', () => {
  it('converts 10 x 5 x 2 inches', () => {
    assert.equal(convertDimensions3D(10, 5, 2), '25.40 x 12.70 x 5.08 cm');
  });
  it('converts large dimensions to meters', () => {
    assert.equal(convertDimensions3D(48, 24, 12), '1.22 x 0.61 x 0.30 m');
  });
});
