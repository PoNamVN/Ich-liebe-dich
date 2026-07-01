const { Jimp } = require('jimp');

async function cropMoon() {
  try {
    const img = await Jimp.read('./public/moon-surface.png');
    // The image is 1024x1024. The bottom half is the ground.
    // Let's crop from y=400, so we get 1024x624
    const dst = new Jimp({ width: 1024, height: 624 });
    
    for (let y = 0; y < 624; y++) {
      for (let x = 0; x < 1024; x++) {
        const srcIdx = ((y + 400) * 1024 + x) * 4;
        const dstIdx = (y * 1024 + x) * 4;
        dst.bitmap.data[dstIdx] = img.bitmap.data[srcIdx];
        dst.bitmap.data[dstIdx+1] = img.bitmap.data[srcIdx+1];
        dst.bitmap.data[dstIdx+2] = img.bitmap.data[srcIdx+2];
        dst.bitmap.data[dstIdx+3] = img.bitmap.data[srcIdx+3];
      }
    }
    
    await dst.write('./public/moon-surface.png');
    console.log('Moon perfectly cropped to bottom surface!');
  } catch (err) {
    console.log(err.message);
  }
}

cropMoon();
