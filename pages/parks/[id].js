import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ff } from "fssf";
import Details from "../../components/Details";
import Map from '../../components/Map';

export async function getServerSideProps({ params: { id } }) {
  const data = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  return { props: { dataList: data.filter(d => d.id == id) } };
}

export default function ({ dataList }) {
  const data = dataList[0];
  return (
    <>
      <Flex m={7} justifyContent={'space-evenly'} flexDir={['column', 'column', 'column', 'row']}>
        <Box flex={1}
          minW={data.width > data.height ? "60%" : "40%"}
          maxW={data.width > data.height ? "60%" : "40%"}
        >
          <Image
            key={data.id}
            src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
            alt={data.name ?? "image"}
            layout="responsive"
            width={data.width}
            height={data.height}
            // sizes="50vw"
            priority
          />
        </Box>
        <Map center={[data.lat, data.long]} name={data.name} />
      </Flex>
      <Details data={data} />
    </>
  )
}
