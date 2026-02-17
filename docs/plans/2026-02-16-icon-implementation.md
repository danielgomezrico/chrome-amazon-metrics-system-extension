# Dual-Scale Badge Icon Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current text-based icon with the approved dual-scale badge design (see `docs/plans/2026-02-16-icon-design.md`).

**Architecture:** Three size-specific SVG source files (128px full detail, 48px simplified, 16px minimal), converted to PNG via `rsvg-convert`. The master SVG stays in `icons/` alongside the PNGs.

**Tech Stack:** SVG, `rsvg-convert` (already installed at `/opt/homebrew/bin/rsvg-convert`)

---

### Task 1: Create 128px SVG (Full Detail)

**Files:**
- Modify: `icons/icon.svg`

**Step 1: Replace `icons/icon.svg` with the full-detail 128px design**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <!-- Background -->
  <rect width="128" height="128" rx="16" fill="#1a2744"/>
  <!-- Border -->
  <rect x="2" y="2" width="124" height="124" rx="14" fill="none" stroke="#3a5f8a" stroke-width="2"/>

  <!-- Ruler bar -->
  <rect x="19" y="62" width="90" height="4" rx="1" fill="#2d4a7a"/>
  <!-- Highlight -->
  <rect x="19" y="62" width="90" height="1" fill="#3a5f8a" opacity="0.5"/>

  <!-- Imperial ticks (top, white) — 5 major, 4 minor -->
  <line x1="19" y1="46" x2="19" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <line x1="41.5" y1="46" x2="41.5" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <line x1="64" y1="46" x2="64" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <line x1="86.5" y1="46" x2="86.5" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <line x1="109" y1="46" x2="109" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <line x1="30.25" y1="53" x2="30.25" y2="62" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="52.75" y1="53" x2="52.75" y2="62" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="75.25" y1="53" x2="75.25" y2="62" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="97.75" y1="53" x2="97.75" y2="62" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Metric ticks (bottom, accent blue) — 11 major, 10 minor -->
  <line x1="19" y1="66" x2="19" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="28" y1="66" x2="28" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="37" y1="66" x2="37" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="46" y1="66" x2="46" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="55" y1="66" x2="55" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="64" y1="66" x2="64" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="73" y1="66" x2="73" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="82" y1="66" x2="82" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="91" y1="66" x2="91" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="100" y1="66" x2="100" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="109" y1="66" x2="109" y2="80" stroke="#4da6ff" stroke-width="2" stroke-linecap="round"/>
  <line x1="23.5" y1="66" x2="23.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="32.5" y1="66" x2="32.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="41.5" y1="66" x2="41.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="50.5" y1="66" x2="50.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="59.5" y1="66" x2="59.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="68.5" y1="66" x2="68.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="77.5" y1="66" x2="77.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="86.5" y1="66" x2="86.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="95.5" y1="66" x2="95.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
  <line x1="104.5" y1="66" x2="104.5" y2="73" stroke="#4da6ff" stroke-width="1" stroke-linecap="round"/>
</svg>
```

**Step 2: Verify SVG renders correctly**

Run: `open icons/icon.svg`
Expected: Browser opens showing the dual-scale ruler badge at full detail.

---

### Task 2: Create Size-Specific SVG Variants

**Files:**
- Create: `icons/icon48.svg`
- Create: `icons/icon16.svg`

**Step 1: Create `icons/icon48.svg` (simplified — fewer ticks, thinner border)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <!-- Background -->
  <rect width="48" height="48" rx="6" fill="#1a2744"/>
  <!-- Border -->
  <rect x="1" y="1" width="46" height="46" rx="5" fill="none" stroke="#3a5f8a" stroke-width="1"/>

  <!-- Ruler bar -->
  <rect x="7" y="23" width="34" height="2" rx="0.5" fill="#2d4a7a"/>

  <!-- Imperial ticks (top, white) — 3 major, 2 minor -->
  <line x1="7" y1="16" x2="7" y2="23" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="24" y1="16" x2="24" y2="23" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="16" x2="41" y2="23" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="15.5" y1="19" x2="15.5" y2="23" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
  <line x1="32.5" y1="19" x2="32.5" y2="23" stroke="#fff" stroke-width="1" stroke-linecap="round"/>

  <!-- Metric ticks (bottom, accent blue) — 6 major -->
  <line x1="7" y1="25" x2="7" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="13.8" y1="25" x2="13.8" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="20.6" y1="25" x2="20.6" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="27.4" y1="25" x2="27.4" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="34.2" y1="25" x2="34.2" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="25" x2="41" y2="32" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

**Step 2: Create `icons/icon16.svg` (minimal — no border, few bold ticks)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <!-- Background -->
  <rect width="16" height="16" rx="3" fill="#1a2744"/>

  <!-- Ruler bar -->
  <rect x="2" y="7.5" width="12" height="1" rx="0.5" fill="#2d4a7a"/>

  <!-- Imperial ticks (top, white) — 3 ticks -->
  <line x1="2" y1="4" x2="2" y2="7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="4" x2="8" y2="7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="4" x2="14" y2="7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Metric ticks (bottom, accent blue) — 5 ticks -->
  <line x1="2" y1="8.5" x2="2" y2="12" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="5" y1="8.5" x2="5" y2="12" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="8.5" x2="8" y2="12" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="11" y1="8.5" x2="11" y2="12" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="8.5" x2="14" y2="12" stroke="#4da6ff" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

**Step 3: Verify both variants render correctly**

Run: `open icons/icon48.svg icons/icon16.svg`

---

### Task 3: Generate PNGs and Replace Existing Icons

**Files:**
- Modify: `icons/icon16.png`
- Modify: `icons/icon48.png`
- Modify: `icons/icon128.png`

**Step 1: Convert each SVG to its target PNG size**

```bash
rsvg-convert -w 128 -h 128 icons/icon.svg -o icons/icon128.png && \
rsvg-convert -w 48 -h 48 icons/icon48.svg -o icons/icon48.png && \
rsvg-convert -w 16 -h 16 icons/icon16.svg -o icons/icon16.png
```

Expected: Three PNG files created, each pixel-optimized for its size.

**Step 2: Visually verify each PNG**

Open each PNG and confirm it looks correct:

```bash
open icons/icon128.png icons/icon48.png icons/icon16.png
```

Expected: 128px shows full detail with border and all ticks. 48px shows simplified version. 16px shows minimal version that still reads as a ruler.

---

### Task 4: Commit

**Step 1: Stage and commit all icon changes**

```bash
git add icons/icon.svg icons/icon48.svg icons/icon16.svg icons/icon128.png icons/icon48.png icons/icon16.png
git commit -m "feat: replace text icon with dual-scale badge design"
```
