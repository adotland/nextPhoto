import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import SEO from "../../components/SEO/park";
import RelatedImages from "../../components/RelatedImages";
import { byWeight } from "../../utils/helpers";

export async function getStaticPaths() {
  const collectionList = ['seattle', 'non-city', 'mercer'];
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))))).flat();
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
  const collectionList = ['seattle', 'non-city', 'mercer'];
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))))).flat();
  const currentData = dataList.filter(d => d.slug == slug).pop();
  let related = dataList
    .filter(d => (d.filters.matchColor === currentData.filters.matchColor && d.slug !== currentData.slug && d.filters.live))
    // .filter(d => (d.filters.matchColor === currentData.filters.matchColor && d.slug !== currentData.slug))
  related = related.sort(byWeight).slice(0,3);
  return {
    props: {
      currentData,
      related
    }
  };
}

export default function ({ currentData, related }) {
  const ext = currentData.imageName.split('.').pop();
  // const ext = 'webp'
  return (
    <>
      <SEO data={currentData} />
      <Flex m={[0, 0, 0, 7]} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']} mt={[4, 4, 4, 4]}>
        <Box flex={1}
          minW={currentData.width > currentData.height ? "60%" : "40%"}
          maxW={currentData.width > currentData.height ? ["100%", "100%", "100%", "65%"] : ["100%", "100%", "100%", "40%"]}
        >
          {ext === 'webp' ?
          <Box maxW={478} mx={'auto'}>
            <Image
              key={currentData.id}
              src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}`}
              alt={currentData.name ?? "image"}
              layout="responsive"
              width={currentData.width}
              height={currentData.height}
              priority
            /></Box>
            :
            <Image
              key={currentData.id}
              src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}`}
              alt={currentData.name ?? "image"}
              layout="responsive"
              width={currentData.width}
              height={currentData.height}
              // sizes="50vw"
              priority
            />
          }
        </Box>
        <Details data={currentData} />
      </Flex>
      <RelatedImages dataList={related} />
    </>
  )
}
