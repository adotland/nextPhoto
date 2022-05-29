
import { Box, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import SEO from "./SEO/home";

export default function Gallery({ dataList }) {
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
        {
          dataList.map((data, index) => (
            (data.live &&
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
          ))}
      </Box>
    </>
  );
}
