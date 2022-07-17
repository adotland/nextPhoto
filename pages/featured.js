import Gallery from "../components/Gallery";
import config from "../config";

export async function getServerSideProps() {
  const api_url = config.endpoints.api
  const response = await fetch(`${api_url}/api/featured/`)
  const { props } = await response.json()
  return {
    props: { dataList: props.dataList }
  }
}

export default function Featured({ dataList }) {
  return (
    <Gallery dataList={dataList} isFeatured={true} />
  )
}
