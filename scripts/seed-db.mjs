const SUPABASE_URL = "https://gibcahbipyxndcefercl.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpYmNhaGJpcHl4bmRjZWZlcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTAyNTAsImV4cCI6MjA5NDk2NjI1MH0.n9UofJNgveFM0AJawBWtS4LbmurDEJ-S8sTrLLlfgHI";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(readFileSync(resolve(__dirname, "..", "data", "menu-items.json"), "utf-8"));

async function seed() {
  const headers = { "Content-Type": "application/json", "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` };
  let success = 0, fail = 0;

  for (const item of items) {
    const body = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      popular: item.popular,
      discount_percent: item.discountPercent || 0,
    };
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (res.ok || res.status === 201) {
        success++;
      } else {
        const txt = await res.text();
        console.log(`FAIL ${item.id} ${item.name}: ${res.status} ${txt.substring(0, 100)}`);
        fail++;
      }
    } catch (e) {
      console.log(`ERR ${item.id}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${success} inserted, ${fail} failed`);
}

seed();
