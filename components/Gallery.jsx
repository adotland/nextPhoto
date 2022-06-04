
import { Box, Tag, TagCloseButton, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "../utils/helpers";
import FilterTagClose from "./FilterTagClose";
import SEO from "./SEO/home";
// import useDimensions from "react-cool-dimensions";


function FiltersRow({ filterColor, filterType}) {
  const displayable = filterColor || filterType;
  return (

    displayable && <Box
      w={"100%"}
      bg={useColorModeValue("gray.100", "#191a1a")}
      pt={4}
      pl={4}
    >
      <Text display={'inline-block'} mr={5} fontSize="sm" fontFamily={'Open sans'}>Active Filters: </Text>
      {filterColor && <FilterTagClose type={'color'} value={filterColor} />}
      {filterType && <FilterTagClose type={'type'} value={filterType} />}
    </Box>
  )
}

export default function Gallery({ dataList, filterColor, filterImageType }) {

  // const { observe, unobserve, width, height, entry } = useDimensions({
  //   onResize: ({ observe, unobserve, width, height, entry }) => {
  //     // Triggered whenever the size of the target is changed...
  
  //     unobserve(); // To stop observing the current target element
  //     observe(); // To re-start observing the current target element
  //   },
  // });

  return (
    <>
      <SEO />
      <FiltersRow filterColor={filterColor} filterType={filterImageType} />
      <Box
        padding={4}
        w="100%"
        mx="auto"
        bg={useColorModeValue("gray.100", "#191a1a")}
        sx={{ columnCount: [1, 2, 3], columnGap: "1rem" }}
      >
        {
          dataList.length ? dataList.map((data, index) => (
            <Link href={`/park/${data.slug}`} key={index}>
              <a>
                <Box
                  w="100%"
                  mb={2}
                  display="inline-block"
                  // ref={observe}
                >
                  <Image
                    key={index}
                    src={data.ext === 'jpg' ? 
                    `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}` :
                    `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/t_${data.imageName}`
                  }
                    alt={data.name || "image"}
                    layout="responsive"
                    width={data.width}
                    height={data.height}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(data.width, data.height))}`}
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
