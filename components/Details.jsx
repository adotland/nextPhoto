import { Box,  Heading, Text } from "@chakra-ui/react";
import FilterDisplay from "./FilterDisplay";
import Map from './Map';

export default function Details({ data }) {
  const filterColor = data.filters?.matchColor
  const filterType = data.filters?.type
  const displayFilter = filterColor || filterType
  return (
    <Box
      textAlign={['center', 'center', 'center', 'left']}
      lineHeight={10}
      mt={["2em", "1.5em", "1em", 0]}
      ml={[0, 0, 0, 10]}
      minW="20rem"
    >
      <Heading>{data.name}</Heading>
      <Heading as={'h3'} fontSize={'medium'} mb={3}>Seattle Collection</Heading>
      <a href={data.link}>{data.link}</a>
      <Text>{data.lat} // {data.long}</Text>
      {data.address && <Text>{data.address}</Text>}
      {data.description && <Text>{data.description}</Text>}
      {displayFilter && <FilterDisplay filterType={filterType} filterColor={filterColor} />}
      <Map center={[data.lat, data.long]} name={data.name} />

    </Box>
  )
}
