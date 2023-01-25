import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import MapGpx from "../../components/MapGpx";
import SEO from "../../components/SEO/general";
import { getBounds, findParksInBounds, meterToMile, getCentroid2 } from "../../utils/helpers";
import GpxParser from "gpxparser";
import RouteDetails from "../../components/MapGpx/RouteDetails";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import clientPromise from '../../lib/mongodb'

const INITIAL_ZOOM = 14;

async function getAllParksData() {
  const collectionList = await ff.readJson(
    "./data",
    "enabled_collections.json"
  );
  const dataList = (
    await Promise.all(
      collectionList.map(async (collection) =>
        ff.readJson(ff.path(`./data/${collection}_data.json`))
      )
    )
  ).flat();
  return dataList;
}

export async function getServerSideProps({ params: { slug } }) {
  // get data
  const data = (await ff.readJson('./data', 'routes.json')).filter(d => d.slug === slug)[0];
  // get gpx data
  const gpxData = await ff.read('./data/gpx', `${data.gpxFile}`);
  // get park data
  const allParks = await getAllParksData();
  const parkList = allParks.filter(p => data.parkList.includes(p.slug));

  // get route data
  var gpx = new GpxParser();
  gpx.parse(gpxData);
  const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
  const initCenter = getCentroid2(positions);
  let initialLikeCount = 0;
  try {
    const client = await clientPromise;
    console.log('is connected')
    const db = client.db(process.env.MONGODB_DBNAME);
    initialLikeCount = (await db.collection('likes').findOne({slug})).count;
    if (isNaN(initialLikeCount)) initialLikeCount = 0;
    if (!initialLikeCount) initialLikeCount = 0;
  } catch (err) {
    console.log(err)
  }


  const routeData = {
    positions: gpx.tracks[0].points.map(p => [p.lat, p.lon]),
    initZoom: INITIAL_ZOOM,
    initCenter,
    initBounds: getBounds(...initCenter, INITIAL_ZOOM),
  };

  const routeDetails = {
    distance: meterToMile(gpx.tracks[0].distance.total),
    elevation: gpx.tracks[0].elevation,
    routeName: data.name,
    gpxFileLocation: data.gpxFileLocation ?? '',
    parkNameList: parkList.map(p => p.parkName),
    slug: data.slug,
    initialLikeCount: initialLikeCount
  };

  const initMapDataList = parkList

  const initCarouselDataList = initMapDataList.map(data => {
    return {
      parkName: data.parkName,
      slug: data.slug,
      // lat: data.lat || null,
      // long: data.long || null,
      imageName: data.imageName,
      // width: data.width,
      // height: data.height,
      filters: data.filters,
      collection: data.collection,
    }
  });

  return { props: { initMapDataList, initCarouselDataList, parkList, routeData, routeDetails } };
}


export default function MapRoutePage({ initMapDataList, initCarouselDataList, parkList, routeData, routeDetails }) {

  const [carouselDataList, setCarouselDataList] = useState(initCarouselDataList);
  const [mapDataList, setMapDataList] = useState(initMapDataList);
  const [newParkSlug, setNewParkSlug] = useState()
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [activeMarker, setActiveMarker] = useState()

  const loadData = (data) => {
    setNewParkSlug(data)
  }

  useEffect(() => {
    const newData = parkList.filter(d => d.slug === newParkSlug)
    if (newData.length) {
      setCarouselDataList(prevDataList => [...newData, ...prevDataList].slice(0, 15));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParkSlug])

  const getParksInBounds = (bounds) => {
    // get every park with lat > s, lat < n, long > w, long < e
    const parksInBounds = findParksInBounds(parkList, bounds, 15)
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
