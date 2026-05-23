const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = 'public/food/';

// Images to find: query -> filename
const dishes = [
  ['chicken+wings+food', 'ai-chicken-wings.jpg'],
  ['garlic+prawns+shrimp', 'ai-prawn-pilpil.jpg'],
  ['mixed+grill+meat+platter', 'ai-mixed-grill.jpg'],
  ['classic+beef+burger', 'ai-beef-burger.jpg'],
  ['margherita+pizza', 'ai-margherita.jpg'],
  ['spaghetti+carbonara', 'ai-carbonara.jpg'],
  ['lasagna+baked+pasta', 'ai-lasagna.jpg'],
  ['creme+caramel+flan+dessert', 'ai-creme-caramel.jpg'],
  ['fresh+orange+juice+drink', 'ai-orange-juice.jpg'],
  ['moroccan+mint+tea+glass', 'ai-mint-tea.jpg']
];

// First, try to fetch from a free API - foodish-api
// This returns random food images for specific categories
const foodishCategories = [
  'biryani', 'burger', 'butter-chicken', 'dessert', 'dosa', 'idly', 'pasta', 'pizza', 'rice', 'samosa'
];

let i = 0;

function downloadUrl(url, file) {
  return new Promise((resolve) => {
    const f = fs.createWriteStream(path.join(dir, file));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        // Follow redirect
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
          r2.pipe(f);
          f.on('finish', () => {
            const s = fs.statSync(path.join(dir, file)).size;
            console.log('  OK ' + file + ' ' + (s/1024).toFixed(1) + ' KB');
            resolve(s > 1000);
          });
        });
      } else {
        res.pipe(f);
        f.on('finish', () => {
          const s = fs.statSync(path.join(dir, file)).size;
          console.log('  OK ' + file + ' ' + (s/1024).toFixed(1) + ' KB');
          resolve(s > 1000);
        });
      }
    }).on('error', (e) => {
      console.log('  FAIL ' + file + ': ' + e.message);
      resolve(false);
    });
  });
}

async function scrapePixabay(query, file) {
  const url = 'https://pixabay.com/images/search/' + encodeURIComponent(query) + '/?pagi=1';
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', async () => {
        // Find image URLs in the page
        // Pixabay uses data-lazy-srcset or src attributes
        const regex = /srcset="([^"]*)"|data-lazy-srcset="([^"]*)"/g;
        let match;
        let urls = [];
        while ((match = regex.exec(d)) !== null) {
          const s = match[1] || match[2];
          // Extract the main URL before first space
          const parts = s.split(' ');
          if (parts[0] && parts[0].includes('pixabay.com/get/')) {
            urls.push(parts[0]);
          }
        }
        // Also try to find direct image URLs
        const imgRegex = /<img[^>]+src="([^"]+pixabay\.com\/get\/[^"]+)"[^>]*>/g;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(d)) !== null) {
          urls.push(imgMatch[1]);
        }
        
        if (urls.length > 0) {
          console.log(query + ': found ' + urls.length + ' potential URLs');
          // Try first URL
          const ok = await downloadUrl(urls[0], file);
          if (ok) resolve(true);
          else resolve(false);
        } else {
          console.log(query + ': no image URLs found');
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.log(query + ': ' + e.message);
      resolve(false);
    });
  });
}

async function scrapeUnsplash(query, file) {
  const url = 'https://unsplash.com/s/photos/' + encodeURIComponent(query);
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', async () => {
        // Find image URLs - Unsplash uses images.unsplash.com
        const regex = /"([^"]*images\.unsplash\.com[^"]*)"}/g;
        let match;
        let urls = [];
        while ((match = regex.exec(d)) !== null) {
          let url = match[1];
          // Clean up and get the full URL
          if (url.includes('w=')) {
            // Resize to reasonable size
            url = url.replace(/w=\d+/, 'w=600').replace(/q=\d+/, 'q=80');
            urls.push(url);
          }
        }
        
        if (urls.length > 0) {
          console.log(query + ': found ' + urls.length + ' Unsplash URLs');
          const ok = await downloadUrl(urls[0], file);
          if (ok) resolve(true);
          else resolve(false);
        } else {
          console.log(query + ': no Unsplash URLs found');
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.log(query + ': ' + e.message);
      resolve(false);
    });
  });
}

// Check if briouates has any special source
async function getBriouates() {
  const query = 'moroccan+pastry+appetizer';
  const file = 'ai-briouates.jpg';
  console.log('Searching: ' + query);
  const ok = await scrapePixabay(query, file);
  if (!ok) await scrapeUnsplash('pastry food', file);
}

async function main() {
  console.log('=== Trying Pixabay scraping ===');
  for (const [q, f] of dishes) {
    console.log('Searching: ' + q);
    const ok = await scrapePixabay(q, f);
    if (!ok) {
      console.log('  Retrying with Unsplash...');
      await scrapeUnsplash(q, f);
    }
  }
  // Try briouates separately
  await getBriouates();
  console.log('ALL DONE');
}

main();
