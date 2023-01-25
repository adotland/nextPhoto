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
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

import ChakraCarousel from "./ChakraCarousel";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Carousel({
  dataList,
  activeCarouselItem,
  setActiveCarouselItem,
  setActiveMarker,
}) {
  const headerTextColor = useColorModeValue("brand.700", "brand.200");
  // const borderColor = useColorModeValue("white", "black");
  const buttonColor = useColorModeValue("green", "green");
  const mapButtonColor = useColorModeValue("teal", "blue");
  const carouselItemBgColor = useColorModeValue("whiteAlpha.100", "blackAlpha.100");
  const carouselButtonBgColor = useColorModeValue("whiteAlpha.400", "blackAlpha.400");

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
          gap={99}
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
              bg={carouselItemBgColor}
              rounded={'3xl'}
              // boxShadow={'md'}
              flex={1}
              pt={4}
              pos={'relative'}
              _before={{
                content: `" "`,
                display: "block",
                position: "absolute",
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0.4,
                backgroundImage: `url('/_next/image?url=https%3A%2F%2Ftheparkandthebike.s3.us-west-2.amazonaws.com%2F${data.imageName}&w=384&q=75')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 0',
                backgroundSize: 'cover',
              }}
            >
              <VStack zIndex={999} pos='relative'>
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
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  <Link href={`/park/${data.slug}`}>
                    <a width={'100%'}>
                      {capFirst(data.parkName)}
                    </a>
                  </Link>
                </Heading>
                {/* <Flex> */}
                <VStack spacing={2} w={'100%'}>
                  <HStack flexWrap={"wrap"} padding={2} justifyContent={'space-evenly'} maxW={'100%'} width={['100%', '100%', '100%', '70%' ]} backgroundColor={carouselButtonBgColor} rounded={'lg'} >
                    <Text style={{ textTransform: 'capitalize' }} textColor={headerTextColor}>Collection:
                      <Link
                        href={`/collection/${data.collection}`}
                      >
                        <a style={{ display: 'inline-block', marginLeft: '5px', fontWeight: 'bold' }}>{data.collection}</a>
                      </Link>
                    </Text>
                  </HStack>
                  <HStack flexWrap={"wrap"} padding={2} justifyContent={'space-evenly'}  maxW={'100%'} width={['100%', '100%', '100%', '70%' ]}backgroundColor={carouselButtonBgColor} rounded={'lg'} >
                    <Text textColor={headerTextColor} >Tags: </Text>
                    {data.filters?.matchColor && (
                      <Link
                        href={`/filter/color/${data.filters.matchColor}`}
                      >
                        <a>
                          <Tag
                            size="sm"
                            variant="solid"
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
                            variant="solid"
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
                            variant="solid"
                            colorScheme="blue"
                          >
                            featured
                          </Tag>
                        </a>
                      </Link>
                    )}
                  </HStack>

                </VStack>
                {/* </Flex> */}
              </VStack>
              <HStack mt={3} spacing={0} justifyContent={'space-between'}>
                <Button
                  colorScheme={mapButtonColor}
                  fontWeight="bold"
                  // textColor={useColorModeValue("blackAlpha.800", "white",)}
                  fontFamily="Open Sans"
                  size="sm"
                  // transform={'skew(-21deg)'}
                  rounded="none"
                  onClick={() => {
                    setActiveMarker(data.slug);
                    scrollTo({ top: 0 })
                  }}
                  w={'50%'}
                  roundedBottomleft={'lg'}
                >
                  Map
                  <span style={{ display: 'inline-block', marginLeft: '5px;' }}>
                    <FaMapMarkerAlt />
                  </span>
                </Button>
                <Link href={`/park/${data.slug}`}>
                  <a style={{width: '50%'}}>
                    <Button
                      colorScheme={buttonColor}
                      fontWeight="bold"
                      // textColor={useColorModeValue("blackAlpha.800", "white",)}
                      fontFamily="Open Sans"
                      size="sm"
                      // transform={'skew(-21deg)'}
                      rounded={'none'}
                      roundedBottomRight={'lg'}
                      w={'100%'}
                    >
                      View &rarr;
                    </Button>
                  </a>
                </Link>
              </HStack>
            </Flex>
          ))}
        </ChakraCarousel>
      </Container>
    );
  } else {
    return (
      <Flex height={300} fontSize={"large"} justify="center" align={"center"}>
        <span>Zoom and scroll to find parks</span>
      </Flex>
    );
  }
}
