const { Jimp } = require('jimp');

async function cleanEarth() {
  const img = await Jimp.read('./public/earth-space.png');
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const radius = 380; 
  const feather = 5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const idx = (y * width + x) * 4;
      
      if (distance > radius + feather) {
        img.bitmap.data[idx + 3] = 0; // Completely transparent
      } else if (distance > radius) {
        const ratio = 1 - ((distance - radius) / feather);
        img.bitmap.data[idx + 3] = Math.min(img.bitmap.data[idx + 3], Math.floor(255 * ratio));
      }
    }
  }

  img.autocrop();
  
  await img.write('./public/earth-space.png');
  console.log('Earth mathematically cropped! New dimensions:', img.bitmap.width, 'x', img.bitmap.height);
}

cleanEarth().catch(console.error);
