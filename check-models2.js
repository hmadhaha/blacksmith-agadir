const https = require('https');
https.get('https://openrouter.ai/api/v1/models', { timeout: 10000 }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(d);
      const data = j.data || [];
      console.log('Total models: ' + data.length);
      
      // Check all pricing - look for free models
      const freeModels = data.filter(m => {
        if (!m.pricing) return false;
        const p = m.pricing;
        return (p.image === 0 || p.prompt === 0 || p.completion === 0);
      });
      console.log('Free models: ' + freeModels.length);
      
      // Check what kinds of models have image pricing
      const hasImage = data.filter(m => m.pricing && m.pricing.image !== undefined);
      console.log('Models with image pricing: ' + hasImage.length);
      hasImage.slice(0, 10).forEach(m => {
        console.log('  ' + m.id + ' | image: ' + m.pricing.image + ' | prompt: ' + m.pricing.prompt);
      });
      
      // Also search for common image model names
      ['flux', 'sdxl', 'dall-e', 'stable-diffusion', 'playground', 'midjourney'].forEach(k => {
        const found = data.filter(m => m.id.toLowerCase().includes(k));
        if (found.length > 0) {
          console.log('Models matching "' + k + '": ' + found.length);
          found.forEach(m => console.log('  ' + m.id));
        } else {
          console.log('No models matching "' + k + '"');
        }
      });
    } catch(e) { console.log('Error: ' + e.message); }
  });
});
