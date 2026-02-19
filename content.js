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
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft|['\u2032\u2019])\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in(?:\.)?|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "combined_ft_in",
          feet: parseFloat(m[1].replace(/,/g, "")),
          inches: parseFloat(m[2].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "dimensions_3d",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "dimensions_3d",
          values: [
            parseFloat(m[1].replace(/,/g, "")),
            parseFloat(m[2].replace(/,/g, "")),
            parseFloat(m[3].replace(/,/g, ""))
          ],
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "dimensions_2d",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[x\u00D7]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\.|in\b|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "dimensions_2d",
          values: [
            parseFloat(m[1].replace(/,/g, "")),
            parseFloat(m[2].replace(/,/g, ""))
          ],
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "sq_feet",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+feet|square\s+foot|sq\.?\s*ft\.?|ft²)(?!\w)/gi,
      parse(m) {
        return {
          type: "sq_feet",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "sq_inches",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s+inches?|sq\.?\s*in\.?|in²)(?!\w)/gi,
      parse(m) {
        return {
          type: "sq_inches",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "combined_lbs_oz",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
      parse(m) {
        return {
          type: "combined_lbs_oz",
          pounds: parseFloat(m[1].replace(/,/g, "")),
          oz: parseFloat(m[2].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "pounds",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds?|lbs?\.?)\b/gi,
      parse(m) {
        return {
          type: "pounds",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "feet",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft\.|ft\b|['\u2032\u2019])(?!\s*\d)/gi,
      parse(m) {
        return {
          type: "feet",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "inches",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in\b(?!\s*(?:the|a|an|stock|store|cart|total|color|this|that|our|your|my|its|one|all|any|no|each|every|some|most|both|part|front|back|between|addition|order|length))|in\.|["\u2033\u201D])/gi,
      parse(m) {
        return {
          type: "inches",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "fluid_oz",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:fl\.?\s*oz\.?|fluid\s+ounces?)\b/gi,
      parse(m) {
        return {
          type: "fluid_oz",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "weight_oz",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ounces?|onzas?|oz\.?)\b/gi,
      parse(m) {
        return {
          type: "weight_oz",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "gallons",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:gallons?|gal\.?)\b/gi,
      parse(m) {
        return {
          type: "gallons",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "quarts",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:quarts?|qt\.?)\b/gi,
      parse(m) {
        return {
          type: "quarts",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "pints",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pints?|pt\.?)\b/gi,
      parse(m) {
        return {
          type: "pints",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "fahrenheit",
      regex: /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:°\s*F|℉|degrees\s+fahrenheit)(?!\w)/gi,
      parse(m) {
        return {
          type: "fahrenheit",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "psi",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*psi\b/gi,
      parse(m) {
        return {
          type: "psi",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "mph",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:mph|MPH|miles\s+per\s+hour)\b/gi,
      parse(m) {
        return {
          type: "mph",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    },
    {
      name: "miles",
      regex: /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:miles?|mi\.?)\b/gi,
      parse(m) {
        return {
          type: "miles",
          value: parseFloat(m[1].replace(/,/g, "")),
          matched: m[0],
          index: m.index
        };
      }
    }
  ];
  var ALREADY_CONVERTED = /^\s*\(-?\d+(?:\.\d+)?(?:\s*[×x]\s*-?\d+(?:\.\d+)?)*\s*(?:cm|m|mL|L|g|kg|°C|bar|km\/h|km|m²|cm²)\)/;
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
  var ML_PER_FL_OZ = 29.5735;
  var G_PER_OZ = 28.3495;
  var G_PER_LB = 453.592;
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
  function formatVolume(totalMl) {
    if (totalMl >= 1e3) {
      return `${(totalMl / 1e3).toFixed(2)} L`;
    }
    return `${totalMl.toFixed(2)} mL`;
  }
  function convertFlOz(flOz) {
    const ml = flOz * ML_PER_FL_OZ;
    return formatVolume(ml);
  }
  function formatWeight(totalG) {
    if (totalG >= 1e3) {
      return `${(totalG / 1e3).toFixed(2)} kg`;
    }
    return `${totalG.toFixed(2)} g`;
  }
  function convertOz(oz) {
    const g = oz * G_PER_OZ;
    return formatWeight(g);
  }
  function convertPounds(lbs) {
    const g = lbs * G_PER_LB;
    return formatWeight(g);
  }
  function convertPoundsOz(lbs, oz) {
    const totalG = lbs * G_PER_LB + oz * G_PER_OZ;
    return formatWeight(totalG);
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
  var ML_PER_GALLON = 3785.41;
  var ML_PER_QUART = 946.353;
  var ML_PER_PINT = 473.176;
  var SQ_CM_PER_SQ_INCH = 6.4516;
  var SQ_CM_PER_SQ_FOOT = 929.0304;
  var BAR_PER_PSI = 0.0689476;
  var KM_PER_MILE = 1.60934;
  function convertGallons(gal) {
    const ml = gal * ML_PER_GALLON;
    return formatVolume(ml);
  }
  function convertQuarts(qt) {
    const ml = qt * ML_PER_QUART;
    return formatVolume(ml);
  }
  function convertPints(pt) {
    const ml = pt * ML_PER_PINT;
    return formatVolume(ml);
  }
  function convertFahrenheit(f) {
    const c = (f - 32) * 5 / 9;
    return `${c.toFixed(2)} \xB0C`;
  }
  function formatArea(totalSqCm) {
    if (totalSqCm >= 1e4) {
      return `${(totalSqCm / 1e4).toFixed(2)} m\xB2`;
    }
    return `${totalSqCm.toFixed(2)} cm\xB2`;
  }
  function convertSqFeet(sqFt) {
    const sqCm = sqFt * SQ_CM_PER_SQ_FOOT;
    return formatArea(sqCm);
  }
  function convertSqInches(sqIn) {
    const sqCm = sqIn * SQ_CM_PER_SQ_INCH;
    return formatArea(sqCm);
  }
  function convertPsi(psi) {
    const bar = psi * BAR_PER_PSI;
    return `${bar.toFixed(2)} bar`;
  }
  function convertMph(mph) {
    const kmh = mph * KM_PER_MILE;
    return `${kmh.toFixed(2)} km/h`;
  }
  function convertMiles(miles) {
    const km = miles * KM_PER_MILE;
    return `${km.toFixed(2)} km`;
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
      case "fluid_oz":
        return convertFlOz(measurement.value);
      case "combined_lbs_oz":
        return convertPoundsOz(measurement.pounds, measurement.oz);
      case "pounds":
        return convertPounds(measurement.value);
      case "weight_oz":
        return convertOz(measurement.value);
      case "gallons":
        return convertGallons(measurement.value);
      case "quarts":
        return convertQuarts(measurement.value);
      case "pints":
        return convertPints(measurement.value);
      case "fahrenheit":
        return convertFahrenheit(measurement.value);
      case "sq_feet":
        return convertSqFeet(measurement.value);
      case "sq_inches":
        return convertSqInches(measurement.value);
      case "psi":
        return convertPsi(measurement.value);
      case "mph":
        return convertMph(measurement.value);
      case "miles":
        return convertMiles(measurement.value);
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
        `| parent: ${parent.tagName}${parent.className ? `.${parent.className.split(" ")[0]}` : ""}`
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
