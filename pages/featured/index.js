import Gallery from "../../components/Gallery";
// import fs from 'fs';

import { dataList } from './featured_data'

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function byColor(a, b) {
  return (Number.parseInt(b.filters?.matchColor?.substring(1), 16) - Number.parseInt(a.filters?.matchColor?.substring(1), 16));
}

export async function getServerSideProps() {
  // const collectionList = await ff.readJson('./cms/data/live/data', 'enabled_collections.json');
  // // const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/data/${collection}_data.json`))))).flat();
  // const dataList = JSON.parse(fs.readFileSync(__dirname + '/featured/featured_data.json'))
  const sorted = shuffle(dataList).sort(byColor)
  const retval = [];
  sorted.forEach(data => {
    if (data.filters.live && data.filters.featured) {
      retval.push({
        slug: data.slug,
        imageName: data.imageName,
        ext: data.ext,
        name: data.parkName,
        width: data.width,
        height: data.height,
      });
    }
  })
  return { props: { dataList: retval.slice(0,12) } };
}

export default function ({ dataList }) {
  return (
    <Gallery dataList={dataList} />
  )
}
