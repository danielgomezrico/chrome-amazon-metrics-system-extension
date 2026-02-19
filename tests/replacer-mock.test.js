import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('replaceWithMetric', () => {
  it('returns original text unchanged when measurement type is unrecognized', async (t) => {
    // Mock patterns.js so findMeasurements returns a measurement with an
    // unrecognized type. This exercises:
    //   - replacer.js:24  (default: return null)
    //   - replacer.js:39  (if (!converted) continue; — true branch)
    let callCount = 0;
    t.mock.module('../patterns.js', {
      namedExports: {
        findMeasurements: () => {
          callCount++;
          return [
            {
              type: 'future_unit',   // not handled by the switch
              matched: '5 furlongs',
              index: 0,
              value: 5,
            },
          ];
        },
      },
    });

    // Dynamic import AFTER mock so the mocked version is used.
    const { replaceWithMetric } = await import('../replacer.js');

    assert.equal(replaceWithMetric('5 furlongs'), '5 furlongs');
    assert.equal(callCount, 1, 'mock findMeasurements must have been called');
  });
});
