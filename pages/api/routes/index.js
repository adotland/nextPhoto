import { withSentry } from "@sentry/nextjs";
import path from "path";
import * as fs from "fs";

const readJson = (filePath, fileName) => {
  const dataStr = readFile(filePath, fileName)
  return JSON.parse(dataStr);
}

const readFile = (filePath, fileName) => {
  const fullPath = path.join(process.cwd(), filePath, fileName);
  return fs.readFileSync(fullPath, "utf8");
}


const getGpxFile = (fileName) => {
  return readFile("./data/gpx/", fileName)
}

const santize = (input) => {
  return input
    .substring(0, 100)
    .replaceAll(/[^a-z-\s]/gi, "")
    ?.toLowerCase();
}

const routeDataList = readJson("./data/", "routes.json");

const dataList = routeDataList.map(data => {
  const gpxData = getGpxFile(data.gpxFile);
  return {
    ...data,
    gpxData
  }
});

const collectionList = readJson("./data/", "enabled_collections.json");

let parksDataList = [];
collectionList.map(async (collection) =>
  parksDataList.push(readJson('./data/', `${collection}_data.json`))
)
parksDataList = parksDataList.flat();


async function handler(req, res) {
  let { slug } = req.query
  slug = santize(slug);
  const routeData = dataList.find(d => d.slug === slug);
  if (routeData) {
    // get park data
    const routeParkDataList = parksDataList.filter(p => routeData.parkNameList.includes(p.slug));
    res.status(200).send(JSON.stringify({ ...routeData, parkDataList: routeParkDataList }));
  } else {
    res.status(404).send({ error: 'failed to fetch data' })
  }
}

export default withSentry(handler);
