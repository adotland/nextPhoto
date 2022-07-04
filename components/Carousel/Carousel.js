// adapted from https://codesandbox.io/s/chakra-carousel-prototype-jmqnh?file=/package.json

import { capFirst } from "../../utils/helpers";

import {
  Container,
  Heading,
  Button,
  VStack,
  HStack,
  Flex,
  Tag,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import ChakraCarousel from "./ChakraCarousel";
import Link from "next/link";
import Image from "next/image";

export default function Carousel({
  dataList,
  activeCarouselItem,
  setActiveCarouselItem,
  setActiveMarker,
}) {
  const headerTextColor = useColorModeValue("brand.700", "brand.200");
  const borderColor = useColorModeValue("white", "black");
  const buttonColor = useColorModeValue("blackAlpha", "green");

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
          xxl: "87.5rem",
        }}
      >
        <ChakraCarousel
          gap={30}
          activeCarouselItem={activeCarouselItem}
          setActiveCarouselItem={setActiveCarouselItem}
        >
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
              <VStack>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  textAlign="center"
                  // w="full"
                  maxW={"90%"}
                  mb={2}
                  textColor={headerTextColor}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  onClick={() => {
                    setActiveMarker(data.slug);
                  }}
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {capFirst(data.parkName)}
                </Heading>
                <Flex>
                  <Box
                    w="150px"
                    h="100px"
                    position="relative"
                    rounded={"lg"}
                    overflow={"hidden"}
                    border={`1px solid ${borderColor}`}
                  >
                    <Image
                      key={index}
                      src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`}
                      alt={
                        data.parkName ? `image of ${data.parkName}` : "image"
                      }
                      layout={"fixed"}
                      width={150}
                      height={100}
                      objectFit={"cover"}
                      onClick={() => {
                        setActiveMarker(data.slug);
                      }}
                    />
                  </Box>
                  <VStack spacing={4} ml={2} alignItems={"flex-start"}>
                    <Box ml={2}>
                      <HStack flexWrap={"wrap"} mb={2}>
                        {data.filters?.matchColor && (
                          <Link
                            href={`/filter/color/${data.filters.matchColor}`}
                          >
                            <a>
                              <Tag
                                size="sm"
                                variant="outline"
                                colorScheme="green"
                              >
                                {data.filters.matchColor}
                              </Tag>
                            </a>
                          </Link>
                        )}
                        {data.filters?.type && (
                          <Link href={`/filter/type/${data.filters.type}`}>
                            <a>
                              <Tag
                                size="sm"
                                variant="outline"
                                colorScheme="gray"
                              >
                                {data.filters.type}
                              </Tag>
                            </a>
                          </Link>
                        )}
                        {data.filters?.featured && (
                          <Link href={`/featured`}>
                            <a>
                              <Tag
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                              >
                                featured
                              </Tag>
                            </a>
                          </Link>
                        )}
                      </HStack>
                      <Link href={`/park/${data.slug}`}>
                        <a>
                          <Button
                            colorScheme={buttonColor}
                            fontWeight="bold"
                            // textColor={useColorModeValue("blackAlpha.800", "white",)}
                            fontFamily="Open Sans"
                            size="sm"
                            // transform={'skew(-21deg)'}
                            rounded="none"
                          >
                            View &rarr;
                          </Button>
                        </a>
                      </Link>
                    </Box>
                  </VStack>
                </Flex>
              </VStack>
            </Flex>
          ))}
        </ChakraCarousel>
      </Container>
    );
  } else {
    return (
      <Flex height={300} fontSize={"large"} justify="center" align={"center"}>
        <span>Zoom and scroll to find more</span>
      </Flex>
    );
  }
}
