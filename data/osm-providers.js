// require('dotenv').config()
// const JAWG_ACCESS_TOKEN = process.env.

export default {
  osm: {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  },
  maptiler: {
    url: "https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1",
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  },
  cyclosm: {
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  jawgDark: {
    url: 'https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=GHObkvztlI0hiice5CFVpDvQ1agP2YTe3MNarGOdrOpvK9Ool9FwNJWSp9Z3ucjF',
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  jawgLight: {
    url: 'https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=GHObkvztlI0hiice5CFVpDvQ1agP2YTe3MNarGOdrOpvK9Ool9FwNJWSp9Z3ucjF',
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  jawgTerrain: {
    url: 'https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=GHObkvztlI0hiice5CFVpDvQ1agP2YTe3MNarGOdrOpvK9Ool9FwNJWSp9Z3ucjF',
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }

};
