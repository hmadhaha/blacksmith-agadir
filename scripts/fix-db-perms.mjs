import pkg from "pg";
const { Client } = pkg;

const regions = [
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-0-eu-west-1.pooler.supabase.com",
  "aws-0-eu-west-2.pooler.supabase.com",
  "aws-0-eu-central-1.pooler.supabase.com",
  "aws-0-ap-southeast-1.pooler.supabase.com",
  "aws-0-us-west-1.pooler.supabase.com",
  "aws-0-eu-south-1.pooler.supabase.com",
  "us-east-1.pooler.supabase.com",
  "eu-west-1.pooler.supabase.com",
];

const sqls = [
  "GRANT INSERT ON TABLE reservations TO anon",
  "GRANT UPDATE ON TABLE reservations TO anon",
  "GRANT INSERT ON TABLE messages TO anon",
  "GRANT SELECT ON TABLE messages TO anon",
];

for (const host of regions) {
  const client = new Client({
    user: "postgres.gibcahbipyxndcefercl",
    password: "rida vegeto1",
    host,
    port: 6543,
    database: "postgres",
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    console.log("CONNECTED via", host);
    for (const sql of sqls) {
      try {
        await client.query(sql);
        console.log("OK:", sql);
      } catch (e) {
        console.log("FAIL:", e.message.substring(0, 80));
      }
    }
    await client.end();
    process.exit(0);
  } catch (e) {
    console.log("NO:", host, "-", e.message.substring(0, 60));
  }
}
console.log("Could not connect to any region");
