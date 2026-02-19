# Implementation Plan: 12 New Measurement Types

**Date:** 2026-02-17
**Status:** Ready for implementation
**Files in scope:** `patterns.js`, `conversion.js`, `src/content.js`, `tests/patterns.test.js`, `tests/conversion.test.js`, `tests/edge-cases.test.js`

---

## Overview

Add 12 new measurement types to the Chrome extension (weight, volume, temperature, area, pressure, speed, distance) along with cross-cutting infrastructure changes (comma-number support, expanded already-converted detection, narrowed fluid_oz). Each milestone is independently testable and leaves all existing tests passing (with documented updates).

---

## Milestone 1: Cross-Cutting Changes

**Goal:** Update shared infrastructure used by all patterns -- comma-number support, expanded ALREADY_CONVERTED regex, and narrowed fluid_oz -- then fix all existing tests to match the new behavior.

### Files Changed

- `patterns.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js` (no changes expected, but verify)
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

**1a. Comma-number support in ALL existing patterns**

Replace every occurrence of `\d+(?:\.\d+)?` used as a number capture group with `\d{1,3}(?:,\d{3})*(?:\.\d+)?` so numbers like `1,200` and `12,500.5` are captured whole.

Affected patterns and the specific regex fragments:

| Pattern | Current capture | New capture |
|---|---|---|
| `combined_ft_in` (m[1] and m[2]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |
| `dimensions_3d` (m[1], m[2], m[3]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |
| `dimensions_2d` (m[1], m[2]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |
| `feet` (m[1]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |
| `inches` (m[1]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |
| `fluid_oz` (m[1]) | `(\d+(?:\.\d+)?)` | `(\d{1,3}(?:,\d{3})*(?:\.\d+)?)` |

Note: `fractional_ft_in` uses plain `(\d+)` for its four capture groups (feet integer, inches integer, numerator, denominator). These do not need comma support since fractional notation like `5' 3 1/2"` never uses comma-separated numbers.

In every `parse()` function that reads a captured number group, add `.replace(/,/g, '')` before `parseFloat`. For example:

```js
// Before:
value: parseFloat(m[1]),

// After:
value: parseFloat(m[1].replace(/,/g, '')),
```

Apply this change to:
- `combined_ft_in.parse`: m[1] and m[2]
- `dimensions_3d.parse`: m[1], m[2], m[3]
- `dimensions_2d.parse`: m[1], m[2]
- `feet.parse`: m[1]
- `inches.parse`: m[1]
- `fluid_oz.parse`: m[1]

**1b. Expand ALREADY_CONVERTED regex**

Current:
```js
const ALREADY_CONVERTED = /^\s*\(\d+(?:\.\d+)?(?:\s*[×x]\s*\d+(?:\.\d+)?)*\s*(?:cm|m|mL|L)\)/;
```

New:
```js
const ALREADY_CONVERTED = /^\s*\(-?\d+(?:\.\d+)?(?:\s*[×x]\s*-?\d+(?:\.\d+)?)*\s*(?:cm|m|mL|L|g|kg|°C|bar|km\/h|km|m²|cm²)\)/;
```

Changes:
- Add `-?` prefix inside the parens to allow negative values (e.g., `-40.00 °C`).
- Extend the unit alternation with `g|kg|°C|bar|km\/h|km|m²|cm²`.
- Order the alternation so longer units (`km/h`, `cm²`, `m²`, `mL`) are checked before shorter ones that could be substring prefixes. The regex engine handles this correctly with the alternation, but for clarity and maintenance order as: `cm²|cm|m²|mL|m|km\/h|km|L|g|kg|°C|bar`. Actually, since these are inside a group followed by `)`, no ambiguity arises, so keep the ordering readable: `cm|m|mL|L|g|kg|°C|bar|km\/h|km|m²|cm²`.

**1c. Narrow fluid_oz to explicit fluid forms only**

Current `fluid_oz` regex:
```js
/(\d+(?:\.\d+)?)\s*(?:fl\.?\s*oz\.?|fluid\s+ounces?|ounces?|onzas?|oz\.?)\b/gi
```

New `fluid_oz` regex (with comma-number support applied):
```js
/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:fl\.?\s*oz\.?|fluid\s+ounces?)\b/gi
```

Removed alternatives: `ounces?`, `onzas?`, `oz\.?` -- these move to the new `weight_oz` pattern in Milestone 2. Until M2, bare `oz`/`ounces`/`onzas` will produce no match. This is acceptable because M1 is a staging milestone not shipped independently.

### Test Changes

#### tests/patterns.test.js

**Update `fluid ounces` describe block:**

- Keep tests for `"8 fl oz"`, `"8 fl. oz."`, `"20 fluid ounces"` -- these still match `fluid_oz`.
- Remove or update these tests that use bare oz/ounces/onzas (they will no longer match `fluid_oz`):
  - `"16 oz"` -- change assertion to `results.length === 0` (bare oz no longer matches fluid_oz; will be re-added as weight_oz in M2).
  - `"12 ounces"` -- change assertion to `results.length === 0`.
  - `"1 ounce"` -- change assertion to `results.length === 0`.
  - `"16 onzas"` -- change assertion to `results.length === 0`.
  - `"1 onza"` -- change assertion to `results.length === 0`.

**Add `comma-number support` describe block:**

```js
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
```

#### tests/edge-cases.test.js

**Update `Fluid oz ambiguity` describe block:**

- `"8 oz"` test: Change assertion from `results.length === 1, type fluid_oz` to `results.length === 0` with comment that bare oz will match `weight_oz` after M2.
- `"16 ounces"` test: Change assertion from `results.length === 1, type fluid_oz` to `results.length === 0`.
- `"8 fl. oz."` test: Stays the same (still matches `fluid_oz`).
- `"8 fl oz"` test: Stays the same.

**Update `Already-converted detection` describe block:**

- `"8 oz (227.00 g)"` test: With narrowed fluid_oz, bare `oz` no longer matches anything, so change assertion to `results.length === 0` with comment that after M2, weight_oz will exist and ALREADY_CONVERTED will correctly skip it via the `g` unit.
- `"35 PSI (2.41 bar)"` test: Stays as `results.length === 0` (no PSI pattern yet), but update comment noting ALREADY_CONVERTED now includes `bar`.
- `"350°F (176.67 °C)"` test: Stays as `results.length === 0`, but update comment noting ALREADY_CONVERTED now includes `°C`.

**Update `Combined format conflicts` describe block:**

- `"2 lbs 4 oz bag"` test: With narrowed fluid_oz, `"4 oz"` no longer matches. Change assertion to `results.length === 0` with comment that M2 will add combined_lbs_oz to match the full string.

**Update `Numeric edge cases` describe block:**

- `"1,200 sq ft"` test: Stays as `results.length === 0` (no sq_feet pattern yet). Update comment to note that comma-number support is now in place.
- `"1,200 ft"` test: Change assertion from `value === 200, matched === '200 ft'` to `value === 1200, matched === '1,200 ft'` -- comma-number support now captures the full number.

**Update `Overlap priority with existing patterns` describe block:**

- `"32 fl oz bottle, 4 oz per serving"` test: With narrowed fluid_oz, only `"32 fl oz"` matches. Change assertion from `results.length === 2` to `results.length === 1`, keeping the first match as `fluid_oz, value 32`. Add comment that `"4 oz"` will match `weight_oz` after M2.

### Verification

```bash
node --test
```

**Done when:**
- All existing tests pass with updated assertions.
- New comma-number tests pass.
- `"1,200 ft"` correctly parses as value `1200`.
- Bare `oz`/`ounces`/`onzas` no longer match `fluid_oz`.
- ALREADY_CONVERTED regex matches `(227.00 g)`, `(2.41 bar)`, `(176.67 °C)`, `(-40.00 °C)`, `(37.00 m²)`.

---

## Milestone 2: Weight (combined_lbs_oz, pounds, weight_oz)

**Goal:** Add three weight patterns, two formatter functions, and three conversion functions.

### Files Changed

- `patterns.js`
- `conversion.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js`
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

Add three new pattern entries to the PATTERNS array. Insertion order matters:

1. `combined_lbs_oz` -- insert immediately BEFORE the current `feet` pattern (index 4 in the original array, after `dimensions_2d`). This ensures the combined pattern claims "2 lbs 4 oz" before standalone pounds or weight_oz can steal parts.

2. `pounds` -- insert after `combined_lbs_oz` (and before `feet`).

3. `weight_oz` -- insert immediately AFTER `fluid_oz`. This way `fl oz` / `fluid ounces` are tried first; bare `oz` / `ounces` / `onzas` fall through to weight.

**Pattern definitions:**

```js
{
  name: 'combined_lbs_oz',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
  parse(m) {
    return {
      type: 'combined_lbs_oz',
      pounds: parseFloat(m[1].replace(/,/g, '')),
      oz: parseFloat(m[2].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

```js
{
  name: 'pounds',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\b/gi,
  parse(m) {
    return {
      type: 'pounds',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

```js
{
  name: 'weight_oz',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
  parse(m) {
    return {
      type: 'weight_oz',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

**Resulting PATTERNS order after M2:**
1. `fractional_ft_in`
2. `combined_ft_in`
3. `dimensions_3d`
4. `dimensions_2d`
5. `combined_lbs_oz` (NEW)
6. `pounds` (NEW)
7. `feet`
8. `inches`
9. `fluid_oz` (narrowed in M1)
10. `weight_oz` (NEW)

#### conversion.js

Add constants:
```js
const G_PER_OZ = 28.3495;
const G_PER_LB = 453.592;
```

Add functions:
```js
export function formatWeight(totalG) {
  if (totalG >= 1000) {
    return `${(totalG / 1000).toFixed(2)} kg`;
  }
  return `${totalG.toFixed(2)} g`;
}

export function convertOz(oz) {
  const g = oz * G_PER_OZ;
  return formatWeight(g);
}

export function convertPounds(lbs) {
  const g = lbs * G_PER_LB;
  return formatWeight(g);
}

export function convertPoundsOz(lbs, oz) {
  const totalG = lbs * G_PER_LB + oz * G_PER_OZ;
  return formatWeight(totalG);
}
```

### Test Changes

#### tests/patterns.test.js

Add describe blocks:

```js
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
```

#### tests/conversion.test.js

Add describe blocks:

```js
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
```

Import the new functions at the top of `tests/conversion.test.js`:
```js
import { formatWeight, convertOz, convertPounds, convertPoundsOz } from '../conversion.js';
```

#### tests/edge-cases.test.js

**Update tests that changed due to weight_oz now existing:**

- `"8 oz"` (Fluid oz ambiguity): Now matches `weight_oz` with value 8 (was updated to 0 in M1; now restore to length 1 but type `weight_oz`).
- `"16 ounces"`: Now matches `weight_oz` with value 16.
- `"8 oz (227.00 g)"` (Already-converted): Now `weight_oz` matches `"8 oz"`, but ALREADY_CONVERTED includes `g`, so it gets skipped. Change assertion to `results.length === 0`.
- `"2 lbs 4 oz bag"` (Combined format conflicts): Now matches `combined_lbs_oz` with pounds 2, oz 4. Change assertion to `results.length === 1, type combined_lbs_oz`.
- `"32 fl oz bottle, 4 oz per serving"`: Now `"32 fl oz"` matches `fluid_oz` and `"4 oz"` matches `weight_oz`. Change assertion to `results.length === 2`, first is `fluid_oz` value 32, second is `weight_oz` value 4.
- `"2 lbs"` (Word boundary hazards): Now matches `pounds`. Change assertion to `results.length === 1, type pounds`.

### Verification

```bash
node --test
```

**Done when:**
- `"2 lbs 4 oz"` matches as `combined_lbs_oz` (not two separate matches).
- `"5 lbs"` matches as `pounds`.
- `"8 oz"` matches as `weight_oz`.
- `"8 fl oz"` still matches as `fluid_oz`.
- `"8 oz (227.00 g)"` is skipped by ALREADY_CONVERTED.
- All tests pass.

---

## Milestone 3: Volume (gallons, quarts, pints)

**Goal:** Add three volume patterns and three conversion functions.

### Files Changed

- `patterns.js`
- `conversion.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js`
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

Add three patterns after `weight_oz` in the PATTERNS array:

```js
{
  name: 'gallons',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:gallons?|gal\.?)\b/gi,
  parse(m) {
    return {
      type: 'gallons',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
{
  name: 'quarts',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:quarts?|qt\.?)\b/gi,
  parse(m) {
    return {
      type: 'quarts',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
{
  name: 'pints',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pints?|pt\.?)\b/gi,
  parse(m) {
    return {
      type: 'pints',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

**Resulting PATTERNS order after M3:**
1. `fractional_ft_in`
2. `combined_ft_in`
3. `dimensions_3d`
4. `dimensions_2d`
5. `combined_lbs_oz`
6. `pounds`
7. `feet`
8. `inches`
9. `fluid_oz`
10. `weight_oz`
11. `gallons` (NEW)
12. `quarts` (NEW)
13. `pints` (NEW)

#### conversion.js

Add constants:
```js
const ML_PER_GALLON = 3785.41;
const ML_PER_QUART = 946.353;
const ML_PER_PINT = 473.176;
```

Add functions:
```js
export function convertGallons(gal) {
  const ml = gal * ML_PER_GALLON;
  return formatVolume(ml);
}

export function convertQuarts(qt) {
  const ml = qt * ML_PER_QUART;
  return formatVolume(ml);
}

export function convertPints(pt) {
  const ml = pt * ML_PER_PINT;
  return formatVolume(ml);
}
```

These reuse the existing `formatVolume()` function (mL < 1000 shows mL, >= 1000 shows L).

### Test Changes

#### tests/patterns.test.js

```js
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

  it('matches "1 qt bag" (qt followed by other words)', () => {
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

  it('does not match "2 pt size" -- note: \b after pt\. handles this if "size" is separate word', () => {
    // "2 pt" with \b -- "pt" followed by " " is a word boundary, so "2 pt" matches.
    // This is acceptable; "pt" is a standard pints abbreviation.
    // The edge-cases.test.js test for "2 pt size" will need updating.
    const results = findMeasurements('2 pt size');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'pints');
    assert.equal(results[0].value, 2);
  });
});
```

#### tests/conversion.test.js

Import new functions and add:

```js
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
```

#### tests/edge-cases.test.js

- `"2 pints"` test: Change assertion to `results.length === 1, type pints`.
- `"1 qt bag"` test: Change assertion to `results.length === 1, type quarts`.
- `"1 quart"` test: Change assertion to `results.length === 1, type quarts`.
- `"2 gallons"` test: Change assertion to `results.length === 1, type gallons`.
- `"2 pt size"` test: Change assertion to `results.length === 1, type pints` with updated comment. The `\b` after `pt\.?` means "2 pt" is a valid match when followed by a space. This is acceptable behavior for the pints abbreviation.

### Verification

```bash
node --test
```

**Done when:**
- `"2 gallons"` matches as `gallons`.
- `"1 qt bag"` matches as `quarts`.
- `"2 pints"` matches as `pints`.
- Volume conversions produce correct L/mL values.
- All tests pass.

---

## Milestone 4: Temperature (fahrenheit)

**Goal:** Add a fahrenheit pattern and conversion function supporting negative values and the degree symbol requirement.

### Files Changed

- `patterns.js`
- `conversion.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js`
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

Add the fahrenheit pattern after `pints` in the PATTERNS array:

```js
{
  name: 'fahrenheit',
  regex: /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:°\s*F|℉|degrees\s+fahrenheit)\b/gi,
  parse(m) {
    return {
      type: 'fahrenheit',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

Key design decisions:
- Requires `°F`, `℉`, or `degrees fahrenheit` -- bare `F` without degree symbol does NOT match (avoids false positives on model numbers).
- Supports negative values with `-?` prefix in the capture group.
- The `-?` is placed outside the `\d` capture start, inside the capture group: `(-?\d{1,3}...)`.

#### conversion.js

Add function:
```js
export function convertFahrenheit(f) {
  const c = (f - 32) * 5 / 9;
  return `${c.toFixed(2)} °C`;
}
```

Temperature always displays as `°C` regardless of magnitude (no unit switching like length/weight/volume).

### Test Changes

#### tests/patterns.test.js

```js
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
```

#### tests/conversion.test.js

Import `convertFahrenheit` and add:

```js
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
```

#### tests/edge-cases.test.js

- `"350°F"` (Cross-pattern conflicts): Change assertion to `results.length === 1, type fahrenheit`.
- `"-40°F"` (Temperature edge cases): Change assertion to `results.length === 1, type fahrenheit, value -40`.
- `"72°F to 104°F"`: Change assertion to `results.length === 2, both type fahrenheit`.
- `"Model F150"`: Stays as `results.length === 0` (correct).
- `"350 F"`: Stays as `results.length === 0` (correct).
- `"350°F (176.67 °C)"` (Already-converted): Now fahrenheit pattern matches, but ALREADY_CONVERTED includes `°C`, so it gets skipped. Change assertion to `results.length === 0` with updated comment.

### Verification

```bash
node --test
```

**Done when:**
- `"350°F"` matches as `fahrenheit`.
- `"-40°F"` matches with value `-40`.
- `"350 F"` and `"Model F150"` produce no match.
- `"350°F (176.67 °C)"` is skipped by ALREADY_CONVERTED.
- `convertFahrenheit(32)` returns `"0.00 °C"`.
- All tests pass.

---

## Milestone 5: Area (sq_feet, sq_inches)

**Goal:** Add two area patterns, a format function, and two conversion functions. These patterns must be ordered BEFORE standalone `feet` and `inches` in the PATTERNS array to win overlap priority.

### Files Changed

- `patterns.js`
- `conversion.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js`
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

Insert `sq_feet` and `sq_inches` immediately BEFORE `combined_lbs_oz` in the PATTERNS array (i.e., after `dimensions_2d`, before weight/length patterns). This ensures "400 sq ft" is claimed by `sq_feet` before the `feet` pattern could match the "ft" portion.

```js
{
  name: 'sq_feet',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+feet|square\s+foot|sq\.?\s*ft\.?|ft²)\b/gi,
  parse(m) {
    return {
      type: 'sq_feet',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
{
  name: 'sq_inches',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+inches?|sq\.?\s*in\.?|in²)\b/gi,
  parse(m) {
    return {
      type: 'sq_inches',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

**Resulting PATTERNS order after M5:**
1. `fractional_ft_in`
2. `combined_ft_in`
3. `dimensions_3d`
4. `dimensions_2d`
5. `sq_feet` (NEW)
6. `sq_inches` (NEW)
7. `combined_lbs_oz`
8. `pounds`
9. `feet`
10. `inches`
11. `fluid_oz`
12. `weight_oz`
13. `gallons`
14. `quarts`
15. `pints`
16. `fahrenheit`

#### conversion.js

Add constants:
```js
const SQ_CM_PER_SQ_INCH = 6.4516;    // 2.54^2
const SQ_CM_PER_SQ_FOOT = 929.0304;  // 30.48^2
```

Add functions:
```js
export function formatArea(totalSqCm) {
  if (totalSqCm >= 10000) {
    return `${(totalSqCm / 10000).toFixed(2)} m²`;
  }
  return `${totalSqCm.toFixed(2)} cm²`;
}

export function convertSqFeet(sqFt) {
  const sqCm = sqFt * SQ_CM_PER_SQ_FOOT;
  return formatArea(sqCm);
}

export function convertSqInches(sqIn) {
  const sqCm = sqIn * SQ_CM_PER_SQ_INCH;
  return formatArea(sqCm);
}
```

The `formatArea` function uses 10,000 cm² = 1 m² as the threshold (since 1 m² = 10,000 cm²).

### Test Changes

#### tests/patterns.test.js

```js
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
```

#### tests/conversion.test.js

Import `formatArea`, `convertSqFeet`, `convertSqInches` and add:

```js
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
```

#### tests/edge-cases.test.js

- `"400 sq ft"` (Cross-pattern conflicts): Change assertion to `results.length === 1, type sq_feet, value 400`.
- `"144 sq in"`: Change assertion to `results.length === 1, type sq_inches, value 144`.
- `"400 sq ft room"` (Area edge cases): Change assertion to `results.length === 1, type sq_feet`.
- `"12 ft² area"`: Change assertion to `results.length === 1, type sq_feet, value 12`. Remove the note about `matched === '12 ft'`; it now matches `"12 ft²"`.
- `"100 square feet"`: Change assertion to `results.length === 1, type sq_feet, value 100`.
- `"Room is 400 sq ft with 10 ft ceilings"`: Change assertion to `results.length === 2`. First match is `sq_feet` value 400, second is `feet` value 10.
- `"1,200 sq ft"` (Numeric edge cases): Change assertion to `results.length === 1, type sq_feet, value 1200`.

### Verification

```bash
node --test
```

**Done when:**
- `"400 sq ft"` matches as `sq_feet`, not `feet`.
- `"12 ft²"` matches as `sq_feet`, not `feet`.
- `"400 ft cable"` still matches as `feet`.
- `"Room is 400 sq ft with 10 ft ceilings"` produces two matches: `sq_feet` and `feet`.
- `convertSqFeet(400)` returns `"37.16 m²"`.
- All tests pass.

---

## Milestone 6: Pressure + Speed + Distance (psi, mph, miles)

**Goal:** Add three more patterns and conversion functions. `mph` must be ordered BEFORE `miles` so "20 miles per hour" matches as `mph`, not `miles`.

### Files Changed

- `patterns.js`
- `conversion.js`
- `tests/patterns.test.js`
- `tests/conversion.test.js`
- `tests/edge-cases.test.js`

### Exact Changes

#### patterns.js

Add three patterns at the end of the PATTERNS array, in this order: `psi`, `mph`, `miles`.

```js
{
  name: 'psi',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:psi|PSI)\b/g,
  parse(m) {
    return {
      type: 'psi',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
{
  name: 'mph',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:mph|MPH|miles\s+per\s+hour)\b/gi,
  parse(m) {
    return {
      type: 'mph',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
{
  name: 'miles',
  regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:miles?|mi\.?)\b/gi,
  parse(m) {
    return {
      type: 'miles',
      value: parseFloat(m[1].replace(/,/g, '')),
      matched: m[0],
      index: m.index,
    };
  },
},
```

Note on `psi`: Uses `/g` (not `/gi`) for the alternation `psi|PSI` to allow both lower and uppercase. Alternatively, use `/gi` and simplify to just `psi`. Design decision: use `/gi` with just `psi` for simplicity:

```js
regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*psi\b/gi,
```

**Final PATTERNS order after M6:**
1. `fractional_ft_in`
2. `combined_ft_in`
3. `dimensions_3d`
4. `dimensions_2d`
5. `sq_feet`
6. `sq_inches`
7. `combined_lbs_oz`
8. `pounds`
9. `feet`
10. `inches`
11. `fluid_oz`
12. `weight_oz`
13. `gallons`
14. `quarts`
15. `pints`
16. `fahrenheit`
17. `psi` (NEW)
18. `mph` (NEW)
19. `miles` (NEW)

#### conversion.js

Add constants:
```js
const BAR_PER_PSI = 0.0689476;
const KM_PER_MILE = 1.60934;
```

Add functions:
```js
export function convertPsi(psi) {
  const bar = psi * BAR_PER_PSI;
  return `${bar.toFixed(2)} bar`;
}

export function convertMph(mph) {
  const kmh = mph * KM_PER_MILE;
  return `${kmh.toFixed(2)} km/h`;
}

export function convertMiles(miles) {
  const km = miles * KM_PER_MILE;
  return `${km.toFixed(2)} km`;
}
```

### Test Changes

#### tests/patterns.test.js

```js
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
    // Not 'miles' -- mph pattern is ordered first and claims the range
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
```

#### tests/conversion.test.js

Import `convertPsi`, `convertMph`, `convertMiles` and add:

```js
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
```

#### tests/edge-cases.test.js

- `"20 miles per hour"` (Cross-pattern conflicts): Change assertion to `results.length === 1, type mph`.
- `"5 miles"`: Change assertion to `results.length === 1, type miles`.
- `"35 PSI"` (Cross-pattern conflicts): Change assertion to `results.length === 1, type psi`.
- `"35 PSI (2.41 bar)"` (Already-converted): Now psi pattern matches, but ALREADY_CONVERTED includes `bar`, so it gets skipped. Change assertion to `results.length === 0` with updated comment.
- `"5 miles from here"` (Word boundary hazards): Change assertion to `results.length === 1, type miles`.
- `"5 mild days"`: Stays as `results.length === 0`.
- `"PSI Sigma"`: Stays as `results.length === 0`.
- `"35 PSI"` (in Word boundary hazards): Change to `results.length === 1, type psi`.
- `"0.5 miles"` (Numeric edge cases): Change to `results.length === 1, type miles, value 0.5`.
- `"20 miles per hour"` (Combined format conflicts): Change to `results.length === 1, type mph`.

### Verification

```bash
node --test
```

**Done when:**
- `"60 mph"` matches as `mph`.
- `"20 miles per hour"` matches as `mph` (not `miles`).
- `"5 miles"` matches as `miles`.
- `"35 PSI"` matches as `psi`.
- `"35 PSI (2.41 bar)"` is skipped by ALREADY_CONVERTED.
- `"5 mild days"` produces no match.
- All tests pass.

---

## Milestone 7: content.js Dispatch + Integration Verification

**Goal:** Wire up all new conversion functions in the content script's dispatch switch and verify end-to-end behavior.

### Files Changed

- `src/content.js`

### Exact Changes

#### src/content.js

**Update imports:**

Current:
```js
import {
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
  convertFlOz,
} from '../conversion.js';
```

New:
```js
import {
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
  convertFlOz,
  convertOz,
  convertPounds,
  convertPoundsOz,
  convertGallons,
  convertQuarts,
  convertPints,
  convertFahrenheit,
  convertSqFeet,
  convertSqInches,
  convertPsi,
  convertMph,
  convertMiles,
} from '../conversion.js';
```

**Update switch statement in `convertMeasurement`:**

Add new cases after the existing `fluid_oz` case:

```js
case 'combined_lbs_oz':
  return convertPoundsOz(measurement.pounds, measurement.oz);
case 'pounds':
  return convertPounds(measurement.value);
case 'weight_oz':
  return convertOz(measurement.value);
case 'gallons':
  return convertGallons(measurement.value);
case 'quarts':
  return convertQuarts(measurement.value);
case 'pints':
  return convertPints(measurement.value);
case 'fahrenheit':
  return convertFahrenheit(measurement.value);
case 'sq_feet':
  return convertSqFeet(measurement.value);
case 'sq_inches':
  return convertSqInches(measurement.value);
case 'psi':
  return convertPsi(measurement.value);
case 'mph':
  return convertMph(measurement.value);
case 'miles':
  return convertMiles(measurement.value);
```

### Verification

**Step 1: Run all unit tests:**
```bash
node --test
```

**Step 2: Build the extension:**
```bash
npm run build
```

Verify the build succeeds with no errors (esbuild bundles `src/content.js` with all imports).

**Step 3: Manual smoke test in Chrome:**

Load the unpacked extension and visit Amazon product pages containing:
- Weight: A product listing showing "2 lbs 4 oz" or "5 lbs"
- Volume: A product listing showing "1 gallon" or "2 quarts"
- Temperature: A product listing or review mentioning "350°F"
- Area: A product listing mentioning "400 sq ft"
- Pressure: A product listing mentioning "35 PSI"
- Speed: A product listing mentioning "60 mph"
- Distance: A product listing mentioning "5 miles"

For each, confirm:
- The metric conversion appears inline in green text after the imperial value.
- Already-converted values (with metric in parens) are not double-converted.
- No false positives on prices, model numbers, or natural language "in" words.

**Done when:**
- `npm run build` succeeds.
- All unit tests pass (`node --test`).
- Manual smoke test on 3+ Amazon pages shows correct conversions.
- No regressions on existing measurement types (feet, inches, dimensions, fl oz).

---

## Summary

| Milestone | Patterns Added | Functions Added | Est. Complexity |
|---|---|---|---|
| M1: Cross-cutting | 0 (modify existing) | 0 (modify existing) | Medium |
| M2: Weight | 3 | 4 (formatWeight, convertOz, convertPounds, convertPoundsOz) | Medium |
| M3: Volume | 3 | 3 (convertGallons, convertQuarts, convertPints) | Low |
| M4: Temperature | 1 | 1 (convertFahrenheit) | Low |
| M5: Area | 2 | 3 (formatArea, convertSqFeet, convertSqInches) | Medium |
| M6: Pressure/Speed/Distance | 3 | 3 (convertPsi, convertMph, convertMiles) | Low |
| M7: Dispatch | 0 | 0 (wire existing) | Low |

**Total: 12 new patterns, 14 new functions, ~150 new test assertions.**

### Final PATTERNS Array Order

```
 1. fractional_ft_in
 2. combined_ft_in
 3. dimensions_3d
 4. dimensions_2d
 5. sq_feet
 6. sq_inches
 7. combined_lbs_oz
 8. pounds
 9. feet
10. inches
11. fluid_oz  (narrowed: fl oz / fluid ounces only)
12. weight_oz (bare oz / ounces / onzas)
13. gallons
14. quarts
15. pints
16. fahrenheit
17. psi
18. mph
19. miles
```

### Conversion Constants Reference

| Constant | Value | Used By |
|---|---|---|
| `CM_PER_INCH` | 2.54 | existing |
| `CM_PER_FOOT` | 30.48 | existing |
| `ML_PER_FL_OZ` | 29.5735 | existing |
| `G_PER_OZ` | 28.3495 | M2 |
| `G_PER_LB` | 453.592 | M2 |
| `ML_PER_GALLON` | 3785.41 | M3 |
| `ML_PER_QUART` | 946.353 | M3 |
| `ML_PER_PINT` | 473.176 | M3 |
| `SQ_CM_PER_SQ_INCH` | 6.4516 | M5 |
| `SQ_CM_PER_SQ_FOOT` | 929.0304 | M5 |
| `BAR_PER_PSI` | 0.0689476 | M6 |
| `KM_PER_MILE` | 1.60934 | M6 |
