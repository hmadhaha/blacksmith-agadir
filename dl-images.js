const https = require('https');
const fs = require('fs');
const path = require('path');
const dir = 'public/food/';

const sources = [
  // Briouates - Moroccan briouates category
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Briouat.jpg/600px-Briouat.jpg', file: 'ai-briouates.jpg' },
  // Chicken wings - Fried Chicken from Unsplash on Commons
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fried_Chicken_%28Unsplash%29.jpg/600px-Fried_Chicken_%28Unsplash%29.jpg', file: 'ai-chicken-wings.jpg' },
  // Garlic prawns
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Gambas_al_ajillo_%28Madrid%29.jpg/600px-Gambas_al_ajillo_%28Madrid%29.jpg', file: 'ai-prawn-pilpil.jpg' },
  // Mixed Grill - Arabic MixedGrill
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Arabic_MixedGrill.JPG/600px-Arabic_MixedGrill.JPG', file: 'ai-mixed-grill.jpg' },
  // Beef burger - need to find
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Hamburger_%28black_bg%29.jpg/600px-Hamburger_%28black_bg%29.jpg', file: 'ai-beef-burger.jpg' },
  // Margherita pizza
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/600px-Eq_it-na_pizza-margherita_sep2005_sml.jpg', file: 'ai-margherita.jpg' },
  // Spaghetti carbonara
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Spaghetti_alla_carbonara_%28cropped%29.jpg/600px-Spaghetti_alla_carbonara_%28cropped%29.jpg', file: 'ai-carbonara.jpg' },
  // Lasagna
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Lasagne_%282%29.jpg/600px-Lasagne_%282%29.jpg', file: 'ai-lasagna.jpg' },
  // Creme caramel
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cr%C3%A8me_caramelle.jpg/600px-Cr%C3%A8me_caramelle.jpg', file: 'ai-creme-caramel.jpg' },
  // Orange juice
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Orange_juice_%281%29.jpg/600px-Orange_juice_%281%29.jpg', file: 'ai-orange-juice.jpg' },
  // Moroccan mint tea
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Moroccan_mint_tea_%282%29.jpg/600px-Moroccan_mint_tea_%282%29.jpg', file: 'ai-mint-tea.jpg' }
];

let i = 0;

function downloadNext() {
  if (i >= sources.length) {
    console.log('ALL DONE');
    return;
  }
  const { url, file } = sources[i];
  const filepath = path.join(dir, file);
  console.log('Downloading: ' + file);
  
  const f = fs.createWriteStream(filepath);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode === 200) {
      res.pipe(f);
      f.on('finish', () => {
        const s = fs.statSync(filepath).size;
        if (s > 1000) {
          console.log('  OK ' + file + ' - ' + (s/1024).toFixed(1) + ' KB');
        } else {
          console.log('  TOO SMALL ' + file + ' - ' + s + ' bytes');
        }
        i++;
        downloadNext();
      });
    } else {
      console.log('  FAIL ' + file + ' - HTTP ' + res.statusCode);
      // Try without thumb prefix
      const altUrl = url.replace('/thumb', '').replace(/\/600px-[^\/]+$/, '');
      console.log('  Trying: ' + altUrl);
      const f2 = fs.createWriteStream(filepath);
      https.get(altUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
        r2.pipe(f2);
        f2.on('finish', () => {
          const s = fs.statSync(filepath).size;
          if (s > 1000) {
            console.log('  OK ' + file + ' - ' + (s/1024).toFixed(1) + ' KB (full size)');
          } else {
            console.log('  FAILED ' + file);
          }
          i++;
          downloadNext();
        });
      });
    }
  }).on('error', (e) => {
    console.log('  ERROR ' + file + ': ' + e.message);
    i++;
    downloadNext();
  });
}

downloadNext();
