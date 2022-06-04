import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";
import config from "../config";

export default function Social({ endpoint }) {

  const buildTwitterLink = () => {
    const url = config.meta.canonicalUrl + endpoint;
    return `https://twitter.com/intent/tweet?hashtags=theParkandtheBike&original_referer=${encodeURIComponent(url)}&text=${encodeURIComponent(config.meta.social.tagline)}&url=${encodeURIComponent(url)}&via=${config.meta.social.twitter.handle}`
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
