
import { Box, Tag, TagCloseButton, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import FilterTagClose from "./FilterTagClose";
import SEO from "./SEO/home";

function FiltersRow({ filterColor, filterType}) {
  const displayable = filterColor || filterType;
  return (

    displayable && <Box
      w={"100%"}
      bg={useColorModeValue("gray.100", "gray.800")}
      pt={4}
      pl={4}
    >
      <Text display={'inline-block'} mr={5} fontSize="sm">Active Filters: </Text>
      {filterColor && <FilterTagClose type={'color'} value={filterColor} />}
      {filterType && <FilterTagClose type={'type'} value={filterType} />}
    </Box>
  )
}

export default function Gallery({ dataList, filterColor, filterImageType }) {
  return (
    <>
      <SEO />
      <FiltersRow filterColor={filterColor} filterType={filterImageType} />
      <Box
        padding={4}
        w="100%"
        mx="auto"
        bg={useColorModeValue("gray.100", "gray.800")}
        sx={{ columnCount: [1, 2, 3], columnGap: "1rem" }}
      >
        {
          dataList.length ? dataList.map((data, index) => (
            <Link href={`/parks/${data.slug}`} key={index}>
              <a>
                <Box
                  w="100%"
                  mb={2}
                  display="inline-block"
                >
                  <Image
                    key={index}
                    src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
                    alt={data.name || "image"}
                    layout="responsive"
                    width={data.width}
                    height={data.height}
                    sizes="33vw"
                  />
                </Box>
              </a>
            </Link>
          )) :
            <Text>No Parks matching this filter</Text>
        }
      </Box>
    </>
  );
}
