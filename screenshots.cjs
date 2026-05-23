const { chromium } = require("playwright");
const path = require("path");

const pages = [
  { name: "01-home", url: "http://localhost:3000/" },
  { name: "02-menu", url: "http://localhost:3000/menu" },
  { name: "03-about", url: "http://localhost:3000/about" },
  { name: "04-gallery", url: "http://localhost:3000/gallery" },
  { name: "05-contact", url: "http://localhost:3000/contact" },
  { name: "06-reservations", url: "http://localhost:3000/reservations" },
  { name: "07-reviews", url: "http://localhost:3000/reviews" },
  { name: "08-dashboard", url: "http://localhost:3000/dashboard" },
  { name: "09-login", url: "http://localhost:3000/auth/login" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  for (const page of pages) {
    try {
      const p = await context.newPage();
      await p.goto(page.url, { waitUntil: "networkidle", timeout: 30000 });
      await p.waitForTimeout(2000);
      await p.screenshot({
        path: path.join(__dirname, `${page.name}.png`),
        fullPage: true,
      });
      console.log(`✓ ${page.name}.png`);
      await p.close();
    } catch (e) {
      console.error(`✗ ${page.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("Done!");
})();
