// Content script — injected into Amazon pages at document_idle
// Cannot use ES module imports in content scripts, so we inline the logic

(function () {
  'use strict';

  // ===== Conversion Logic =====
  const CM_PER_INCH = 2.54;
  const CM_PER_FOOT = 30.48;

  function formatMetric(totalCm) {
    if (totalCm >= 100) {
      return `${(totalCm / 100).toFixed(2)} m`;
    }
    return `${totalCm.toFixed(2)} cm`;
  }

  function convertInches(inches) {
    return formatMetric(inches * CM_PER_INCH);
  }

  function convertFeet(feet) {
    return formatMetric(feet * CM_PER_FOOT);
  }

  function convertFeetInches(feet, inches) {
    return formatMetric(feet * CM_PER_FOOT + inches * CM_PER_INCH);
  }

  function convertDimensions(values) {
    const cmValues = values.map((v) => v * CM_PER_INCH);
    const maxCm = Math.max(...cmValues);
    if (maxCm >= 100) {
      return cmValues.map((v) => `${(v / 100).toFixed(2)}`).join(' \u00D7 ') + ' m';
    }
    return cmValues.map((v) => `${v.toFixed(2)}`).join(' \u00D7 ') + ' cm';
  }

  // ===== Pattern Matching =====
  const DIRECTION_MARKERS = /[\u200e\u200f\u200b]/g;
  const METRIC_PATTERN = /\d+(?:\.\d+)?\s*(?:cm|mm|m\b|meters?|centimeters?|millimeters?)/i;

  const PATTERNS = [
    {
      name: 'fractional_ft_in',
      regex: /(\d+)\s*['\u2032]\s*(\d+)\s+(\d+)\/(\d+)\s*["\u2033]/gi,
      convert(m) {
        const feet = parseFloat(m[1]);
        const inches = parseFloat(m[2]) + parseFloat(m[3]) / parseFloat(m[4]);
        return convertFeetInches(feet, inches);
      },
    },
    {
      name: 'combined_ft_in',
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032])\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033])/gi,
      convert(m) {
        return convertFeetInches(parseFloat(m[1]), parseFloat(m[2]));
      },
    },
    {
      name: 'dimensions_3d',
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
      convert(m) {
        return convertDimensions([parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]);
      },
    },
    {
      name: 'dimensions_2d',
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033])/gi,
      convert(m) {
        return convertDimensions([parseFloat(m[1]), parseFloat(m[2])]);
      },
    },
    {
      name: 'feet',
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032])(?!\s*\d)/gi,
      convert(m) {
        return convertFeet(parseFloat(m[1]));
      },
    },
    {
      name: 'inches',
      regex: /(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|["\u2033])/gi,
      convert(m) {
        return convertInches(parseFloat(m[1]));
      },
    },
  ];

  // ===== Marker =====
  const CONVERTED_ATTR = 'data-metric-converted';

  // ===== Skip these elements =====
  const SKIP_TAGS = new Set([
    'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT',
  ]);
  const SKIP_SELECTORS = '.a-price, .a-price-whole, .a-price-fraction';

  // ===== Amazon container selectors (scoped scanning) =====
  const AMAZON_CONTAINERS = [
    '#productDetails_techSpec_section_1',
    '#productDetails_detailBullets_sections1',
    '#detailBullets_feature_div',
    '#detailBulletsWrapper_feature_div',
    '#feature-bullets',
    '#productTitle',
    '#productOverview_feature_div',
    '#productDescription',
    '#aplus_feature_div',
    '#variation_size_name',
    '#technicalSpecifications_section_1',
    'table.prodDetTable',
  ];

  function shouldSkipNode(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.matches && el.matches(SKIP_SELECTORS)) return true;
      if (el.hasAttribute && el.hasAttribute(CONVERTED_ATTR)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function processTextNode(textNode) {
    const original = textNode.textContent;
    if (!original || original.trim().length === 0) return;

    const cleaned = original.replace(DIRECTION_MARKERS, '');

    if (METRIC_PATTERN.test(cleaned)) return;

    const measurements = [];
    const coveredRanges = [];

    for (const pattern of PATTERNS) {
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(cleaned)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const overlaps = coveredRanges.some(
          (r) => start < r.end && end > r.start
        );
        if (overlaps) continue;

        measurements.push({
          index: start,
          length: match[0].length,
          converted: pattern.convert(match),
          matched: match[0],
        });
        coveredRanges.push({ start, end });
      }
    }

    if (measurements.length === 0) return;

    measurements.sort((a, b) => a.index - b.index);

    let result = '';
    let lastIndex = 0;
    for (const m of measurements) {
      const end = m.index + m.length;
      result += cleaned.slice(lastIndex, end);
      result += ` (${m.converted})`;
      lastIndex = end;
    }
    result += cleaned.slice(lastIndex);

    if (result !== cleaned) {
      textNode.textContent = result;
      if (textNode.parentElement) {
        textNode.parentElement.setAttribute(CONVERTED_ATTR, 'true');
      }
    }
  }

  function scanContainer(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const node of textNodes) {
      processTextNode(node);
    }
  }

  function scanPage() {
    let found = false;
    for (const selector of AMAZON_CONTAINERS) {
      const containers = document.querySelectorAll(selector);
      for (const container of containers) {
        scanContainer(container);
        found = true;
      }
    }

    if (!found) {
      scanContainer(document.body);
    }
  }

  // ===== MutationObserver for dynamic content =====
  let debounceTimer = null;

  function setupObserver() {
    const target = document.getElementById('dp-container') || document.body;

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanPage();
      }, 300);
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  // ===== Preference handling =====
  let enabled = true;

  function init() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get({ enabled: true }, (prefs) => {
        enabled = prefs.enabled;
        if (enabled) {
          scanPage();
          setupObserver();
        }
      });

      chrome.storage.onChanged.addListener((changes) => {
        if (changes.enabled) {
          enabled = changes.enabled.newValue;
          if (enabled) {
            scanPage();
          }
        }
      });
    } else {
      scanPage();
      setupObserver();
    }
  }

  init();
})();
