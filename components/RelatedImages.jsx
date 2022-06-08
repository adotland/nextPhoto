import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function RelatedImages({ dataList }) {
  return (
    <Box
      w={['100%', "50%"]}
      textAlign={['center', 'center', 'center', 'left']}
      my={'auto'}
      mr={['auto']}
      ml={[0, 'auto', 'auto', '8']}
      pb={5}
    >
      <Heading as={'h3'} fontSize={'large'} mt={5}>Related Images</Heading>
      {dataList.map((data, index) => (
        <Link href={`/park/${data.slug}`} key={index}>
          <a>
            <Box
              minW="20%"
              m={2}
              display="inline-block"
              rounded={'lg'}
              height={100}
              overflow={'hidden'}
              border={`1px solid ${useColorModeValue('white', 'black')}`}
              _hover={{border: `1px solid #777`}}
            >
              <Image
                key={index}
                src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
                alt={data.name || "image"}
                layout={'fixed'}
                width={150}
                height={100}
              />
            </Box>
          </a>
        </Link>
      ))
      }
    </Box>
  );
}
