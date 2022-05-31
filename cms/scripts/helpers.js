// const { differenceCie76 } = require('d3-color-difference');
const diff = require('color-diff');
const { COLORS } = require('../config');
// const Colour = require('./Colour');

// const constants = {
//   HIGH_SQ: 441.673, // sqrt(255^2 * 3)
// };

const formatImageFileName = function (fileName) {
  const tmp = fileName.split('.');
  const ext = tmp.pop().toLowerCase();
  let sanitizedName = tmp.join('.');
  const spaces_re = /['.,]/g;
  const dashes_re = /[\s\(\)]/g;
  sanitizedName = sanitizedName.replaceAll(spaces_re, ' ');
  sanitizedName = sanitizedName.replaceAll(dashes_re, '-');
  const slug = sanitizedName.toLowerCase();
  return {
    name: sanitizedName,
    slug,
    ext
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
  const palette = COLORS.PALETTE;

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

module.exports = {
  formatImageFileName,
  findDuplicates,
  getColorDiff,
  toHex
}
