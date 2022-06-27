(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports);
    global.actual = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true,
  });

  const COLORS = {
    // DAY: [135, 206, 235],
    // NIGHT: [4, 0, 32],
    // LIGHT: [255, 255, 255],
    // DARK: [0, 0, 0],
    DAY: [135, 206, 235],
    NIGHT: [4, 0, 32],
    LIGHT: [255, 255, 255],
    DARK: {
      rgb: [0, 0, 0],
      hex: '#000000',
    },
    PALETTE: {
      light: {
        hex: '#ffffff',
        displayHex: '#f8f0e3',
        rgb: { R: 255, G: 255, B: 255 },
      },
      // earth: {
      //   hex: '#654321',
      //   displayHex: '#654321',
      //   rgb: { R: 101, G: 67, B: 33 },
      // },
      sky: {
        hex: '#4bb5d8',
        displayHex: '#4bb5d8',
        rgb: { R: 75, G: 181, B: 216 },
      },
      forest: {
        hex: '#37522c',
        displayHex: '#37522c',
        rgb: { R: 55, G: 82, B: 44 }, // blend green
      },
      bold: {
        hex: '#000000',
        displayHex: '#301934',
        rgb: { R: 0, G: 0, B: 0 },
      },
      noir: {
        hex: '#000000',
        displayHex: '#000000',
        rgb: { R: 0, G: 0, B: 0 },
      }
    }
  }

  exports.default = COLORS.PALETTE;

  exports.getColor = (colorName) => {
    return COLORS.PALETTE[colorName]?.hex
  }

  exports.getAllColors = () => {
    return Object.keys(COLORS.PALETTE);
  }
});
