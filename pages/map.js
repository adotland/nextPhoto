import { Box, Text } from "@chakra-ui/react";
import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import MapFull from "../components/MapFull";
import Stats from "../components/Stats";
import { shuffle } from "../utils/helpers";

function getTypeAmount(type, list) {
  let amount = 0;
  list.forEach(data => {
    if (data.slug.indexOf(`${type}_`) === 0) {
      amount++;
    }
  });
  return amount;
}

export async function getStaticProps() {
  const collectionList = ['seattle', 'non-city', 'mercer'];
  const dataObj = {};
  const statsObj = {
    amount: {
      all: 0
    }
  };
  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))
    dataObj[collection] = data.filter(d => d.ext === 'jpg'); //TODO
    const singleImageList = data.filter(d => d.ext === 'jpg'); //TODO
    statsObj['amount'][collection] = singleImageList.length;
    statsObj['amount'].all += singleImageList.length;
  }));
  statsObj['amount'].port = getTypeAmount('port', dataObj['non-city']);
  statsObj['amount'].state = getTypeAmount('state', dataObj['non-city']);
  statsObj['amount'].county = getTypeAmount('county', dataObj['non-city']);

  // smallest 
  const initBounds = { north: 47.63694030290387, south: 47.58138923915503, east: -122.2716522216797, west: -122.3705291748047 }

  const dataList = [];
  for (const collection in dataObj) {
    dataList.push(...dataObj[collection].filter(d=>d.filters?.live))
  }
  shuffle(dataList);

  const initParksWithinBounds = dataList.filter(data => {
    let withinBounds = false;
    if ((data.lat && (data.lat > initBounds.south)) && (data.lat && (data.lat < initBounds.north)) && (data.long && (data.long > initBounds.west)) && (data.long && (data.long < initBounds.east))) {
      withinBounds = true;
    }
    return withinBounds;
  })
    .slice(0, 15);

  const initMapDataList = initParksWithinBounds.map(data => {
    return {
      name: data.name,
      slug: data.slug,
      lat: data.lat || null,
      long: data.long || null,
    }
  });
  const initCarouselDataList = initParksWithinBounds.map(data => {
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
  return { props: { initMapDataList, statsObj, initCarouselDataList, dataList } };
}


export default function ({ initMapDataList, statsObj, initCarouselDataList, dataList }) {

  const [carouselDataList, setCarouselDataList] = useState(initCarouselDataList);
  const [mapDataList, setMapDataList] = useState(initMapDataList);
  const [newParkSlug, setNewParkSlug] = useState()

  const loadData = (data) => {
    setNewParkSlug(data)
  }
  useEffect(() => {
    const newData = dataList.filter(d => d.slug === newParkSlug)
    if (newData.length) {
      setCarouselDataList(prevDataList => [...newData, ...prevDataList].slice(0, 15));
    }
  }, [newParkSlug])

  const getParksInBounds = (bounds) => {
    // get every park with lat > s, lat < n, long > w, long < e
    const retval = dataList.filter(data => {
      let withinBounds = false;
      if ((data.lat && (data.lat > bounds.south)) && (data.lat && (data.lat < bounds.north)) && (data.long && (data.long > bounds.west)) && (data.long && (data.long < bounds.east))) {
        withinBounds = true;
      }
      return withinBounds;
    });
    const truncatedList = retval.slice(0, 15);
    setMapDataList(truncatedList)
    setCarouselDataList(truncatedList)
  }

  return (
    <Box
      mx={4}
      mt={4}
    >
      <Stats stats={statsObj} />
      <MapFull dataList={mapDataList} loadData={loadData} getParksInBounds={getParksInBounds} />
      <Text textAlign={'center'} pt={2}>&uarr; Pan and Zoom to discover &darr; </Text>
      <Carousel dataList={carouselDataList} />
    </Box>
  )
}
