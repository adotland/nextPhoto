import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function Logo(props) {
  return (
    <Box {...props} mb={[0, 0, 5, 0]}>
      <Link href="/">
        <a>
          <Text
            fontFamily={'Open sans'}
            fontSize="md"
            fontWeight="bold"
            minW={180}
            color={useColorModeValue("brand.700", "brand.200")}
            // color={useColorModeValue("white", "black")}
            backgroundColor={useColorModeValue("white", "#191a1a")}
            p={1}
            transform={'skew(-21deg)'}
          // bgGradient={useColorModeValue("linear(to-l, green.300 ,#000)", "linear(to-l, green.300 ,#fff)")}
          // bgClip="text"
          >
            TheParkAndTheBike
          </Text>
        </a>
      </Link>
    </Box>
  )
}
