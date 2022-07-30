import { withSentry } from "@sentry/nextjs";
import path from "path";
import * as fs from "fs";
const dataList = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/") + "park_search_data.json",
    "utf8"
  )
);

import Fuse from "fuse.js";
const options = {
  includeScore: false,
  keys: ["parkName"],
};
const fuse = new Fuse(dataList, options);

async function handler(req, res) {
  let { query } = req.query;
  query = query
    .substring(0, 10)
    .replaceAll(/[^a-z\s]/gi, "")
    ?.toLowerCase();
  const result = fuse.search(query);
  res.status(200).json({ props: { searchDataList: result.slice(0, 5) } });
}

export default withSentry(handler);
