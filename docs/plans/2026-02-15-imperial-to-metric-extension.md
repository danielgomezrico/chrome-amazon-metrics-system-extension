# Imperial-to-Metric Chrome Extension Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Chrome Extension (Manifest V3) that detects imperial measurements on Amazon product pages and appends metric conversions in parentheses.

**Architecture:** Content script injected into Amazon pages scans text nodes via TreeWalker, matches imperial patterns with priority-ordered regexes, appends metric conversions. Popup UI communicates preferences (unit, enable/disable) through `chrome.storage.sync`. MutationObserver handles dynamic content from variant switches.

**Tech Stack:** Chrome Extension Manifest V3, vanilla JavaScript, chrome.storage.sync API, TreeWalker API, MutationObserver API. Node.js for running unit tests (no external test framework — just assert).

---

### Task 1: Initialize Git Repo and Project Scaffold

**Files:**
- Create: `manifest.json`
- Create: `icons/` (placeholder directory)

**Step 1: Initialize git repo**

Run: `git init`

**Step 2: Create manifest.json**

```json
{
  "manifest_version": 3,
  "name": "Amazon Imperial to Metric",
  "version": "1.0.0",
  "description": "Converts imperial measurements (feet, inches) to metric (meters, centimeters) on Amazon product pages.",
  "permissions": ["storage"],
  "host_permissions": [
    "https://www.amazon.com/*",
    "https://www.amazon.co.uk/*",
    "https://www.amazon.ca/*",
    "https://www.amazon.com.au/*",
    "https://www.amazon.in/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://www.amazon.com/*",
        "https://www.amazon.co.uk/*",
        "https://www.amazon.ca/*",
        "https://www.amazon.com.au/*",
        "https://www.amazon.in/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

**Step 3: Create placeholder icon directory**

Run: `mkdir -p icons`

Create a simple SVG and convert to PNGs, or use placeholder PNGs. For now, create a minimal placeholder so the extension loads:

Run: `touch icons/.gitkeep`

**Step 4: Create .gitignore**

```
node_modules/
.DS_Store
*.log
```

**Step 5: Commit**

```bash
git add manifest.json icons/.gitkeep .gitignore
git commit -m "feat: initialize project with MV3 manifest"
```

---

### Task 2: Conversion Logic — Pure Functions with Tests

**Files:**
- Create: `conversion.js`
- Create: `tests/conversion.test.js`

**Step 1: Write the failing tests**

Create `tests/conversion.test.js`:

```javascript
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// We'll import from conversion.js — needs to export functions
// For Chrome extension compatibility, conversion.js uses plain functions
// but we re-export for Node testing
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
```

**Step 2: Run tests to verify they fail**

Run: `node --experimental-vm-modules --test tests/conversion.test.js`
Expected: FAIL — `conversion.js` doesn't exist yet

**Step 3: Write minimal implementation**

Create `conversion.js`:

```javascript
// Conversion factors
const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function inchesToCm(inches) {
  return parseFloat((inches * CM_PER_INCH).toFixed(5));
}

export function feetToM(feet) {
  return parseFloat((feet * CM_PER_FOOT / 100).toFixed(5));
}

export function formatMetric(totalCm) {
  if (totalCm >= 100) {
    return `${(totalCm / 100).toFixed(2)} m`;
  }
  return `${totalCm.toFixed(2)} cm`;
}

export function convertInches(inches) {
  const cm = inches * CM_PER_INCH;
  return formatMetric(cm);
}

export function convertFeet(feet) {
  const cm = feet * CM_PER_FOOT;
  return formatMetric(cm);
}

export function convertFeetInches(feet, inches) {
  const totalCm = feet * CM_PER_FOOT + inches * CM_PER_INCH;
  return formatMetric(totalCm);
}

