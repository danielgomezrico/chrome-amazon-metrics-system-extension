(() => {
  // patterns.js
  var DIRECTION_MARKERS = /[\u200e\u200f\u200b]/g;
  var PATTERNS = [
    {
      name: "fractional_ft_in",
      regex: /(\d+)\s*['\u2032\u2019]\s*(\d+)\s+(\d+)\/(\d+)\s*["\u2033\u201D]/gi,
      parse(m) {
        return {
          type: "fractional_ft_in",
          feet: parseFloat(m[1]),
          inches: parseFloat(m[2]) + parseFloat(m[3]) / parseFloat(m[4]),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "combined_ft_in",
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032\u2019])\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "combined_ft_in",
          feet: parseFloat(m[1]),
          inches: parseFloat(m[2]),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "dimensions_3d",
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "dimensions_3d",
          values: [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])],
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "dimensions_2d",
      regex: /(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "dimensions_2d",
          values: [parseFloat(m[1]), parseFloat(m[2])],
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "feet",
      regex: /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032\u2019])(?!\s*\d)/gi,
      parse(m) {
        return {
          type: "feet",
          value: parseFloat(m[1]),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "inches",
      regex: /(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "inches",
          value: parseFloat(m[1]),
          matched: m[0],
          index: m.index
        };
      }
    }
  ];
  var ALREADY_CONVERTED = /^\s*\(\d+(?:\.\d+)?(?:\s*[×x]\s*\d+(?:\.\d+)?)*\s*(?:cm|m)\)/;
  function findMeasurements(text) {
    const cleaned = text.replace(DIRECTION_MARKERS, "");
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

  // conversion.js
  var CM_PER_INCH = 2.54;
  var CM_PER_FOOT = 30.48;
  function formatMetric(totalCm) {
    if (totalCm >= 100) {
      return `${(totalCm / 100).toFixed(2)} m`;
    }
    return `${totalCm.toFixed(2)} cm`;
  }
  function convertInches(inches) {
    const cm = inches * CM_PER_INCH;
    return formatMetric(cm);
  }
  function convertFeet(feet) {
    const cm = feet * CM_PER_FOOT;
    return formatMetric(cm);
  }
  function convertFeetInches(feet, inches) {
    const totalCm = feet * CM_PER_FOOT + inches * CM_PER_INCH;
    return formatMetric(totalCm);
  }
  function convertDimensions2D(w, h) {
    const wCm = w * CM_PER_INCH;
    const hCm = h * CM_PER_INCH;
    const maxCm = Math.max(wCm, hCm);
    if (maxCm >= 100) {
      return `${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
    }
    return `${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
  }
  function convertDimensions3D(l, w, h) {
    const lCm = l * CM_PER_INCH;
    const wCm = w * CM_PER_INCH;
    const hCm = h * CM_PER_INCH;
    const maxCm = Math.max(lCm, wCm, hCm);
    if (maxCm >= 100) {
      return `${(lCm / 100).toFixed(2)} x ${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
    }
    return `${lCm.toFixed(2)} x ${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
  }

  // src/content.js
  var LOG_PREFIX = "[im2m]";
  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }
  function convertMeasurement(measurement) {
    switch (measurement.type) {
      case "fractional_ft_in":
      case "combined_ft_in":
        return convertFeetInches(measurement.feet, measurement.inches);
      case "dimensions_3d":
        return convertDimensions3D(...measurement.values);
      case "dimensions_2d":
        return convertDimensions2D(...measurement.values);
      case "feet":
        return convertFeet(measurement.value);
      case "inches":
        return convertInches(measurement.value);
      default:
        return null;
    }
  }
  var CONVERTED_ATTR = "data-metric-converted";
  var SKIP_TAGS = /* @__PURE__ */ new Set([
    "INPUT",
    "TEXTAREA",
    "SCRIPT",
    "STYLE",
    "CODE",
    "PRE",
    "NOSCRIPT"
  ]);
  var SKIP_SELECTORS = ".a-price, .a-price-whole, .a-price-fraction";
  function shouldSkipNode(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) {
        log("skip (tag):", el.tagName, JSON.stringify(node.textContent.slice(0, 60)));
        return true;
      }
      if (el.matches && el.matches(SKIP_SELECTORS)) {
        log("skip (price):", JSON.stringify(node.textContent.slice(0, 60)));
        return true;
      }
      if (el.hasAttribute && el.hasAttribute(CONVERTED_ATTR)) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }
  function processTextNode(textNode) {
    const original = textNode.textContent;
    if (!original || original.trim().length === 0) return;
    const measurements = findMeasurements(original);
    if (measurements.length === 0) return;
    const cleaned = original.replace(/[\u200e\u200f\u200b]/g, "");
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    for (const m of measurements) {
      const converted = convertMeasurement(m);
      if (!converted) continue;
      const end = m.index + m.matched.length;
      fragment.appendChild(document.createTextNode(cleaned.slice(lastIndex, end)));
      const span = document.createElement("span");
      span.className = "im2m-converted";
      span.textContent = ` (${converted})`;
      fragment.appendChild(span);
      lastIndex = end;
    }
    if (lastIndex < cleaned.length) {
      fragment.appendChild(document.createTextNode(cleaned.slice(lastIndex)));
    }
    const parent = textNode.parentNode;
    if (parent) {
      log(
        "converted:",
        measurements.map((m) => `"${m.matched}" \u2192 (${convertMeasurement(m)})`).join(", "),
        "| parent:",
        parent.tagName + (parent.className ? "." + parent.className.split(" ")[0] : "")
      );
      parent.replaceChild(fragment, textNode);
      parent.setAttribute(CONVERTED_ATTR, "true");
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
        }
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
    log("scanPage: starting full body scan");
    scanContainer(document.body);
    log("scanPage: done");
  }
  var debounceTimer = null;
  function setupObserver() {
    const target = document.getElementById("dp-container") || document.body;
    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanPage();
      }, 300);
    });
    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .im2m-converted {
      color: #067D62;
      font-size: 0.85em;
      white-space: nowrap;
    }
  `;
    document.head.appendChild(style);
  }
  var enabled = true;
  function init() {
    log("init: content script loaded on", window.location.href);
    injectStyles();
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get({ enabled: true }, (prefs) => {
        enabled = prefs.enabled;
        log("init: enabled =", enabled);
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
