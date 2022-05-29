import { ff } from "fssf";
import Gallery from "../../../components/Gallery";
import { COLORS } from "../../../cms/config";

export async function getStaticPaths() {
  const paths = Object.keys(COLORS.PALETTE);
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
  return {
    props: {
      dataList: data.filter(d => d.filters?.matchColor?.toLowerCase() == value?.toLowerCase()),
      filterColor: value,
    }
  };
}

export default function ({ dataList, filterColor }) {
  return (
    <Gallery dataList={dataList} filterColor={filterColor}/>
  )
}
