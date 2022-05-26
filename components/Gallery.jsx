
import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function Gallery({ data }) {
  return (
    <Box
      padding={4}
      w="100%"
      mx="auto"
      bg={useColorModeValue("gray.100", "gray.800")}
      sx={{ columnCount: [1, 2, 3], columnGap: "8px" }}
    >
      {data.map((d, index) => (
        <Link href={`/parks/${d.id}`} key={index} url={d.download_url}>
          <a>
            <Image
              key={index}
              w="100%"
              mb={2}
              d="inline-block"
              src={`${d.download_url}`}
              alt="park"
            /></a>
        </Link>
      ))}
    </Box>
  );
}
