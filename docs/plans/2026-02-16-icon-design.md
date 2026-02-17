# Icon Design: Dual-Scale Badge

**Date:** 2026-02-16
**Status:** Approved

## Goal

Replace the current text-based icon ("in → cm") with a clean, professional, purely geometric icon that communicates both measurement conversion and trustworthiness (local-only, no data transmission).

## Design Requirements

- Clean and professional aesthetic
- Conveys trust/security — the extension only reads Amazon pages locally
- Balances measurement/conversion symbolism with trust cues
- Blue-toned palette
- Ruler motif as the primary visual element
- No text — scales cleanly across sizes and languages

## Design Specification

### Shape

Rounded square matching Chrome extension icon conventions. 16px corner radius at 128px scale.

### Background

Deep navy blue (#1a2744). Professional, trustworthy, distinct from browser chrome.

### Central Element: Dual-Scale Ruler

A horizontal ruler segment spanning ~70% of badge width, centered vertically. Two rows of tick marks:

- **Top row (imperial):** Wider-spaced ticks in white (#ffffff), representing inches. 4-5 major ticks with smaller subdivisions.
- **Bottom row (metric):** Tighter-spaced ticks in bright accent blue (#4da6ff), representing centimeters. More numerous, closer together.

The visual contrast between the two tick spacings communicates "two different scales" — the core conversion concept.

### Ruler Body

Thin horizontal bar (#2d4a7a, medium blue) separating the two scales. Subtle 1px highlight on top for depth.

### Border

Thin (2px at 128px) rounded border in medium blue (#3a5f8a) framing the badge. Gives a polished, contained feel and hints at security without being literal.

### Color Palette

| Element | Color | Hex |
|---|---|---|
| Background | Deep navy | #1a2744 |
| Imperial ticks | White | #ffffff |
| Metric ticks | Accent blue | #4da6ff |
| Ruler bar | Medium blue | #2d4a7a |
| Border | Medium blue | #3a5f8a |

### Size Adaptations

- **128px:** Full detail — both tick rows clearly visible, border present
- **48px:** Simplified — fewer tick marks, border thinner (1px)
- **16px:** Most simplified — horizontal bar with a few ticks above and below, border omitted. Still reads as "ruler/measurement" at tiny size.
