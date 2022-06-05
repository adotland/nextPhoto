import Fuse from 'fuse.js';

import { dataList } from './park_search_data'

export default async function handler(req, res) {
  let { query } = (req.query)
  query = query.substring(0, 10).replaceAll(/[^a-z\s]/ig, '')?.toLowerCase();
  const options = {
    includeScore: false,
    keys: ['parkName']
  }
  const fuse = new Fuse(dataList, options)
  const retval = fuse.search(query)
  return res.status(200).json({ props: { searchDataList: retval.slice(0, 5) } });
}
