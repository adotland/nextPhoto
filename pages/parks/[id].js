import { Box, Flex, Image } from "@chakra-ui/react";
import { ff } from "fssf";
import Details from "../../components/Details";
import Map from '../../components/Map';

export async function getServerSideProps({ params: { id } }) {
  const data = await ff.readJson(ff.path('./data/db.json'));
  return { props: { dataList: data.filter(d => d.id === id) } };
}

export default function ({ dataList }) {
  const data = dataList[0];
  return (
    <>
      <Flex m={7} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']}>
        <Box flex={1}>
          <Image
            key={data.id}
            w="100%"
            d="inline-block"
            src={`${data.download_url}`}
            alt={data.name ?? "image"}
          />
        </Box>
        <Map center={[data.lat, data.long]} name={data.name} />
      </Flex>
      <Details data={data} />
    </>
  )
}
