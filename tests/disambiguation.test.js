import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { disambiguate } from '../patterns.js';

describe('disambiguate', () => {
  function makeWeightOz(text, matched) {
    const index = text.indexOf(matched);
    return { type: 'weight_oz', index, matched, value: parseFloat(matched) };
  }

  it('"18 oz water bottle" → fluid_oz', () => {
    const text = '18 oz water bottle';
    const results = [makeWeightOz(text, '18 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'fluid_oz');
  });

  it('"16 oz coffee beans" → weight_oz (dry keyword wins)', () => {
    const text = '16 oz coffee beans';
    const results = [makeWeightOz(text, '16 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'weight_oz');
  });

  it('"32 oz jug" → fluid_oz', () => {
    const text = '32 oz jug';
    const results = [makeWeightOz(text, '32 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'fluid_oz');
  });

  it('"1 oz powder" → weight_oz (dry keyword wins)', () => {
    const text = '1 oz powder';
    const results = [makeWeightOz(text, '1 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'weight_oz');
  });

  it('"8 oz" (no context) → weight_oz (default)', () => {
    const text = '8 oz';
    const results = [makeWeightOz(text, '8 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'weight_oz');
  });

  it('"8 oz milk" → fluid_oz', () => {
    const text = '8 oz milk';
    const results = [makeWeightOz(text, '8 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'fluid_oz');
  });

  it('"16 oz beans drink" → weight_oz (dry beats liquid)', () => {
    const text = '16 oz beans drink';
    const results = [makeWeightOz(text, '16 oz')];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'weight_oz');
  });

  it('non-weight_oz types pass through unchanged', () => {
    const text = '5 miles';
    const results = [{ type: 'miles', index: 0, matched: '5 miles', value: 5 }];
    const out = disambiguate(results, text);
    assert.equal(out[0].type, 'miles');
    assert.equal(out[0].value, 5);
  });
});
