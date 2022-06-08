
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { capFirst, commonBlurImage, shimmer, toBase64 } from "../utils/helpers";
import FilterTagClose from "./FilterTagClose";
import SEO from "./SEO/general";
import styles from './Gallery.module.css'

function FiltersRow({ filterColor, filterType }) {
  const displayable = filterColor || filterType;
  return (

    displayable && <Box
      w={"100%"}
      bg={useColorModeValue("gray.100", "#191a1a")}
      pt={4}
      pl={4}
    >
      <Text display={'inline-block'} mr={5} fontSize="sm" fontFamily={'Open sans'}>Active Filters: </Text>
      {filterColor && <FilterTagClose type={'color'} value={filterColor} />}
      {filterType && <FilterTagClose type={'type'} value={filterType} />}
    </Box>
  )
}

export default function Gallery({ dataList, filterColor, filterImageType, isFeatured }) {

  return (
    <Box mt={[4, 4, 14, 4]} >
      <SEO pageTitle={filterImageType && `${capFirst(filterImageType)} Gallery` || filterColor && `${capFirst(filterColor)} Gallery` || isFeatured && 'Featured Gallery'}/>
      <FiltersRow filterColor={filterColor} filterType={filterImageType} />
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
