import { Box, Heading, Text } from "@chakra-ui/react";

export default function Details({ data }) {
  return (
    <Box textAlign={'center'} lineHeight={10}>
      <Heading>{data.name}</Heading>
      <Heading as={'h3'} fontSize={'medium'} mb={3}>Seattle Collection</Heading>
      <a href={data.link}>{data.link}</a>
      <Text>{data.lat} // {data.long}</Text>
      {data.address && <Text>{data.address}</Text>}
      {data.description && <Text>{data.description}</Text>}
    </Box>
  )
}
