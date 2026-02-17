import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const iconSvg = readFileSync(resolve(root, 'icons/icon.svg'), 'utf8');
const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;
const example2Base64 = readFileSync(resolve(root, 'docs/example2.png')).toString('base64');
const example2DataUri = `data:image/png;base64,${example2Base64}`;
const example1Base64 = readFileSync(resolve(root, 'docs/example.png')).toString('base64');
const example1DataUri = `data:image/png;base64,${example1Base64}`;

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
  }
`;

// Screenshot 1: Hero - Main promotional image
const screenshot1 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  background: linear-gradient(135deg, #0f1b2d 0%, #1a2744 40%, #1e3a5f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.container {
  display: flex;
  align-items: center;
  gap: 80px;
  padding: 0 80px;
}
.left {
  flex: 0 0 auto;
  text-align: center;
}
.icon {
  width: 120px;
  height: 120px;
  margin-bottom: 32px;
}
.title {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
}
.subtitle {
  font-size: 18px;
  color: #8bb8e8;
  font-weight: 400;
  max-width: 340px;
  line-height: 1.5;
}
.right {
  flex: 1;
  position: relative;
}
.browser-frame {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0,0,0,0.5);
}
.browser-bar {
  background: #f1f3f4;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot.r { background: #ff5f57; }
.dot.y { background: #febc2e; }
.dot.g { background: #28c840; }
.url-bar {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  color: #666;
  margin-left: 12px;
}
.page-content {
  padding: 0;
  height: 520px;
  overflow: hidden;
}
.page-content img {
  width: 100%;
  display: block;
}
.badge {
  position: absolute;
  top: -15px;
  right: -15px;
  background: linear-gradient(135deg, #067D62, #0a9e7a);
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(6,125,98,0.4);
}
</style></head>
<body>
  <div class="container">
    <div class="left">
      <img class="icon" src="${iconDataUri}" alt="icon">
      <div class="title">Amazon Imperial<br>to Metric</div>
      <div class="subtitle">Automatically converts feet &amp; inches to meters &amp; centimeters on Amazon</div>
    </div>
    <div class="right">
      <div class="browser-frame">
        <div class="browser-bar">
          <div class="dot r"></div>
          <div class="dot y"></div>
          <div class="dot g"></div>
          <div class="url-bar">amazon.com/dp/B0...</div>
        </div>
        <div class="page-content">
          <img src="${example2DataUri}" alt="example">
        </div>
      </div>
      <div class="badge">✓ Metric conversions shown</div>
    </div>
  </div>
</body></html>
`;

// Screenshot 2: In-Action with callouts
const screenshot2 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.heading {
  font-size: 28px;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 8px;
}
.subheading {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}
.main {
  position: relative;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}
