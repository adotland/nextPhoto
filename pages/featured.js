import Gallery from "../components/Gallery";
import config from "../config";


// TODO
export async function getServerSideProps() {
  const response = await fetch(`${config.meta.canonicalUrl}/api/featured/`)
  const { props } = await response.json()
  return {
    props
  }
}

export default function ({ dataList }) {
  return (
    <Gallery dataList={dataList} />
  )
}
