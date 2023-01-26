import { withSentry } from "@sentry/nextjs";
import path from "path";
import * as fs from "fs";

const getGpxFile = (fileName) => {
  return fs.readFileSync(
    path.join(process.cwd(), "data/gpx/") + fileName,
    "utf8"
  )
}

const santize = (input) => {
  return input
    .substring(0, 100)
    .replaceAll(/[^a-z-\s]/gi, "")
    ?.toLowerCase();
}

const routeDataList = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/") + "routes.json",
    "utf8"
  )
);

const dataList = routeDataList.map(data => {
  const gpxData = getGpxFile(data.gpxFile);
  return {
    ...data,
    gpxData
  }
})

async function handler(req, res) {
  let { slug } = req.query
  slug = santize(slug);
  const found = dataList.find(d => d.slug === slug);
  if (found) {
    res.status(200).send(JSON.stringify(found));
  } else {
    res.status(404).send({ error: 'failed to fetch data' })
  }
}

export default withSentry(handler);
