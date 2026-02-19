import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findMeasurements } from '../patterns.js';

// =============================================================================
// Edge-case tests for current patterns (before adding new metric types).
//
// These tests document how the CURRENT codebase behaves with inputs that will
// matter when we add: combined_lbs_oz, pounds, weight_oz, gallons, quarts,
// pints, fahrenheit, sq_feet, sq_inches, psi, mph, miles.
//
// Tests that assert CURRENT behavior which will need to change are marked with
// TODO comments explaining the expected future behavior.
// =============================================================================

describe('Cross-pattern conflicts', () => {
  it('"400 sq ft" — matches sq_feet', () => {
    const results = findMeasurements('400 sq ft');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_feet');
    assert.equal(results[0].value, 400);
  });

  it('"144 sq in" — matches sq_inches', () => {
    const results = findMeasurements('144 sq in');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_inches');
    assert.equal(results[0].value, 144);
  });

  it('"20 miles per hour" — matches mph', () => {
    const results = findMeasurements('20 miles per hour');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'mph');
  });

  it('"5 miles" — matches miles', () => {
    const results = findMeasurements('5 miles');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'miles');
  });

  it('"35 PSI" — matches psi', () => {
    const results = findMeasurements('35 PSI');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'psi');
  });

  it('"350°F" — matches fahrenheit', () => {
    const results = findMeasurements('350°F');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'fahrenheit');
  });
});

describe('Fluid oz ambiguity (current behavior)', () => {
  it('"8 fl oz" — currently matches fluid_oz (correct, should stay)', () => {
    const results = findMeasurements('8 fl oz');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'fluid_oz');
    assert.equal(results[0].value, 8);
  });

  it('"8 oz" — now matches weight_oz', () => {
    const results = findMeasurements('8 oz');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'weight_oz');
    assert.equal(results[0].value, 8);
  });

  it('"16 ounces" — now matches weight_oz', () => {
    const results = findMeasurements('16 ounces');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'weight_oz');
    assert.equal(results[0].value, 16);
  });

  it('"8 fl. oz." — currently matches fluid_oz (should stay)', () => {
    const results = findMeasurements('8 fl. oz.');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'fluid_oz');
    assert.equal(results[0].value, 8);
  });
});

describe('Word boundary hazards for new patterns', () => {
  // These test strings that new patterns must be careful NOT to match.
  // Current patterns should not match any of these either.

  it('"5 miles from here" — matches miles', () => {
    const results = findMeasurements('5 miles from here');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'miles');
  });

  it('"5 mild days" — "mi" in "mild" must not match', () => {
    const results = findMeasurements('5 mild days');
    // No current patterns match, good. When miles pattern is added,
    // this must still be 0 matches — "mild" is not "miles".
    assert.equal(results.length, 0);
  });

  it('"2 pt size" — matches pints (pt is a word boundary before space)', () => {
    const results = findMeasurements('2 pt size');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'pints');
    assert.equal(results[0].value, 2);
  });

  it('"2 pints" — matches pints', () => {
    const results = findMeasurements('2 pints');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'pints');
  });

  it('"1 qt bag" — matches quarts', () => {
    const results = findMeasurements('1 qt bag');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'quarts');
    assert.equal(results[0].value, 1);
  });

  it('"1 quart" — matches quarts', () => {
    const results = findMeasurements('1 quart');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'quarts');
  });

  it('"gallery" — "gal" inside a word must not match', () => {
    const results = findMeasurements('Visit our gallery');
    // No number prefix, and "gal" is embedded in "gallery". No match expected
    // now or after adding gallons pattern.
    assert.equal(results.length, 0);
  });

  it('"2 gallons" — matches gallons', () => {
    const results = findMeasurements('2 gallons');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'gallons');
  });

  it('"album" — "lb" inside a word must not match', () => {
    const results = findMeasurements('Check out this album');
    // "lb" is embedded in "album". No number prefix either. No match.
    assert.equal(results.length, 0);
  });

  it('"2 lbs" — now matches pounds', () => {
    const results = findMeasurements('2 lbs');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'pounds');
  });

  it('"PSI Sigma" — PSI without number prefix must not match', () => {
    const results = findMeasurements('PSI Sigma fraternity');
    // No number before "PSI". Should never match as pressure.
    assert.equal(results.length, 0);
  });

  it('"35 PSI" — matches psi', () => {
    const results = findMeasurements('35 PSI');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'psi');
  });
});

describe('Combined format conflicts', () => {
  it('"2 lbs 4 oz bag" — matches combined_lbs_oz', () => {
    const results = findMeasurements('2 lbs 4 oz bag');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'combined_lbs_oz');
    assert.equal(results[0].pounds, 2);
    assert.equal(results[0].oz, 4);
  });

  it('"20 miles per hour" — matches mph (not miles)', () => {
    const results = findMeasurements('20 miles per hour');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'mph');
  });
});

