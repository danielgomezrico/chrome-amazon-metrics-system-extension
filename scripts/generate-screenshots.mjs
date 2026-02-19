import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const iconSvg = readFileSync(resolve(root, 'icons/icon.svg'), 'utf8');
const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;

const WIDTH = 1280;
const HEIGHT = 800;

const commonStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    background: linear-gradient(135deg, #0f766e 0%, #2563eb 55%, #4338ca 100%);
    color: white;
  }
  .glass {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 18px;
  }
  .yellow { color: #fbbf24; }
`;

// Screenshot 1: Hero — value prop + privacy chips + inline product mockup
const screenshot1 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 0 72px;
}
.left {
  flex: 0 0 auto;
  max-width: 380px;
}
.icon {
  width: 96px;
  height: 96px;
  margin-bottom: 28px;
}
.title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
  margin-bottom: 16px;
}
.subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.8);
  line-height: 1.55;
  margin-bottom: 32px;
}
.chips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.28);
  border-radius: 40px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
}
.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fbbf24;
  flex-shrink: 0;
}
.right {
  flex: 1;
}
.product-card {
  padding: 36px 40px;
}
.product-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 20px;
}
.product-title {
  font-size: 19px;
  font-weight: 700;
  color: rgba(255,255,255,0.95);
  line-height: 1.4;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.product-title .converted {
  color: #fbbf24;
  font-weight: 700;
}
.spec-table {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.spec-row {
  display: flex;
  gap: 16px;
  align-items: baseline;
}
.spec-key {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  width: 160px;
  flex-shrink: 0;
}
.spec-val {
  font-size: 15px;
  color: rgba(255,255,255,0.9);
}
.spec-val .converted {
  color: #fbbf24;
  font-weight: 600;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  background: rgba(251, 191, 36, 0.18);
  border: 1px solid rgba(251, 191, 36, 0.45);
  border-radius: 40px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
}
</style></head>
<body>
  <div class="left">
    <img class="icon" src="${iconDataUri}" alt="icon">
    <div class="title">Amazon Imperial<br>to Metric</div>
    <div class="subtitle">Automatically converts imperial measurements to metric on every Amazon page — instantly.</div>
    <div class="chips">
      <div class="chip"><div class="chip-dot"></div>Zero data collected, ever</div>
      <div class="chip"><div class="chip-dot"></div>100% local — no external calls</div>
      <div class="chip"><div class="chip-dot"></div>Fully open source</div>
    </div>
  </div>
  <div class="right">
    <div class="glass product-card">
      <div class="product-label">Amazon Product Page — Live Preview</div>
      <div class="product-title">
        Adjustable Standing Desk — 48 x 24 Inches <span class="converted">(1.22 × 0.61 m)</span>, Electric Height Adjustable, Memory Preset
      </div>
      <div class="spec-table">
        <div class="spec-row">
          <div class="spec-key">Desktop Size</div>
          <div class="spec-val">48 x 24 inches <span class="converted">(1.22 × 0.61 m)</span></div>
        </div>
        <div class="spec-row">
          <div class="spec-key">Height Range</div>
          <div class="spec-val">28 to 47.6 inches <span class="converted">(71.12 to 120.9 cm)</span></div>
        </div>
        <div class="spec-row">
          <div class="spec-key">Weight Capacity</div>
          <div class="spec-val">176 lbs <span class="converted">(79.83 kg)</span></div>
        </div>
        <div class="spec-row">
          <div class="spec-key">Package Weight</div>
          <div class="spec-val">86 lbs 4 oz <span class="converted">(39.12 kg)</span></div>
        </div>
        <div class="spec-row">
          <div class="spec-key">Item Dimensions</div>
          <div class="spec-val">48 x 24 x 28.3 inches <span class="converted">(1.22 × 0.61 × 0.72 m)</span></div>
        </div>
      </div>
      <div class="badge">✓ Metric conversions shown automatically</div>
    </div>
  </div>
</body></html>
`;

// Screenshot 2: In Action — large centered product spec mockup with annotations
const screenshot2 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 80px;
  gap: 36px;
}
.heading {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-align: center;
}
.subheading {
  font-size: 18px;
  color: rgba(255,255,255,0.75);
  text-align: center;
  margin-top: -24px;
}
.card {
  padding: 36px 48px;
  width: 100%;
  max-width: 1060px;
}
.listing-title {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255,255,255,0.95);
  line-height: 1.4;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.converted { color: #fbbf24; font-weight: 700; }
.specs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px 40px;
}
.spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.spec-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}
.spec-value {
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  line-height: 1.4;
}
.annotations {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.annotation {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 40px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
}
.annotation-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fbbf24;
}
</style></head>
<body>
  <div class="heading">See It in Action</div>
  <div class="subheading">Metric conversions appear automatically in yellow alongside original measurements</div>
  <div class="glass card">
    <div class="listing-title">
      Adjustable Standing Desk — 48 x 24 Inches <span class="converted">(1.22 × 0.61 m)</span>, Electric Height Adjustable
    </div>
    <div class="specs">
      <div class="spec">
        <div class="spec-label">Desktop Size</div>
        <div class="spec-value">48 x 24 inches<br><span class="converted">(1.22 × 0.61 m)</span></div>
      </div>
      <div class="spec">
        <div class="spec-label">Height Range</div>
        <div class="spec-value">28 to 47.6 inches<br><span class="converted">(71.12 to 120.9 cm)</span></div>
      </div>
      <div class="spec">
        <div class="spec-label">Weight Capacity</div>
        <div class="spec-value">176 lbs<br><span class="converted">(79.83 kg)</span></div>
      </div>
      <div class="spec">
        <div class="spec-label">Package Weight</div>
        <div class="spec-value">86 lbs 4 oz<br><span class="converted">(39.12 kg)</span></div>
      </div>
      <div class="spec">
        <div class="spec-label">Water Tank</div>
        <div class="spec-value">0.5 gallons<br><span class="converted">(1.89 L)</span></div>
      </div>
      <div class="spec">
        <div class="spec-label">Operating Temp</div>
        <div class="spec-value">32°F to 104°F<br><span class="converted">(0.00°C to 40.00°C)</span></div>
      </div>
    </div>
  </div>
  <div class="annotations">
    <div class="annotation"><div class="annotation-dot"></div>Product Titles</div>
    <div class="annotation"><div class="annotation-dot"></div>Spec Tables</div>
    <div class="annotation"><div class="annotation-dot"></div>Size Variants</div>
    <div class="annotation"><div class="annotation-dot"></div>Descriptions</div>
  </div>
