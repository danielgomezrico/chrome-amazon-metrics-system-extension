import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  inchesToCm,
  feetToM,
  formatMetric,
  formatVolume,
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
  convertFlOz,
  formatWeight,
  convertOz,
  convertPounds,
  convertPoundsOz,
  convertGallons,
  convertQuarts,
  convertPints,
  convertFahrenheit,
  formatArea,
  convertSqFeet,
  convertSqInches,
  convertPsi,
  convertMph,
  convertMiles,
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

describe('formatVolume', () => {
  it('formats mL < 1000 as mL with 2 decimal places', () => {
    assert.equal(formatVolume(500.5), '500.50 mL');
  });
  it('formats mL >= 1000 as liters with 2 decimal places', () => {
    assert.equal(formatVolume(1500), '1.50 L');
  });
  it('formats exactly 1000 mL as liters', () => {
    assert.equal(formatVolume(1000), '1.00 L');
  });
  it('formats 0 as 0.00 mL', () => {
    assert.equal(formatVolume(0), '0.00 mL');
  });
});

describe('convertFlOz', () => {
  it('converts 1 fl oz to 29.57 mL', () => {
    assert.equal(convertFlOz(1), '29.57 mL');
  });
  it('converts 16 fl oz to 473.18 mL', () => {
    assert.equal(convertFlOz(16), '473.18 mL');
  });
  it('converts 64 fl oz to liters', () => {
    assert.equal(convertFlOz(64), '1.89 L');
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

describe('formatWeight', () => {
  it('formats grams < 1000 as g', () => {
    assert.equal(formatWeight(500), '500.00 g');
  });
  it('formats grams >= 1000 as kg', () => {
    assert.equal(formatWeight(1500), '1.50 kg');
  });
  it('formats exactly 1000 g as kg', () => {
    assert.equal(formatWeight(1000), '1.00 kg');
  });
  it('formats 0 as 0.00 g', () => {
    assert.equal(formatWeight(0), '0.00 g');
  });
});

describe('convertOz (weight)', () => {
  it('converts 1 oz to ~28.35 g', () => {
    assert.equal(convertOz(1), '28.35 g');
  });
  it('converts 16 oz to ~453.59 g', () => {
    assert.equal(convertOz(16), '453.59 g');
  });
  it('converts 40 oz to ~1.13 kg', () => {
    assert.equal(convertOz(40), '1.13 kg');
  });
});

describe('convertPounds', () => {
  it('converts 1 lb to ~453.59 g', () => {
    assert.equal(convertPounds(1), '453.59 g');
  });
  it('converts 5 lbs to ~2.27 kg', () => {
    assert.equal(convertPounds(5), '2.27 kg');
  });
});

describe('convertPoundsOz', () => {
  it('converts 2 lbs 4 oz to ~1.02 kg', () => {
    assert.equal(convertPoundsOz(2, 4), '1.02 kg');
  });
  it('converts 0 lbs 8 oz to ~226.80 g', () => {
    assert.equal(convertPoundsOz(0, 8), '226.80 g');
  });
});

describe('convertGallons', () => {
  it('converts 1 gallon to ~3.79 L', () => {
    assert.equal(convertGallons(1), '3.79 L');
  });
  it('converts 0.5 gallon to ~1.89 L', () => {
    assert.equal(convertGallons(0.5), '1.89 L');
  });
});

describe('convertQuarts', () => {
  it('converts 1 quart to ~946.35 mL', () => {
    assert.equal(convertQuarts(1), '946.35 mL');
  });
  it('converts 2 quarts to ~1.89 L', () => {
    assert.equal(convertQuarts(2), '1.89 L');
  });
});

describe('convertPints', () => {
  it('converts 1 pint to ~473.18 mL', () => {
    assert.equal(convertPints(1), '473.18 mL');
  });
  it('converts 4 pints to ~1.89 L', () => {
    assert.equal(convertPints(4), '1.89 L');
  });
});

describe('convertFahrenheit', () => {
  it('converts 32°F to 0.00 °C', () => {
    assert.equal(convertFahrenheit(32), '0.00 °C');
  });
  it('converts 212°F to 100.00 °C', () => {
    assert.equal(convertFahrenheit(212), '100.00 °C');
  });
  it('converts -40°F to -40.00 °C', () => {
    assert.equal(convertFahrenheit(-40), '-40.00 °C');
  });
  it('converts 350°F to 176.67 °C', () => {
    assert.equal(convertFahrenheit(350), '176.67 °C');
  });
  it('converts 72°F to 22.22 °C', () => {
    assert.equal(convertFahrenheit(72), '22.22 °C');
  });
});

describe('formatArea', () => {
  it('formats cm² < 10000 as cm²', () => {
    assert.equal(formatArea(5000), '5000.00 cm²');
  });
  it('formats cm² >= 10000 as m²', () => {
    assert.equal(formatArea(20000), '2.00 m²');
  });
  it('formats exactly 10000 cm² as m²', () => {
    assert.equal(formatArea(10000), '1.00 m²');
  });
});

describe('convertSqFeet', () => {
  it('converts 1 sq ft to ~929.03 cm²', () => {
    assert.equal(convertSqFeet(1), '929.03 cm²');
  });
  it('converts 400 sq ft to ~37.16 m²', () => {
    assert.equal(convertSqFeet(400), '37.16 m²');
  });
  it('converts 1200 sq ft to ~111.48 m²', () => {
    assert.equal(convertSqFeet(1200), '111.48 m²');
  });
});

describe('convertSqInches', () => {
  it('converts 1 sq in to ~6.45 cm²', () => {
    assert.equal(convertSqInches(1), '6.45 cm²');
  });
  it('converts 144 sq in (= 1 sq ft) to ~929.03 cm²', () => {
    assert.equal(convertSqInches(144), '929.03 cm²');
  });
});

describe('convertPsi', () => {
  it('converts 35 PSI to ~2.41 bar', () => {
    assert.equal(convertPsi(35), '2.41 bar');
  });
  it('converts 14.7 PSI (1 atm) to ~1.01 bar', () => {
    assert.equal(convertPsi(14.7), '1.01 bar');
  });
});

describe('convertMph', () => {
  it('converts 60 mph to ~96.56 km/h', () => {
    assert.equal(convertMph(60), '96.56 km/h');
  });
  it('converts 100 mph to ~160.93 km/h', () => {
    assert.equal(convertMph(100), '160.93 km/h');
  });
});

describe('convertMiles', () => {
  it('converts 1 mile to ~1.61 km', () => {
    assert.equal(convertMiles(1), '1.61 km');
  });
  it('converts 5 miles to ~8.05 km', () => {
    assert.equal(convertMiles(5), '8.05 km');
  });
  it('converts 0.5 miles to ~0.80 km', () => {
    assert.equal(convertMiles(0.5), '0.80 km');
  });
});
