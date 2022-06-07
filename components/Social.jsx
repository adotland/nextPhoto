import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { BsReddit, BsTwitter } from "react-icons/bs";
import config from "../config";

export default function Social({ path, takenAt }) {

  const buildTwitterLink = () => {
    const url = encodeURIComponent(config.endpoints.canonical + path);
    // const tagline = encodeURIComponent(config.meta.social.tagline + (takenAt ? `, photo taken at ${takenAt}` : ''));
    const tagline = encodeURIComponent(`photo taken at ${takenAt}`);
    const handle = encodeURIComponent(config.meta.social.twitter.handle);

    return `https://twitter.com/intent/tweet?hashtags=theParkandtheBike&original_referer=${url}&text=${tagline}&url=${url}&via=${handle}`
  }

  const buildRedditLink = () => {
    const url = encodeURIComponent(config.endpoints.canonical + path);
    const title = encodeURIComponent(config.meta.social.hashtag);
    return `https://www.reddit.com/submit?url=${url}&title=${title}`
  }
  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      <Text pt={2} mr={5}>Share via: </Text>
      <Link mr={'1em'} target={'_blank'} href={buildTwitterLink()}>
        <Box pt={5}>
          <BsTwitter />
        </Box>
      </Link>
      <Link mr={'1em'} target={'_blank'} href={buildRedditLink()}>
        <Box pt={5}>
          <BsReddit />
        </Box>
      </Link>
    </Flex>
  )
}
