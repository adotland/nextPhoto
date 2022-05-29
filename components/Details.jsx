import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import FilterTag from "./FilterTag";

export default function Details({ data }) {
  const filterColor = data.filters?.matchColor
  return (
    <Box textAlign={'center'} lineHeight={10} mt={["2em", "1.5em", "1em", 0]}>
      <Heading>{data.name}</Heading>
      <Heading as={'h3'} fontSize={'medium'} mb={3}>Seattle Collection</Heading>
      <a href={data.link}>{data.link}</a>
      <Text>{data.lat} // {data.long}</Text>
      {data.address && <Text>{data.address}</Text>}
      {data.description && <Text>{data.description}</Text>}
      <Flex justifyContent={'center'} mt={7}>
        {/* <ListIcon as={MdSettings} color={`gray.500`} />Filters:  */}
        {filterColor && <FilterTag type={'color'} value={filterColor} />}
      </Flex>
    </Box>
  )
}
