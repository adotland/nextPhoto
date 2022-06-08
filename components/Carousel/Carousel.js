// adapted from https://codesandbox.io/s/chakra-carousel-prototype-jmqnh?file=/package.json

import { capFirst } from "../../utils/helpers"

import {
  Container,
  Heading,
  Button,
  VStack,
  HStack,
  Flex,
  Tag,
  Box,
  useColorModeValue
} from "@chakra-ui/react";

import ChakraCarousel from "./ChakraCarousel";
import Link from "next/link";
import Image from "next/image";

export default function ({ dataList, activeCarouselItem, setActiveCarouselItem }) {
  if (dataList.length) {
    return (
      <Container
        py={4}
        px={0}
        maxW={{
          base: "100%",
          sm: "35rem",
          md: "43.75rem",
          lg: "57.5rem",
          xl: "75rem",
          xxl: "87.5rem"
        }}
      >
        <ChakraCarousel gap={30} activeCarouselItem={activeCarouselItem} setActiveCarouselItem={setActiveCarouselItem}>
          {dataList.map((data, index) => (
            <Flex
              key={index}
              boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
              justifyContent="space-between"
              flexDirection="column"
              overflow="hidden"
              color="gray.300"
              bg="blackAlpha.100"
              rounded={1}
              flex={1}
              p={4}
            >
              <VStack mb={6}>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  textAlign="center"
                  // w="full"
                  maxW={'300px'}
                  mb={2}
                  textColor={useColorModeValue("brand.700", "brand.200")}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                >
                  {capFirst(data.name)}
                </Heading>
                {/* <Text w="full">{capFirst(data.name)}</Text> */}
                <Box
                  w='150px'
                  h='100px'
                  position='relative'
                  rounded={'lg'}
                  overflow={'hidden'}
                  border={`1px solid ${useColorModeValue('white', 'black')}`}
                >
                  <Image
                    key={index}
                    src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
                    alt={data.name ? `image of ${data.name}` : "image"}
                    layout={'fixed'}
                    width={150}
                    height={100}
                  />
                </Box>
              </VStack>

              <Flex justifyContent='space-between'>
                <HStack spacing={2}>
                  {data.filters?.matchColor && <Tag size="sm" variant="outline" colorScheme="green">
                    {data.filters.matchColor}
                  </Tag>}
                  {data.filters?.type && <Tag size="sm" variant="outline" colorScheme="green">
                    {data.filters.type}
                  </Tag>}
                  {data.filters?.featured && <Tag size="sm" variant="outline" colorScheme="green">
                    featured
                  </Tag>}
                </HStack>
                <Link href={`/park/${data.slug}`}>
                  <a>
                    <Button
                      colorScheme={useColorModeValue("blackAlpha", "green",)}
                      fontWeight="bold"
                      // textColor={useColorModeValue("blackAlpha.800", "white",)}
                      fontFamily='Open Sans'
                      size="sm"
                      // transform={'skew(-21deg)'}
                      rounded='none'
                    >
                      View &rarr;
                    </Button>
                  </a>
                </Link>
              </Flex>
            </Flex>
          ))}
        </ChakraCarousel>
      </Container>
    );
  } else {
    return (
      <Flex height={300} fontSize={'large'} justify='center' align={'center'}>
        <span>Zoom and scroll to find more</span>
      </Flex>
    )
  }
}
