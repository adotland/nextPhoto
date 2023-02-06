import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { ff } from "fssf";
import Link from "next/link";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import PageWrap from "../../components/PageWrap";
import SEO from "../../components/SEO/general";
import RouteFilter from "../../components/RouteFilter";
import styles from "./RouteList.module.css";

async function getAllParksData() {
  const collectionList = await ff.readJson(
    "./data",
    "enabled_collections.json"
  );
  const dataList = (
    await Promise.all(
      collectionList.map(async (collection) =>
        await ff.readJson(ff.path(`./data/${collection}_data.json`))
      )
    )
  ).flat();
  return dataList;
}

export async function getStaticProps() {
  const routeDataListInput = await ff.readJson('./data', 'routes.json');
  const allParks = await getAllParksData();
  const hoodFilterSet = new Set();

  const routeDataList = routeDataListInput.map(routeData => {
    // get hood filters
    routeData.hoodNameList.forEach(hood => hoodFilterSet.add(hood));
    // get cover images
    const twoParks = [routeData.parkList[0]?.slug, routeData.parkList.slice(-1)[0]?.slug];
    const imageList = [];
    const image_1 = allParks.find(d => d.slug === twoParks[0]);
    imageList.push(image_1 ? image_1.imageName : null);
    const image_2 = allParks.find(d => d.slug === twoParks[1]);
    imageList.push(image_2 ? image_2.imageName : null);
    return {
      ...routeData,
      imageList
    }
  });

  const filters = {
    hood: Array.from(hoodFilterSet)
  }

  return {
    props: {
      routeDataList,
      filters
    }
  }
}

function RouteContainer({ children }) {
  return (
    <Flex wrap={'wrap'} justifyContent={'center'}>{children}</Flex>
  )
}

function RouteCard({
  data
}) {
  return (
    <Link href={`/routes/${data.slug}`}>
      <a>
        <Box className={styles.grow} bgSize={'cover'} width="303px" height={'133px'} rounded={'lg'} m={5} backgroundImage={`url('/_next/image?url=https%3A%2F%2Ftheparkandthebike.s3.us-west-2.amazonaws.com%2F${data.imageList[0]}&w=384&q=75')`}>
          <Box
            p={'10px'}
            roundedTop={'lg'}
            backgroundColor={useColorModeValue("whiteAlpha.900", "blackAlpha.600")}
            fontWeight={'bold'}
          >{data.name}</Box>
        </Box>
      </a>
    </Link>
  )
}

export default function RouteListPage({
  routeDataList,
  filters
}) {
  const [filteredRouteDataList, setFilteredRouteDataList] = useState(routeDataList)
  return (
    <>
      <SEO pageTitle={"Route List"} />
      <PageWrap>
        <Flex flexDir={'column'} mt={5} mb={8} alignItems={'center'}>
          <Flex flexDir={'column'} maxW={['100%', '100%', '100%', '75%']} alignItems={'center'} textAlign={'center'}>
            <Heading mb={4}>Park Routes</Heading>
            <Text mb={4}>{`Each of these routes will take to you several parks in Seattle. They are based on the routes I originally took, but are replanned and improved. If you complete all of the routes, you will have gone to every park and P-Patch in the city! Routes vary in length and difficulty, but most are short tours of parks that are close to each other. Try incorporating them into an existing ride! The shorter ones also work well as run or walk routes.`}
            </Text>
            <Text as={'div'} fontWeight={'bold'} mb={4}>{`After you complete a route, feel free to share on social media with the tag #theparkandthebike, and if you like, follow on `}
              <a
                href="https://instagram.com/theparkandthebike"
                title="instagram"
                target={"_blank"}
                rel="noreferrer"
                style={{ display: 'inline-block', margin: '5px', borderBottom: '2px solid' }}
              >
                <span style={{ display: 'inline-block', marginRight: '5px' }}>
                  <BsInstagram />
                </span>
                Instagram!
              </a>
            </Text>
            <RouteFilter
              routeDataList={routeDataList}
              setFilteredRouteDataList={setFilteredRouteDataList}
              filters={filters} />
            <RouteContainer>
              {
                filteredRouteDataList.length && filteredRouteDataList.map(data => <RouteCard data={data} key={data.name} />)
              }
            </RouteContainer>
            <Box my={5} fontSize={'lg'}>more coming soon!</Box>
          </Flex>
        </Flex>
      </PageWrap>
    </>
  )
}
