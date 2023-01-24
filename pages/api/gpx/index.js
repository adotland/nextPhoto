import { withSentry } from "@sentry/nextjs";
import path from "path";
import * as fs from "fs";
import { promisify } from "util";
import { Stream } from "stream";

const pipeline = promisify(Stream.pipeline);

const dataList = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/") + "routes.json",
    "utf8"
  )
);

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

async function handler(req, res) {
  let { query } = req.query;
  query = santize(query);
  const found = dataList.find(d => d.slug === query);
  if (found) {
    const file = getGpxFile(found.gpxFile)
    res.setHeader('Content-Type', 'application/gpx+xml');
    res.setHeader('Content-Disposition', `attachment; filename=${found.gpxFile}`);
    await pipeline(file, res);
  } else {
    res.status(404).send({ error: 'failed to fetch data' })
  }
}

export default withSentry(handler);
