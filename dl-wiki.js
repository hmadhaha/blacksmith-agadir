const https = require('https');
const fs = require('fs');
const dir = 'public/food/';

// Known file names on Wikimedia Commons
const files = [
  ['Briouat.jpg', 'ai-briouates.jpg'],
  ['Spaghetti_carbonara.jpg', 'ai-carbonara.jpg'],
  ['Lasagne_(2).jpg', 'ai-lasagna.jpg'],
  ['Moroccan_mint_tea_on_a_traditional_tray.jpg', 'ai-mint-tea.jpg'],
  ['Gambas_al_ajillo_(Madrid).jpg', 'ai-prawn-pilpil.jpg'],
  ['Arabic_MixedGrill.JPG', 'ai-mixed-grill.jpg'],
  ['Hamburger_(black_bg).jpg', 'ai-beef-burger.jpg'],
  ['Fresh_orange_juice.jpg', 'ai-orange-juice.jpg'],
  ['Vanilla_flan_(Creme_caramelle).jpg', 'ai-creme-caramel.jpg'],
  ['Moroccan_Chicken_wings.jpg', 'ai-chicken-wings.jpg'],
];

let i = 0;

function getUrl(title) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url&format=json';
    https.get(url, { headers: { 'User-Agent': 'BlacksmithRestaurant/1.0 (contact@example.com)' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const pages = j.query?.pages || {};
          const page = Object.values(pages)[0];
          if (page?.imageinfo?.[0]?.url) {
            resolve(page.imageinfo[0].url);
          } else {
            console.log('  No URL for ' + title);
            resolve(null);
          }
        } catch(e) {
          console.log('  Parse error for ' + title + ': ' + d.slice(0,100));
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.log('  Req error for ' + title + ': ' + e.message);
      resolve(null);
    });
  });
}

async function next() {
  if (i >= files.length) {
    console.log('ALL DONE');
    return;
  }
  const [wikiFile, localFile] = files[i];
  console.log('Looking up: ' + wikiFile);
  const url = await getUrl(wikiFile);
  if (url) {
    console.log('  URL: ' + url);
    const f = fs.createWriteStream(dir + localFile);
    https.get(url, { headers: { 'User-Agent': 'BlacksmithRestaurant/1.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(f);
        f.on('finish', () => {
          const s = fs.statSync(dir + localFile).size;
          console.log('  OK ' + localFile + ' - ' + (s/1024).toFixed(1) + ' KB');
          i++; setTimeout(next, 500);
        });
      } else {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          console.log('  HTTP ' + res.statusCode + ': ' + d.slice(0,50));
          i++; setTimeout(next, 500);
        });
      }
    }).on('error', (e) => {
      console.log('  DL error: ' + e.message);
      i++; setTimeout(next, 500);
    });
  } else {
    i++; setTimeout(next, 500);
  }
}

next();