</body></html>
`;

// Screenshot 3: Formats — 6 category cards covering 19+ formats
const screenshot3 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 72px;
  gap: 0;
}
.heading {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  text-align: center;
}
.subheading {
  font-size: 17px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  text-align: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1136px;
}
.card {
  padding: 24px 26px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.card-icon {
  font-size: 26px;
  line-height: 1;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
}
.examples {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.example {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.imperial {
  color: rgba(255,255,255,0.7);
  font-family: 'SF Mono', 'Menlo', monospace;
  background: rgba(255,255,255,0.08);
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}
.arrow {
  color: rgba(255,255,255,0.4);
  font-size: 12px;
  flex-shrink: 0;
}
.metric {
  color: #fbbf24;
  font-weight: 700;
  font-family: 'SF Mono', 'Menlo', monospace;
  white-space: nowrap;
}
</style></head>
<body>
  <div class="heading">Every Measurement, Converted Instantly</div>
  <div class="subheading">19+ imperial formats across 6 categories</div>
  <div class="grid">
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">📏</div>
        <div class="card-title">Length &amp; Dimensions</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">5'3"</span><span class="arrow">→</span><span class="metric">1.60 m</span></div>
        <div class="example"><span class="imperial">10 × 5 × 2 in</span><span class="arrow">→</span><span class="metric">25.4 × 12.7 × 5.08 cm</span></div>
        <div class="example"><span class="imperial">36 inches</span><span class="arrow">→</span><span class="metric">91.44 cm</span></div>
      </div>
    </div>
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">⚖️</div>
        <div class="card-title">Weight</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">5 lbs 8 oz</span><span class="arrow">→</span><span class="metric">2.49 kg</span></div>
        <div class="example"><span class="imperial">176 pounds</span><span class="arrow">→</span><span class="metric">79.83 kg</span></div>
        <div class="example"><span class="imperial">12 oz</span><span class="arrow">→</span><span class="metric">340.19 g</span></div>
      </div>
    </div>
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">🫗</div>
        <div class="card-title">Volume</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">1 gallon</span><span class="arrow">→</span><span class="metric">3.79 L</span></div>
        <div class="example"><span class="imperial">16 fl oz</span><span class="arrow">→</span><span class="metric">473.18 mL</span></div>
        <div class="example"><span class="imperial">2 quarts</span><span class="arrow">→</span><span class="metric">1.89 L</span></div>
      </div>
    </div>
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">📐</div>
        <div class="card-title">Area</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">150 sq ft</span><span class="arrow">→</span><span class="metric">13.94 m²</span></div>
        <div class="example"><span class="imperial">36 sq in</span><span class="arrow">→</span><span class="metric">232.26 cm²</span></div>
      </div>
    </div>
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">🌡️</div>
        <div class="card-title">Temperature</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">98.6°F</span><span class="arrow">→</span><span class="metric">37.00°C</span></div>
        <div class="example"><span class="imperial">32°F</span><span class="arrow">→</span><span class="metric">0.00°C</span></div>
      </div>
    </div>
    <div class="glass card">
      <div class="card-header">
        <div class="card-icon">⚡</div>
        <div class="card-title">Speed &amp; Pressure</div>
      </div>
      <div class="examples">
        <div class="example"><span class="imperial">60 mph</span><span class="arrow">→</span><span class="metric">96.56 km/h</span></div>
        <div class="example"><span class="imperial">30 psi</span><span class="arrow">→</span><span class="metric">2.07 bar</span></div>
        <div class="example"><span class="imperial">120 miles</span><span class="arrow">→</span><span class="metric">193.12 km</span></div>
      </div>
    </div>
  </div>
</body></html>
`;

