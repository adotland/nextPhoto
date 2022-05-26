import { Box, Flex, Image } from "@chakra-ui/react";
import { ff } from "fssf";

export async function getServerSideProps({ params: { id } }) {
  const data = await ff.readJson(ff.path('./data/db.json'));
  return { props: { data: data.filter(d => d.id === id) } };
}

export default function ({ data }) {
  return (
    <Flex>
      <Box>
        <Image
          key={data[0].id}
          w="100%"
          d="inline-block"
          src={`${data[0].download_url}`}
          alt="image"
        />
      </Box>
    </Flex>
  )
}
