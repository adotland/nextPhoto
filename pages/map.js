import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import MapFull from "../components/MapFull";
import SEO from "../components/SEO/general";
import { shuffle } from "../utils/helpers";

export async function getStaticProps() {
  const collectionList = await ff.readJson('./cms/data/live/data', 'enabled_collections.json');
  const dataObj = {};

  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./cms/data/live/data/${collection}_data.json`))
    dataObj[collection] = data.filter(d => d.ext === 'jpg');
  }));

  // smallest 
  const initBounds = { north: 47.63694030290387, south: 47.58138923915503, east: -122.2716522216797, west: -122.3705291748047 }

  const dataList = [];
  for (const collection in dataObj) {
    dataList.push(...dataObj[collection]
      .filter(d => d.filters?.live)
      .map(d => {
        return {
          parkName: d.parkName,
          slug: d.slug,
          lat: d.lat || null,
          long: d.long || null,
          imageName: d.imageName,
          filters: d.filters
        }
      })
    )
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
      parkName: data.parkName,
      slug: data.slug,
      lat: data.lat || null,
      long: data.long || null,
    }
  });

  const initCarouselDataList = initParksWithinBounds.map(data => {
    return {
      parkName: data.parkName,
      slug: data.slug,
      // lat: data.lat || null,
      // long: data.long || null,
      imageName: data.imageName,
      // width: data.width,
      // height: data.height,
      filters: data.filters,
    }
  });

  return { props: { initMapDataList, initCarouselDataList, dataList } };
}

export default function ({ initMapDataList, initCarouselDataList, dataList }) {

  const [carouselDataList, setCarouselDataList] = useState(initCarouselDataList);
  const [mapDataList, setMapDataList] = useState(initMapDataList);
  const [newParkSlug, setNewParkSlug] = useState()
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [activeMarker, setActiveMarker] = useState()

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
    <>
      <SEO pageTitle={'Map'} />
      <Box
        mx={4}
        mt={[4, 14, 14, 4]}
      >
        {/* <Text
          textAlign={'center'}
          letterSpacing={'0.1em'}
          fontWeight={'bold'}
          pt={2}
          color={useColorModeValue("#111", "#111")}
          backgroundColor={useColorModeValue("#eee", "#777")}
          borderTop={'2px solid black'}
          borderBottom={'2px solid black'}
          pb={2}
        >&uarr; Click and Drag to discover &darr;</Text> */}
        <MapFull
          dataList={mapDataList}
          loadData={loadData}
          getParksInBounds={getParksInBounds}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
          activeMarker={activeMarker}
        />
        <Carousel
          dataList={carouselDataList}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
          setActiveMarker={setActiveMarker}
        />
      </Box>
    </>
  )
}
