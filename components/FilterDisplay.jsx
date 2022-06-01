import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import FilterTag from "./FilterTag";

export default function FilterDisplay({ filterColor, filterType, filterFeatured }) {
  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      <Text pt={2} mr={5}>Tags: </Text>
      <Flex
        justifyContent={['center', 'center', 'center', 'left']}
        boxShadow='inner'
        p={2}
        pl={6}
        rounded='md'
        bg={useColorModeValue('white.600', 'blackAlpha.200')}
      >
        {/* <ListIcon as={MdSettings} color={`gray.500`} />Filters:  */}
        {filterColor && <FilterTag type={'color'} value={filterColor} />}
        {filterType && <FilterTag type={'type'} value={filterType} />}
        {filterFeatured && <FilterTag type={'featured'} value={'featured'} />}
      </Flex>
    </Flex>
  )
}
