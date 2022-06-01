import { Box, Flex, Tag, useColorModeValue, PseudoBox } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTag({ type, value }) {
  return (
    <Box as="Flex" mr={5}>
      {/* <Text>{type}: </Text> */}
      <Box>
        <Link href={type === 'featured' ? '/' : `/filter/${type}/${value}`}>
          <a>
            <Tag
              bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')}
              color='gray.900'
              _hover={{ background: useColorModeValue('blackAlpha.200', 'white') }}
              mt='0.5rem'
              boxShadow='md'
            >{value}</Tag>
          </a>
        </Link>
      </Box>
    </Box>
  )
}
