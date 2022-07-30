const { ff } = require("fssf");
const pointInPolygon = require('point-in-polygon')

const { BASE_DATA_PATH, LIVE_DATA_PATH, DEFAULT_COLLECTION } = require('../config');

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const { program } = require('commander');
program.requiredOption('-x, --method <method>');
program.option('-c, --collection <collection>', 'collection', DEFAULT_COLLECTION);
program.parse();

async function initData() {
  city_parkDataList = (await ff.readJson(BASE_DATA_PATH, 'cityData/seattle_park_area.json')).features;

  seattle_parkFeatureDataList = await ff.csvToObj(BASE_DATA_PATH, 'cityData/Seattle_Parks_and_Recreation_Parks_With_Features.tsv', '\t')

  seattle_parkGeoDataList = (await ff.readJson(BASE_DATA_PATH, 'cityData/seattle_park_area.geojson')).features;

  seattle_censusData = (await ff.readJson(BASE_DATA_PATH, 'cityData/Census_2020_Tracts_with_PL_94-171_Redistricting__Data_for_1990-2020.geojson')).features;

  RSECI_DataList = (await ff.readJson(BASE_DATA_PATH, 'cityData/RSECI.geojson')).features;
}

// all X park map
const ProcessCityData = {
  collectionMap: function (collection) {

  },
  generateParkData: async function () {
    const collectionList = await ff.readJson(LIVE_DATA_PATH, 'enabled_collections.json');

    const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(LIVE_DATA_PATH, `${collection}_data.json`))))
      .flat()
      .filter(d => d.ext === 'jpg')

    const missingCityParkData = [];
    const missingSeattleParkData = [];
    const missingTract = [];

    const live_parkDataList = dataList.map(data => {
      const pma = Number(data.imageName.split('_')[0]);
      let city_parkData = (city_parkDataList.filter(data => Number(data.attributes.PMA) === pma))
      if (!city_parkData.length) {
        missingCityParkData.push(data.slug)
      } else {
        city_parkData = city_parkData[0].attributes
      }
      const seattle_parkFeatureData = seattle_parkFeatureDataList.filter(data => Number(data.pmaid) === pma)
      if (!seattle_parkFeatureData.length) {
        missingSeattleParkData.push(data.slug)
      }

      const tractLabel = this.getTractLabel(data.lat, data.long);
      if (!tractLabel) {
        missingTract.push(data.slug)
      }

      return {
        name: data.parkName,
        slug: data.slug,
        pma,
        area: city_parkData?.SHAPE_Area,
        features: seattle_parkFeatureData.length ? {
          create: seattle_parkFeatureData.map(data => { return { featureName: data.feature_desc } })
        } : undefined,
        hours: seattle_parkFeatureData.length ? this.formatHours(seattle_parkFeatureData[0].hours) : null,
        tractLabel,
        lat: Number(data.lat),
        long: Number(data.long),
        collection: data.collection
      }
    })

    await ff.writeJson(live_parkDataList, BASE_DATA_PATH, '/cityData/etl/live_parkDataList.json', 2);

    await ff.writeJson(missingCityParkData, BASE_DATA_PATH, '/cityData/etl/missingCityParkData.json', 2)

    await ff.writeJson(missingSeattleParkData, BASE_DATA_PATH, '/cityData/etl/missingSeattleParkData.json', 2)

    await ff.writeJson(missingTract, BASE_DATA_PATH, '/cityData/etl/missingTract.json', 2)

  },

  formatHours(data) {
    // \"<b>Tuesday - Sunday</b> 10 a.m. - 6 p.m. <BR>
    return data.replaceAll(/[\"\r]/g, '').replaceAll(/<[a-z]+>|<\/[a-z]+>/ig, '')
  },

  formatArea(data) {
    if (!data) return null;
    let area = Math.round(data);
    if (area < 10000) {
      if (area > 999) {
        const thousand = (area + '')[0];
        const rest = (area + '').substring(1);
        return `${thousand},${rest} Sq. Ft.`;
      } else {
        return `${area} Sq. Ft.`;
      }
    } else {
      area = (area / 43560).toFixed(1);
      return area === '1.0' ? `${area} Acre` : `${area} Acres`;
    }
  },

  // model CensusTract {
  //   id         Int         @id @default(autoincrement())
  //   name       String      @unique
  //   tractId    Float       @unique
  //   tractLabel String      @unique
  //   area       Float
  //   polygon    Json
  //   parks      Park[]
  //   censusdata CensusData?
  //   demoData   RSECI_Data?
  // }

  async generateSeedData() {
    const parksData = await ff.readJson(BASE_DATA_PATH, '/cityData/etl/live_parkDataList.json');
    const tractsWithNoParks = [];
    const tractsWithNoDemoData = [];
    const censusDataList = seattle_censusData.map(censusData => {
      const modelData = {
        name: censusData.properties.TRACT_20_NAME,
        tractId: censusData.properties.TRACT_20,
        tractLabel: censusData.properties.TRACT_20_LABEL,
        geoId: censusData.properties.GEOID_20,
        area: censusData.properties.Shape__Area,
        polygon: censusData.geometry,
      };

      // parks
      const parksInTract = parksData.filter(park => park.tractLabel === modelData.tractLabel);
      if (parksInTract.length) {
        modelData.parks = {
          create: parksInTract.map(park => {
            delete park.tractLabel;
            return park;
          })
        }
      } else {
        tractsWithNoParks.push(modelData.tractLabel)
      }

      // censusdata
      delete censusData.properties.OBJECTID_1;
      delete censusData.properties.GEOID_20;
      delete censusData.properties.TRACT_20_NAME;
      delete censusData.properties.TRACT_20_LABEL;
      delete censusData.properties.TRACT_20;
      delete censusData.properties.AREA_ACRES;
      delete censusData.properties.AREA_SQMI;
      delete censusData.properties.Shape__Area;
      delete censusData.properties.Shape__Length;
      modelData.censusData = {
        create: censusData.properties
      }
      // demodata
      let RSECI_Data = RSECI_DataList.filter(data => data.properties.NAME10 === modelData.tractLabel)
      if (RSECI_Data.length) {
        RSECI_Data = RSECI_Data[0]
        delete RSECI_Data.properties.OBJECTID;
        delete RSECI_Data.properties.GEOID10;
        delete RSECI_Data.properties.NAME10;
        delete RSECI_Data.properties.NAMELSAD10;
        delete RSECI_Data.properties.ACRES_TOTAL;
        delete RSECI_Data.properties.Shape__Length;
        const tmp_area = RSECI_Data.properties.Shape__Area;
        delete RSECI_Data.properties.Shape__Area;
        modelData.demoData = {
          create: {
            ...RSECI_Data.properties,
            area: tmp_area,
          }
        }
      } else {
        tractsWithNoDemoData.push(modelData.tractLabel)
      }
      return modelData;
    });
    await ff.writeJson(censusDataList, BASE_DATA_PATH, '/cityData/etl/censusDataList.json', 2);
    await ff.writeJson(tractsWithNoParks, BASE_DATA_PATH, '/cityData/etl/tractsWithNoParks.json', 2);
    await ff.writeJson(tractsWithNoDemoData, BASE_DATA_PATH, '/cityData/etl/tractsWithNoDemoData.json', 2);

  },

  getTractLabel(lat, long) {
    let tract;
    const dataList = seattle_censusData;
    for (let i = 0; i < dataList.length; i++) {
      if (pointInPolygon([Number(long), Number(lat)], dataList[i].geometry.coordinates[0])) {
        tract = dataList[i].properties.TRACT_20_LABEL;
      }
    }
    return tract;
  },

  async populateLiveData() {
    const seattleParksDTOList = await prisma.park.findMany({ where: { collection: 'seattle' }, include: { features: true } });
    const seattleParksDataObj = seattleParksDTOList.reduce((acc, curr) => {
      acc[curr.slug] = curr;
      return acc;
    }, {})
    const seattleLiveData = await ff.readJson(BASE_DATA_PATH, 'INIT_seattle_data.json');
    const updatedData = seattleLiveData.map(data => {
      const slug = data.slug.replace('-anim', '');
      const parkData = seattleParksDataObj[slug];
      return {
        ...data,
        area: this.formatArea(parkData.area),
        hours: parkData.hours,
        features: parkData.features.map(f => f.featureName)
      }
    })
    await ff.writeJson(updatedData, LIVE_DATA_PATH, 'seattle_data.json', 2);
  },

  async generateGeoJSON() {
    const censusTractDTOList = await prisma.censusTract.findMany({
      select: {
        id: true,
        tractLabel: true,
        area: true,
        polygon: true,
        parks: true,
        demoData: {
          select: {
            SOCIOECONOMIC_PERCENTILE: true,
            PTL_ADULTNOLEISUREPHYSACTIVITY: true,
            PTL_ADULTMENTALHEALTHNOTGOOD: true,
            HEALTH_PERCENTILE: true,
          }
        }
      }
    })
    //{ where: { collection: { in: ['seattle', 'p-patch'] }, }, }

    function getParkArea(data) {
      return data.parks?.length ? data.parks.reduce((acc, cur) => acc + cur.area, 0) : 0
    };

    function getParkAmount(data) {
      return data.parks?.length > 0 ? data.parks.length : 0
    }

    // function 
    // sum park area per tract
    // pct of area used by parks
    // ptl rank tract by park area pct

    let totalParkArea = 0;
    const tractParkAreaList = [];
    let totalParkAmount = 0;
    const tractParkAmountList = [];
    censusTractDTOList.forEach(data => {
      const tractParkArea = getParkArea(data);
      const tractParkAmount = getParkAmount(data);
      totalParkArea += tractParkArea;
      totalParkAmount += tractParkAmount;
      tractParkAreaList.push({ id: data.id, area: tractParkArea });
      tractParkAmountList.push({ id: data.id, amount: tractParkAmount })
    });
    tractParkAreaList.sort((a, b) => a.area - b.area);
    tractParkAmountList.sort((a, b) => a.amount - b.amount);
    const tractParkAreaMap = new Map();
    const tractParkAmountMap = new Map();
    tractParkAreaList.forEach((data, index) => {
      tractParkAreaMap.set(data.id, data.area === 0 ? 0 : index)
    });
    tractParkAmountList.forEach((data, index) => {
      tractParkAmountMap.set(data.id, data.amount === 0 ? 0 : index)
    });
    const totalTracts = tractParkAreaList.length;

    // ptl rank tract by park area pct

    const retval_features = censusTractDTOList.map(data => {
      const tractParkArea = getParkArea(data);
      return {
        type: "Feature",
        properties: {
          id: data.id,
          tractLabel: data.tractLabel,
          parkArea: tractParkArea,
          parkAreaPct: tractParkArea / data.area,
          parkAreaPtl: tractParkAreaMap.get(data.id) / totalTracts * 100,
          parkAmount: getParkAmount(data),
          parkAmountPtl: tractParkAmountMap.get(data.id) / totalTracts * 100,
          socioEconomicPtl: data.demoData?.SOCIOECONOMIC_PERCENTILE,
          mentalHealthLowPtl: data.demoData?.PTL_ADULTMENTALHEALTHNOTGOOD,
          noExerciseTimePtl: data.demoData?.PTL_ADULTNOLEISUREPHYSACTIVITY,
          healthPtl: data.demoData?.HEALTH_PERCENTILE,
        },
        geometry: data.polygon,
      }
    });
    const retval = {
      type: "FeatureCollection",
      features: retval_features
    };
    await ff.writeJson(retval, LIVE_DATA_PATH, 'censusDataParks.geojson', 2);
  },
};

(async () => {
  try {
    const options = program.opts();
    if (options.method && ProcessCityData[options.method]) {
      await initData()
      await ProcessCityData[options.method](options.collection);
    } else {
      console.error('missing/bad method');
    }
  } catch (err) {
    console.error(err);
  }
})();
