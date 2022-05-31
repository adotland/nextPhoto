const fs = require('fs');
const { ff } = require('fssf');
const sharp = require("sharp");

const { IMAGES_PATH, PROCESSED_IMAGES_PATH, LIVE_DATA_PATH, BASE_DATA_PATH, GIFS_PATH, PROCESSED_GIFS_PATH } = require('../config');
const { formatImageFileName } = require('./helpers');

const FONT_SCALE = 70 / (3000 * 4000);

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
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
        const statObj = fs.statSync(ff.path(IMAGES_PATH, d));
        retval.push({
          pmaid,
          locid,
          imageName: name,
          parsed: name.replaceAll(/[^a-z]/ig, '').toUpperCase().replace(/JPG$/, ''),
          slug,
          ext,
          lastChange: statObj?.ctime
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
    const width = imageWidth || 4000;
    const height = imageHeight || 3000;
    const text = String.fromCharCode(169) + "TheParkAndTheBike";

    const fontSize = Math.ceil(FONT_SCALE * width * height);
    // console.log(fontSize)

    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { fill: rgba(255, 255, 255, 0.333); font-size: ${fontSize}px;}
      </style>
      <text x="80%" y="95%" text-anchor="right" class="title">${text}</text>
    </svg>
    `;
    try {
      const svgBuffer = Buffer.from(svgImage);
      const image = sharp(svgBuffer);
      if (dump) {
        await image.toFile(ff.path(__dirname, "watermark.png"));
      }
      return svgBuffer;
    } catch (error) {
      console.log(error);
    }
  },

  addWatermark: async function (imageFileName = '238_1199_Blue-Ridge-Circle.jpg', metadata = {}, dump = true) {
    try {
      const ext = imageFileName.split('.').pop();
      const isGif = ext === 'gif';
      const imageFileFullPath = ff.path(isGif ? GIFS_PATH : IMAGES_PATH, imageFileName);
      const imageFile = fs.readFileSync(imageFileFullPath);
      if (!metadata.width || !metadata.height) {
        const sharpImage = sharp(imageFileFullPath);
        metadata = await sharpImage.metadata();
        console.log(metadata.xmp.toString())
      }
      const watermarkBuffer = await this.createWatermark(metadata.width, metadata.height, true);
      let image;
      if (isGif) {
        image = sharp(imageFile, { animated: true });
      }
      else {
        image = sharp(imageFile);
      }
      image = image.composite([
        {
          input: watermarkBuffer,
          top: 0,
          left: 0,
          tile: (ext === 'gif'),
          // gravity: 'northwest'
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

  processImages: async function (imageDataList) {
    console.time('processImages')
    imageDataList = imageDataList || await ff.readJson(LIVE_DATA_PATH, 'images.json');
    for (let i = 0, len = imageDataList.length; i < len; i++) {
      const imageFileName = `${imageDataList[i].pmaid}_${imageDataList[i].locid}_${imageDataList[i].imageName}`;
      const imageFileFullPath = ff.path(IMAGES_PATH, imageFileName);
      console.info(`processing [${imageFileName}]`);
      const sharpImage = sharp(imageFileFullPath);
      if (sharpImage) {
        const metadata = await sharpImage.metadata();
        const processedImage = await this.addWatermark(imageFileName, metadata, false);
        const { name: formattedImageFileName, ext } = formatImageFileName(imageFileName);
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
    console.timeEnd('processImages');
  },

  sanitizeFileNames: async function () {
    const list = await ff.readdir(GIFS_PATH);
    console.log(list)
    for (let i = 0, len = list.length; i < len; i++) {
      const srcPath = ff.path(GIFS_PATH, list[i]);
      const { name, ext } = formatImageFileName(list[i]);
      const destPath = ff.path(GIFS_PATH, `${name}.${ext}`);
      if (srcPath !== destPath) {
        await ff.mv(srcPath, destPath);
      }
    }
  },

  processRecent: async function () {
    const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
    const yesterday = Date.now() - (1 * 24 * 60 * 60 * 1000);
    const filtered = imageDataList.filter(data => new Date(data.lastChange).getTime() > yesterday);
    await this.processImages(filtered);
    // console.log(filtered.map(f => f.imageName));
  }

};

(async () => {
  try {
    const options = program.opts();
    if (options.method && ImageProcessor[options.method]) {
      await ImageProcessor[options.method]();
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
