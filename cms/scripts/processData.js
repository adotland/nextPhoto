const { ff } = require("fssf");
const fs = require('fs');
const sharp = require("sharp");
// const ColorThief = require('colorthief');

const { STILL_PATH, CMS_EXPORT_FILE, BASE_DATA_PATH, LIVE_DATA_PATH, PROCESSED_STILL_PATH, GIF_PATH, PROCESSED_WEBP_PATH } = require('../config');
const { formatImageFileName, findDuplicates, getColorDiff, toHex, formatImageFileNameNoExt, asyncForEach } = require('./helpers');

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
    const filterFeatured = await ff.readJson(BASE_DATA_PATH, 'filter-featured.json');
    const jsonData = [];
    const missingImages = [];
    const duplicateImages = [];
    const imagesToProcess = [];
    const cmsDataObj = {};

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
        }
      }
    })



    cmsDataList.forEach(cmsData => {
      if (cmsData[14]) {
        const long_name = cmsData[14];
        // match cms long_name to acutal image in file system
        // seattle parks format XX_XX_name
        // image data has image file name and parsed name upper case, only alpha chars

        // const parsedLongName = long_name.replaceAll(/[^a-z]/ig, '').toUpperCase();
        // const imageData = imageDataList.filter(d => d.parsed === parsedLongName);

        const { name: formattedNameNoExt } = formatImageFileNameNoExt(long_name);

        const matchingImageDataList = imageDataList.filter(d => `${d.pmaid}_${d.locid}_${d.imageName}` === formattedNameNoExt);

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
      }
    });

    await Promise.all(imagesToProcess.map(async (imageDataObj, index) => {
      // const imageData = matchingImageDataList[0];
      const long_name = imageDataObj.long_name;
      await Promise.all(imageDataObj.imageDataList.map(async imageData => {
        const isGif = imageData.ext === 'gif'
        const path = isGif ? PROCESSED_WEBP_PATH : STILL_PATH;
        const currentImageName = imageData.imageName;
        let fullImageName;
        if (isGif) {
          fullImageName = `${imageData.pmaid}_${imageData.locid}_${currentImageName}.webp`;
        } else {
          fullImageName = `${imageData.pmaid}_${imageData.locid}_${currentImageName}.${imageData.ext}`;
        }
        console.log(`processing [${fullImageName}]`);

        // image dimensions
        const imageBuffer = fs.readFileSync(ff.path(path, fullImageName));
        const sharpImage = sharp(imageBuffer);
        const metadata = await sharpImage.metadata();

        // filters
        const weight = filterWeight.filter(x => x.slug === imageData.slug);
        const live = filterLive.includes(imageData.slug);
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
          filters: {
            weight: weight.length ? weight[0].weight : 100,
            live,
            featured,
            type: isGif ? 'animated' : 'still'
          }
        });
      }));
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

  updateFilter: async function (filter, newOnly = true) {
    console.time('updateFilter');
    const dataList = await ff.readJson(LIVE_DATA_PATH, 'seattle.json');
    let existing;
    try {
      existing = await ff.readJson(BASE_DATA_PATH, `filterData_${filter}.json`);
    } catch (err) {
      // noop
    }
    const retval = [];
    const dumpObj = {};
    let newFilterObj;
    await Promise.all(dataList.map(async data => {
      try {
        if (newOnly) {
          if (existing?.[data.slug]) {
            newFilterObj = existing[data.slug]
          }
        }
        newFilterObj = newFilterObj || await this[`_get_${filter}`](data);
        dumpObj[data.slug] = newFilterObj;
        retval.push({
          ...data,
          filters: {
            ...data.filters,
            ...newFilterObj,
          }
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }));
    await ff.writeJson(retval, LIVE_DATA_PATH, 'seattle.json', 2);
    await ff.writeJson(dumpObj, BASE_DATA_PATH, `filterData_${filter}.json`, 2);
    console.timeEnd('updateFilter');
    // output color to avoid having to reprocess
  },

  _get_matchColor: async function (data) {
    // color thief
    // const color = await ColorThief.getColor(ff.path(PROCESSED_STILL_PATH, `${data.imageName}.${data.ext}`));



    let imageToProcess = '';
    if (data.ext === 'webp') {
      imageToProcess = data.imageName.replace('webp', 'jpg');
    }
    else {
      imageToProcess = data.imageName;
    }

    // sharp
    let sharpImage;
    let image;
    try {
      image = await ff.read(ff.path(PROCESSED_STILL_PATH, `${imageToProcess}`));
    } catch (err) {
      console.error(err);
      return;
    }
    sharpImage = sharp(ff.path(PROCESSED_STILL_PATH, `${imageToProcess}`));

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

  _get_featured: async function (data) {
    const updateList = await ff.readJson(BASE_DATA_PATH, 'filter-featured.json');
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
