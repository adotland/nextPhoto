import { ff } from "fssf";
import Gallery from "../../components/Gallery";
import { byWeight } from "../../utils/helpers";


export async function getStaticPaths() {
  const paths = await ff.readJson('./cms/data/live/data', 'enabled_collections.json');
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
  const dataList = await ff.readJson(ff.path(`./cms/data/live/data/${value}_data.json`));
  const filtered = dataList.sort(byWeight);
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
