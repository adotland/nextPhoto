
import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { capFirst, commonBlurImage, shimmer, toBase64 } from "../utils/helpers";
import SEO from "./SEO/general";
import styles from './Gallery.module.css'

function GalleryHeader({ children }) {
  return (
    <Box
      w={"100%"}
      bg={useColorModeValue("gray.100", "#191a1a")}
      pt={4}
      pl={['auto', 'auto', 'auto', 8]}
      textAlign={['center', 'center', 'center', 'left']}
    >
      <Heading as={'h1'} fontSize={'lg'} color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}>{children}</Heading>
    </Box>
  )
}

function GalleryTitle({ filterColor, filterImageType }) {
  if (filterImageType) {
    return (<GalleryHeader>{`${capFirst(filterImageType)} Collection`}</GalleryHeader >)
  } else if (filterColor) {
    return (<GalleryHeader>{`${capFirst(filterColor)} Collection`}</GalleryHeader>)
  } else {
    return (<GalleryHeader>Featured Collection</GalleryHeader>)
  }
}

export default function Gallery({ dataList, filterColor, filterImageType, isFeatured }) {

  return (
    <Box mt={[4, 4, 14, 4]} >
      <SEO pageTitle={filterImageType && `${capFirst(filterImageType)} Collection` || filterColor && `${capFirst(filterColor)} Collection` || isFeatured && 'Featured Collection'} />
      <GalleryTitle filterColor={filterColor} filterImageType={filterImageType} />
      <Box
        padding={4}
        w="100%"
        mx="auto"
        bg={useColorModeValue("gray.100", "#191a1a")}
        sx={{ columnCount: [1, 2, 3], columnGap: "1rem" }}
      >
        {
          dataList.length ? dataList.map((data, index) => {
            let blurImage;
            if (data.width === 4032 && data.height === 3024) blurImage = commonBlurImage;
            return (
              <Link href={`/park/${data.slug}`} key={index}>
                <a>
                  <Box
                    className={styles.galleryContainer}
                  >
                    <Box
                      className={styles.galleryOverlay}
                      bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.700')}
                    />
                    <Image
                      key={index}
                      src={data.ext === 'jpg' ?
                        `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}` :
                        `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/t_${data.imageName}`
                      }
                      alt={data.name ? `image of ${data.name}` : "image"}
                      layout="responsive"
                      width={data.width}
                      height={data.height}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${blurImage || toBase64(shimmer(data.width, data.height))}`}
                      sizes="33vw"
                      className={styles.galleryImage}
                    />
                    <Box
                      className={styles.galleryCaption}
                    >
                      <Text
                        color={useColorModeValue('black', 'white')}
                      >{data.name}</Text>
                    </Box>
                  </Box>
                </a>
              </Link>
            )
          }) :
            <Text>No Parks matching this filter</Text>
        }
      </Box>
    </Box>
  );
}
