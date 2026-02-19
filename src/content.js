import { findMeasurements } from '../patterns.js';
import {
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
  convertFlOz,
  convertOz,
  convertPounds,
  convertPoundsOz,
  convertGallons,
  convertQuarts,
  convertPints,
  convertFahrenheit,
  convertSqFeet,
  convertSqInches,
  convertPsi,
  convertMph,
  convertMiles,
} from '../conversion.js';

const LOG_PREFIX = '[im2m]';
// eslint-disable-next-line no-console
function log(...args) { console.log(LOG_PREFIX, ...args); }

// ===== Conversion Dispatch =====
function convertMeasurement(measurement) {
  switch (measurement.type) {
    case 'fractional_ft_in':
    case 'combined_ft_in':
      return convertFeetInches(measurement.feet, measurement.inches);
    case 'dimensions_3d':
      return convertDimensions3D(...measurement.values);
    case 'dimensions_2d':
      return convertDimensions2D(...measurement.values);
    case 'feet':
      return convertFeet(measurement.value);
    case 'inches':
      return convertInches(measurement.value);
    case 'fluid_oz':
      return convertFlOz(measurement.value);
    case 'combined_lbs_oz':
      return convertPoundsOz(measurement.pounds, measurement.oz);
    case 'pounds':
      return convertPounds(measurement.value);
    case 'weight_oz':
      return convertOz(measurement.value);
    case 'gallons':
      return convertGallons(measurement.value);
    case 'quarts':
      return convertQuarts(measurement.value);
    case 'pints':
      return convertPints(measurement.value);
    case 'fahrenheit':
      return convertFahrenheit(measurement.value);
    case 'sq_feet':
      return convertSqFeet(measurement.value);
    case 'sq_inches':
      return convertSqInches(measurement.value);
    case 'psi':
      return convertPsi(measurement.value);
    case 'mph':
      return convertMph(measurement.value);
    case 'miles':
      return convertMiles(measurement.value);
    default:
      return null;
  }
}

// ===== Marker =====
const CONVERTED_ATTR = 'data-metric-converted';

// ===== Skip these elements =====
const SKIP_TAGS = new Set([
  'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT',
]);
const SKIP_SELECTORS = '.a-price, .a-price-whole, .a-price-fraction';

function shouldSkipNode(node) {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) {
      log('skip (tag):', el.tagName, JSON.stringify(node.textContent.slice(0, 60)));
      return true;
    }
    if (el.matches && el.matches(SKIP_SELECTORS)) {
      log('skip (price):', JSON.stringify(node.textContent.slice(0, 60)));
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

  const cleaned = original.replace(/[\u200e\u200f\u200b]/g, '');

  // Build a DOM fragment with styled spans instead of modifying textContent
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  for (const m of measurements) {
    const converted = convertMeasurement(m);
    if (!converted) continue;

    const end = m.index + m.matched.length;
    fragment.appendChild(document.createTextNode(cleaned.slice(lastIndex, end)));
    const span = document.createElement('span');
    span.className = 'im2m-converted';
    span.textContent = ` (${converted})`;
    fragment.appendChild(span);
    lastIndex = end;
  }

  if (lastIndex < cleaned.length) {
    fragment.appendChild(document.createTextNode(cleaned.slice(lastIndex)));
  }

  const parent = textNode.parentNode;
  if (parent) {
    log('converted:', measurements.map(m => `"${m.matched}" → (${convertMeasurement(m)})`).join(', '),
      `| parent: ${parent.tagName}${parent.className ? `.${parent.className.split(' ')[0]}` : ''}`);
    parent.replaceChild(fragment, textNode);
    parent.setAttribute(CONVERTED_ATTR, 'true');
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
  log('scanPage: starting full body scan');
  scanContainer(document.body);
  log('scanPage: done');
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

// ===== Styles =====
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .im2m-converted {
      color: #067D62;
      font-size: 0.85em;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}

// ===== Preference handling =====
let enabled = true;

function init() {
  log('init: content script loaded on', window.location.href);
  injectStyles();
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({ enabled: true }, (prefs) => {
      enabled = prefs.enabled;
      log('init: enabled =', enabled);
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
