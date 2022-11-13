
import { Box, Heading, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { capFirst, commonBlurImage, shimmer, toBase64 } from "../utils/helpers";
import styles from './Gallery.module.css'

function GalleryHeader({ children }) {
  return (
    <Box
      w={"100%"}
      bg={useColorModeValue("gray.100", "blackAlpha.300")}
      pt={4}
      pl={['initial', 'initial', 'initial', 8]}
      textAlign={['center', 'center', 'center', 'left']}
    >
      <Heading as={'h2'} fontSize={'lg'} color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}>{children}</Heading>
    </Box>
  )
}

function GalleryTitle({ filterColor, filterImageType }) {
    return (<GalleryHeader>Parks To See</GalleryHeader>)
}

export default function GalleryForSocials({ dataList, filterColor, filterImageType, isFeatured }) {
  const boxBgColor = 'rgb(28 32 93 / 24%);' //useColorModeValue('whiteAlpha.500', 'blackAlpha.300')
  const textColor = '#fff'; //useColorModeValue('black', 'white')

  return (
    <Box mt={'2rem'} width={'70%'}>
      {/* <GalleryTitle /> */}
      <Box
        padding={4}
        w="100%"
        className={styles.socialImageGrid}
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
                      bg={boxBgColor}
                    />
                    <Image
                      key={index}
                      src={data.ext === 'jpg' ?
                        `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}` :
                        `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/t_${data.imageName}`
                      }
                      alt={data.parkName ? `image of ${data.parkName}` : "image"}
                      layout="responsive"
                      width={data.width}
                      height={data.height}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${blurImage || toBase64(shimmer(data.width, data.height))}`}
                      sizes={data.ext === 'jpg' ? "384" : "33vw"}
                      quality={50}
                      className={styles.galleryImage}
                    />
                    <Box
                      className={styles.galleryCaption}
                    >
                      <Text
                        color={textColor}
                      >{data.parkName}</Text>
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
