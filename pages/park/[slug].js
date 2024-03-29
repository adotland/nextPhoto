import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import SEO from "../../components/SEO/park";
import RelatedImages from "../../components/RelatedImages";
import { byWeight, shimmer, shuffle, toBase64 } from "../../utils/helpers";
import ImageVersionLink from "../../components/ImageVersionLink";

export async function getStaticPaths() {
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
  const displayable = dataList
    .filter((data) => data.filters.live)
    .map((data) => {
      // const displayable = dataList.map(data => {
      return {
        params: { slug: data.slug },
      };
    });
  return {
    paths: displayable,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
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
  const currentData = dataList.filter((d) => d.slug == slug).pop();
  let related = dataList.filter(
    (d) =>
      d.filters.matchColor === currentData.filters.matchColor &&
      d.slug !== currentData.slug &&
      d.filters.live &&
      d.ext === "jpg" &&
      d.height < d.width &&
      d.filters.weight > 1
  );
  related = shuffle(related.sort(byWeight)).slice(0, 3);
  return {
    props: {
      currentData,
      related,
    },
  };
}

export default function ParkSlug({ currentData, related }) {
  return (
    <>
      <SEO data={currentData} />
      <Flex
        justifyContent={"space-evenly"}
        flexDir={["column", "column", "column", "row"]}
        bgGradient={useColorModeValue("linear(to-b, gray.100, transparent)", "linear(to-b, blackAlpha.300, transparent)")}
        padding={[0, 0, 0, '33px']}
        boxShadow={'rgb(0 0 0 / 17%) inset 0px 2px 4px -2px'}
      >
        <Box
          flex={1}
          minW={currentData.width > currentData.height ? "60%" : "40%"}
          maxW={
            currentData.width > currentData.height
              ? ["100%", "100%", "100%", "65%"]
              : ["100%", "100%", "100%", "40%"]
          }
        >
          {currentData.ext === "webp" ? (
            <Box boxShadow={"lg"} maxW={currentData.width} minW={320} mx="auto">
              <video
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                style={{ width: "100%", maxHeight: "100%" }}
              >
                <source
                  src={`https://${
                    process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN
                  }/video/${currentData.imageName.replace("webp", "mp4")}`}
                  type="video/mp4"
                />
                <source
                  src={`https://${
                    process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN
                  }/video/${currentData.imageName.replace("webp", "webm")}`}
                  type='video/webm; codecs="vp9, vorbis"'
                />
              </video>
            </Box>
          ) : (
            <Box boxShadow={"lg"}>
              <Image
                key={currentData.id}
                src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${currentData.imageName}`}
                alt={currentData.parkName ?? "image"}
                layout="responsive"
                width={currentData.width}
                height={currentData.height}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(currentData.width, currentData.height)
                )}`}
                priority
              />
            </Box>
          )}
        </Box>
        <Details
          data={currentData}
          textAlign={["center", "center", "center", "left"]}
          lineHeight={10}
          mt={["2em", "1.5em", "1em", 0]}
          ml={[0, 0, 0, 10]}
          minW="20rem"
          width={["100%", "100%", "100%", "40rem"]}
        />
      </Flex>
      {currentData.ext === "jpg" && currentData.hasAnim && (
        <ImageVersionLink slug={currentData.slug} type={"animated"} />
      )}
      {currentData.ext === "webp" && currentData.hasAnim && (
        <ImageVersionLink slug={currentData.slug} type={"still"} />
      )}
      <RelatedImages dataList={related} />
    </>
  );
}
