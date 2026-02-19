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

  describe('bare in (standalone inches)', () => {
    it('matches "36 in" at end of string', () => {
      const results = findMeasurements('36 in');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
      assert.equal(results[0].value, 36);
    });
    it('matches "36 in," followed by comma', () => {
      const results = findMeasurements('36 in, very nice');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
      assert.equal(results[0].value, 36);
    });
    it('matches "2.5 in" with decimal', () => {
      const results = findMeasurements('2.5 in');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
      assert.equal(results[0].value, 2.5);
    });
    it('rejects "5 in stock"', () => {
      const results = findMeasurements('5 in stock');
      assert.equal(results.length, 0);
    });
    it('rejects "5 in the box"', () => {
      const results = findMeasurements('5 in the box');
      assert.equal(results.length, 0);
    });
    it('rejects "available in all colors"', () => {
      const results = findMeasurements('available in all colors');
      assert.equal(results.length, 0);
    });
    it('rejects "5 in cart"', () => {
      const results = findMeasurements('5 in cart');
      assert.equal(results.length, 0);
    });
    it('rejects "comes in a box"', () => {
      const results = findMeasurements('comes in a box');
      assert.equal(results.length, 0);
    });
  });

  describe('fluid ounces', () => {
    it('matches "8 fl oz"', () => {
      const results = findMeasurements('8 fl oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fluid_oz');
      assert.equal(results[0].value, 8);
    });
    it('"16 oz" matches weight_oz (not fluid_oz)', () => {
      const results = findMeasurements('16 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
    });
    it('"12 ounces" matches weight_oz (not fluid_oz)', () => {
      const results = findMeasurements('12 ounces');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
    });
    it('"1 ounce" matches weight_oz (not fluid_oz)', () => {
      const results = findMeasurements('1 ounce');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
    });
    it('"16 onzas" matches weight_oz (not fluid_oz)', () => {
      const results = findMeasurements('16 onzas');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
    });
    it('"1 onza" matches weight_oz (not fluid_oz)', () => {
      const results = findMeasurements('1 onza');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
    });
    it('matches "8 fl. oz."', () => {
      const results = findMeasurements('8 fl. oz.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fluid_oz');
      assert.equal(results[0].value, 8);
    });
    it('matches "20 fluid ounces"', () => {
      const results = findMeasurements('20 fluid ounces');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fluid_oz');
      assert.equal(results[0].value, 20);
    });
  });

  describe('comma-separated numbers', () => {
    it('matches "1,200 ft" as 1200 feet', () => {
      const results = findMeasurements('1,200 ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 1200);
    });

    it('matches "1,200 inches" as 1200 inches', () => {
      const results = findMeasurements('1,200 inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'inches');
      assert.equal(results[0].value, 1200);
    });

    it('matches "10,000 ft" as 10000 feet', () => {
      const results = findMeasurements('10,000 ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 10000);
    });

    it('matches "1,200.5 ft" as 1200.5 feet', () => {
      const results = findMeasurements('1,200.5 ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 1200.5);
    });

    it('matches "8 fl oz" with comma-number regex (no comma, still works)', () => {
      const results = findMeasurements('8 fl oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fluid_oz');
      assert.equal(results[0].value, 8);
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
      const results = findMeasurements(
        '10 x 5 x 2 inches (25.40 \u00D7 12.70 \u00D7 5.08 cm)',
      );
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

  describe('combined_lbs_oz', () => {
    it('matches "2 lbs 4 oz"', () => {
      const results = findMeasurements('2 lbs 4 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_lbs_oz');
      assert.equal(results[0].pounds, 2);
      assert.equal(results[0].oz, 4);
    });

    it('matches "5 pounds 8 ounces"', () => {
      const results = findMeasurements('5 pounds 8 ounces');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_lbs_oz');
      assert.equal(results[0].pounds, 5);
      assert.equal(results[0].oz, 8);
    });

    it('matches "1 lb 2 oz"', () => {
      const results = findMeasurements('1 lb 2 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_lbs_oz');
    });

    it('matches "1,000 lbs 4 oz" with comma number', () => {
      const results = findMeasurements('1,000 lbs 4 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'combined_lbs_oz');
      assert.equal(results[0].pounds, 1000);
      assert.equal(results[0].oz, 4);
    });
  });

  describe('pounds', () => {
    it('matches "5 lbs"', () => {
      const results = findMeasurements('5 lbs');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pounds');
      assert.equal(results[0].value, 5);
    });

    it('matches "2.5 pounds"', () => {
      const results = findMeasurements('2.5 pounds');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pounds');
      assert.equal(results[0].value, 2.5);
    });

    it('matches "10 lb."', () => {
      const results = findMeasurements('10 lb.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pounds');
    });

    it('does not match "album" (lb inside word)', () => {
      const results = findMeasurements('Check out this album');
      assert.equal(results.length, 0);
    });

    it('matches "1,200 lbs" with comma number', () => {
      const results = findMeasurements('1,200 lbs');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pounds');
      assert.equal(results[0].value, 1200);
    });
  });

  describe('weight_oz', () => {
    it('matches "8 oz" as weight', () => {
      const results = findMeasurements('8 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
      assert.equal(results[0].value, 8);
    });

    it('matches "16 ounces" as weight', () => {
      const results = findMeasurements('16 ounces');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
      assert.equal(results[0].value, 16);
    });

    it('matches "1 onza" as weight', () => {
      const results = findMeasurements('1 onza');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
      assert.equal(results[0].value, 1);
    });

    it('"8 fl oz" still matches fluid_oz, not weight_oz', () => {
      const results = findMeasurements('8 fl oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fluid_oz');
    });

    it('matches "1,500 oz" with comma number', () => {
      const results = findMeasurements('1,500 oz');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'weight_oz');
      assert.equal(results[0].value, 1500);
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

  describe('sq_feet', () => {
    it('matches "400 sq ft"', () => {
      const results = findMeasurements('400 sq ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_feet');
      assert.equal(results[0].value, 400);
    });

    it('matches "100 square feet"', () => {
      const results = findMeasurements('100 square feet');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_feet');
      assert.equal(results[0].value, 100);
    });

    it('matches "12 ft²"', () => {
      const results = findMeasurements('12 ft²');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_feet');
      assert.equal(results[0].value, 12);
    });

    it('matches "1,200 sq ft" with comma number', () => {
      const results = findMeasurements('1,200 sq ft');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_feet');
      assert.equal(results[0].value, 1200);
    });

    it('does not steal "400 ft cable" from feet pattern', () => {
      const results = findMeasurements('400 ft cable');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'feet');
      assert.equal(results[0].value, 400);
    });

    it('matches "50 sq. ft."', () => {
      const results = findMeasurements('50 sq. ft.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_feet');
      assert.equal(results[0].value, 50);
    });
  });

  describe('sq_inches', () => {
    it('matches "144 sq in"', () => {
      const results = findMeasurements('144 sq in');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_inches');
      assert.equal(results[0].value, 144);
    });

    it('matches "10 square inches"', () => {
      const results = findMeasurements('10 square inches');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_inches');
      assert.equal(results[0].value, 10);
    });

    it('matches "20 in²"', () => {
      const results = findMeasurements('20 in²');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'sq_inches');
      assert.equal(results[0].value, 20);
    });
  });

  describe('gallons', () => {
    it('matches "2 gallons"', () => {
      const results = findMeasurements('2 gallons');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'gallons');
      assert.equal(results[0].value, 2);
    });

    it('matches "1 gallon"', () => {
      const results = findMeasurements('1 gallon');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'gallons');
    });

    it('matches "5 gal"', () => {
      const results = findMeasurements('5 gal');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'gallons');
      assert.equal(results[0].value, 5);
    });

    it('matches "0.5 gal."', () => {
      const results = findMeasurements('0.5 gal.');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'gallons');
      assert.equal(results[0].value, 0.5);
    });

    it('does not match "gallery"', () => {
      const results = findMeasurements('Visit our gallery');
      assert.equal(results.length, 0);
    });

    it('matches "1,000 gallons" with comma number', () => {
      const results = findMeasurements('1,000 gallons');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'gallons');
      assert.equal(results[0].value, 1000);
    });
  });

  describe('quarts', () => {
    it('matches "1 quart"', () => {
      const results = findMeasurements('1 quart');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'quarts');
      assert.equal(results[0].value, 1);
    });

    it('matches "3 qt"', () => {
      const results = findMeasurements('3 qt');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'quarts');
      assert.equal(results[0].value, 3);
    });

    it('matches "2 quarts"', () => {
      const results = findMeasurements('2 quarts');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'quarts');
    });

    it('matches "1 qt bag"', () => {
      const results = findMeasurements('1 qt bag');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'quarts');
      assert.equal(results[0].value, 1);
    });
  });

  describe('pints', () => {
    it('matches "2 pints"', () => {
      const results = findMeasurements('2 pints');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pints');
      assert.equal(results[0].value, 2);
    });

    it('matches "1 pint"', () => {
      const results = findMeasurements('1 pint');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pints');
    });

    it('matches "3 pt"', () => {
      const results = findMeasurements('3 pt');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pints');
      assert.equal(results[0].value, 3);
    });

    it('matches "2 pt size" (pt followed by word is still a word boundary match)', () => {
      const results = findMeasurements('2 pt size');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'pints');
      assert.equal(results[0].value, 2);
    });
  });

  describe('fahrenheit', () => {
    it('matches "350°F"', () => {
      const results = findMeasurements('350°F');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, 350);
    });

    it('matches "72 °F" (space before F)', () => {
      const results = findMeasurements('72 °F');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, 72);
    });

    it('matches "350℉" (single character ℉)', () => {
      const results = findMeasurements('350℉');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, 350);
    });

    it('matches "350 degrees fahrenheit"', () => {
      const results = findMeasurements('350 degrees fahrenheit');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, 350);
    });

    it('matches "-40°F" (negative)', () => {
      const results = findMeasurements('-40°F');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, -40);
    });

    it('matches "72°F to 104°F" (two temps)', () => {
      const results = findMeasurements('72°F to 104°F');
      assert.equal(results.length, 2);
      assert.equal(results[0].type, 'fahrenheit');
      assert.equal(results[0].value, 72);
      assert.equal(results[1].type, 'fahrenheit');
      assert.equal(results[1].value, 104);
    });

    it('does not match "Model F150" (no degree symbol)', () => {
      const results = findMeasurements('Model F150');
      assert.equal(results.length, 0);
    });

    it('does not match "350 F" (no degree symbol)', () => {
      const results = findMeasurements('350 F');
      assert.equal(results.length, 0);
    });
  });

  describe('psi', () => {
    it('matches "35 PSI"', () => {
      const results = findMeasurements('35 PSI');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'psi');
      assert.equal(results[0].value, 35);
    });

    it('matches "120 psi"', () => {
      const results = findMeasurements('120 psi');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'psi');
    });

    it('does not match "PSI Sigma" (no number prefix)', () => {
      const results = findMeasurements('PSI Sigma fraternity');
      assert.equal(results.length, 0);
    });

    it('matches "2,500 psi" with comma number', () => {
      const results = findMeasurements('2,500 psi');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'psi');
      assert.equal(results[0].value, 2500);
    });
  });

  describe('mph', () => {
    it('matches "60 mph"', () => {
      const results = findMeasurements('60 mph');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'mph');
      assert.equal(results[0].value, 60);
    });

    it('matches "20 miles per hour"', () => {
      const results = findMeasurements('20 miles per hour');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'mph');
      assert.equal(results[0].value, 20);
    });

    it('matches "100 MPH"', () => {
      const results = findMeasurements('100 MPH');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'mph');
    });

    it('mph wins over miles for "20 miles per hour"', () => {
      const results = findMeasurements('20 miles per hour');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'mph');
    });
  });

  describe('miles', () => {
    it('matches "5 miles"', () => {
      const results = findMeasurements('5 miles');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'miles');
      assert.equal(results[0].value, 5);
    });

    it('matches "1 mile"', () => {
      const results = findMeasurements('1 mile');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'miles');
    });

    it('matches "0.5 mi"', () => {
      const results = findMeasurements('0.5 mi');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'miles');
      assert.equal(results[0].value, 0.5);
    });

    it('does not match "mild" (mi inside word)', () => {
      const results = findMeasurements('5 mild days');
      assert.equal(results.length, 0);
    });

    it('matches "1,000 miles" with comma number', () => {
      const results = findMeasurements('1,000 miles');
      assert.equal(results.length, 1);
      assert.equal(results[0].type, 'miles');
      assert.equal(results[0].value, 1000);
    });
  });
});
