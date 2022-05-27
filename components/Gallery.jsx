
import { Box, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function Gallery({ data }) {
  return (
    <Box
      padding={4}
      w="100%"
      mx="auto"
      bg={useColorModeValue("gray.100", "gray.800")}
      sx={{ columnCount: [1, 2, 3], columnGap: "1rem" }}
    >
      {data.map((d, index) => (
        <Link href={`/parks/${d.id}`} key={index} url={d.download_url}>
          <a>
            <Box
              w="100%"
              mb={2}
              display="inline-block"
            >
              <Image
                key={index}
                src={`${d.download_url}`}
                alt={d.name || "image"}
                layout="responsive"
                width={d.width}
                height={d.height}
                sizes="33vw"
              />
            </Box>
          </a>
        </Link>
      ))}
    </Box>
  );
}
