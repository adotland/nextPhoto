import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import PageWrap from "../../components/PageWrap";
import SEO from "../../components/SEO/general";
import P from "../../components/P";
import Image from "next/image";
import { shimmer, toBase64 } from "../../utils/helpers";


export async function getStaticProps() {

  return { props: {} };
}


export default function MericaCarsBikeLanes({ }) {

  return (
    <>
      <SEO pageTitle={'Seattle Park Data Map - Health'} />
      <PageWrap>
        <Flex flexDir={'column'} mt={5} mb={8} align={'center'}>
          <Flex flexDir={'column'} maxW={['100%', '100%', '100%', '75%']}>
            <Heading mb={4}>&apos;Merica, Cars, Bikes, and Lanes</Heading>

            <Box boxShadow={"lg"} maxW={['400']}>
              <Image
                src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/4th_of_july_21.JPG`}
                alt={"image of bicycle next to car with Merica painted on it"}
                layout="responsive"
                width={3419}
                height={2564}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(3419, 2564)
                )}`}
                priority
              />
            </Box>
            <Box fontSize={'sm'} mt={2} mb={2}>(photo taken 2021/07/04)</Box>

            <P>I&apos;m making this post with an old picture because I was recently hit by a car, and I&apos;m currently relegated to walking (and fortunate that I can even do that). For me, this image brings to mind at least a couple things: mainly this country&apos;s car-centric identity, and the passage of time.</P>

            <P>Designing a city to prioritize ease of non-car traffic encourages fewer cars on the road, leading to a better experience for both drivers and pedestrians. A parallel can be drawn to website design, where keeping accessibility in mind results in a better user experience for all users. Designing solely for the average car driver, or for the average user, not only alienates everyone else, but also leads to shortsighted and potentially worse solutions for everyone.</P>

            <P>Of course, this takes time, and relatively more work. Seattle is improving cycling infrastructure by adding fully protected bike lanes. However, we cyclists still have to ride in streets with the knowledge that they were designed solely for cars. Anything else is an afterthought, and certainly not a priority.  But just imagine if we collectively took more cues from how Amsterdam solved this problem and further acknowledged the growing number of people choosing to commute by bicycle.</P>

            <P>To my knowledge, there is no type of path in the city where a bicycle is the only expected form of transportation. Pedestrians are commonly found in bike lanes, and we even find the occasional car in one.</P>

            <P>I would advocate for solutions that separate car traffic from bicycle traffic entirely. I have no desire to share the road any more than car drivers themselves want to share it with me.</P>

            <P>Give us peace of mind, and keep us in one piece.</P>
          </Flex>
        </Flex>
      </PageWrap>
    </>
  )
}
