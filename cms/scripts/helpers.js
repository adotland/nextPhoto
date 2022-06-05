// const { differenceCie76 } = require('d3-color-difference');
const diff = require('color-diff');
const COLORS = require('../data/live/scripts/palette');
// const Colour = require('./Colour');

const FONT_SCALE = 70 / (3000 * 4000);
const MIN_WM_FONT_SIZE = 7;

// const constants = {
//   HIGH_SQ: 441.673, // sqrt(255^2 * 3)
// };

const _doRegex = function (fileName, collection) {
  let sanitizedName = fileName.trim();
  // const remove_re = /[’]/g;
  // const spaces_re = /['.,]/g;
  // const dashes_re = /[\s\(\)]/g;
  const dashes_re = /[\s]/g;
  // let sanitizedName = fileName.replaceAll(remove_re, '');
  // sanitizedName = sanitizedName.replaceAll(spaces_re, ' ');
  sanitizedName = sanitizedName.replaceAll(dashes_re, '-');
  sanitizedName = sanitizedName.replaceAll(/[^a-z0-9_-]/ig, '');
  return sanitizedName;
}

const formatImageFileName = function (fileName, collection) {
  let tmp = fileName.split('.');
  const ext = tmp.pop().toLowerCase();
  tmp = tmp.join('.');
  const sanitizedName = _doRegex(tmp, collection);
  return {
    name: sanitizedName,
    slug: sanitizedName.toLowerCase(),
    ext
  }
}
const formatImageFileNameNoExt = function (fileName) {
  const sanitizedName = _doRegex(fileName);
  return {
    name: sanitizedName,
    slug: sanitizedName.toLowerCase(),
  }
}
const findDuplicates = function (arr) {
  let sorted_arr = arr.slice().sort();
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
};

const toHex = function (arr) {
  let retval = arr.map(x => {
    const str = Number(x).toString(16);
    if (str.length === 1) {
      return `0${str}`;
    } else {
      return str;
    }
  }).join('');

  retval = '#' + retval; // Colour.js requirement

  // console.log(`toHex: ` + retval);
  return retval;
}

// in [r,g,b], [r,g,b]
// out #rrggbb
const getColorDiff = function (c1, c2) {
  // console.log('c2: '+c2)
  //TODO: color space
  // const [r1, g1, b1] = c1;
  // let [r2, g2, b2] = c2;
  // const diff = Math.sqrt(Math.pow((r2 - r1), 2) + Math.pow((g2 - g1), 2) + Math.pow((b2 - b1), 2));
  // const pct = diff / constants.HIGH_SQ;
  // return [diff, pct];

  // const retval = differenceCie76(toHex(c1), toHex(c2));

  // get distance to specific color
  // const retval = Colour.deltaE00(...Colour.hex2lab(toHex(c1)), ...Colour.hex2lab(c2));

  // const retval = diff.closest(color, constants.COLORS.PALETTE);


  // var color = { R: 255, G: 255, B: 255 };
  // // black, white
  // var palette = [ {R: 0, G: 0, B: 0 }, {R: 255, G: 255, B: 255 } ];

  const color = { R: c1[0], G: c1[1], B: c1[2] }
  const palette = COLORS.default;

  // { R: 66, G: 105, B: 47 }, // plant green
  // { R: 35, G: 42, B: 38 }, // tree green


  const closestRgb = diff.closest(color, Object.values(palette).map(p => p.rgb));
  const closestHex = toHex([closestRgb.R, closestRgb.G, closestRgb.B]);
  for (const color in palette) {
    if (palette[color].hex === closestHex)
      retval = color;
  }

  return retval;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function arrayDiff(arr1, arr2) {
  return arr1
    .filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)));
}

function getWmFontSize(width, height) {
  const computed = Math.ceil(FONT_SCALE * width * height);
  return computed < MIN_WM_FONT_SIZE ? MIN_WM_FONT_SIZE : computed;
}

module.exports = {
  formatImageFileName,
  findDuplicates,
  getColorDiff,
  toHex,
  asyncForEach,
  formatImageFileNameNoExt,
  arrayDiff,
  getWmFontSize
}
