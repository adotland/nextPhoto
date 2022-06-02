import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function RelatedImages({ dataList }) {
  return (
    <Box w={"50%"} my={'auto'} ml={10}>
      <Heading as={'h3'} fontSize={'large'} mt={5}>Related Images</Heading>
        {dataList.map((data, index) => (
          <Link href={`/park/${data.slug}`} key={index}>
            <a>
              <Box
                minW="20%"
                m={2}
                display="inline-block"
              >
                <Image
                  key={index}
                  src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
                  alt={data.name || "image"}
                  layout="responsive"
                  width={data.width}
                  height={data.height}
                  sizes="15vw"
                />
              </Box>
            </a>
          </Link>
        ))
        }
    </Box>
  );
}
