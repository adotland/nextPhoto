import Gallery from "../components/Gallery";
import { ff } from "fssf";
import { byColor, byWeight } from "../utils/helpers";

export async function getStaticProps() {
  const collectionList = ['seattle', 'non-city', 'mercer'];
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))))).flat();
  const sorted = dataList.sort(byWeight).sort(byColor);
  const retval = [];
  sorted.forEach(data => {
    if (data.filters.live) {
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
  return { props: { dataList: retval } };
}

export default function ({ dataList }) {
  return (
    <Gallery dataList={dataList} />
  )
}
