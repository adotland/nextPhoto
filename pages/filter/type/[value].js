import { ff } from "fssf";
import Gallery from "../../../components/Gallery";
import { byWeight } from "../../../utils/helpers";

const FILTER_NAME = 'type'

export async function getStaticPaths() {
  const paths = ['animated', 'still'];
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
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./data/${collection}_data.json`))))).flat(); const filtered = dataList.filter(d => d.filters?.[FILTER_NAME]?.toLowerCase() == value?.toLowerCase()).sort(byWeight);
  const retval = [];
  filtered.forEach(data => {
    if (data.filters.live) {
      retval.push({
        slug: data.slug,
        imageName: data.imageName,
        ext: data.ext,
        parkName: data.parkName,
        width: data.width,
        height: data.height,
      });
    }
  });
  return {
    props: {
      dataList: retval,
      filterImageType: value,
    }
  };
}

export default function ({ dataList, filterImageType }) {
  return (
    <Gallery dataList={dataList} filterImageType={filterImageType} />
  )
}
