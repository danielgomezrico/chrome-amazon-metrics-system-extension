# Makefile Format & Lint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `make format` (Prettier) and `make lint` (ESLint) targets with industry-standard configs to enforce consistent code style.

**Architecture:** Install Prettier and ESLint as devDependencies, add config files at project root, and wire them up via a Makefile. Prettier handles formatting (style), ESLint handles code quality (logic/clarity). They are kept separate — no eslint-plugin-prettier — to avoid rule conflicts.

**Tech Stack:** Prettier 3.x, ESLint 9.x flat config, `@eslint/js` recommended, GNU Make

---

### Task 1: Add devDependencies

**Files:**
- Modify: `package.json`

**Step 1: Install the packages**

```bash
npm install --save-dev prettier eslint @eslint/js
```

Expected: `node_modules/prettier` and `node_modules/eslint` appear, `package.json` updated.

**Step 2: Verify versions**

```bash
npx prettier --version
npx eslint --version
```

Expected: Prettier 3.x, ESLint 9.x

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add prettier and eslint devDependencies"
```

---

### Task 2: Create Prettier config

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`

**Step 1: Create `.prettierrc`**

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

**Step 2: Create `.prettierignore`**

```
node_modules/
dist/
content.js
```

> `content.js` is the esbuild bundle output — formatting it is pointless and slow.

**Step 3: Verify Prettier picks up the config**

```bash
npx prettier --check "**/*.js" --ignore-path .prettierignore
```

Expected: Either passes (already formatted) or lists files that need formatting. Should NOT error on config.

**Step 4: Commit**

```bash
git add .prettierrc .prettierignore
git commit -m "chore: add prettier config with standard JS style"
```

---

### Task 3: Create ESLint config

**Files:**
- Create: `eslint.config.js`

**Step 1: Create `eslint.config.js`**

```js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    rules: {
      // Airbnb-inspired clarity rules
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-param-reassign": "error",
      "eqeqeq": ["error", "always"],

      // Quality
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];
```

> Note: `globals` is a sub-dependency of ESLint — available without extra install.

**Step 2: Verify ESLint picks up the config**

```bash
npx eslint --print-config src/content.js
```

Expected: Prints a JSON blob of active rules. No errors about missing config.

**Step 3: Run ESLint to confirm it executes**

```bash
npx eslint "**/*.js" --ignore-pattern "node_modules/**" --ignore-pattern "content.js"
```

Expected: Either passes or lists lint issues. Should NOT error on config.

**Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "chore: add eslint flat config with airbnb-inspired rules"
```

---

### Task 4: Create the Makefile

**Files:**
- Create: `Makefile`

**Step 1: Create `Makefile`**

```makefile
.PHONY: format lint check fix

JS_FILES := $(shell find . -name "*.js" \
	-not -path "./node_modules/*" \
	-not -path "./dist/*" \
	-not -name "content.js")

# Format all JS files with Prettier
format:
	npx prettier --write $(JS_FILES)

# Check formatting without writing (for CI)
check:
	npx prettier --check $(JS_FILES)

# List all lint issues
lint:
	npx eslint $(JS_FILES)

# Auto-fix lint issues where possible
fix:
	npx eslint --fix $(JS_FILES)
```

**Step 2: Verify `make format` works**

```bash
make format
```

Expected: Prettier rewrites files (or reports "All matched files use Prettier code style!" if already formatted).

**Step 3: Verify `make lint` works**

```bash
make lint
```

Expected: ESLint outputs any issues, or exits 0 if clean.

**Step 4: Verify `make check` works**

```bash
make check
```

Expected: Exits 0 if all formatted, non-zero with a list of unformatted files otherwise.

**Step 5: Commit**

```bash
git add Makefile
git commit -m "chore: add makefile with format, lint, check, and fix targets"
```

---

### Task 5: Run format + lint on existing code

This task cleans up any existing style issues in the codebase using the new tools.

**Step 1: Format all files**

```bash
make format
```

**Step 2: Auto-fix lint issues**

```bash
make fix
```

**Step 3: Review remaining lint issues**

```bash
make lint
```

Manually inspect any remaining warnings (e.g. `no-console` in background scripts is expected and acceptable — you may want to add `// eslint-disable-next-line no-console` for intentional uses).

**Step 4: Run existing tests to confirm nothing broke**

```bash
npm test
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: apply prettier formatting and eslint fixes to existing code"
```

---
