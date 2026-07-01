const { Jimp } = require('jimp');

async function cropEarthFixed() {
  const img = await Jimp.read('./public/earth-space.png');
  img.crop(128, 128, 768, 768);
  await img.write('./public/earth-space.png');
  console.log('Earth perfectly cropped to bounds! New dimensions:', img.bitmap.width, 'x', img.bitmap.height);
}

cropEarthFixed().catch(console.error);
