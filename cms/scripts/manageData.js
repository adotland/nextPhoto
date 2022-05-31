const { ff } = require("fssf");
const fs = require('fs');
const sharp = require("sharp");
const ColorThief = require('colorthief');

const { IMAGES_PATH, CMS_EXPORT_FILE, BASE_DATA_PATH, LIVE_DATA_PATH, PROCESSED_IMAGES_PATH } = require('../config');
const { formatImageFileName, findDuplicates, getColorDiff, toHex } = require('./helpers');

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
program.option('-f, --filter <filter>');
program.parse();

const ManageData = {
  main: async function () {
    const data = await ff.readCsv(BASE_DATA_PATH, CMS_EXPORT_FILE, true, '\t');
    const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
    const filterWeight = await ff.readJson(BASE_DATA_PATH, 'filter-weight.json');
    const filterLive = await ff.readJson(BASE_DATA_PATH, 'filter-live.json');
    const jsonData = [];
    const missingImages = [];
    await Promise.all(data.map(async (cmsData, index) => {
      if (cmsData[14]) {
        let metadata;
        const long_name = cmsData[14];
        // match cms long_name to acutal image in file system
        // seattle parks format XX_XX_name
        // image data has image file name and parsed name upper case, only alpha chars

        const parsedLongName = long_name.replaceAll(/[^a-z]/ig, '').toUpperCase();
        const imageData = imageDataList.filter(d => d.parsed === parsedLongName);

        if (imageData.length) {
          if (imageData.length > 1) console.log(`has duplicates: ${imageData}`);
          if (imageData[0].imageName) {

            const currentImageName = imageData[0].imageName;
            const { name: sanitizedImageName, slug, ext } = formatImageFileName(currentImageName);
            const fullImageName = `${imageData[0].pmaid}_${imageData[0].locid}_${currentImageName}`;
            const fullSanitizedImageName = `${imageData[0].pmaid}_${imageData[0].locid}_${sanitizedImageName}`;
            console.log(`processing [${fullImageName}]`);

            const imageBuffer = fs.readFileSync(ff.path(IMAGES_PATH, fullImageName));
            const sharpImage = sharp(imageBuffer);
            metadata = await sharpImage.metadata();

            const weight = filterWeight.filter(x => x.slug === slug);
            const live = filterLive.includes(slug);

            jsonData.push({
              id: index,
              pmaid: cmsData[0],
              locid: cmsData[1],
              name: cmsData[2] || console.warn('missing name', cmsData),
              address: cmsData[3] || console.warn('missing address', cmsData),
              zip_code: cmsData[4] || console.warn('missing zip_code', cmsData),
              lat: cmsData[5] || console.warn('missing lat', cmsData),
              long: cmsData[6] || console.warn('missing long', cmsData),
              imageName: fullSanitizedImageName || console.warn('missing long_name', cmsData),
              slug,
              ext,
              width: metadata.width,
              height: metadata.height,
              filters: {
                weight: weight.length ? weight[0].weight : 100,
                live,
              }
            });
          } else {
            console.error(`missing image name [${imageData}]`);
          }
        } else {
          missingImages.push(long_name);
          console.error(`missing image [${long_name}]`);
        }
      }
    }));
    console.log('done')
    await ff.writeJson(jsonData, LIVE_DATA_PATH, 'seattle.json', 2);
    await ff.writeJson(missingImages, BASE_DATA_PATH, 'seattleMissingImages.json', 2);
  },

  sanitizeImageNames: async function () {
    const data = await ff.readJson(LIVE_DATA_PATH, 'seattle.json');
    const retval = [];
    for (let i = 0, len = data.length; i < len; i++) {
      retval.push({
        ...data[i],
        imageName: formatImageFileName(data[i].imageName).sanitizedName
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
    // const color = await ColorThief.getColor(ff.path(PROCESSED_IMAGES_PATH, `${data.imageName}.${data.ext}`));

    // sharp
    const sharpImage = sharp(ff.path(PROCESSED_IMAGES_PATH, `${data.imageName}.${data.ext}`));
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
