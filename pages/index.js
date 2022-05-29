import Gallery from "../components/Gallery";
import { ff } from "fssf";

function byWeight(a, b) {
  return (b.filters?.weight || 0) - (a.filters?.weight || 0);
}

function byColor(a, b) {
  return (Number.parseInt(b.filters?.matchColor?.substring(1), 16) - Number.parseInt(a.filters?.matchColor?.substring(1), 16));
}

export async function getStaticProps() {
  const dataList = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  return { props: { dataList: dataList.sort(byWeight).sort(byColor) } };
}

export default function ({ dataList }) {
  return (
    <Gallery dataList={dataList} />
  )
}
