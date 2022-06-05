const { ff } = require("fssf");
const fs = require('fs');
const sharp = require("sharp");
// const ColorThief = require('colorthief');

const { STILL_PATH, CMS_EXPORT_FILE, BASE_DATA_PATH, LIVE_DATA_PATH, PROCESSED_STILL_PATH, PROCESSED_WEBP_PATH, DEFAULT_COLLECTION } = require('../config');
const { formatImageFileName, findDuplicates, getColorDiff, toHex, formatImageFileNameNoExt, asyncForEach } = require('./helpers');

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
program.option('-f, --filter <filter>');
program.option('-c, --collection <collection>', 'collection', DEFAULT_COLLECTION);
program.parse();


const ManageData = {

  processCmsData: function (collection = DEFAULT_COLLECTION, cmsDataList) {
    const cmsDataObj = {};
    if (collection === 'seattle') {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[14];
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            pmaid: cmsData[0],
            locid: cmsData[1],
            name: cmsData[2] || console.warn('missing name', cmsData),
            address: cmsData[3] || console.warn('missing address', cmsData),
            zip_code: cmsData[4] || console.warn('missing zip_code', cmsData),
            lat: cmsData[5] || console.warn('missing lat', cmsData),
            long: cmsData[6] || console.warn('missing long', cmsData),
            collection: 'seattle',
          }
        }
      });
    } else if (collection === 'extras') {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[12];
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            name: cmsData[0] || console.warn('missing name', cmsData),
            address: cmsData[1] || console.warn('missing address', cmsData),
            lat: cmsData[2] || console.warn('missing lat', cmsData),
            long: cmsData[3] || console.warn('missing long', cmsData),
            link: cmsData[4],
            collection: cmsData[10] || console.warn('missing owner', cmsData),
          }
        }
      });
    } else if (collection === 'mercer') {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[9].trim();
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            name: cmsData[0] || console.warn('missing name', cmsData),
            address: cmsData[1] || console.warn('missing address', cmsData),
            lat: cmsData[2] || console.warn('missing lat', cmsData),
            long: cmsData[3] || console.warn('missing long', cmsData),
            collection: 'mercer'
          }
        }
      });
    } else if (['state', 'county'].includes(collection)) {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[9].trim();
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            name: cmsData[0] || console.warn('missing name', cmsData),
            address: cmsData[1] || console.warn('missing address', cmsData),
            lat: cmsData[4] || console.warn('missing lat', cmsData),
            long: cmsData[5] || console.warn('missing long', cmsData),
            collection
          }
        }
      });
    } else if (collection === 'p-patch') {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[9].trim();
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            name: cmsData[0] || console.warn('missing name', cmsData),
            address: cmsData[1] || console.warn('missing address', cmsData),
            lat: cmsData[2] || console.warn('missing lat', cmsData),
            long: cmsData[3] || console.warn('missing long', cmsData),
            collection: 'mercer'
          }
        }
      });
    } else if (collection === 'bainbridge') {
      cmsDataList.forEach(cmsData => {
        const long_name = cmsData[7].trim();
        if (!long_name) {
          console.error('missing long_name');
          process.exit(1);
        } else {
          cmsDataObj[long_name] = {
            name: cmsData[0] || console.warn('missing name', cmsData),
            address: cmsData[1] || console.warn('missing address', cmsData),
            lat: cmsData[2] || console.warn('missing lat', cmsData),
            long: cmsData[3] || console.warn('missing long', cmsData),
            collection: 'mercer'
          }
        }
      });
    }
    return cmsDataObj;
  },

  main: async function (collection = DEFAULT_COLLECTION) {
    const cmsDataList = await ff.readCsv(BASE_DATA_PATH, CMS_EXPORT_FILE(collection), true, '\t');
    const imageDataList = await ff.readJson(BASE_DATA_PATH, `images/images_${collection}.json`);
    const filterWeight = await ff.readJson(BASE_DATA_PATH, 'filters/filter-weight.json');
    const filterLive = await ff.readJson(BASE_DATA_PATH, 'filters/filter-live.json');
    const filterFeatured = await ff.readJson(BASE_DATA_PATH, 'filters/filter-featured.json');
    const jsonData = [];
    const missingImages = [];
    const duplicateImages = [];
    const imagesToProcess = [];
    const cmsDataObj = this.processCmsData(collection, cmsDataList);

    Object.keys(cmsDataObj).forEach(long_name => {

      // match cms long_name to acutal image in file system
      // seattle parks format XX_XX_name
      // image data has image file name and parsed name upper case, only alpha chars

      // const parsedLongName = long_name.replaceAll(/[^a-z]/ig, '').toUpperCase();
      // const imageData = imageDataList.filter(d => d.parsed === parsedLongName);

      const { name: formattedNameNoExt } = formatImageFileNameNoExt(long_name);

      const matchingImageDataList = imageDataList.filter(d => {
        let fullImageName;
        if (collection === 'seattle') {
          fullImageName = `${d.pmaid}_${d.locid}_${d.imageName}`
        } else {
          fullImageName = d.imageName
        }
        return fullImageName === formattedNameNoExt;
      });

      if (matchingImageDataList.length < 1) {
        // console.error(`missing image name [${parsedLongName}]`);
        missingImages.push(long_name);
      }
      // else if (matchingImageDataList.length > 1) {
      //   // console.log(imageData.length, `has duplicates: ${imageData.map(d=>d.imageName)}`);
      //   duplicateImages.push(matchingImageDataList.map(d => d.imageName));
      // } 
      else {
        imagesToProcess.push({ long_name, imageDataList: [...matchingImageDataList] });
      }

    });

    await Promise.all(imagesToProcess.map(async (imageDataObj, index) => {
      const long_name = imageDataObj.long_name;
      await Promise.all(imageDataObj.imageDataList.map(async imageData => {
        const isGif = imageData.ext === 'gif'
        const path = isGif ? PROCESSED_WEBP_PATH : STILL_PATH(collection);
        const currentImageName = imageData.imageName;
        let fullImageName;
        if (collection === 'seattle') {
          fullImageName = `${imageData.pmaid}_${imageData.locid}_${currentImageName}.${isGif ? 'webp' : imageData.ext}`;
        } else {
          fullImageName = `${currentImageName}.${isGif ? 'webp' : imageData.ext}`;
        }
        console.log(`processing [${fullImageName}]`);

        // image dimensions
        const imageBuffer = fs.readFileSync(ff.path(path, fullImageName));
        const sharpImage = sharp(imageBuffer);
        const metadata = await sharpImage.metadata();

        // filters
        const weight = filterWeight.filter(x => x.slug === imageData.slug);
        const live = !filterLive.includes(imageData.slug);
        const featured = filterFeatured.includes(imageData.slug);

        jsonData.push({
          id: index,
          pmaid: cmsDataObj[long_name].pmaid,
          locid: cmsDataObj[long_name].locid,
          name: cmsDataObj[long_name].name,
          address: cmsDataObj[long_name].address,
          zip_code: cmsDataObj[long_name].zip_code,
          lat: cmsDataObj[long_name].lat,
          long: cmsDataObj[long_name].long,
          imageName: fullImageName,
          slug: isGif ? imageData.slug + '-anim' : imageData.slug,
          ext: isGif ? 'webp' : imageData.ext,
          width: metadata.width,
          height: metadata.height,
          collection,
          filters: {
            weight: weight.length ? weight[0].weight : 100,
            live,
            featured,
            type: isGif ? 'animated' : 'still'
          }
        });
      }));
    }));

    await ff.writeJson(jsonData, LIVE_DATA_PATH, `${collection}_data.json`, 2);
    await ff.writeJson(missingImages, BASE_DATA_PATH, `mgmt/${collection}_missing_images.json`, 2);
    await ff.writeJson(duplicateImages, BASE_DATA_PATH, `mgmt/${collection}_duplicate_images.json`, 2);
  },

  sanitizeImageNamesInFile: async function (collection = DEFAULT_COLLECTION) {
    const data = await ff.readJson(LIVE_DATA_PATH, `${collection}_data.json`);
    const retval = [];
    for (let i = 0, len = data.length; i < len; i++) {
      retval.push({
        ...data[i],
        imageName: formatImageFileName(data[i].imageName).name
      });
    }
    await ff.writeJson(retval, LIVE_DATA_PATH, `${collection}_data.json`, 2);
  },

  duplicateCheck: async function (collection = 'settle') {
    const data = await ff.readJson(LIVE_DATA_PATH, `${collection}_data.json`);
    const slugList = data.map(d => d.slug);
    const dups = findDuplicates(slugList);
    if (dups.length) {
      console.error(`found duplicate slugs: ${dups}`);
    } else {
      console.info('no dups')
    }
    await ff.writeJson(dups, BASE_DATA_PATH, `mgmt/${collection}_duplicate_slugs.json`);
  },

  updateAllFilters: async function (collection = DEFAULT_COLLECTION) {
    let filterList = ['live', 'featured', 'weight'];
    filterList = filterList.concat('matchColor');
    await Promise.all(filterList.map(filter => this.updateFilter(collection, filter)));
  },

  updateFilter: async function (collection = DEFAULT_COLLECTION, filter, newOnly = false) {
    console.time(`updateFilter-${filter}`);
    const dataList = (await ff.readJson(LIVE_DATA_PATH, `${collection}_data.json`))
    let updateList;
    let reprocessList;

    let existing;
    if (filter === 'matchColor') {
      reprocessList = await ff.readJson(BASE_DATA_PATH, 'reprocess_still.json');
      try {
        existing = await ff.readJson(BASE_DATA_PATH, `filters/filterData_${collection}_${filter}.json`);
      } catch (err) {
        // noop
      }
    } else {
      updateList = await ff.readJson(BASE_DATA_PATH, `filters/filter-${filter}.json`);
    }
    const retval = [];
    const dumpObj = {};
    await Promise.all(dataList.map(async data => {
      let newFilterObj;
      try {
        // if (newOnly) {
        if (existing?.[data.slug] && !reprocessList.includes(data.slug)) {
          newFilterObj = existing[data.slug]
        }
        // }
        newFilterObj = newFilterObj || await this[`_get_${filter}`](data, updateList);
        dumpObj[data.slug] = newFilterObj;
        retval.push({
          ...data,
          filters: {
            ...data.filters,
            ...newFilterObj,
          }
        });
        // just copy for anim gif webp for now
        // if ()
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }));
    await ff.writeJson(retval, LIVE_DATA_PATH, `${collection}_data.json`, 2);
    await ff.writeJson(dumpObj, BASE_DATA_PATH, `filters/filterData_${collection}_${filter}.json`, 2);
    console.timeEnd(`updateFilter-${filter}`);
    // output color to avoid having to reprocess
  },

  _get_matchColor: async function (data) {
    // color thief
    // const color = await ColorThief.getColor(ff.path(PROCESSED_STILL_PATH, `${data.imageName}.${data.ext}`));
    const isWebp = data.ext === 'webp'
    const path = isWebp ? PROCESSED_WEBP_PATH : PROCESSED_STILL_PATH;

    let imageToProcess = '';
    // if (data.ext === 'webp') {
    //   // imageToProcess = data.imageName.replace('webp', 'jpg');
    //   console.warn(`skipping webp file [${data.imageName}]`);
    //   return; // better to skip for now
    // }
    // else {
    imageToProcess = data.imageName;
    // }

    // sharp
    if (!fs.existsSync(ff.path(path, `${imageToProcess}`))) {
      console.warn(`-- ${imageToProcess} does not exist in processed folder`);
      return;
    }
    const sharpImage = sharp(ff.path(path, `${imageToProcess}`));

    // background is almost always just region above mid
    const metadata = await sharpImage.metadata();
    const background = await sharpImage.extract({ left: 0, top: 0, width: metadata.width, height: Math.ceil(metadata.height / 1.5) }).toBuffer();

    const { dominant } = await sharp(background).stats();
    const color = [dominant.r, dominant.g, dominant.b];

    console.info(`${imageToProcess} [${color}]`);
    const matchColor = getColorDiff(color);
    const domColor = toHex(color);
    return {
      matchColor,
      domColor,
    }
  },

  _get_weight: async function (data, updateList) {
    const newVal = updateList.filter(x => x.slug === data.slug);
    return {
      weight: newVal.length ? newVal[0].weight : 100,
    }
  },

  _get_live: async function (data, updateList) {
    const newVal = updateList.includes(data.slug);
    return {
      live: !newVal,
    }
  },

  _get_featured: async function (data, updateList) {
    const newVal = updateList.includes(data.slug);
    return {
      featured: newVal,
    }
  },

  getListAll: async function (collection = DEFAULT_COLLECTION) {
    let retval = await ff.readJson(LIVE_DATA_PATH, `${collection}_data.json`);
    retval = retval.map(d => d.slug);
    await ff.writeJson(retval.sort(), BASE_DATA_PATH, `slugsAll_${collection}.json`, 2);
  },

  getApiData: async function () {
    const collectionList = await ff.readJson(LIVE_DATA_PATH, 'enabled_collections.json');
    const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/data/${collection}_data.json`))))).flat();
    const retval = [];
    dataList.forEach(data => {
      if (data.filters.live) {
        retval.push({
          slug: data.slug,
          parkName: data.name.toLowerCase(),
          still: data.ext === 'jpg'
        });
      }
    })
    await ff.writeJson(retval.sort(), LIVE_DATA_PATH, `api_data.json`, 0);
    // await ff.write(`export const dataList = ${retval.sort()}`, '../../pages/api/park/api_data.js');
  }

};


(async () => {
  try {
    const options = program.opts();
    if (options.method && ManageData[options.method]) {
      await ManageData[options.method](options.collection, options.filter);
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
