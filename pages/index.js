import Gallery from "../components/Gallery";
import { ff } from "fssf";

export async function getServerSideProps() {
  const dataList = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  return { props: { dataList } };
}

export default function({ dataList }) {
  return (
    <Gallery dataList={dataList}/>
  )
}
