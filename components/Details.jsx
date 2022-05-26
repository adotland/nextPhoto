import { Box, Heading, Text } from "@chakra-ui/react";

export default function Details({ data }) {
  return (
    <Box textAlign={'center'} lineHeight={10}>
      <Heading>{data.name}</Heading>
      <a href={data.link}>{data.link}</a>
      <Text>{data.lat} // {data.long}</Text>
      {data.description && <Text>{data.description}</Text>}
    </Box>
  )
}
