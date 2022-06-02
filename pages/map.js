import { Box, Flex } from "@chakra-ui/react";
import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import MapFull from "../components/MapFull";
import Stats from "../components/Stats";

function getTypeAmount(type, list) {
  let amount = 0;
  list.forEach(data => {
    if (data.slug.indexOf(`${type}_`) === 0) {
      amount++;
    }
  });
  return amount;
}

function byFeatured(a, b) {
  return (b.filters?.featured - a.filters?.featured);
}

export async function getStaticProps() {
  const collectionList = ['seattle', 'non-city'];
  const dataObj = {};
  const statsObj = {
    amount: {
      all: 0
    }
  };
  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))
    dataObj[collection] = data;
    statsObj['amount'][collection] = data.length;
    statsObj['amount'].all += data.length;
  }));
  statsObj['amount'].port = getTypeAmount('port', dataObj['non-city']);
  statsObj['amount'].state = getTypeAmount('state', dataObj['non-city']);
  statsObj['amount'].county = getTypeAmount('county', dataObj['non-city']);

  // dataList.splice(15) // TODO: load bounds
  const dataList = dataObj.seattle.sort(byFeatured).slice(0, 15);

  const mapDataList = dataList.map(data => {
    return {
      name: data.name,
      slug: data.slug,
      lat: data.lat || null,
      long: data.long || null,
    }
  });
  const initCarouselDataList = dataList.map(data => {
    return {
      name: data.name,
      slug: data.slug,
      lat: data.lat || null,
      long: data.long || null,
      imageName: data.imageName,
      width: data.width,
      height: data.height,
      filters: { featured: data.filters?.featured }
    }
  });
  return { props: { mapDataList, statsObj, initCarouselDataList } };
}


export default function ({ mapDataList, statsObj, initCarouselDataList }) {

  const loadData = (data) => {
    // console.log(data)
    setNewParkSlug(data)
  }

  const [carouselDataList, setCarouselDataList] = useState(initCarouselDataList);
  const [newParkSlug, setNewParkSlug] = useState()

  useEffect(() => {
    const newData = initCarouselDataList.filter(d => d.slug === newParkSlug)
    if (newData.length)
      setCarouselDataList(prevDataList => [...newData, ...prevDataList].slice(0,15));
  }, [newParkSlug])

  return (
    <Box
      mx={4}
      mt={4}
    >
      <Box>
        <Stats stats={statsObj} />
        <MapFull dataList={mapDataList} loadData={loadData} />
      </Box>
      <Flex>
        <Carousel dataList={carouselDataList} />
      </Flex>
    </Box>
  )
}
