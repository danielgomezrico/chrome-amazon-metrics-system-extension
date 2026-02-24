const DIRECTION_MARKERS = /[\u200e\u200f\u200b]/g;

const PATTERNS = [
  {
    name: 'fractional_ft_in',
    regex: /(\d+)\s*['\u2032\u2019]\s*(\d+)\s+(\d+)\/(\d+)\s*["\u2033\u201D]/gi,
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
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032\u2019])\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'combined_ft_in',
        feet: parseFloat(m[1].replace(/,/g, '')),
        inches: parseFloat(m[2].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_3d',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'dimensions_3d',
        values: [
          parseFloat(m[1].replace(/,/g, '')),
          parseFloat(m[2].replace(/,/g, '')),
          parseFloat(m[3].replace(/,/g, '')),
        ],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_2d',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'dimensions_2d',
        values: [
          parseFloat(m[1].replace(/,/g, '')),
          parseFloat(m[2].replace(/,/g, '')),
        ],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'sq_feet',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+feet|square\s+foot|sq\.?\s*ft\.?|ft²)(?!\w)/gi,
    parse(m) {
      return {
        type: 'sq_feet',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'sq_inches',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+inches?|sq\.?\s*in\.?|in²)(?!\w)/gi,
    parse(m) {
      return {
        type: 'sq_inches',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'combined_lbs_oz',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
    parse(m) {
      return {
        type: 'combined_lbs_oz',
        pounds: parseFloat(m[1].replace(/,/g, '')),
        oz: parseFloat(m[2].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'pounds',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\b/gi,
    parse(m) {
      return {
        type: 'pounds',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'feet',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032\u2019])(?!\s*\d)/gi,
    parse(m) {
      return {
        type: 'feet',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'inches',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\b(?!\s*(?:the|a|an|stock|store|cart|total|color|this|that|our|your|my|its|one|all|any|no|each|every|some|most|both|part|front|back|between|addition|order|length))|in\.|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'inches',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'fluid_oz',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:fl\.?\s*oz\.?|fluid\s+ounces?)\b/gi,
    parse(m) {
      return {
        type: 'fluid_oz',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'weight_oz',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
    parse(m) {
      return {
        type: 'weight_oz',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'gallons',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:gallons?|gal\.?)\b/gi,
    parse(m) {
      return {
        type: 'gallons',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'quarts',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:quarts?|qt\.?)\b/gi,
    parse(m) {
      return {
        type: 'quarts',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'pints',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pints?|pt\.?)\b/gi,
    parse(m) {
      return {
        type: 'pints',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'fahrenheit',
    regex:
      /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:°\s*F|℉|degrees\s+fahrenheit)(?!\w)/gi,
    parse(m) {
      return {
        type: 'fahrenheit',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'psi',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*psi\b/gi,
    parse(m) {
      return {
        type: 'psi',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'mph',
    regex:
      /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:mph|MPH|miles\s+per\s+hour)\b/gi,
    parse(m) {
      return {
        type: 'mph',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'miles',
    regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:miles?|mi\.?)\b/gi,
    parse(m) {
      return {
        type: 'miles',
        value: parseFloat(m[1].replace(/,/g, '')),
        matched: m[0],
        index: m.index,
      };
    },
  },
];

const LIQUID_KEYWORDS = /\b(bottle|water|liquid|beverage|juice|milk|drink|rinse|pitcher|jug|carafe|canteen|thermos|tumbler|flask|spray|solution)\b/i;
const DRY_KEYWORDS = /\b(bean|beans|powder|flour|coffee|grain|seed|seeds|nut|nuts|spice|spices|herb|herbs|sugar|salt|rice|oat|oats|protein|supplement|extract)\b/i;
const CONTEXT_WINDOW = 50;

export function disambiguate(results, text) {
  return results.map((r) => {
    if (r.type !== 'weight_oz') return r;
    const start = Math.max(0, r.index - CONTEXT_WINDOW);
    const end = Math.min(text.length, r.index + r.matched.length + CONTEXT_WINDOW);
    const ctx = text.slice(start, end);
    if (DRY_KEYWORDS.test(ctx)) return r;
    if (LIQUID_KEYWORDS.test(ctx)) return { ...r, type: 'fluid_oz' };
    return r;
  });
}

// Pattern to detect if a match is already followed by a metric conversion in parens
const ALREADY_CONVERTED =
  /^\s*\(-?\d+(?:\.\d+)?(?:\s*[×x]\s*-?\d+(?:\.\d+)?)*\s*(?:cm|m|mL|L|g|kg|°C|bar|km\/h|km|m²|cm²)\)/;

export function findMeasurements(text) {
  const cleaned = text.replace(DIRECTION_MARKERS, '');

  const results = [];
  const coveredRanges = [];

  for (const pattern of PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(cleaned)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      const overlaps = coveredRanges.some(
        (range) => start < range.end && end > range.start,
      );
      if (overlaps) continue;

      // Skip if this match is already followed by a metric conversion in parens
      const afterMatch = cleaned.slice(end);
      if (ALREADY_CONVERTED.test(afterMatch)) continue;

      const parsed = pattern.parse(match);
      results.push(parsed);
      coveredRanges.push({ start, end });
    }
  }

  results.sort((a, b) => a.index - b.index);
  return disambiguate(results, cleaned);
}
