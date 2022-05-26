import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function Logo(props) {
  return (
    <Box {...props}>
      <Link href="/">
        <a>
          <Heading
            as={'h1'}
            fontSize="lg"
            fontWeight="bold"
            minW={180}
            color={useColorModeValue("brand.700", "brand.200")}
            backgroundColor={useColorModeValue("white", "gray.800")}
            p={1}
          >
            TheBikeAndThePark
          </Heading>
        </a>
      </Link>
    </Box>
  )
}
