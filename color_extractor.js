const sharp = require('sharp');

async function extractUniqueColors(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const uniqueColors = new Set();
    const channels = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();

      uniqueColors.add(hex);
    }


    const colorList = Array.from(uniqueColors);

    console.log(JSON.stringify(colorList, null, 2));

    return colorList;
  } catch (error) {
    console.error( error);
  }
}

extractUniqueColors('colors/matlab.png');
