const { Jimp } = require('jimp');

async function findEarthBounds() {
  const img = await Jimp.read('./public/earth-space.png');
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  
  let minX = width, minY = height, maxX = 0, maxY = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = img.bitmap.data[idx + 3];
      // Assume pixels with alpha > 10 are part of the Earth or glow
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  console.log(`Earth bounding box: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
  console.log(`Earth size: ${maxX - minX} x ${maxY - minY}`);
}

findEarthBounds().catch(console.error);
