import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import SEO from "../../components/SEO/park";
import RelatedImages from "../../components/RelatedImages";

export async function getStaticPaths() {
  const dataList = await ff.readJson(ff.path(process.cwd(), './cms/data/live/seattle.json'));
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
  const data = await ff.readJson(ff.path(process.cwd(), './cms/data/live/seattle.json'));
  const currentData = data.filter(d => d.slug == slug).pop();
  const related = data
    .filter(d => (d.filters.matchColor === currentData.filters.matchColor && d.slug !== currentData.slug && d.filters.live))
    .slice(0, 3);
  return {
    props: {
      currentData,
      related
    }
  };
}

export default function ({ currentData, related }) {
  return (
    <>
      <SEO data={currentData} />
      <Flex m={[0, 0, 0, 7]} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']} mt={[4, 4, 4, 4]}>
        <Box flex={1}
          minW={currentData.width > currentData.height ? "60%" : "40%"}
          maxW={currentData.width > currentData.height ? ["100%", "100%", "100%", "65%"] : ["100%", "100%", "100%", "40%"]}
        >
          <Image
            key={currentData.id}
            src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}.${currentData.ext}`}
            alt={currentData.name ?? "image"}
            layout="responsive"
            width={currentData.width}
            height={currentData.height}
            // sizes="50vw"
            priority
          />
        </Box>
        <Details data={currentData} />
      </Flex>
      <RelatedImages dataList={related} />
    </>
  )
}
