import { useColorModeValue, Box, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "../utils/helpers";


function CollectionItem({ name, imageUrl, width, height, link }) {
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
      <Image
        src={`https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${imageUrl}`}
        alt={"image"}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        sizes="25vw"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer( width, height))}`}
      />
      <Flex justifyContent={'center'} alignItems={'center'} h={200}>
        <Link href={`/collection/${link}`}>
          <a style={{ zIndex: 999 }} >
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
    </Box >
  )
}


export default function () {
  return (
    <Box>
      <CollectionItem name={'Seattle'} link={'seattle'} imageUrl='310_1301_Discovery-Park.jpg' width={4032} height={3024} />
      <CollectionItem name={'Mercer Island'} link={'mercer'} imageUrl='mercer_park_North-Mercerdale-Hillside.jpg' width={4032} height={3024} />
      <CollectionItem name={'King County'} link={'county'} imageUrl="county_May-Creek-Park---County.jpg" width={4032} height={3024} />
      <CollectionItem name={'P-Patch'} link={'p-patch'} imageUrl='p-patch_Pelican-Tea-Garden.jpg' width={4032} height={3024} />
      <CollectionItem name={'Extra'} link={'extras'} imageUrl='private_Duwamish-Hill-Preserve.jpg' width={4032} height={3024} />
    </Box>
  )
}
