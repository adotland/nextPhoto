const { ff } = require("fssf");
const fs = require('fs');
const sharp = require("sharp");
// const ColorThief = require('colorthief');

const { STILL_PATH, CMS_EXPORT_FILE, BASE_DATA_PATH, LIVE_DATA_PATH, PROCESSED_STILL_PATH } = require('../config');
const { formatImageFileName, findDuplicates, getColorDiff, toHex, formatImageFileNameNoExt } = require('./helpers');

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
program.option('-f, --filter <filter>');
program.parse();

const ManageData = {
  main: async function () {
    const cmsDataList = await ff.readCsv(BASE_DATA_PATH, CMS_EXPORT_FILE, true, '\t');
    const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
    const filterWeight = await ff.readJson(BASE_DATA_PATH, 'filter-weight.json');
    const filterLive = await ff.readJson(BASE_DATA_PATH, 'filter-live.json');
    const jsonData = [];
    const missingImages = [];
    const duplicateImages = [];
    await Promise.all(cmsDataList.map(async (cmsData, index) => {
      if (cmsData[14]) {
        let metadata;
        const long_name = cmsData[14];
        // match cms long_name to acutal image in file system
        // seattle parks format XX_XX_name
        // image data has image file name and parsed name upper case, only alpha chars

        // const parsedLongName = long_name.replaceAll(/[^a-z]/ig, '').toUpperCase();
        // const imageData = imageDataList.filter(d => d.parsed === parsedLongName);

        const {name: formattedNameNoExt} = formatImageFileNameNoExt(long_name);

        const matchingImageDataList = imageDataList.filter(d => `${d.pmaid}_${d.locid}_${d.imageName}` === formattedNameNoExt);

        if (matchingImageDataList.length < 1) {
          // console.error(`missing image name [${parsedLongName}]`);
          missingImages.push(long_name);
        } else if (matchingImageDataList.length > 1) {
          // console.log(imageData.length, `has duplicates: ${imageData.map(d=>d.imageName)}`);
          duplicateImages.push(matchingImageDataList.map(d => d.imageName));
        } else {
          const imageData = matchingImageDataList[0];
          const currentImageName = imageData.imageName;
          const fullImageName = `${imageData.pmaid}_${imageData.locid}_${currentImageName}.${imageData.ext}`;
          console.log(`processing [${fullImageName}]`);

          // image dimensions
          const imageBuffer = fs.readFileSync(ff.path(STILL_PATH, fullImageName));
          const sharpImage = sharp(imageBuffer);
          metadata = await sharpImage.metadata();

          // filters
          const weight = filterWeight.filter(x => x.slug === imageData.slug);
          const live = filterLive.includes(imageData.slug);

          jsonData.push({
            id: index,
            pmaid: cmsData[0],
            locid: cmsData[1],
            name: cmsData[2] || console.warn('missing name', cmsData),
            address: cmsData[3] || console.warn('missing address', cmsData),
            zip_code: cmsData[4] || console.warn('missing zip_code', cmsData),
            lat: cmsData[5] || console.warn('missing lat', cmsData),
            long: cmsData[6] || console.warn('missing long', cmsData),
            imageName: fullImageName || console.warn('missing long_name', cmsData),
            slug: imageData.slug,
            ext: imageData.ext,
            width: metadata.width,
            height: metadata.height,
            filters: {
              weight: weight.length ? weight[0].weight : 100,
              live,
            }
          });
        }
      }
    }));
    await ff.writeJson(jsonData, LIVE_DATA_PATH, 'seattle.json', 2);
    await ff.writeJson(missingImages, BASE_DATA_PATH, 'seattle_missing_still_images.json', 2);
    await ff.writeJson(duplicateImages, BASE_DATA_PATH, 'seattle_duplicate_still_images.json', 2);
  },

  sanitizeImageNamesInFile: async function () {
    const data = await ff.readJson(LIVE_DATA_PATH, 'seattle.json');
    const retval = [];
    for (let i = 0, len = data.length; i < len; i++) {
      retval.push({
        ...data[i],
        imageName: formatImageFileName(data[i].imageName).name
      });
    }
    await ff.writeJson(retval, LIVE_DATA_PATH, 'seattle.json', 2);
  },

  duplicateCheck: async function () {
    const data = await ff.readJson(LIVE_DATA_PATH, 'seattle.json');
    const slugList = data.map(d => d.slug);
    const dups = findDuplicates(slugList);
    if (dups.length) {
      console.error(`found duplicate slugs: ${dups}`);
    } else {
      console.info('no dups')
    }
    await ff.writeJson(dups, BASE_DATA_PATH, 'seattle_duplicate_slugs.json');
  },

  updateFilter: async function (filter) {
    console.time('updateFilter');
    const dataList = await ff.readJson(LIVE_DATA_PATH, 'seattle.json');
    const retval = [];
    await Promise.all(dataList.map(async data => {
      try {
        const newFilterObj = await this[`_get_${filter}`](data);
        retval.push({
          ...data,
          filters: {
            ...data.filters,
            ...newFilterObj,
          }
        });
      } catch (err) {
        console.error(err);
      }
    }));
    await ff.writeJson(retval, LIVE_DATA_PATH, 'seattle.json', 2);
    console.timeEnd('updateFilter');
    // output color to avoid having to reprocess
  },

  _get_matchColor: async function (data) {
    // color thief
    // const color = await ColorThief.getColor(ff.path(PROCESSED_STILL_PATH, `${data.imageName}.${data.ext}`));

    // sharp
    const sharpImage = sharp(ff.path(PROCESSED_STILL_PATH, `${data.imageName}.${data.ext}`));
    // background is almost always just region above mid
    const metadata = await sharpImage.metadata();
    const background = await sharpImage.extract({ left: 0, top: 0, width: metadata.width, height: Math.ceil(metadata.height / 1.5) }).toBuffer();

    const { dominant } = await sharp(background).stats();
    const color = [dominant.r, dominant.g, dominant.b];


    console.info(`${data.imageName} [${color}]`);
    const matchColor = getColorDiff(color);
    const domColor = toHex(color);
    return {
      matchColor,
      domColor,
    }
  },

  _get_weight: async function (data) {
    const updateList = await ff.readJson(BASE_DATA_PATH, 'filter-weight.json');
    const newVal = updateList.filter(x => x.slug === data.slug);
    return {
      weight: newVal.length ? newVal[0].weight : 100,
    }
  },

  _get_live: async function (data) {
    const updateList = await ff.readJson(BASE_DATA_PATH, 'filter-live.json');
    const newVal = updateList.includes(data.slug);
    return {
      live: newVal,
    }
  },

};


(async () => {
  try {
    const options = program.opts();
    if (options.method && ManageData[options.method]) {
      await ManageData[options.method](options.filter);
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
