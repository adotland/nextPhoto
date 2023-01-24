import { Box, Flex, Heading, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { ff } from "fssf";
import Link from "next/link";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import PageWrap from "../../components/PageWrap";
import SEO from "../../components/SEO/general";
import { Link as ChakraLink } from "@chakra-ui/react";
import styles from "./RouteList.module.css";

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

export async function getStaticProps() {
  // get list of routes
  const routeDataList = await ff.readJson('./data', 'routes.json');

  // get park data
  const allParks = await getAllParksData();
  // const parkList = allParks.filter(p => data.parkList.includes(p.slug));

  const dataList = routeDataList.map(routeData => {
    const twoParks = [routeData.parkList[0], routeData.parkList.slice(-1)[0]];
    const imageList = [];
    const image_1 = allParks.find(d => d.slug === twoParks[0]);
    imageList.push(image_1 ? image_1.imageName : null)
    const image_2 = allParks.find(d => d.slug === twoParks[1]);
    imageList.push(image_2 ? image_2.imageName : null)
    return {
      ...routeData,
      imageList
    }
  });

  return {
    props: {
      dataList
    }
  }

}

function RouteFilters({
  data,
  setData
}) {

}

function RouteContainer({ children }) {
  return (
    <Flex wrap={'wrap'} justifyContent={'space-between'}>{children}</Flex>
  )
}

function RouteCard({
  data
}) {
  return (
    <Link href={`/routes/${data.slug}`}>
      <a>
        <Box className={styles.grow} bgSize={'cover'} width="303px" height={'133px'} rounded={'lg'} m={2} backgroundImage={`url('/_next/image?url=https%3A%2F%2Ftheparkandthebike.s3.us-west-2.amazonaws.com%2F${data.imageList[0]}&w=384&q=75')`}>
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
  dataList
}) {
  const [filteredList, setFilteredList] = useState(dataList)
  return (
    <>
      <SEO pageTitle={"Route List"} />
      <PageWrap>
        <Flex flexDir={'column'} mt={5} mb={8} alignItems={'center'}>
          <Flex flexDir={'column'} maxW={['100%', '100%', '100%', '75%']} alignItems={'center'} textAlign={'center'}>
            <Heading mb={4}>Park Routes</Heading>
            <Text mb={4}>{`Each of these routes will take to you several parks in Seattle. If you complete all of the routes, you will have gone to every park and P-Patch in the city! Routes vary in length and difficulty, but most are short tours of parks that are close to each other. For this reason, I suggest incorporating them into an existing ride. The shorter ones also work well as run or walk routes.`}
            </Text>
            {/* <Flex mb={4}> */}
            <Text as={'div'} fontWeight={'bold'} mb={4}>{`After you complete a route, feel free to share on social media with the tag #theparkandthebike, and if you like, follow us on `}
              <a
                href="https://instagram.com/theparkandthebike"
                title="instagram"
                target={"_blank"}
                rel="noreferrer"
                style={{display: 'inline-block', margin: '5px', borderBottom: '2px solid'}}
              >
                <span style={{ display: 'inline-block', marginRight: '5px' }}>
                  <BsInstagram />
                </span>
                Instagram!
              </a>
            </Text>
            <RouteFilters data={filteredList} setData={setFilteredList} />
            <RouteContainer>
              {
                filteredList.length && filteredList.map(data => <RouteCard data={data} key={data.name} />)
              }
            </RouteContainer>
          </Flex>
        </Flex>
      </PageWrap>
    </>
  )
}
