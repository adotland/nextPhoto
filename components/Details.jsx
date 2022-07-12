import {
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import FilterDisplay from "./FilterDisplay";
import Map from "./Map";
import styles from "./Details.module.css";
import Social from "./Social";
import { MdCollections } from "react-icons/md";

function Detail({ title, data }) {
  return (
    <Box>
      <Text display={"inline-block"} fontWeight={"bold"}>
        {title}:
      </Text>
      &nbsp;
      <Text display={"inline-block"} ml={2}>
        {data}
      </Text>
    </Box>
  );
}

export default function Details({ data, ...props }) {
  const filterColor = data.filters?.matchColor;
  const filterType = data.filters?.type;
  const filterFeatured = data.filters?.featured;
  const displayFilter = filterColor || filterType || filterFeatured;
  const latlngSeparator = "//";
  const isPPatch = data.slug.indexOf("p-patch") === 0;

  let collection = data.slug.split("_");
  if (collection.length > 1) {
    collection = collection[0];
  } else {
    collection = "Seattle";
  }

  return (
    <Box {...props}>
      <Heading
        as={"h1"}
        pb={3}
        color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
      >
        {data.parkName}
      </Heading>
      <Link href={`/collection/${data.collection.toLowerCase()}`}>
        <a className={styles.collectionLink}>
          <Heading
            as={"h2"}
            fontSize={"medium"}
            mb={3}
            textTransform={"capitalize"}
          >
            <Flex justifyContent={["center", "center", "center", "flex-start"]}>
              <Text mr={2}>{collection} Collection</Text>
              <MdCollections />
            </Flex>
          </Heading>
        </a>
      </Link>
      {data.link && <ChakraLink href={data.link}>{data.link}</ChakraLink>}
      {data.lat && data.long && (
        <Link href={`/map/${data.slug}`}>
          <a>
            <Text _hover={{textDecoration: 'underline', textUnderlineOffset: 3}}>
              {data.lat.substring(0,9)} {latlngSeparator} {data.long.substring(0,12)}
            </Text>
          </a>
        </Link>
      )}
      {data.address && <Text>{data.address}</Text>}
      {data.hours && <Detail title={"Hours"} data={data.hours} />}
      {data.area && <Detail title={"Area"} data={data.area} />}
      {data.features?.length > 0 && (
        <Detail title={"Features"} data={data.features.join(", ")} />
      )}
      {data.description && (
        <Detail title={"Description"} data={data.description} />
      )}
      {displayFilter && (
        <FilterDisplay
          filterType={filterType}
          filterColor={filterColor}
          filterFeatured={filterFeatured}
        />
      )}
      <Social path={`/park/${data.slug}`} takenAt={data.parkName} />
      {data.lat && data.long && (
        <Map
          isPPatch={isPPatch}
          center={[data.lat, data.long]}
          slug={data.slug}
        />
      )}
      <Link href={`/map/${data.slug}`}>
        <a className={styles.mapLink}>View on Interactive Map &rarr;</a>
      </Link>
    </Box>
  );
}
