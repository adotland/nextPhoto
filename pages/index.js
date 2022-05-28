import Gallery from "../components/Gallery";
import { ff } from "fssf";

function byWeight(a, b) {
  return (b.weight || 0) - (a.weight || 0);
}

export async function getServerSideProps() {
  const dataList = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  return { props: { dataList: dataList.sort(byWeight) } };
}

export default function ({ dataList }) {
  return (
    <Gallery dataList={dataList} />
  )
}
