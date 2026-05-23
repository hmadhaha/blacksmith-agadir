const https = require('https');
const req = https.get('https://openrouter.ai/api/v1/models', { timeout: 10000 }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(d);
      const data = j.data || [];
      const imageModels = data.filter(m => 
        m.id.includes('dall-e') || m.id.includes('flux') || 
        m.id.includes('sdxl') || m.id.includes('stable') ||
        m.id.includes('playground') || m.id.includes('imagen')
      );
      console.log('Image models:');
      imageModels.forEach(m => {
        console.log('  ' + m.id);
        if (m.pricing) console.log('    pricing: ' + JSON.stringify(m.pricing));
      });
      if (imageModels.length === 0) {
        console.log('No image models found. Total models: ' + data.length);
      }
    } catch(e) { console.log('Parse error: ' + e.message); }
  });
});
req.on('error', e => console.log('Error: ' + e.message));
