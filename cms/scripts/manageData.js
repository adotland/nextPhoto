require('dotenv').config();
const { ff } = require("fssf");
const fs = require('fs');
const sharp = require("sharp");

const { IMAGES_PATH, CMS_EXPORT_FILE, BASE_DATA_PATH, LIVE_DATA_PATH } = require('../config');
const { formatImageFileName } = require('./helpers');

const { program } = require('commander');
program.requiredOption('-x, --execute <method>');
program.parse();

const ManageData = {
  main: async function () {
    const data = await ff.readCsv(BASE_DATA_PATH, CMS_EXPORT_FILE, true, '\t');
    const imageDataList = await ff.readJson(LIVE_DATA_PATH, 'images.json');
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
            // console.log(`NAME: ${imageData.imageName}`);
            const fullImageName = `${imageData[0].pmaid}_${imageData[0].locid}_${imageData[0].imageName}`;
            console.log(`processing [${fullImageName}]`);

            try {
              const imageBuffer = fs.readFileSync(ff.path(IMAGES_PATH, fullImageName));
              const sharperImage = sharp(imageBuffer);
              metadata = await sharperImage.metadata();
            } catch (err) {
              console.error(err);
            }
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
              width: metadata.width,
              height: metadata.height,
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
    const retval =[]
    for (let i = 0, len = data.length; i < len; i++) {
      retval.push({
        ...data[i],
        imageName: formatImageFileName(data[i].imageName)
      });
    }
    await ff.writeJson(retval, LIVE_DATA_PATH, 'seattle.json', 2);
  },
};


(async () => {
  try {
    const options = program.opts();
    if (options.execute && ManageData[options.execute]) {
      await ManageData[options.execute]();
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
