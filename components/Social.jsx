import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";
import config from "../config";

export default function Social({ endpoint, takenAt }) {

  const buildTwitterLink = () => {
    const url = encodeURIComponent(config.meta.canonicalUrl + endpoint);
    const tagline = encodeURIComponent(config.meta.social.tagline + (takenAt ? `, photo taken at ${takenAt}` : ''));
    const handle = encodeURIComponent(config.meta.social.twitter.handle);

    return `https://twitter.com/intent/tweet?hashtags=theParkandtheBike&original_referer=${url}&text=${tagline}&url=${url}&via=${handle}`
  }

  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      <Text pt={2} mr={5}>Share via: </Text>
      <Link target={'_blank'} href={buildTwitterLink()}>
        <Box pt={5}>
          <BsTwitter />
        </Box>
      </Link>
    </Flex>
  )
}