export function convertDimensions2D(w, h) {
  const wCm = w * CM_PER_INCH;
  const hCm = h * CM_PER_INCH;
  const maxCm = Math.max(wCm, hCm);
  if (maxCm >= 100) {
    return `${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
  }
  return `${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
}

export function convertDimensions3D(l, w, h) {
  const lCm = l * CM_PER_INCH;
  const wCm = w * CM_PER_INCH;
  const hCm = h * CM_PER_INCH;
  const maxCm = Math.max(lCm, wCm, hCm);
  if (maxCm >= 100) {
    return `${(lCm / 100).toFixed(2)} x ${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
  }
  return `${lCm.toFixed(2)} x ${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
}
```

**Step 4: Run tests to verify they pass**

Run: `node --experimental-vm-modules --test tests/conversion.test.js`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add conversion.js tests/conversion.test.js
git commit -m "feat: add conversion logic with unit tests"
```

---

### Task 3: Regex Patterns — Detection Logic with Tests

**Files:**
- Create: `patterns.js`
- Create: `tests/patterns.test.js`

**Step 1: Write the failing tests**

Create `tests/patterns.test.js`:

```javascript
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
      // Should match as combined, not standalone feet
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
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/patterns.test.js`
Expected: FAIL — `patterns.js` doesn't exist yet

**Step 3: Write minimal implementation**

Create `patterns.js`:

```javascript
// Unicode direction markers to strip before matching
const DIRECTION_MARKERS = /[\u200e\u200f\u200b]/g;

// Regex patterns in priority order (higher priority first to prevent partial matches)
const PATTERNS = [
  {
    name: 'fractional_ft_in',
    regex: /(\d+)\s*['\u2032]\s*(\d+)\s+(\d+)\/(\d+)\s*["\u2033]/gi,
    parse(m) {
      return {
        type: 'fractional_ft_in',
        feet: parseFloat(m[1]),
        inches: parseFloat(m[2]) + parseFloat(m[3]) / parseFloat(m[4]),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'combined_ft_in',
    regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032])\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033])/gi,
    parse(m) {
      return {
        type: 'combined_ft_in',
        feet: parseFloat(m[1]),
        inches: parseFloat(m[2]),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_3d',
    regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
    parse(m) {
      return {
        type: 'dimensions_3d',
        values: [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_2d',
    regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
    parse(m) {
      return {
        type: 'dimensions_2d',
        values: [parseFloat(m[1]), parseFloat(m[2])],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'feet',
    regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032])(?!\s*\d)/gi,
    parse(m) {
      return {
        type: 'feet',
        value: parseFloat(m[1]),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'inches',
    regex: /(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|["\u2033])/gi,
    parse(m) {
      return {
        type: 'inches',
        value: parseFloat(m[1]),
        matched: m[0],
        index: m.index,
      };
    },
  },
];

// Metric pattern to skip already-converted values
const METRIC_PATTERN = /\d+(?:\.\d+)?\s*(?:cm|mm|m\b|meters?|centimeters?|millimeters?)/i;

export function findMeasurements(text) {
  // Skip if text contains metric units (already converted)
  if (METRIC_PATTERN.test(text)) {
    return [];
  }

  // Strip unicode direction markers
  const cleaned = text.replace(DIRECTION_MARKERS, '');

  const results = [];
  const coveredRanges = []; // Track character ranges already matched

  for (const pattern of PATTERNS) {
    // Reset regex lastIndex for each pattern
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(cleaned)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Skip if this range overlaps with a higher-priority match
      const overlaps = coveredRanges.some(
        (range) => start < range.end && end > range.start
      );
      if (overlaps) continue;

      const parsed = pattern.parse(match);
      results.push(parsed);
      coveredRanges.push({ start, end });
    }
  }

  // Sort by position in text
  results.sort((a, b) => a.index - b.index);
  return results;
}
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/patterns.test.js`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add patterns.js tests/patterns.test.js
git commit -m "feat: add regex-based measurement detection with priority ordering"
```

---

### Task 4: Text Replacement Engine — Combining Patterns + Conversions

**Files:**
- Create: `replacer.js`
- Create: `tests/replacer.test.js`

**Step 1: Write the failing tests**

Create `tests/replacer.test.js`:

```javascript
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
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/replacer.test.js`
Expected: FAIL — `replacer.js` doesn't exist yet

**Step 3: Write minimal implementation**

Create `replacer.js`:

```javascript
import { findMeasurements } from './patterns.js';
import {
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
} from './conversion.js';

function convertMeasurement(measurement) {
  switch (measurement.type) {
    case 'fractional_ft_in':
    case 'combined_ft_in':
      return convertFeetInches(measurement.feet, measurement.inches);
    case 'dimensions_3d':
      return convertDimensions3D(...measurement.values);
    case 'dimensions_2d':
      return convertDimensions2D(...measurement.values);
    case 'feet':
      return convertFeet(measurement.value);
    case 'inches':
      return convertInches(measurement.value);
    default:
      return null;
  }
}

export function replaceWithMetric(text) {
  const measurements = findMeasurements(text);
  if (measurements.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  // Strip direction markers to align indices with cleaned text
  const cleaned = text.replace(/[\u200e\u200f\u200b]/g, '');

  for (const m of measurements) {
    const converted = convertMeasurement(m);
    if (!converted) continue;

    const end = m.index + m.matched.length;
    result += cleaned.slice(lastIndex, end);
    result += ` (${converted})`;
    lastIndex = end;
  }

  result += cleaned.slice(lastIndex);
  return result;
}
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/replacer.test.js`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add replacer.js tests/replacer.test.js
git commit -m "feat: add text replacement engine combining patterns and conversions"
```

---

### Task 5: Content Script — DOM Scanning and MutationObserver

**Files:**
- Create: `content.js`

This task is not unit-testable (depends on Chrome APIs and DOM). Manual testing follows in Task 8.

**Step 1: Create content.js**

```javascript
// Content script — injected into Amazon pages at document_idle
// Cannot use ES module imports in content scripts, so we inline the logic
// or use a build step. For simplicity in v1, we'll inline.

(function () {
  'use strict';

  // ===== Conversion Logic =====
  const CM_PER_INCH = 2.54;
  const CM_PER_FOOT = 30.48;

  function formatMetric(totalCm) {
    if (totalCm >= 100) {
      return `${(totalCm / 100).toFixed(2)} m`;
    }
    return `${totalCm.toFixed(2)} cm`;
  }

  function convertInches(inches) {
    return formatMetric(inches * CM_PER_INCH);
  }

  function convertFeet(feet) {
    return formatMetric(feet * CM_PER_FOOT);
  }

  function convertFeetInches(feet, inches) {
    return formatMetric(feet * CM_PER_FOOT + inches * CM_PER_INCH);
  }

  function convertDimensions(values) {
    const cmValues = values.map((v) => v * CM_PER_INCH);
    const maxCm = Math.max(...cmValues);
    if (maxCm >= 100) {
      return cmValues.map((v) => `${(v / 100).toFixed(2)}`).join(' \u00D7 ') + ' m';
    }
    return cmValues.map((v) => `${v.toFixed(2)}`).join(' \u00D7 ') + ' cm';
  }

  // ===== Pattern Matching =====
  const DIRECTION_MARKERS = /[\u200e\u200f\u200b]/g;
  const METRIC_PATTERN = /\d+(?:\.\d+)?\s*(?:cm|mm|m\b|meters?|centimeters?|millimeters?)/i;

  const PATTERNS = [
    {
      name: 'fractional_ft_in',
      regex: /(\d+)\s*['\u2032]\s*(\d+)\s+(\d+)\/(\d+)\s*["\u2033]/gi,
      convert(m) {
        const feet = parseFloat(m[1]);
        const inches = parseFloat(m[2]) + parseFloat(m[3]) / parseFloat(m[4]);
        return convertFeetInches(feet, inches);
      },
    },
    {
      name: 'combined_ft_in',
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032])\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033])/gi,
      convert(m) {
        return convertFeetInches(parseFloat(m[1]), parseFloat(m[2]));
      },
    },
    {
      name: 'dimensions_3d',
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
      convert(m) {
        return convertDimensions([parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]);
      },
    },
    {
      name: 'dimensions_2d',
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
      convert(m) {
        return convertDimensions([parseFloat(m[1]), parseFloat(m[2])]);
      },
    },
    {
      name: 'feet',
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032])(?!\s*\d)/gi,
      convert(m) {
        return convertFeet(parseFloat(m[1]));
      },
    },
    {
      name: 'inches',
      regex: /(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|["\u2033])/gi,
      convert(m) {
        return convertInches(parseFloat(m[1]));
      },
    },
  ];

  // ===== Marker =====
  const CONVERTED_ATTR = 'data-metric-converted';

  // ===== Skip these elements =====
  const SKIP_TAGS = new Set([
    'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT',
  ]);
  const SKIP_SELECTORS = '.a-price, .a-price-whole, .a-price-fraction';

  // ===== Amazon container selectors (scoped scanning) =====
  const AMAZON_CONTAINERS = [
    '#productDetails_techSpec_section_1',
    '#productDetails_detailBullets_sections1',
    '#detailBullets_feature_div',
    '#detailBulletsWrapper_feature_div',
    '#feature-bullets',
    '#productTitle',
    '#productOverview_feature_div',
    '#productDescription',
    '#aplus_feature_div',
    '#variation_size_name',
    '#technicalSpecifications_section_1',
    'table.prodDetTable',
  ];

  function shouldSkipNode(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.matches && el.matches(SKIP_SELECTORS)) return true;
      if (el.hasAttribute && el.hasAttribute(CONVERTED_ATTR)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function processTextNode(textNode) {
    const original = textNode.textContent;
    if (!original || original.trim().length === 0) return;

    // Strip direction markers for matching
    const cleaned = original.replace(DIRECTION_MARKERS, '');

    // Skip already-metric text
    if (METRIC_PATTERN.test(cleaned)) return;

    const measurements = [];
    const coveredRanges = [];

    for (const pattern of PATTERNS) {
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(cleaned)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const overlaps = coveredRanges.some(
          (r) => start < r.end && end > r.start
        );
        if (overlaps) continue;

        measurements.push({
          index: start,
          length: match[0].length,
          converted: pattern.convert(match),
          matched: match[0],
        });
        coveredRanges.push({ start, end });
      }
    }

    if (measurements.length === 0) return;

    // Sort by position
    measurements.sort((a, b) => a.index - b.index);

    // Build new text with appended conversions
    let result = '';
    let lastIndex = 0;
    for (const m of measurements) {
      const end = m.index + m.length;
      result += cleaned.slice(lastIndex, end);
      result += ` (${m.converted})`;
      lastIndex = end;
    }
    result += cleaned.slice(lastIndex);

    // Only update if something changed
    if (result !== cleaned) {
      textNode.textContent = result;
      // Mark parent to prevent re-processing
      if (textNode.parentElement) {
        textNode.parentElement.setAttribute(CONVERTED_ATTR, 'true');
      }
    }
  }

  function scanContainer(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const node of textNodes) {
      processTextNode(node);
    }
  }

  function scanPage() {
    // First try scoped containers
    let found = false;
    for (const selector of AMAZON_CONTAINERS) {
      const containers = document.querySelectorAll(selector);
      for (const container of containers) {
        scanContainer(container);
        found = true;
      }
    }

    // Fallback: scan entire body if no known containers found
    if (!found) {
      scanContainer(document.body);
    }
  }

  // ===== MutationObserver for dynamic content =====
  let debounceTimer = null;

  function setupObserver() {
    const target = document.getElementById('dp-container') || document.body;

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanPage();
      }, 300);
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  // ===== Preference handling =====
  let enabled = true;

  function init() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get({ enabled: true }, (prefs) => {
        enabled = prefs.enabled;
        if (enabled) {
          scanPage();
          setupObserver();
        }
      });

      chrome.storage.onChanged.addListener((changes) => {
        if (changes.enabled) {
          enabled = changes.enabled.newValue;
          if (enabled) {
            scanPage();
          }
          // Note: disabling doesn't revert conversions (would need page reload)
        }
      });
    } else {
      // Fallback for non-extension context (testing)
      scanPage();
      setupObserver();
    }
  }

  init();
})();
```

**Step 2: Verify file was created correctly**

Run: `wc -l content.js`
Expected: ~200 lines, no syntax errors

**Step 3: Commit**

```bash
git add content.js
git commit -m "feat: add content script with DOM scanning and MutationObserver"
```

---

### Task 6: Popup UI — HTML, CSS, and JS

**Files:**
- Create: `popup.html`
- Create: `popup.css`
- Create: `popup.js`

**Step 1: Create popup.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup">
    <h1>Imperial → Metric</h1>
    <div class="toggle-row">
      <label for="enabled">Enabled</label>
      <input type="checkbox" id="enabled" checked>
    </div>
    <p class="status" id="status">Active</p>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

**Step 2: Create popup.css**

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  min-width: 220px;
}

.popup {
  padding: 16px;
}

h1 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #232f3e;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.toggle-row label {
  font-size: 14px;
  color: #333;
}

.status {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
```

**Step 3: Create popup.js**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  const statusEl = document.getElementById('status');

  // Load current preference
  chrome.storage.sync.get({ enabled: true }, (prefs) => {
    enabledCheckbox.checked = prefs.enabled;
    statusEl.textContent = prefs.enabled ? 'Active' : 'Paused';
  });

  // Save preference on toggle
  enabledCheckbox.addEventListener('change', () => {
    const enabled = enabledCheckbox.checked;
    chrome.storage.sync.set({ enabled }, () => {
      statusEl.textContent = enabled ? 'Active' : 'Paused';
    });
  });
});
```

**Step 4: Commit**

```bash
git add popup.html popup.css popup.js
git commit -m "feat: add popup UI with enable/disable toggle"
```

---

### Task 7: Background Service Worker

**Files:**
- Create: `background.js`

**Step 1: Create background.js**

```javascript
// Service worker — set default preferences on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, (existing) => {
    if (existing.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});
```

**Step 2: Commit**

```bash
git add background.js
git commit -m "feat: add background service worker with install defaults"
```

---

### Task 8: Generate Extension Icons

**Files:**
- Create: `icons/icon16.png`
- Create: `icons/icon48.png`
- Create: `icons/icon128.png`

**Step 1: Create a simple SVG source icon**

Create `icons/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="16" fill="#232f3e"/>
  <text x="64" y="54" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ff9900">in</text>
  <text x="64" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#ffffff">→</text>
  <text x="64" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ff9900">cm</text>
</svg>
```

**Step 2: Convert SVG to PNGs at required sizes**

Use one of these approaches:
- If `rsvg-convert` available: `rsvg-convert -w 16 -h 16 icons/icon.svg > icons/icon16.png`
- If `sips` available (macOS): convert via Preview or `sips`
- If `npx` available: `npx svg2png-cli icons/icon.svg --output icons/ --width 16,48,128`

Or simply open the SVG in a browser and screenshot/export at each size.

Run (macOS approach):
```bash
# Using rsvg-convert if available:
rsvg-convert -w 16 -h 16 icons/icon.svg -o icons/icon16.png
rsvg-convert -w 48 -h 48 icons/icon.svg -o icons/icon48.png
rsvg-convert -w 128 -h 128 icons/icon.svg -o icons/icon128.png
```

If `rsvg-convert` is not available, try:
```bash
brew install librsvg && rsvg-convert -w 16 -h 16 icons/icon.svg -o icons/icon16.png && rsvg-convert -w 48 -h 48 icons/icon.svg -o icons/icon48.png && rsvg-convert -w 128 -h 128 icons/icon.svg -o icons/icon128.png
```

**Step 3: Remove .gitkeep and commit**

```bash
rm icons/.gitkeep
git add icons/
git commit -m "feat: add extension icons"
```

---

### Task 9: Run All Unit Tests and Fix Any Issues

**Files:**
- Modify: `tests/conversion.test.js` (if needed)
- Modify: `tests/patterns.test.js` (if needed)
- Modify: `tests/replacer.test.js` (if needed)

**Step 1: Run all tests**

Run: `node --test tests/conversion.test.js tests/patterns.test.js tests/replacer.test.js`
Expected: All tests PASS

**Step 2: Fix any failures**

If any tests fail, read the error output, fix the failing code (in implementation files, not tests), and re-run.

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve test failures"
```

(Only if fixes were needed)

---

### Task 10: Manual Integration Testing in Chrome

**Files:**
- No new files

**Step 1: Load extension in Chrome**

1. Open `chrome://extensions`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the project root directory

Expected: Extension loads without errors, icon appears in toolbar

**Step 2: Test on Amazon product pages**

Navigate to these Amazon pages and verify conversions appear:

1. A cable product (should convert "6.6 feet" or "6.6FT" in title)
2. A piece of furniture (should convert dimension tables like "10 x 5 x 2 inches")
3. An electronics product (should convert specs like "36 inches")

Expected for each:
- Measurements in tech specs table show `(X.XX m)` or `(X.XX cm)` appended
- Measurements in feature bullets show conversions
- Title measurements show conversions
- Prices are NOT modified
- Navigation text like "in stock" is NOT modified

**Step 3: Test popup toggle**

1. Click extension icon — popup shows "Enabled" checkbox checked, "Active" status
2. Uncheck "Enabled" — status changes to "Paused"
3. Reload the Amazon page — no conversions should appear
4. Re-enable and reload — conversions should appear again

**Step 4: Test variant switching**

1. On a product with size variants, switch between sizes
2. Verify new measurements that load dynamically are also converted

**Step 5: Note and fix any issues found**

If issues found, go back to the relevant task's files, fix, re-test, and commit:

```bash
git add -A
git commit -m "fix: [describe what was fixed from manual testing]"
```

---

Plan complete and saved to `docs/plans/2026-02-15-imperial-to-metric-extension.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
