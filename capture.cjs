const { chromium } = require("playwright");
const path = require("path");

const PAGES = [
  { name: "01-home", url: "/" },
  { name: "02-menu", url: "/menu" },
  { name: "03-about", url: "/about" },
  { name: "04-gallery", url: "/gallery" },
  { name: "05-contact", url: "/contact" },
  { name: "06-reservations", url: "/reservations" },
  { name: "07-reviews", url: "/reviews" },
  { name: "08-dashboard", url: "/dashboard" },
  { name: "09-login", url: "/auth/login" },
];

(async () => {
  console.log("Starting browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const page of PAGES) {
    try {
      const p = await context.newPage();
      const url = `http://localhost:3001${page.url}`;
      console.log(`Navigating to ${url}`);
      await p.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
      await p.waitForTimeout(2000);
      await p.screenshot({ path: path.join(__dirname, `${page.name}.png`), fullPage: true });
      console.log(`✓ ${page.name}.png`);
      await p.close();
    } catch (e) {
      console.error(`✗ ${page.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("All screenshots done!");
  process.exit(0);
})();
