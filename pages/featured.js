import Gallery from "../components/Gallery";
import { ff } from "fssf";
import { byColor, shuffle } from "../utils/helpers";

export async function getServerSideProps() {
  const collectionList = await ff.readJson('./cms/data/live/data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/data/${collection}_data.json`))))).flat();
  const sorted = shuffle(dataList).sort(byColor)
  const retval = [];
  sorted.forEach(data => {
    if (data.filters.live && data.filters.featured) {
      retval.push({
        slug: data.slug,
        imageName: data.imageName,
        ext: data.ext,
        name: data.name,
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
