import { Box, Flex, Tag, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTag({ type, value }) {
  return (
    <Flex mr={5}>
      <Box>
        <Link href={type === 'featured' ? '/featured' : `/filter/${type}/${value}`}>
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
    </Flex>
  )
}
