import PageWrap from "../../components/PageWrap";
import { ff } from "fssf";
import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import MapFull from "../../components/MapFull";
import SEO from "../../components/SEO/general";
import { getBounds, shuffle, findParksInBounds } from "../../utils/helpers";

export async function getStaticPaths() {
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./data/${collection}_data.json`))))).flat();
  const displayable = dataList.filter(data => data.filters.live).map(data => {
    return {
      params: { slug: data.slug }
    }
  })
  return {
    paths: displayable,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  slug = slug.replace('-anim', '');
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataObj = {};

  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./data/${collection}_data.json`))
    dataObj[collection] = data.filter(d => d.ext === 'jpg');
  }));

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

  const currentData = dataList.filter(d => d.slug == slug).pop();
  const initCenter = [currentData.lat, currentData.long];
  const initZoom = 16;
  const initBounds = getBounds(...initCenter, initZoom);

  const heatmapData = dataList.map(data => [Number(data.lat), Number(data.long)]);

  shuffle(dataList);

  const initParksWithinBounds = findParksInBounds(dataList, initBounds, 15)

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

  return { props: { initMapDataList, initCarouselDataList, dataList, heatmapData, initCenter } };
}

export default function MapPage({ initMapDataList, initCarouselDataList, dataList, heatmapData, initCenter }) {

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
    const parksInBounds = findParksInBounds(dataList, bounds, 15)
    setMapDataList(parksInBounds)
    setCarouselDataList(parksInBounds)
  }

  return (
    <>
      <SEO pageTitle={'Map'} />
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
          initZoom={16}
        />
        <Carousel
          dataList={carouselDataList}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
          setActiveMarker={setActiveMarker}
        />
      </PageWrap>
    </>
  )
}