describe('Temperature edge cases', () => {
  it('"-40°F" — matches fahrenheit with negative value', () => {
    const results = findMeasurements('-40°F');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'fahrenheit');
    assert.equal(results[0].value, -40);
  });

  it('"72°F to 104°F" — matches two fahrenheit values', () => {
    const results = findMeasurements('72°F to 104°F');
    assert.equal(results.length, 2);
    assert.equal(results[0].type, 'fahrenheit');
    assert.equal(results[0].value, 72);
    assert.equal(results[1].type, 'fahrenheit');
    assert.equal(results[1].value, 104);
  });

  it('"Model F150" — should NOT match fahrenheit (no degree symbol)', () => {
    const results = findMeasurements('Model F150');
    // No current match. Must remain 0 after fahrenheit pattern is added.
    // The fahrenheit pattern should require ° before F.
    assert.equal(results.length, 0);
  });

  it('"350 F" (no degree symbol) — should NOT match per design decision', () => {
    const results = findMeasurements('350 F');
    // No current match. Design decision: require degree symbol (°) to avoid
    // false positives on model numbers, sizes, etc.
    // TODO: Ensure fahrenheit regex requires ° (e.g., \d+\s*°\s*F).
    assert.equal(results.length, 0);
  });
});

describe('Area edge cases', () => {
  it('"400 sq ft room" — matches sq_feet', () => {
    const results = findMeasurements('400 sq ft room');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_feet');
  });

  it('"400 ft cable" — matches current feet pattern', () => {
    // This SHOULD match feet (and continue to match feet even after sq_feet
    // is added, since there is no "sq" prefix).
    const results = findMeasurements('400 ft cable');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'feet');
    assert.equal(results[0].value, 400);
  });

  it('"12 ft² area" — matches sq_feet (sq_feet ordered before feet)', () => {
    const results = findMeasurements('12 ft² area');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_feet');
    assert.equal(results[0].value, 12);
  });

  it('"100 square feet" — matches sq_feet', () => {
    const results = findMeasurements('100 square feet');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_feet');
    assert.equal(results[0].value, 100);
  });
});

describe('Already-converted detection', () => {
  // The current ALREADY_CONVERTED regex is:
  //   /^\s*\(\d+(?:\.\d+)?(?:\s*[×x]\s*\d+(?:\.\d+)?)*\s*(?:cm|m|mL|L)\)/
  // It only recognizes cm, m, mL, L in parens. It does NOT recognize
  // g, kg, bar, °C, km/h, kPa, m², cm², etc.

  it('"8 oz (227.00 g)" — weight_oz matches "8 oz" but ALREADY_CONVERTED skips it (g is in ALREADY_CONVERTED)', () => {
    const results = findMeasurements('8 oz (227.00 g)');
    assert.equal(results.length, 0);
  });

  it('"35 PSI (2.41 bar)" — psi matches but ALREADY_CONVERTED skips it (bar is in ALREADY_CONVERTED)', () => {
    const results = findMeasurements('35 PSI (2.41 bar)');
    assert.equal(results.length, 0);
  });

  it('"350°F (176.67 °C)" — fahrenheit matches but ALREADY_CONVERTED skips it (°C is in ALREADY_CONVERTED)', () => {
    const results = findMeasurements('350°F (176.67 °C)');
    assert.equal(results.length, 0);
  });

  it('"16 oz (473.18 mL)" — current code DOES skip (mL IS in ALREADY_CONVERTED)', () => {
    // fluid_oz matches "16 oz", the text after is " (473.18 mL)".
    // ALREADY_CONVERTED recognizes mL, so this is correctly skipped.
    const results = findMeasurements('16 oz (473.18 mL)');
    assert.equal(
      results.length,
      0,
      'correctly skipped — mL is in ALREADY_CONVERTED',
    );
  });

  it('"6.6 feet (2.01 m)" — current code DOES skip (m IS in ALREADY_CONVERTED)', () => {
    const results = findMeasurements('6.6 feet (2.01 m)');
    assert.equal(
      results.length,
      0,
      'correctly skipped — m is in ALREADY_CONVERTED',
    );
  });
});

describe('Overlap priority with existing patterns', () => {
  // Verify that the overlap-prevention logic (coveredRanges) works correctly
  // with inputs that will interact with new patterns.

  it('"5 ft 10 in" — combined_ft_in wins over standalone feet and inches', () => {
    const results = findMeasurements('5 ft 10 in');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'combined_ft_in');
    assert.equal(results[0].feet, 5);
    assert.equal(results[0].inches, 10);
  });

  it('"Room is 400 sq ft with 10 ft ceilings" — matches sq_feet and feet', () => {
    const results = findMeasurements('Room is 400 sq ft with 10 ft ceilings');
    assert.equal(results.length, 2);
    assert.equal(results[0].type, 'sq_feet');
    assert.equal(results[0].value, 400);
    assert.equal(results[1].type, 'feet');
    assert.equal(results[1].value, 10);
  });

  it('"32 fl oz bottle, 4 oz per serving" — "32 fl oz" is fluid_oz, "4 oz" is weight_oz', () => {
    const results = findMeasurements('32 fl oz bottle, 4 oz per serving');
    assert.equal(results.length, 2);
    assert.equal(results[0].type, 'fluid_oz');
    assert.equal(results[0].value, 32);
    assert.equal(results[1].type, 'weight_oz');
    assert.equal(results[1].value, 4);
  });
});

describe('Numeric edge cases relevant to new patterns', () => {
  it('"0.5 miles" — matches miles', () => {
    const results = findMeasurements('0.5 miles');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'miles');
    assert.equal(results[0].value, 0.5);
  });

  it('"1,200 sq ft" — matches sq_feet with comma-number support', () => {
    const results = findMeasurements('1,200 sq ft');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'sq_feet');
    assert.equal(results[0].value, 1200);
  });

  it('"1,200 ft" — comma-number support now captures full number', () => {
    const results = findMeasurements('1,200 ft');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'feet');
    assert.equal(results[0].value, 1200);
    assert.equal(results[0].matched, '1,200 ft');
  });
});
