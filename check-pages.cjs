const http = require("http");

const pages = [
  "/", "/menu", "/about", "/gallery", "/contact",
  "/reservations", "/reviews", "/dashboard", "/auth/login"
];

let completed = 0;

pages.forEach((path) => {
  http.get(`http://localhost:3000${path}`, (res) => {
    let data = "";
    res.on("data", (c) => (data += c));
    res.on("end", () => {
      const hasHtml = data.includes("<!DOCTYPE");
      const hasBlacksmith = data.includes("Blacksmith");
      const hasScript = data.includes("_next/");
      console.log(
        `${res.statusCode} ${path} - HTML:${hasHtml} Blacksmith:${hasBlacksmith} Script:${hasScript} Size:${data.length}B`
      );
      completed++;
      if (completed === pages.length) process.exit(0);
    });
  }).on("error", (e) => {
    console.log(`ERR ${path} - ${e.message}`);
    completed++;
    if (completed === pages.length) process.exit(1);
  });
});
