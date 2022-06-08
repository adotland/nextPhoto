import { Box, Heading, Text, Link as ChakraLink, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import FilterDisplay from "./FilterDisplay";
import Map from './Map';
import styles from './Details.module.css';
import Social from "./Social";
import { MdCollections } from 'react-icons/md'

export default function Details({ data, ...props }) {
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
    <Box {...props}>
      <Heading as={'h1'} pb={3} color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}>{data.name}</Heading>
      <Link href={`/collection/${data.collection.toLowerCase()}`}>
        <a className={styles.collectionLink}>
          <Heading as={'h2'} fontSize={'medium'} mb={3} textTransform={'capitalize'}>
            <Flex justifyContent={['center', 'center', 'center', 'flex-start']}>
              <Text mr={2}>{collection} Collection</Text>
              <MdCollections />
            </Flex>
          </Heading>
        </a>
      </Link>
      {data.link && <ChakraLink href={data.link}>{data.link}</ChakraLink>}
      {data.lat && data.long && <Text>{data.lat} // {data.long}</Text>}
      {data.address && <Text>{data.address}</Text>}
      {data.description && <Text>{data.description}</Text>}
      {displayFilter && <FilterDisplay filterType={filterType} filterColor={filterColor} filterFeatured={filterFeatured} />}
      <Social path={`/park/${data.slug}`} takenAt={data.name} />
      {data.lat && data.long && <Map center={[data.lat, data.long]} name={data.name} />}

    </Box>
  )
}
