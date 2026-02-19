import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.webextensions,
      },
    },
    rules: {
      // Airbnb-inspired clarity rules
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      eqeqeq: ['error', 'always'],

      // Quality
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
