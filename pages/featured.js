// import { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
// import config from "../config";

// TODO 
export async function getServerSideProps() {
  const api_url = process.env.API_URL
  const response = await fetch(`${api_url}/api/featured/`)
  const { props } = await response.json()
  return {
    props: { dataList: props.dataList }
  }
}

export default function ({ dataList }) {

  // const [dataList, setDataList] = useState([])

  // useEffect(() => {
  //   fetch(`/api/featured`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setDataList(data.props?.dataList)
  //     })
  //     .catch(err => {
  //       // console.log(err)
  //     })
  // }, [])

  return (
    <Gallery dataList={dataList} />
  )
}
