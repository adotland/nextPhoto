import { useColorModeValue, Box, Text, Flex, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { commonBlurImage, } from "../utils/helpers";

function CollectionItemContainer({ children }) {
  return (
    <Box
      pos={'relative'}
      h={200}
      _after={{
        backgroundColor: useColorModeValue('#eee', '#111'),
        opacity: '60%',
        backdropFilter: "saturate(180%) blur(5px)",
        position: "absolute",
        content: "''",
        zIndex: 1,
        h: "100%",
        w: "100%",
        right: 0,
        top: 0,
      }}
    >
      {children}
    </Box >
  )
}

function CollectionImage({ imageUrl }) {
  return (
    <Image
      src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${imageUrl}`}
      alt={"image"}
      layout="fill"
      objectFit="cover"
      placeholder="blur"
      sizes="25vw"
      blurDataURL={`data:image/svg+xml;base64,${commonBlurImage}`}
    />
  )
}

function CollectionItem({ name, imageUrl, link }) {
  return (
    <CollectionItemContainer >
      <CollectionImage imageUrl={imageUrl} />
      <Flex justifyContent={'center'} alignItems={'center'} h={200}>
        <Link href={`/collection/${link}`} passHref={true}>
          <ChakraLink zIndex={999}
            _hover={{ borderBottom: '1px solid' }}
            style={{ zIndex: 999 }} >
            <Text
              color={useColorModeValue('#111', '#eee')}
              fontSize={['3xl', '4xl', '5xl']}
              zIndex={999}
              letterSpacing={'0.2em'}
            >
              {name}
            </Text>
          </ChakraLink>
        </Link>
      </Flex>
    </CollectionItemContainer>
  )
}

function FeaturedCollectionItem({ imageUrl }) {
  return (
    <CollectionItemContainer >
      <CollectionImage imageUrl={imageUrl} />
      <Flex justifyContent={'center'} alignItems={'center'} h={200}>
        <Link href={`/featured`}>
          <ChakraLink zIndex={999}
            _hover={{ borderBottom: '1px solid' }}
            style={{ zIndex: 999 }} >
            <Text
              color={useColorModeValue('#111', '#eee')}
              fontSize={['3xl', '4xl', '5xl']}
              zIndex={999}
              letterSpacing={'0.2em'}
            >
              Featured
            </Text>
          </ChakraLink>
        </Link>
      </Flex>
    </CollectionItemContainer>
  )
}

export default function () {
  return (
    <Box>
      <FeaturedCollectionItem imageUrl='310_1301_Discovery-Park.jpg' />
      <CollectionItem name={'Seattle'} link={'seattle'} imageUrl='__Alice-Ball-Park.jpg' />
      <CollectionItem name={'Mercer Island'} link={'mercer'} imageUrl='mercer_park_North-Mercerdale-Hillside.jpg' />
      <CollectionItem name={'King County'} link={'county'} imageUrl="county_May-Creek-Park---County.jpg" />
      <CollectionItem name={'P-Patch'} link={'p-patch'} imageUrl='p-patch_Pelican-Tea-Garden.jpg' />
      <CollectionItem name={'Extra'} link={'extras'} imageUrl='private_Duwamish-Hill-Preserve.jpg' />
    </Box>
  )
}
