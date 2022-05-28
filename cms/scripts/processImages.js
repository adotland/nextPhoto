const fs = require('fs');
const { ff } = require('fssf');
const sharp = require("sharp");

const { IMAGES_PATH, PROCESSED_IMAGES_PATH, LIVE_DATA_PATH, BASE_DATA_PATH } = require('../config');
const { formatImageFileName } = require('./helpers');

const { program } = require('commander');
program.requiredOption('-x, --execute <method>');
program.parse();


const ImageProcessor = {
  getList: async function () {
    const data = await ff.readdir(IMAGES_PATH);
    const retval = [];
    const rejects = [];
    data.forEach(d => {
      const dParsed = d.split('_');
      if (dParsed.length !== 3 || (dParsed[0].match(/^[a-z]/i))) {
        rejects.push(d);
      } else {
        const pmaid = dParsed[0];
        const locid = dParsed[1];
        const name = dParsed[2];
        const { slug, ext } = formatImageFileName(name);
        retval.push({
          pmaid,
          locid,
          imageName: name,
          parsed: name.replaceAll(/[^a-z]/ig, '').toUpperCase().replace(/JPG$/, ''),
          slug,
          ext
        });
      }
    })
    await ff.writeJson(retval, LIVE_DATA_PATH, 'images.json', 2);
    await ff.writeJson(rejects, BASE_DATA_PATH, 'imagesRejected.json', 2);
  },

  getListAll: async function () {
    const data = await ff.readdir(IMAGES_PATH);
    await ff.writeJson(data, BASE_DATA_PATH, 'imagesAll.json', 2);
  },

  createWatermark: async function (imageWidth, imageHeight, dump) {
    const width = imageWidth || 4032;
    const height = imageHeight || 3024;
    const text = String.fromCharCode(169) + "TheParkAndTheBike";

    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { fill: rgba(255, 255, 255, 0.333); font-size: 70px;}
      </style>
      <text x="80%" y="95%" text-anchor="right" class="title">${text}</text>
    </svg>
    `;
    try {
      const svgBuffer = Buffer.from(svgImage);
      const image = sharp(svgBuffer);
      if (dump) {
        await image.toFile(ff.path(__dirname, "watermark.png"));
      } else {
        return svgBuffer;
      }
    } catch (error) {
      console.log(error);
    }
  },

  addWatermark: async function (imageFileName = '2975_1323_Fairview-Park.jpg', metadata = {}, dump = true) {
    try {
      const imageFileFullPath = ff.path(IMAGES_PATH, imageFileName);
      const imageFile = fs.readFileSync(imageFileFullPath);
      if (!metadata.width || !metadata.height) {
        const sharpImage = sharp(imageFileFullPath);
        metadata = await sharpImage.metadata();
      }
      const watermarkBuffer = await this.createWatermark(metadata.width, metadata.height);
      const image = sharp(imageFile)
        .composite([
          {
            input: watermarkBuffer,
            top: 0,
            left: 0,
          },
        ]);
      if (dump) {
        image.toFile(ff.path(__dirname, `p-${imageFileName}`));
      } else {
        return image;
      }
    } catch (err) {
      console.error(err);
    }
  },

  processImages: async function () {
    const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
    for (let i = 0, len = imageDataList.length; i < len; i++) {
      const imageFileName = `${imageDataList[i].pmaid}_${imageDataList[i].locid}_${imageDataList[i].imageName}`;
      const imageFileFullPath = ff.path(IMAGES_PATH, imageFileName);
      console.info(`processing [${imageFileName}]`);
      const sharpImage = sharp(imageFileFullPath);
      if (sharpImage) {
        const metadata = await sharpImage.metadata();
        const processedImage = await this.addWatermark(imageFileName, metadata, false);
        const {name: formattedImageFileName, ext} = formatImageFileName(imageFileName);
        if (processedImage) {
          console.info(`saving [${imageFileName}]`);
          await processedImage.toFile(ff.path(PROCESSED_IMAGES_PATH, `${formattedImageFileName}.${ext}`));
        } else {
          throw new Error(`image undefined on [${imageFileName}]`);
        }
      } else {
        throw new Error(`file missing [${imageFileName}]`);
      }
    }
  },

  // sanitizeFileNames: async function () {
  //   const list = await ff.readdir(PROCESSED_IMAGES_PATH);
  //   for (let i = 0, len = list.length; i < len; i++) {
  //     const srcPath = ff.path(PROCESSED_IMAGES_PATH, list[i]);
  //     const destPath = ff.path(PROCESSED_IMAGES_PATH, formatImageFileName(list[i]));
  //     if (srcPath !== destPath) {
  //       await ff.mv(srcPath, destPath);
  //     }
  //   }
  // }
};

(async () => {
  try {
    const options = program.opts();
    if (options.execute && ImageProcessor[options.execute]) {
      await ImageProcessor[options.execute]();
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
