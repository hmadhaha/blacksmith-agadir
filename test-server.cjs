const { spawn } = require("child_process");
const http = require("http");

const PAGES = [
  "/", "/menu", "/about", "/gallery", "/contact",
  "/reservations", "/reviews", "/dashboard", "/auth/login",
  "/menu/1", "/dashboard/menu", "/dashboard/categories",
  "/dashboard/reservations", "/dashboard/gallery", "/dashboard/settings",
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

// Kill any existing server first
http.get("http://localhost:3000", () => {}).on("error", () => {});

console.log("Starting server...");
const server = spawn("npx.cmd", ["next", "start", "-p", "3000"], {
  cwd: __dirname,
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
});

setTimeout(async () => {
  let ok = 0, fail = 0;
  for (const path of PAGES) {
    try {
      const { status, body } = await fetch(`http://localhost:3000${path}`);
      const hasHtml = body.includes("<!DOCTYPE");
      const hasTitle = body.includes("Blacksmith") || body.includes("Dashboard");
      const hasScript = body.includes("_next/");
      if (status === 200 && hasHtml && hasTitle) {
        console.log(`✓ ${status} ${path}`);
        ok++;
      } else {
        console.log(`⚠ ${status} ${path} (html:${hasHtml} title:${hasTitle})`);
        fail++;
      }
    } catch (e) {
      console.log(`✗ ${path} - ${e.message}`);
      fail++;
    }
  }
  console.log(`\nResults: ${ok} OK, ${fail} Failed out of ${PAGES.length}`);
  server.kill();
  process.exit(fail > 0 ? 1 : 0);
}, 8000);
