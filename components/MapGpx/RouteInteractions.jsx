import { Box, Flex, Tag, useColorModeValue } from "@chakra-ui/react";

function handleGpxDownload(slug) {
  umami.trackEvent('gpx-download', slug);
  window.location.href = `/api/gpx?query=${slug}`;
}

function InteractionTag({ slug, children }) {
  return (
    <Flex mr={5}>
      <Box>
        {/* <Link href={type === 'featured' ? '/featured' : `/filter/${type}/${value}`}> */}
        <Tag
          bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')}
          color='gray.900'
          _hover={{ background: useColorModeValue('blackAlpha.200', 'white') }}
          mt='0.5rem'
          boxShadow='md'
          onClick={() => handleGpxDownload(slug)}
          cursor={'pointer'}
        >
          {children}
        </Tag>
      </Box>
    </Flex>
  )
}

export default function RouteInteractions({ slug }) {
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
        <InteractionTag slug={slug}>download gpx</InteractionTag>
        {/* <InteractionTag type={'color'} value={'like'} />
        <InteractionTag type={'color'} value={'share'} /> */}
        {/* {filterType && <FilterTag type={'type'} value={filterType} />} */}
        {/* {filterFeatured && <FilterTag type={'featured'} value={'featured'} />} */}
      </Flex>
    </Flex>
  )
}
