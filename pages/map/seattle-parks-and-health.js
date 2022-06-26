import { Box, Flex, Heading, Link, ListItem, Text, UnorderedList, useColorModeValue } from "@chakra-ui/react";
import { ff } from "fssf";
import MapExp from "../../components/MapExp";
import PageWrap from "../../components/PageWrap";
import SEO from "../../components/SEO/general";

export async function getStaticProps() {
  //TODO MERGE
  // const data_geo_tpatb = await ff.readJson('./cms/data/base/data/censusDataParks.geojson');
  // const data_geo_demog = await ff.readJson('./cms/data/base/data/tmp_RASECI.geojson');

  let data = await fetch('https://theparkandthebike.s3.us-west-2.amazonaws.com/data/censusDataParks.geojson');
  const data_geo_tpatb = await data.json();
  data = await fetch('https://theparkandthebike.s3.us-west-2.amazonaws.com/data/tmp_RASECI.geojson');
  const data_geo_demog = await data.json();

  const collectionList = ['seattle', 'p-patch']
  const dataObj = {};

  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./data/${collection}_data.json`))
    dataObj[collection] = data
      .filter(d => d.ext === 'jpg')
      .map(d => {
        return {
          parkName: d.parkName,
          slug: d.slug,
          lat: d.lat,
          long: d.long,
        }
      })
  }));
  return { props: { data_geo_demog, data_geo_tpatb, seattleParks: dataObj.seattle, pPatchParks: dataObj['p-patch'] } };
}

export default function ({ data_geo_demog, data_geo_tpatb, seattleParks, pPatchParks }) {

  return (
    <>
      <SEO pageTitle={'Seattle Park Data Map'} />
      <PageWrap>
        <Flex flexDir={'column'} mt={5} mb={8}>
          <Flex flexDir={'column'} maxW={['100%', '100%', '100%', '75%']}>
            <Heading mb={4}>Parks and Health in Seattle</Heading>
            <Text>
              Is there a connection between a Seattle neighborhood's health and ease of access to recreational space? That was the initial purpose for creating this map, and the results seem mixed. There appears to arguably be some small connection, but it is largely dwarfed by the correlation between health and socioeconomic circumstances. Initially the focus was on physical health, but studies have also been done to <Link href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4049158/' target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>link park proximity to mental health</Link>, so I've included mental health data in the map as well.
            </Text>
          </Flex>
        </Flex>

        <MapExp
          data_geo_demog={data_geo_demog}
          // data_geo_census={data_geo_census}
          data_geo_park={data_geo_tpatb}
          seattleParks={seattleParks}
          pPatchParks={pPatchParks}
        />

        <Box mt={10}><Heading fontSize={'larger'}>Disclaimer</Heading><Text fontSize={'smaller'}>This is a work in progress. Park data on this map only inlcludes City owned parks and P-Patches, and does not yet include neighborhood and privately operated parks, individual small parks along the coasts of Lake Union, Lake Washington, etc. Demographics data is from a Seattle study conducted over 2011-2015, while census tracts data and park data is from 2020. It should also be said that <strong>correlation does not always imply causation</strong>. For any questions or if you would like to expand on this, please contact via twitter link below.</Text>
          <Text mt={4}>*Sources: </Text><UnorderedList><ListItem><Link href="https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::racial-and-social-equity-composite-index/about" target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>Demographics</Link></ListItem>
            <ListItem><Link href="https://data-seattlecitygis.opendata.arcgis.com/maps/SeattleCityGIS::seattle-parks/explore?location=47.546802%2C-122.287895%2C12.00" target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>Parks</Link></ListItem>
          </UnorderedList>
        </Box>
      </PageWrap>
    </>
  )
}
