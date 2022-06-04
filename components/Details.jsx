import { Box, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import FilterDisplay from "./FilterDisplay";
import Map from './Map';
import styles from './Details.module.css';
import Social from "./Social";

export default function Details({ data }) {
  const filterColor = data.filters?.matchColor
  const filterType = data.filters?.type
  const filterFeatured = data.filters?.featured
  const displayFilter = filterColor || filterType || filterFeatured
  let collection = data.slug.split('_')
  if (collection.length > 1) {
    collection = collection[0]
  } else {
    collection = 'Seattle'
  }
  return (
    <Box
      textAlign={['center', 'center', 'center', 'left']}
      lineHeight={10}
      mt={["2em", "1.5em", "1em", 0]}
      ml={[0, 0, 0, 10]}
      minW="20rem"
    >
      <Heading>{data.name}</Heading>
      <Link href={`/collection/${data.collection.toLowerCase()}`}>
        <a className={styles.collectionLink}>
          <Heading as={'h3'} fontSize={'medium'} mb={3} textTransform={'capitalize'}>{collection} Collection</Heading>
        </a>
      </Link>
      {data.link && <ChakraLink href={data.link}>{data.link}</ChakraLink>}
      {data.lat && data.long && <Text>{data.lat} // {data.long}</Text>}
      {data.address && <Text>{data.address}</Text>}
      {data.description && <Text>{data.description}</Text>}
      {displayFilter && <FilterDisplay filterType={filterType} filterColor={filterColor} filterFeatured={filterFeatured} />}
      <Social endpoint={`/park/${data.slug}`} />
      {data.lat && data.long && <Map center={[data.lat, data.long]} name={data.name} />}

    </Box>
  )
}
