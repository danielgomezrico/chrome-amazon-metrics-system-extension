# Makefile Format & Lint Design

**Date:** 2026-02-18
**Status:** Approved

## Overview

Add a `Makefile` with `format` and `lint` targets to enforce consistent code style across the JavaScript codebase, using industry-standard Prettier and ESLint configurations.

## Makefile Targets

| Target | Tool | Action |
|--------|------|--------|
| `make format` | Prettier `--write` | Auto-formats all `.js` files |
| `make lint` | ESLint | Reports all code quality issues |
| `make check` | Prettier `--check` | Validates formatting (CI-friendly, exits non-zero) |
| `make fix` | ESLint `--fix` | Auto-fixes lint issues where possible |

## Prettier Config (`.prettierrc`)

Industry standard matching Google, Airbnb, Meta:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always"
}
```

- `trailingComma: "all"` — Prettier 3 default, adopted by most modern teams
- `singleQuote: true` — near-universal in JS community

## ESLint Config (`eslint.config.js`)

Flat config (ESLint 9), using `@eslint/js` recommended + Airbnb-inspired rules:

- Base: `@eslint/js` recommended
- Globals: browser + ES2022
- Key rules: `no-var`, `prefer-const`, `object-shorthand`, `prefer-template`, `no-param-reassign`, `eqeqeq`

## `.prettierignore`

Excludes: `node_modules/`, `dist/`, `content.js` (bundled output)

## `package.json` Changes

Add to `devDependencies`:
- `prettier`
- `eslint`
- `@eslint/js`

## Files Created/Modified

- `Makefile` — new
- `.prettierrc` — new
- `.prettierignore` — new
- `eslint.config.js` — new
- `package.json` — add devDependencies
