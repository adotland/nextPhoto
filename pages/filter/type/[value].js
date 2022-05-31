import { ff } from "fssf";
import Gallery from "../../../components/Gallery";

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
  const data = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  const filtered = data.filter(d => d.filters?.[FILTER_NAME]?.toLowerCase() == value?.toLowerCase());
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
      filterImageType: value,
    }
  };
}

export default function ({ dataList, filterImageType }) {
  return (
    <Gallery dataList={dataList} filterImageType={filterImageType} />
  )
}