.browser-frame {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  width: 780px;
}
.browser-bar {
  background: #f1f3f4;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.r { background: #ff5f57; }
.dot.y { background: #febc2e; }
.dot.g { background: #28c840; }
.url-bar {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 5px 14px;
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}
.page-content {
  height: 580px;
  overflow: hidden;
}
.page-content img {
  width: 100%;
  display: block;
}
.callouts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 360px;
  padding-top: 30px;
}
.callout {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-left: 4px solid #067D62;
}
.callout-title {
  font-size: 14px;
  font-weight: 600;
  color: #232f3e;
  margin-bottom: 6px;
}
.callout-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
.callout-example {
  margin-top: 8px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 13px;
  color: #333;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
}
.callout-example .metric {
  color: #067D62;
  font-weight: 600;
}
</style></head>
<body>
  <div class="heading">See It in Action</div>
  <div class="subheading">Metric conversions appear automatically in green alongside original measurements</div>
  <div class="main">
    <div class="browser-frame">
      <div class="browser-bar">
        <div class="dot r"></div>
        <div class="dot y"></div>
        <div class="dot g"></div>
        <div class="url-bar">amazon.com — Adjustable Standing Desk</div>
      </div>
      <div class="page-content">
        <img src="${example2DataUri}" alt="example">
      </div>
    </div>
    <div class="callouts">
      <div class="callout">
        <div class="callout-title">Product Title</div>
        <div class="callout-text">Dimensions in the title are converted automatically</div>
        <div class="callout-example">48 x 24 Inches <span class="metric">(1.22 x 0.61 m)</span></div>
      </div>
      <div class="callout">
        <div class="callout-title">Size Options</div>
        <div class="callout-text">Every size variant shows its metric equivalent</div>
        <div class="callout-example">48 Inches <span class="metric">(1.22 m)</span></div>
      </div>
      <div class="callout">
        <div class="callout-title">Product Details</div>
        <div class="callout-text">Specification tables are converted too</div>
        <div class="callout-example">24" x 48" x 28.3"H <span class="metric">(0.61 x 1.22 x 0.72 m)</span></div>
      </div>
    </div>
  </div>
</body></html>
`;

// Screenshot 3: Supported formats
const screenshot3 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  background: linear-gradient(170deg, #f8fafb 0%, #eef3f7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}
.heading {
  font-size: 32px;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 8px;
}
.subheading {
  font-size: 17px;
  color: #666;
  margin-bottom: 48px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1100px;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}
.card-icon {
  width: 44px;
  height: 44px;
  background: #e8f5f1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #232f3e;
  margin-bottom: 8px;
}
.card-example {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  background: #f8f9fa;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #333;
}
.arrow {
  display: block;
  text-align: center;
  color: #067D62;
  font-size: 16px;
  margin: 6px 0;
}
.card-result {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  background: #e8f5f1;
  padding: 10px 14px;
  border-radius: 8px;
  color: #067D62;
  font-weight: 600;
}
</style></head>
<body>
  <div class="heading">Every Format, Converted Instantly</div>
  <div class="subheading">Handles all common imperial measurement formats found on Amazon</div>
  <div class="grid">
    <div class="card">
      <div class="card-icon">📏</div>
      <div class="card-title">Feet &amp; Inches</div>
      <div class="card-example">5 feet 3 inches</div>
      <div class="arrow">↓</div>
      <div class="card-result">1.60 m</div>
    </div>
    <div class="card">
      <div class="card-icon">📐</div>
      <div class="card-title">Shorthand Notation</div>
      <div class="card-example">5' 3 1/2"</div>
      <div class="arrow">↓</div>
      <div class="card-result">1.61 m</div>
    </div>
    <div class="card">
      <div class="card-icon">↔️</div>
      <div class="card-title">Inches Only</div>
      <div class="card-example">36 inches</div>
      <div class="arrow">↓</div>
      <div class="card-result">91.44 cm</div>
    </div>
    <div class="card">
      <div class="card-icon">↕️</div>
      <div class="card-title">Feet Only</div>
      <div class="card-example">6.5 feet</div>
      <div class="arrow">↓</div>
      <div class="card-result">1.98 m</div>
    </div>
    <div class="card">
      <div class="card-icon">📦</div>
      <div class="card-title">2D Dimensions</div>
      <div class="card-example">48 x 24 inches</div>
      <div class="arrow">↓</div>
      <div class="card-result">121.92 x 60.96 cm</div>
    </div>
    <div class="card">
      <div class="card-icon">🗃️</div>
      <div class="card-title">3D Dimensions</div>
      <div class="card-example">10 x 5 x 2 inches</div>
      <div class="arrow">↓</div>
      <div class="card-result">25.40 x 12.70 x 5.08 cm</div>
    </div>
  </div>
</body></html>
`;

// Screenshot 4: Simple popup + privacy
const screenshot4 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  background: linear-gradient(135deg, #0f1b2d 0%, #1a2744 50%, #1e3a5f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.container {
  display: flex;
  gap: 100px;
  align-items: center;
  padding: 0 100px;
}
.left {
  flex: 0 0 auto;
  text-align: center;
}
.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}
.section-subtitle {
  font-size: 15px;
  color: #8bb8e8;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 340px;
}
.popup-mock {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 260px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  margin: 0 auto;
}
.popup-header {
  font-size: 18px;
  font-weight: 600;
  color: #232f3e;
  margin-bottom: 16px;
}
.popup-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.popup-label {
  font-size: 15px;
  color: #333;
}
.toggle-switch {
  width: 48px;
  height: 26px;
  background: #067D62;
  border-radius: 13px;
  position: relative;
}
.toggle-knob {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.popup-status {
  font-size: 13px;
  color: #067D62;
  margin-top: 8px;
  font-weight: 500;
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
  gap: 24px;
}
.feature {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.feature-icon {
  width: 52px;
  height: 52px;
  background: rgba(77, 166, 255, 0.1);
  border: 1px solid rgba(77, 166, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
.feature-text h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}
.feature-text p {
  font-size: 14px;
  color: #8bb8e8;
  line-height: 1.4;
}
</style></head>
<body>
  <div class="container">
    <div class="left">
      <div class="section-title">Simple Toggle</div>
      <div class="section-subtitle">One click to enable or disable.<br>Your preference syncs across devices.</div>
      <div class="popup-mock">
        <div class="popup-header">Imperial → Metric</div>
        <div class="popup-toggle">
          <div class="popup-label">Enabled</div>
          <div class="toggle-switch">
            <div class="toggle-knob"></div>
          </div>
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
  </div>
</body></html>
`;

// Screenshot 5: Global Amazon support
const screenshot5 = `
<!DOCTYPE html>
<html><head><style>
${commonStyles}
body {
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
}
.heading {
  font-size: 32px;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 8px;
}
.subheading {
  font-size: 17px;
  color: #666;
  margin-bottom: 48px;
}
.sites-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 48px;
}
.site-card {
  background: white;
  border-radius: 14px;
  padding: 22px 16px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}
.site-flag {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}
.site-domain {
  font-size: 13px;
  color: #232f3e;
  font-weight: 600;
}
.site-country {
  font-size: 11px;
  color: #888;
  margin-top: 3px;
}
.bottom-bar {
  display: flex;
  align-items: center;
  gap: 40px;
  background: white;
  border-radius: 16px;
  padding: 24px 48px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.stat {
  text-align: center;
}
.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #067D62;
}
.stat-label {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 48px;
  background: #eee;
}
</style></head>
<body>
  <div class="heading">Works on 15 Amazon Sites Worldwide</div>
  <div class="subheading">Wherever you shop on Amazon, metric conversions are right there with you</div>
  <div class="sites-grid">
    <div class="site-card">
      <span class="site-flag">🇺🇸</span>
      <div class="site-domain">amazon.com</div>
      <div class="site-country">United States</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇬🇧</span>
      <div class="site-domain">amazon.co.uk</div>
      <div class="site-country">United Kingdom</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇨🇦</span>
      <div class="site-domain">amazon.ca</div>
      <div class="site-country">Canada</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇦🇺</span>
      <div class="site-domain">amazon.com.au</div>
      <div class="site-country">Australia</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇮🇳</span>
      <div class="site-domain">amazon.in</div>
      <div class="site-country">India</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇩🇪</span>
      <div class="site-domain">amazon.de</div>
      <div class="site-country">Germany</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇫🇷</span>
      <div class="site-domain">amazon.fr</div>
      <div class="site-country">France</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇪🇸</span>
      <div class="site-domain">amazon.es</div>
      <div class="site-country">Spain</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇮🇹</span>
      <div class="site-domain">amazon.it</div>
      <div class="site-country">Italy</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇯🇵</span>
      <div class="site-domain">amazon.co.jp</div>
      <div class="site-country">Japan</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇧🇷</span>
      <div class="site-domain">amazon.com.br</div>
      <div class="site-country">Brazil</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇳🇱</span>
      <div class="site-domain">amazon.nl</div>
      <div class="site-country">Netherlands</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇸🇪</span>
      <div class="site-domain">amazon.se</div>
      <div class="site-country">Sweden</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇵🇱</span>
      <div class="site-domain">amazon.pl</div>
      <div class="site-country">Poland</div>
    </div>
    <div class="site-card">
      <span class="site-flag">🇲🇽</span>
      <div class="site-domain">amazon.com.mx</div>
      <div class="site-country">Mexico</div>
    </div>
  </div>
  <div class="bottom-bar">
    <div class="stat">
      <div class="stat-number">15</div>
      <div class="stat-label">Amazon Sites</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-number">6</div>
      <div class="stat-label">Format Types</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-number">0</div>
      <div class="stat-label">Data Collected</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-number">100%</div>
      <div class="stat-label">Open Source</div>
    </div>
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
