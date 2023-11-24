import { Box, Heading, Text, useColorModeValue, Link as ChakraLink, UnorderedList, ListItem } from "@chakra-ui/react";
import Link from "next/link";
import P from "../components/P"

import { ff } from "fssf";
import Stats from "../components/Stats";
import SEO from "../components/SEO/general";

function getTypeAmount(type, list) {
  let amount = 0;
  list.forEach(data => {
    if (data.slug.indexOf(`${type}_`) === 0) {
      amount++;
    }
  });
  return amount;
}

function AboutLink({ text, path }) {
  return (
    <Link href={path}><a><Text color={useColorModeValue('green.700', 'green.500')} as='span'>{text}</Text></a></Link>
  )
}

export async function getStaticProps() {
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataObj = {};
  const statsObj = {
    amount: {
      all: 0
    }
  };
  await Promise.all(collectionList.map(async collection => {
    const data = await ff.readJson(ff.path(`./data/${collection}_data.json`))
    dataObj[collection] = data.filter(d => d.ext === 'jpg');
    const singleImageList = dataObj[collection];
    statsObj['amount'][collection] = singleImageList.length;
    statsObj['amount'].all += singleImageList.length;
  }));
  statsObj['amount'].port = getTypeAmount('port', dataObj['extras']);
  statsObj['amount'].extras -= statsObj['amount'].port;

  return { props: { statsObj, } };
}

export default function About({ statsObj }) {
  return (
    <Box
      mx={[4, 4, 4, 24]}>
      <SEO pageTitle={'About'} />
      <Box
        mt={[4, 14, 14, 4]}
      >
        <Stats stats={statsObj} />
      </Box>
      <Box mt={2} ml={4}>
        <Heading as={'h2'} fontSize={'1rem'} >Why</Heading>
      </Box>
      <Box as="section" className="content" my={30} mx={'auto'} maxW={["90%", "90%", "90%", "75%"]}>
        <P>In 2020, as a way to get exercise and explore the city, I decided to ride a bicycle to every park in Seattle. I was surprised to find there was over four hundred.</P>

        <P>{`I wasn't used to riding often or over distances, so having the parks as motivation to go somewhere outdoors with fresh air and nature during the pandemic's lockdown was what worked for me. As you can see, most of the rides were done on a "Walmart bike", so equipment was not a barrier to entry. I also started off a little heavier, ended the quest a little lighter.`}</P>

        <P>Along the way, I learned about the alternatives to parks, like P-Patches, which were often inside the parks, so I also rode my bike to every standalone <AboutLink text='P-Patch' path='/collection/p-patch' />.</P>

        <P>I also covered parks not operated by the city: </P>

        <UnorderedList mb={2}>
          <ListItem><AboutLink text='Port of Seattle owned parks' path='/collection/extras' /></ListItem>
          <ListItem><AboutLink text='Seattle Public Utilities owned parks' path='/collection/extras' /></ListItem>
          <ListItem><AboutLink text='Mercer Island' path='/collection/mercer' /></ListItem>
        </UnorderedList>

        <P>...along with a few extra parks from <AboutLink text='King County' path='/collection/county' />, and a few other cities.</P>

        <P>After completing this challenge, I was down three bikes: one sold, one traded, and one stolen. However, my health and knowledge of the city were greatly improved and I felt much closer to being a Seattlelite. This blog is about the <AboutLink text='experience' path='/map' />, and to provide some information, thoughts, and opinions on the connections between parks, bikes, and communities.</P>

      </Box>
      <Box mt={2} pl={4} pt={2} borderTop={'1px solid'} borderColor={'chakra-border-color'}>
        <Heading as={'h2'} fontSize={'1rem'} >How</Heading>
      </Box>

      <Box as="section" className="how" my={30} mx={'auto'} maxW={["90%", "90%", "90%", "75%"]}>
        <Heading as={'h3'} fontSize={'medium'} mb={4}>Tools used to find bikeable routes:</Heading>
        <UnorderedList>
          <ListItem><ChakraLink href={'https://www.komoot.com/plan'} target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>Komoot Route Planner</ChakraLink></ListItem>
          <ListItem><ChakraLink href={'https://web6.seattle.gov/travelers/'} target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>SDOT</ChakraLink> for up to date road closures</ListItem>
          <ListItem><ChakraLink href={'https://maps.google.com/'} target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>Goole Maps</ChakraLink> with biking layer and imaging (--not recommended--)</ListItem>
          <ListItem><ChakraLink href={'https://twitter.com/SeattleParks'} target={'_blank'} color={useColorModeValue('green.700', 'green.500')}>Seattle Parks Twitter</ChakraLink> for park event info</ListItem>
        </UnorderedList>
      </Box>

    </Box >
  )
}
