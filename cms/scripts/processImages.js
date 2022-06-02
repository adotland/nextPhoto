const fs = require('fs');
const { ff } = require('fssf');
const sharp = require("sharp");
const differenceBy = require('lodash/differenceBy');

const { STILL_PATH, PROCESSED_STILL_PATH, LIVE_DATA_PATH, BASE_DATA_PATH, GIF_PATH, PROCESSED_GIF_PATH, PROCESSED_WEBP_PATH, SHARE_PATH_STILL, SHARE_PATH_GIF } = require('../config');
const { formatImageFileName, asyncForEach, arrayDiff } = require('./helpers');

const FONT_SCALE = 70 / (3000 * 4000);

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
program.option('-c, --collection <collection>');
program.parse();

const ImageProcessor = {

  getList: async function (collection = 'seattle') {
    const pathList = [STILL_PATH(collection), GIF_PATH(collection)];
    const retval = [];
    const rejects = [];
    pathList.forEach(path => {
      const data = fs.readdirSync(path);
      data.forEach(d => {
        let pmaid;
        let locid;
        let name;
        const dParsed = d.split('_');
        if (collection === 'seattle' && (dParsed.length !== 3 || (dParsed[0].match(/^[a-z]/i)))) {
          rejects.push(d);
        } else if (dParsed.length < 2) {
          rejects.push(d);
        } else {
          if (collection === 'seattle') {
            pmaid = dParsed[0];
            locid = dParsed[1];
            name = dParsed[2];
          } else {
            name = d;//dParsed[1];
          }
          const { name: formattedName, slug, ext } = formatImageFileName(name, collection);
          const statObj = fs.statSync(ff.path(path, d));
          retval.push({
            pmaid,
            locid,
            imageName: formattedName,
            // parsed: name.replaceAll(/[^a-z]/ig, '').toUpperCase().replace(/JPG$/, ''),
            slug,
            ext,
            lastChange: statObj?.ctime
          });
        }
      });
    });
    retval.sort((a, b) => new Date(a.lastChange).getTime() - new Date(b.lastChange).getTime());
    await ff.writeJson(retval, LIVE_DATA_PATH, `images_${collection}.json`, 2);
    await ff.writeJson(rejects, BASE_DATA_PATH, `imagesRejected_${collection}.json`, 2);
  },

  getListAll: async function (collection = 'seattle') {
    const local = await ff.readdir(STILL_PATH(collection));
    await ff.writeJson(local.sort(), BASE_DATA_PATH, 'imagesAll_still.json', 2);
    const data = await ff.readdir(SHARE_PATH_STILL);
    await ff.writeJson(data.sort(), BASE_DATA_PATH, 'imagesAll_share.json', 2);
  },

  imageDiff: async function () {
    let a = await ff.readJson(LIVE_DATA_PATH, 'images_seattle.json');
    let b = await ff.readJson(LIVE_DATA_PATH, 'images.json');
    // let diff = arrayDiff(a, b);
    // let shareDiff = difference(share, local);
    let diff = differenceBy(a, b, 'slug')
    await ff.writeJson({ diff }, BASE_DATA_PATH, 'imageDiff.json', 2);
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

  addWatermark: async function (collection = 'seattle', imageFileName = '274_1943_Piers-62-and-63.gif', metadata = {}, dump = true) {
    try {
      const ext = imageFileName.split('.').pop();
      const isGif = ext === 'gif';
      const imageFileFullPath = ff.path(isGif ? GIF_PATH(collection) : STILL_PATH(collection), imageFileName);
      const imageFile = fs.readFileSync(imageFileFullPath);
      if (!metadata.width || !metadata.height) {
        const sharpImage = sharp(imageFileFullPath);
        metadata = await sharpImage.metadata();
        // console.log(metadata.xmp.toString())
      }
      let watermarkBuffer;
      let image;
      if (isGif) {
        watermarkBuffer = await this.createWatermark(metadata.width / 2, metadata.height / 2, false);
        image = sharp(imageFile, { animated: true });
        image = image.resize({ width: metadata.width / 2, height: metadata.height / 2 })
          // .gif({ colors: 16 })
          .webp({ effort: 6 })
      } else {
        watermarkBuffer = await this.createWatermark(metadata.width, metadata.height, false);
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

  processStills: async function (collection = 'seattle', imageDataList) {
    console.time('processStills')
    imageDataList = imageDataList || await ff.readJson(LIVE_DATA_PATH, `images_${collection}.json`);
    imageDataList = imageDataList.filter(data => data.ext === 'jpg');
    const reprocessList = await ff.readJson(BASE_DATA_PATH, 'reprocess_still.json');
    await asyncForEach(imageDataList, async imageData => {
      let imageFileName;
      if (collection === 'seattle') {
        imageFileName = `${imageData.pmaid}_${imageData.locid}_${imageData.imageName}.${imageData.ext}`;
      } else {
        imageFileName = `${imageData.imageName}.${imageData.ext}`;
      }
      const imageFileFullPath = ff.path(STILL_PATH(collection), imageFileName);
      const existingProcessed = fs.existsSync(PROCESSED_STILL_PATH, imageFileName);
      if (existingProcessed && !reprocessList?.includes(imageData.slug)) {
        // console.info(`file already processed, skipping [${imageFileName}]`);
        return;
      }
      console.info(`processing [${imageFileName}]`);
      const sharpImage = sharp(imageFileFullPath);
      if (sharpImage) {
        const metadata = await sharpImage.metadata();
        const processedImage = await this.addWatermark(collection, imageFileName, metadata, false);
        const { name: formattedImageFileName, ext } = formatImageFileName(imageFileName);
        if (processedImage) {
          console.info(`saving [${imageFileName}]`);
          await processedImage.toFile(ff.path(PROCESSED_STILL_PATH, `${formattedImageFileName}.${ext}`));
        } else {
          throw new Error(`image undefined on [${imageFileName}]`);
        }
      } else {
        throw new Error(`file missing [${imageFileName}]`);
      }
    });
    console.timeEnd('processStills');
  },

  // sanitizeFileNames: async function (isGif = true) {
  //   const path = isGif ? GIF_PATH : STILL_PATH;
  //   const list = await ff.readdir(path);
  //   // console.log(list)
  //   for (let i = 0, len = list.length; i < len; i++) {
  //     const srcPath = ff.path(path, list[i]);
  //     const { name, ext } = formatImageFileName(list[i]);
  //     const destPath = ff.path(path, `${name}.${ext}`);
  //     if (srcPath !== destPath) {
  //       console.log(srcPath + ' --> ' + destPath);
  //       fs.renameSync(srcPath, destPath);
  //     }
  //   }
  // },

  processRecent: async function (collection = 'seattle') {
    imageDataList = await ff.readJson(LIVE_DATA_PATH, `images_${collection}.json`);
    const yesterday = Date.now() - (1 * 24 * 60 * 60 * 1000);
    const filtered_stills = imageDataList.filter(data => (new Date(data.lastChange).getTime() > yesterday && data.ext === 'jpg'));
    const filtered_gifs = imageDataList.filter(data => (new Date(data.lastChange).getTime() > yesterday && data.ext === 'gif'));
    await this.processStills(filtered_stills);
    await this.processGifs(collection, filtered_gifs);
    // console.log(filtered.map(f => f.imageName));
  },

  processGifs: async function (collection = 'seattle', imageDataList) {
    console.time('processGifs')
    const imageFileNameList = await ff.readdir(GIF_PATH(collection));
    await asyncForEach(imageFileNameList, async imageFileName => {
      const imageFileFullPath = ff.path(GIF_PATH(collection), imageFileName);
      const existingProcessed = fs.existsSync(ff.path(PROCESSED_WEBP_PATH, imageFileName.replace('gif', 'webp')));
      // console.log(existingProcessed)
      if (existingProcessed) {
        // console.info(`file already processed, skipping [${imageFileName}]`);
        return;
      }
      console.info(`processing [${imageFileName}]`);
      const sharpImage = sharp(imageFileFullPath);
      if (sharpImage) {
        const metadata = await sharpImage.metadata();
        const processedImage = await this.addWatermark(collection, imageFileName, metadata, false);
        const { name: formattedImageFileName, ext } = formatImageFileName(imageFileName);
        if (processedImage) {
          // const saveFullPath = ff.path(PROCESSED_GIF_PATH, `${formattedImageFileName}.${ext}`);
          const saveFullPath = ff.path(PROCESSED_WEBP_PATH, `${formattedImageFileName}.webp`);
          console.info(`saving [${saveFullPath}]`);
          await processedImage.toFile(saveFullPath);
        } else {
          throw new Error(`image undefined on [${imageFileName}]`);
        }
      } else {
        throw new Error(`file missing [${imageFileName}]`);
      }
    });
    console.timeEnd('processGifs');
  },

  // processMissing: async function () {
  //   const selection = await ff.readJson(BASE_DATA_PATH, 'seattle_missing_images.json');
  //   const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
  //   const filtered = imageDataList.filter(data => selection.includes(data.imageName));
  //   console.log(filtered.map(f => f.imageName));
  // },

  resize: async function (src, dest) {
    sharp(ff.path(src))
      .resize({ width: 25 })
      .toFile(dest);
  }


};

(async () => {
  try {
    const options = program.opts();
    if (options.method && ImageProcessor[options.method]) {
      await ImageProcessor[options.method](options.collection);
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
