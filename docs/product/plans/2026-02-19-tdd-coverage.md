# TDD Coverage Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Achieve 100% line and branch coverage for `conversion.js` and `replacer.js` using TDD.

**Architecture:** Two coverage gaps exist. Task 1 adds a missing test case for the large-dimensions path in `convertDimensions2D`. Task 2 uses Node's built-in `t.mock.module()` to test the unreachable-via-public-API `default` branch in `convertMeasurement`, covering both the switch default and the `if (!converted)` guard in `replaceWithMetric`.

**Tech Stack:** Node.js v25 built-in `node:test` runner, `node:assert/strict`, `t.mock.module()` for ESM mocking.

---

## Current State

Run `npm test -- --experimental-test-coverage` to see baseline:

```
conversion.js |  96.23 |    92.86 |  100.00 | 39-40
replacer.js   |  97.96 |    86.67 |  100.00 | 24
all files     |  98.60 |    93.48 |  100.00 |
```

**Gap 1 — `conversion.js` lines 39-40:** `convertDimensions2D` has an `if (maxCm >= 100)` branch that formats in meters. The existing test only calls it with small dimensions (10×5 inches = 25.40×12.70 cm), so the meters path is never hit.

**Gap 2 — `replacer.js` line 24 + 2 branches:** `convertMeasurement` has `default: return null` (line 24) which can never be reached via the public API since `findMeasurements` always returns known types. The `if (!converted) continue;` guard (line 39) is also dead code for the same reason. Both require mocking.

---

### Task 1: Cover `convertDimensions2D` meters path

**Files:**
- Modify: `tests/conversion.test.js:87-91`

**Step 1: Verify the baseline**

Run: `npm test -- --experimental-test-coverage 2>&1 | grep "conversion.js"`

Expected output: `conversion.js |  96.23 |    92.86 |  100.00 | 39-40`

**Step 2: Write the failing test**

In `tests/conversion.test.js`, find the existing `describe('convertDimensions2D', ...)` block (lines 87-91) and add a second test case:

```javascript
describe('convertDimensions2D', () => {
  it('converts 10 x 5 inches', () => {
    assert.equal(convertDimensions2D(10, 5), '25.40 x 12.70 cm');
  });
  it('converts large 2D dimensions to meters', () => {
    assert.equal(convertDimensions2D(48, 24), '1.22 x 0.61 m');
  });
});
```

Why `48 x 24`: 48 inches × 2.54 = 121.92 cm (>100), so the if-branch is taken and the result is formatted in meters: `(121.92/100).toFixed(2) x (60.96/100).toFixed(2) m` = `1.22 x 0.61 m`.

**Step 3: Run the test to verify it passes**

Run: `node --test tests/conversion.test.js 2>&1 | tail -10`

Expected: all tests pass (the code already handles large 2D dimensions — we are covering existing, untested behaviour).

**Step 4: Run coverage to verify the gap is closed**

Run: `npm test -- --experimental-test-coverage 2>&1 | grep "conversion.js"`

Expected: `conversion.js | 100.00 |   100.00 |  100.00 |`

**Step 5: Commit**

```bash
git add tests/conversion.test.js
git commit -m "test: cover convertDimensions2D meters path (lines 39-40)"
```

---

### Task 2: Cover `convertMeasurement` default path via mock

**Files:**
- Create: `tests/replacer-mock.test.js`

**Step 1: Verify the baseline**

Run: `npm test -- --experimental-test-coverage 2>&1 | grep "replacer.js"`

Expected: `replacer.js   |  97.96 |    86.67 |  100.00 | 24`

**Step 2: Write the test**

Create `tests/replacer-mock.test.js` with the following content. The file must NOT statically import `replacer.js` — it must use a dynamic import AFTER setting up the mock, so the mock intercepts the module before it is cached.

```javascript
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('replaceWithMetric – unknown measurement type', () => {
  it('returns original text unchanged when measurement type is unrecognized', async (t) => {
    // Mock patterns.js so findMeasurements returns a measurement with an
    // unrecognized type. This exercises:
    //   - replacer.js:24  (default: return null)
    //   - replacer.js:39  (if (!converted) continue; — true branch)
    t.mock.module('../patterns.js', {
      namedExports: {
        findMeasurements: () => [
          {
            type: 'future_unit',   // not handled by the switch
            matched: '5 furlongs',
            index: 0,
            value: 5,
          },
        ],
      },
    });

    // Dynamic import AFTER mock so the mocked version is used.
    const { replaceWithMetric } = await import('../replacer.js');

    assert.equal(replaceWithMetric('5 furlongs'), '5 furlongs');
  });
});
```

**Step 3: Run the new test in isolation to verify it passes**

Run: `node --test tests/replacer-mock.test.js 2>&1`

Expected:
```
✔ replaceWithMetric – unknown measurement type
  ✔ returns original text unchanged when measurement type is unrecognized
ℹ tests 1
ℹ pass 1
ℹ fail 0
```

If the test fails with a module-cache issue (i.e., `replacer.js` was already loaded before the mock), run with isolation: `node --test --experimental-test-isolation=process tests/replacer-mock.test.js`

**Step 4: Run full coverage**

Run: `npm test -- --experimental-test-coverage 2>&1 | tail -20`

Expected:
```
conversion.js | 100.00 |   100.00 |  100.00 |
patterns.js   | 100.00 |   100.00 |  100.00 |
replacer.js   | 100.00 |   100.00 |  100.00 |
all files     | 100.00 |   100.00 |  100.00 |
```

> **STOP HERE if coverage does not reach 100%.** Investigate which lines remain uncovered before proceeding.

**Step 5: Commit**

```bash
git add tests/replacer-mock.test.js
git commit -m "test: cover convertMeasurement default branch via mock module"
```

---

## Done

After both tasks, run the full test suite to confirm no regressions:

```bash
npm test
```

Expected: all existing tests still pass.
