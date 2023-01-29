import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import MapGpx from "../../components/MapGpx";
import SEO from "../../components/SEO/general";
import { findParksInBounds } from "../../utils/helpers";
import RouteDetails from "../../components/MapGpx/RouteDetails";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import clientPromise from '../../lib/mongodb'
import config from "../../config";

export async function getServerSideProps({ params: { slug } }) {
  // get data
  const api_url = config.endpoints.api
  const response = await fetch(`${api_url}/api/routes?slug=${slug}`);
  const data = await response.json();

  // get route data
  let initialLikeCount = 0;
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const dbResponse = (await db.collection('likes').findOne({ slug }));
    initialLikeCount = dbResponse?.count ?? 0;
    if (isNaN(initialLikeCount)) initialLikeCount = 0;
    if (!initialLikeCount) initialLikeCount = 0;
  } catch (err) {
    console.error(err)
  }


  const routeDetails = {
    distance: data.routeData?.distance,
    elevation: data.routeData?.elevation,
    routeName: data.name ?? '',
    parkList: data.parkList ?? [],
    slug: data.slug ?? '',
    initialLikeCount: initialLikeCount ?? 0,
    links: data.links,
  };

  const initMapDataList = data.parkDataList

  const initCarouselDataList = initMapDataList.map(data => {
    return {
      parkName: data.parkName,
      slug: data.slug,
      imageName: data.imageName,
      filters: data.filters,
      collection: data.collection,
    }
  });

  return { props: { initCarouselDataList, parkDataList: data.parkDataList, routeData: data.routeData, routeDetails } };
}


export default function MapRoutePage({ initCarouselDataList, parkDataList, routeData, routeDetails }) {

  const [carouselDataList, setCarouselDataList] = useState(initCarouselDataList);
  const [mapDataList, setMapDataList] = useState(parkDataList);
  const [newParkSlug, setNewParkSlug] = useState()
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [activeMarker, setActiveMarker] = useState()

  const loadData = (data) => {
    setNewParkSlug(data)
  }

  useEffect(() => {
    const newData = parkDataList.filter(d => d.slug === newParkSlug)
    if (newData.length) {
      setCarouselDataList(prevDataList => [...newData, ...prevDataList].slice(0, 15));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParkSlug])

  const getParksInBounds = (bounds) => {
    // get every park with lat > s, lat < n, long > w, long < e
    const parksInBounds = findParksInBounds(parkDataList, bounds, 15)
    setMapDataList(parksInBounds)
    setCarouselDataList(parksInBounds)
  }


  const width = 866;
  const height = 635;


  return (
    <>
      <SEO pageTitle={`Route - ${routeDetails.routeName}`} isMap={true} />
      <Box
        bgGradient={useColorModeValue("linear(to-b, gray.100, transparent)", "linear(to-b, blackAlpha.300, transparent)")}
        padding={[0, 0, 0, '33px']}
        boxShadow={'rgb(0 0 0 / 17%) inset 0px 0px 4px -2px'}
      >
        <Flex
          m={[0, 0, 0, 7]}
          justifyContent={"space-evenly"}
          flexDir={["column", "column", "column", "row"]}
          mt={[4, 4, 16, 4]}
        >
          <Box
            flex={1}
            minW={width > height ? "60%" : "40%"}
            maxW={
              width > height
                ? ["100%", "100%", "100%", "65%"]
                : ["100%", "100%", "100%", "40%"]
            }
          >
            <MapGpx
              dataList={mapDataList}
              loadData={loadData}
              getParksInBounds={getParksInBounds}
              activeCarouselItem={activeCarouselItem}
              setActiveCarouselItem={setActiveCarouselItem}
              activeMarker={activeMarker}
              routeData={routeData}
            />
          </Box>
          <RouteDetails
            data={routeDetails}
            textAlign={["center", "center", "center", "left"]}
            lineHeight={10}
            mt={["2em", "1.5em", "1em", 0]}
            ml={[0, 0, 0, 10]}
            minW="20rem"
            width={["100%", "100%", "100%", "40rem"]}
          />
        </Flex>
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
