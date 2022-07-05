import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import SEO from "../../components/SEO/park";
import RelatedImages from "../../components/RelatedImages";
import { byWeight, shimmer, shuffle, toBase64 } from "../../utils/helpers";
import ImageVersionLink from "../../components/ImageVersionLink";

export async function getStaticPaths() {
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./data/${collection}_data.json`))))).flat();
  const displayable = dataList.filter(data => data.filters.live).map(data => {
    // const displayable = dataList.map(data => {
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
  const collectionList = await ff.readJson('./data', 'enabled_collections.json');
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./data/${collection}_data.json`))))).flat();
  const currentData = dataList.filter(d => d.slug == slug).pop();
  let related = dataList
    .filter(d => (d.filters.matchColor === currentData.filters.matchColor && d.slug !== currentData.slug && d.filters.live && d.ext === 'jpg' && ((d.height < d.width) && (d.filters.weight > 1))))
  related = shuffle(related.sort(byWeight)).slice(0, 3);
  return {
    props: {
      currentData,
      related
    }
  };
}


export default function ParkSlug({ currentData, related }) {
  return (
    <>
      <SEO data={currentData} />
      <Flex m={[0, 0, 0, 7]} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']} mt={[4, 4, 16, 4]}>
        <Box flex={1}
          minW={currentData.width > currentData.height ? "60%" : "40%"}
          maxW={currentData.width > currentData.height ? ["100%", "100%", "100%", "65%"] : ["100%", "100%", "100%", "40%"]}
        >
          {currentData.ext === 'webp' ?
            <Box boxShadow={'lg'}>
              <Image
                key={currentData.id}
                src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}`}
                alt={currentData.parkName ?? "image"}
                layout="responsive"
                width={currentData.width}
                height={currentData.height}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(currentData.width, currentData.height))}`}
                priority
              />
            </Box>
            :
            <Box boxShadow={'lg'}>
              {/* <Box style={{boxShadow: `0px 0px 3px 0px ${currentData.filters.domColor}`}}> */}
              <Image
                key={currentData.id}
                src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}`}
                alt={currentData.parkName ?? "image"}
                layout="responsive"
                width={currentData.width}
                height={currentData.height}
                // sizes="50vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(currentData.width, currentData.height))}`}
                priority
              />
            </Box>
          }
        </Box>
        <Details
          data={currentData}
          textAlign={['center', 'center', 'center', 'left']}
          lineHeight={10}
          mt={["2em", "1.5em", "1em", 0]}
          ml={[0, 0, 0, 10]}
          minW="20rem"
          // maxW={["100%", "100%", "100%", "40rem"]}
          width={["100%", "100%", "100%", "40rem"]}
        />
      </Flex>
      {currentData.ext === 'jpg' && currentData.hasAnim && <ImageVersionLink slug={currentData.slug} type={'animated'} />}
      {currentData.ext === 'webp' && currentData.hasAnim && <ImageVersionLink slug={currentData.slug} type={'still'} />}
      <RelatedImages dataList={related} />
    </>
  )
}
