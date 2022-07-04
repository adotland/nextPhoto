import PageWrap from "../../components/PageWrap";
import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import MapFull from "../../components/MapFull";
import SEO from "../../components/SEO/general";
import { getBounds, shuffle } from "../../utils/helpers";

export async function getStaticProps() {
  const collectionList = await ff.readJson(
    "./data",
    "enabled_collections.json"
  );
  const dataObj = {};

  await Promise.all(
    collectionList.map(async (collection) => {
      const data = await ff.readJson(ff.path(`./data/${collection}_data.json`));
      dataObj[collection] = data.filter((d) => d.ext === "jpg");
    })
  );

  const initCenter = [47.6092355, -122.317784]; // seattle univ
  // smallest
  const initBounds = getBounds(...initCenter);

  const dataList = [];
  for (const collection in dataObj) {
    dataList.push(
      ...dataObj[collection]
        .filter((d) => d.filters?.live)
        .map((d) => {
          return {
            parkName: d.parkName,
            slug: d.slug,
            lat: d.lat || null,
            long: d.long || null,
            imageName: d.imageName,
            filters: d.filters,
          };
        })
    );
  }

  const heatmapData = dataList.map((data) => [
    Number(data.lat),
    Number(data.long),
  ]);

  shuffle(dataList);

  const initParksWithinBounds = dataList
    .filter((data) => {
      let withinBounds = false;
      if (
        data.lat &&
        data.lat > initBounds.south &&
        data.lat &&
        data.lat < initBounds.north &&
        data.long &&
        data.long > initBounds.west &&
        data.long &&
        data.long < initBounds.east
      ) {
        withinBounds = true;
      }
      return withinBounds;
    })
    .slice(0, 15);

  const initMapDataList = initParksWithinBounds.map((data) => {
    return {
      parkName: data.parkName,
      slug: data.slug,
      lat: data.lat || null,
      long: data.long || null,
    };
  });

  const initCarouselDataList = initParksWithinBounds.map((data) => {
    return {
      parkName: data.parkName,
      slug: data.slug,
      // lat: data.lat || null,
      // long: data.long || null,
      imageName: data.imageName,
      // width: data.width,
      // height: data.height,
      filters: data.filters,
    };
  });

  return {
    props: {
      initMapDataList,
      initCarouselDataList,
      dataList,
      heatmapData,
      initCenter,
    },
  };
}

// MapPage.getInitialProps = async (ctx) => {

// }

export default function MapPage({
  initMapDataList,
  initCarouselDataList,
  dataList,
  heatmapData,
  initCenter,
}) {
  const [carouselDataList, setCarouselDataList] =
    useState(initCarouselDataList);
  const [mapDataList, setMapDataList] = useState(initMapDataList);
  const [newParkSlug, setNewParkSlug] = useState();
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [activeMarker, setActiveMarker] = useState();

  const loadData = (data) => {
    setNewParkSlug(data);
  };

  useEffect(() => {
    const newData = dataList.filter((d) => d.slug === newParkSlug);
    if (newData.length) {
      setCarouselDataList((prevDataList) =>
        [...newData, ...prevDataList].slice(0, 15)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParkSlug]);

  const getParksInBounds = (bounds) => {
    // get every park with lat > s, lat < n, long > w, long < e
    const retval = dataList.filter((data) => {
      let withinBounds = false;
      if (
        data.lat &&
        data.lat > bounds.south &&
        data.lat &&
        data.lat < bounds.north &&
        data.long &&
        data.long > bounds.west &&
        data.long &&
        data.long < bounds.east
      ) {
        withinBounds = true;
      }
      return withinBounds;
    });
    const truncatedList = retval.slice(0, 15);
    setMapDataList(truncatedList);
    setCarouselDataList(truncatedList);
  };

  return (
    <>
      <SEO pageTitle={"Map"} />
      <PageWrap>
        <MapFull
          dataList={mapDataList}
          loadData={loadData}
          getParksInBounds={getParksInBounds}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
          activeMarker={activeMarker}
          heatmapData={heatmapData}
          initCenter={initCenter}
          initZoom={12}
        />
        <Carousel
          dataList={carouselDataList}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
          setActiveMarker={setActiveMarker}
        />
      </PageWrap>
    </>
  );
}
