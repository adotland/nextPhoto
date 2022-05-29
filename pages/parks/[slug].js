import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import SEO from "../../components/SEO/park";

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
  return { props: { dataList: data.filter(d => d.slug == slug) } };
}

export default function ({ dataList }) {
  const data = dataList[0];
  return (
    <>
      <SEO data={data} />
      <Flex m={[0, 0, 0, 7]} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']} mt={[4,4,4,4]}>
        <Box flex={1}
          minW={data.width > data.height ? "60%" : "40%"}
          maxW={data.width > data.height ? ["100%", "100%", "100%", "65%"] : ["100%", "100%", "100%", "40%"]}
        >
          <Image
            key={data.id}
            src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}.${data.ext}`}
            alt={data.name ?? "image"}
            layout="responsive"
            width={data.width}
            height={data.height}
            // sizes="50vw"
            priority
          />
        </Box>
        <Details data={data} />
      </Flex>
    </>
  )
}
