import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig } from '../scripts/deploy-to-store.mjs';

describe('validateConfig', () => {
  const validEnv = {
    CHROME_EXTENSION_ID: 'abcdef',
    GOOGLE_CLIENT_ID: 'client',
    GOOGLE_CLIENT_SECRET: 'secret',
    GOOGLE_REFRESH_TOKEN: 'token',
  };

  it('returns config when all env vars are present', () => {
    const config = validateConfig(validEnv);
    assert.equal(config.extensionId, 'abcdef');
    assert.equal(config.clientId, 'client');
  });

  it('throws when any env var is missing', () => {
    const env = { ...validEnv };
    delete env.GOOGLE_REFRESH_TOKEN;
    assert.throws(
      () => validateConfig(env),
      /Missing required environment variables: GOOGLE_REFRESH_TOKEN/
    );
  });

  it('throws listing all missing vars', () => {
    assert.throws(
      () => validateConfig({}),
      /CHROME_EXTENSION_ID.*GOOGLE_CLIENT_ID/
    );
  });
});
