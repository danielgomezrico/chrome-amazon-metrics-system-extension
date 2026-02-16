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
    regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032\u2019])\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'combined_ft_in',
        feet: parseFloat(m[1]),
        inches: parseFloat(m[2]),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_3d',
    regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'dimensions_3d',
        values: [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'dimensions_2d',
    regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'dimensions_2d',
        values: [parseFloat(m[1]), parseFloat(m[2])],
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'feet',
    regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032\u2019])(?!\s*\d)/gi,
    parse(m) {
      return {
        type: 'feet',
        value: parseFloat(m[1]),
        matched: m[0],
        index: m.index,
      };
    },
  },
  {
    name: 'inches',
    regex: /(\d+(?:\.\d+)?)\s*(?:inches|inch|in\b(?!\s*(?:the|a|an|stock|store|cart|total|color|this|that|our|your|my|its|one|all|any|no|each|every|some|most|both|part|front|back|between|addition|order|length))|in\.|["\u2033\u201D])/gi,
    parse(m) {
      return {
        type: 'inches',
        value: parseFloat(m[1]),
        matched: m[0],
        index: m.index,
      };
    },
  },
];

// Pattern to detect if a match is already followed by a metric conversion in parens
const ALREADY_CONVERTED = /^\s*\(\d+(?:\.\d+)?(?:\s*[×x]\s*\d+(?:\.\d+)?)*\s*(?:cm|m)\)/;

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
        (range) => start < range.end && end > range.start
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
  return results;
}