// Screenshot 4: Simple toggle + privacy
const screenshot4 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 0 88px;
}
.left {
  flex: 0 0 auto;
  text-align: center;
}
.section-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
}
.section-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  line-height: 1.6;
  max-width: 300px;
}
.popup-mock {
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 300px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.35);
  margin: 0 auto;
}
.popup-header {
  font-size: 19px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
}
.popup-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.popup-label {
  font-size: 16px;
  color: #333;
}
.toggle-switch {
  width: 52px;
  height: 28px;
  background: #0f766e;
  border-radius: 14px;
  position: relative;
}
.toggle-knob {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}
.popup-status {
  font-size: 14px;
  color: #0f766e;
  margin-top: 12px;
  font-weight: 600;
}
.right {
  flex: 1;
}
.right .section-title {
  text-align: left;
}
.features {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.feature {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.feature-icon {
  width: 56px;
  height: 56px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}
.feature-text h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 4px;
}
.feature-text p {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  line-height: 1.4;
}
</style></head>
<body>
  <div class="left">
    <div class="section-title">Simple Toggle</div>
    <div class="section-subtitle">One click to enable or disable.<br>Your preference syncs across devices.</div>
    <div class="popup-mock">
      <div class="popup-header">Imperial → Metric</div>
      <div class="popup-toggle">
        <div class="popup-label">Enabled</div>
        <div class="toggle-switch"><div class="toggle-knob"></div></div>
      </div>
      <div class="popup-status">Active</div>
    </div>
  </div>
  <div class="right">
    <div class="section-title">Privacy First</div>
    <div class="features">
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <div class="feature-text">
          <h3>No Data Collection</h3>
          <p>Zero data is collected, transmitted, or stored. Ever.</p>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <div class="feature-text">
          <h3>100% Local</h3>
          <p>All conversions happen in your browser. No external API calls.</p>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <div class="feature-text">
          <h3>No Tracking</h3>
          <p>No analytics, no accounts, no third-party services.</p>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon">📖</div>
        <div class="feature-text">
          <h3>Open Source</h3>
          <p>Fully open source. Review every line of code on GitHub.</p>
        </div>
      </div>
    </div>
  </div>
</body></html>
`;

// Screenshot 5: Global Amazon support
const screenshot5 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 72px;
}
.heading {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  text-align: center;
}
.subheading {
  font-size: 17px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  text-align: center;
}
.sites-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  width: 100%;
  max-width: 1136px;
  margin-bottom: 28px;
}
.site-card {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 14px;
  padding: 18px 12px;
  text-align: center;
}
.site-flag {
  font-size: 30px;
  margin-bottom: 8px;
  display: block;
}
.site-domain {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
}
.site-country {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}
.bottom-bar {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 16px;
  padding: 20px 0;
  width: 100%;
  max-width: 1136px;
}
.stat {
  text-align: center;
  flex: 1;
}
.stat-number {
  font-size: 30px;
  font-weight: 800;
  color: #fbbf24;
}
.stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 44px;
  background: rgba(255,255,255,0.15);
}
</style></head>
<body>
  <div class="heading">Works on 15 Amazon Sites Worldwide</div>
  <div class="subheading">Wherever you shop on Amazon, metric conversions are right there with you</div>
  <div class="sites-grid">
    <div class="site-card"><span class="site-flag">🇺🇸</span><div class="site-domain">amazon.com</div><div class="site-country">United States</div></div>
    <div class="site-card"><span class="site-flag">🇬🇧</span><div class="site-domain">amazon.co.uk</div><div class="site-country">United Kingdom</div></div>
    <div class="site-card"><span class="site-flag">🇨🇦</span><div class="site-domain">amazon.ca</div><div class="site-country">Canada</div></div>
    <div class="site-card"><span class="site-flag">🇦🇺</span><div class="site-domain">amazon.com.au</div><div class="site-country">Australia</div></div>
    <div class="site-card"><span class="site-flag">🇮🇳</span><div class="site-domain">amazon.in</div><div class="site-country">India</div></div>
    <div class="site-card"><span class="site-flag">🇩🇪</span><div class="site-domain">amazon.de</div><div class="site-country">Germany</div></div>
    <div class="site-card"><span class="site-flag">🇫🇷</span><div class="site-domain">amazon.fr</div><div class="site-country">France</div></div>
    <div class="site-card"><span class="site-flag">🇪🇸</span><div class="site-domain">amazon.es</div><div class="site-country">Spain</div></div>
    <div class="site-card"><span class="site-flag">🇮🇹</span><div class="site-domain">amazon.it</div><div class="site-country">Italy</div></div>
    <div class="site-card"><span class="site-flag">🇯🇵</span><div class="site-domain">amazon.co.jp</div><div class="site-country">Japan</div></div>
    <div class="site-card"><span class="site-flag">🇧🇷</span><div class="site-domain">amazon.com.br</div><div class="site-country">Brazil</div></div>
    <div class="site-card"><span class="site-flag">🇳🇱</span><div class="site-domain">amazon.nl</div><div class="site-country">Netherlands</div></div>
    <div class="site-card"><span class="site-flag">🇸🇪</span><div class="site-domain">amazon.se</div><div class="site-country">Sweden</div></div>
    <div class="site-card"><span class="site-flag">🇵🇱</span><div class="site-domain">amazon.pl</div><div class="site-country">Poland</div></div>
    <div class="site-card"><span class="site-flag">🇲🇽</span><div class="site-domain">amazon.com.mx</div><div class="site-country">Mexico</div></div>
  </div>
  <div class="bottom-bar">
    <div class="stat"><div class="stat-number">15</div><div class="stat-label">Amazon Sites</div></div>
    <div class="stat-divider"></div>
    <div class="stat"><div class="stat-number">19+</div><div class="stat-label">Format Types</div></div>
    <div class="stat-divider"></div>
    <div class="stat"><div class="stat-number">0</div><div class="stat-label">Data Collected</div></div>
    <div class="stat-divider"></div>
    <div class="stat"><div class="stat-number">100%</div><div class="stat-label">Open Source</div></div>
  </div>
</body></html>
`;

const screenshots = [
  { name: 'screenshot-1-hero.png', html: screenshot1 },
  { name: 'screenshot-2-in-action.png', html: screenshot2 },
  { name: 'screenshot-3-formats.png', html: screenshot3 },
  { name: 'screenshot-4-simple-private.png', html: screenshot4 },
  { name: 'screenshot-5-global.png', html: screenshot5 },
];

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const { name, html } of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const outPath = resolve(root, 'screenshots', name);
    await page.screenshot({ path: outPath, type: 'png', omitBackground: false });
    console.log(`Created: ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone! All screenshots generated in screenshots/ directory.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
