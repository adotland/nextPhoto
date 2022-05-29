
import { Box, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import SEO from "./SEO/home";

export default function Gallery({ dataList, filterColor }) {
  return (
    <>
      <SEO />
      <Box
        padding={4}
        w="100%"
        mx="auto"
        bg={useColorModeValue("gray.100", "gray.800")}
        sx={{ columnCount: [1, 2, 3], columnGap: "1rem" }}
      >
        {filterColor && <Tag bg={useColorModeValue('blackAlpha.400' ,'whiteAlpha.700')} color='gray.900' mb={7} border='2px' borderColor={filterColor}>{filterColor}</Tag>}
        {
          dataList.length ? dataList.map((data, index) => (
            (data.filters.live &&
              <Link href={`/parks/${data.slug}`} key={index}>
                <a>
                  <Box
                    w="100%"
                    mb={2}
                    display="inline-block"
                  >
                    <Image
                      key={index}
                      src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}.${data.ext}`}
                      alt={data.name || "image"}
                      layout="responsive"
                      width={data.width}
                      height={data.height}
                      sizes="33vw"
                    />
                  </Box>
                </a>
              </Link>
            )
          )) :
          <Text>No Parks matching this filter</Text>
        }
      </Box>
    </>
  );
}
