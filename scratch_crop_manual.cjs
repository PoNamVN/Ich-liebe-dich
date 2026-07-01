const { Jimp } = require('jimp');

async function cropEarthManual() {
  try {
    const src = await Jimp.read('./public/earth-space.png');
    // Create a new image 768x768
    const dst = new Jimp({ width: 768, height: 768 });
    
    for (let y = 0; y < 768; y++) {
      for (let x = 0; x < 768; x++) {
        const srcIdx = ((y + 128) * 1024 + (x + 128)) * 4;
        const dstIdx = (y * 768 + x) * 4;
        dst.bitmap.data[dstIdx] = src.bitmap.data[srcIdx];
        dst.bitmap.data[dstIdx+1] = src.bitmap.data[srcIdx+1];
        dst.bitmap.data[dstIdx+2] = src.bitmap.data[srcIdx+2];
        dst.bitmap.data[dstIdx+3] = src.bitmap.data[srcIdx+3];
      }
    }
    
    await dst.write('./public/earth-space.png');
    console.log('Earth manually cropped to 768x768!');
  } catch (err) {
    console.log(err.message);
  }
}

cropEarthManual();
