const SUPABASE_URL = "https://gibcahbipyxndcefercl.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpYmNhaGJpcHl4bmRjZWZlcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTAyNTAsImV4cCI6MjA5NDk2NjI1MH0.n9UofJNgveFM0AJawBWtS4LbmurDEJ-S8sTrLLlfgHI";
const MGMT_KEY = "sb_publishable_GUSd1u839VYk0T67mDKuTg_h0xwgGCo";

const sql = `
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  popular BOOLEAN DEFAULT false,
  discount_percent NUMERIC DEFAULT 0,
  discount_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  source TEXT DEFAULT 'Website',
  date TEXT,
  reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
`;

async function main() {
  // Try via management API
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/gibcahbipyxndcefercl/sql`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MGMT_KEY}` },
      body: JSON.stringify({ query: sql }),
    });
    if (res.ok) {
      console.log("Tables created via Mgmt API!");
    } else {
      const text = await res.text();
      console.log("Mgmt API failed:", res.status, text.substring(0, 200));
      // Fallback: try direct REST
      console.log("\nTrying direct Supabase REST...");
      const menuSql = `INSERT INTO menu_items (id, name, description, price, category, image, popular) VALUES ('init', 'Init', 'Init', 0, 'Starters', null, false) ON CONFLICT (id) DO NOTHING;`;
      const r2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` },
        body: JSON.stringify({}),
      });
      console.log("RPC test:", r2.status);
    }
  } catch (e) {
    console.log("Error:", e.message);
  }

  // Try direct insert to see if table exists
  console.log("\nChecking if menu_items table exists...");
  const r3 = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?limit=1`, {
    headers: { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` },
  });
  console.log("menu_items query:", r3.status);
  
  if (r3.status === 404) {
    console.log("\n*** TABLE DOES NOT EXIST ***");
    console.log('Please go to Supabase Dashboard → SQL Editor and run:');
    console.log(sql);
  } else if (r3.status === 200) {
    const data = await r3.json();
    console.log("Data:", JSON.stringify(data));
    console.log("\n=== TABLE EXISTS - READY TO GO ===");
  } else {
    console.log(`Status ${r3.status} - trying to debug...`);
    const txt = await r3.text();
    console.log("Response:", txt.substring(0, 200));
  }
}

main();
