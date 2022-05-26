import Gallery from "../components/Gallery";
import { ff } from "fssf";

export async function getServerSideProps() {
  const data = await ff.readJson(ff.path('./data/db.json'));
  return { props: { data } };
}

export default function({ data }) {
  return (
    <Gallery data={data}/>
  )
}
