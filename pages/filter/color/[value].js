import { ff } from "fssf";
import { getAllColors } from "../../../cms/data/live/scripts/palette";
import Gallery from "../../../components/Gallery";
import { byWeight } from "../../../utils/helpers";

const FILTER_NAME = 'matchColor'

export async function getStaticPaths() {
  const paths = getAllColors();
  const displayable = paths.map(p => {
    return {
      params: { value: p }
    }
  });
  return {
    paths: displayable,
    fallback: false,
  }
}

export async function getStaticProps({ params: { value } }) {
  const collectionList = await ff.readJson('./cms/data/live/data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/data/${collection}_data.json`))))).flat();
  const filtered = dataList.filter(d => d.filters?.[FILTER_NAME]?.toLowerCase() == value?.toLowerCase()).sort(byWeight);
  const retval = [];
  filtered.forEach(data => {
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
  });
  return {
    props: {
      dataList: retval,
      filterColor: value,
    }
  };
}

export default function ({ dataList, filterColor }) {
  return (
    <Gallery dataList={dataList} filterColor={filterColor} />
  )
}
