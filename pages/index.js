import { useColorModeValue, Box, Text, Flex, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import SEO from "../components/SEO/general";
import { commonBlurImage, } from "../utils/helpers";
import styles from '../components/Home.module.css'

function CollectionItemContainer({ children }) {
  return (
    <Box
      pos={'relative'}
      h={200}
      mb={2}
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

function CollectionImage({ imageUrl, isPriority = false }) {
  return (
    <Image
      src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${imageUrl}`}
      alt={"image"}
      layout="fill"
      objectFit="cover"
      placeholder="blur"
      sizes="25vw"
      blurDataURL={`data:image/svg+xml;base64,${commonBlurImage}`}
      priority={isPriority}
    />
  )
}

function CollectionItem({ name, imageUrl, link, isPriority }) {
  return (
    <CollectionItemContainer>
      <CollectionImage imageUrl={imageUrl} isPriority={isPriority} />
      <Flex justifyContent={'center'} alignItems={'center'} h={200}>
        <Link href={`/collection/${link}`}>
          <a className={styles.homeLink}>
            <Text
              color={useColorModeValue('#111', '#eee')}
              fontSize={['3xl', '4xl', '5xl']}
              zIndex={999}
              letterSpacing={'0.2em'}
            >
              {name}
            </Text>
          </a>
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
          <a className={styles.homeLink}>
            <Text
              color={useColorModeValue('#111', '#eee')}
              fontSize={['3xl', '4xl', '5xl']}
              zIndex={999}
              letterSpacing={'0.2em'}
            >
              Featured
            </Text>
          </a>
        </Link>
      </Flex>
    </CollectionItemContainer>
  )
}

export default function () {
  return (
    <>
      <SEO pageTitle={'Home'} />
      <Box mt={[4, 4, 14, 4]} width={'95%'} mx={'auto'}>
        <FeaturedCollectionItem imageUrl='310_1301_Discovery-Park.jpg' isPriority={true} />
        <CollectionItem name={'Seattle'} link={'seattle'} imageUrl="309_1297_Denny-Park.jpg" />
        <CollectionItem name={'Mercer Island'} link={'mercer'} imageUrl="mercer_streetEnd_77th-Avenue-SE-Landing.jpg" />
        <CollectionItem name={'King County'} link={'county'} imageUrl="county_May-Creek-Park---County.jpg" />
        <CollectionItem name={'P-Patch'} link={'p-patch'} imageUrl='p-patch_Pelican-Tea-Garden.jpg' />
        <CollectionItem name={'Extra'} link={'extras'} imageUrl='private_Duwamish-Hill-Preserve.jpg' />
      </Box>
    </>
  )
}
