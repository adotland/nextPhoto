import { Box, Flex, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

function FilterTag({ type, value }) {
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

export default function RouteInteractions() {
  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      {/* <Text pt={2} mr={5}>Tags: </Text> */}
      <Flex
        justifyContent={['center', 'center', 'center', 'left']}
        boxShadow='inner'
        p={2}
        pl={6}
        rounded='md'
        bg={useColorModeValue('white', 'blackAlpha.200')}
      >
        <FilterTag type={'color'} value={'download gpx'} />
        <FilterTag type={'color'} value={'like'} />
        <FilterTag type={'color'} value={'share'} />
        {/* {filterType && <FilterTag type={'type'} value={filterType} />} */}
        {/* {filterFeatured && <FilterTag type={'featured'} value={'featured'} />} */}
      </Flex>
    </Flex>
  )
}
