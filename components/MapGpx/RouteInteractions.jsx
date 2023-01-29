import { Box, Button, Flex, IconButton, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { FaDownload, FaThumbsUp } from "react-icons/fa";

function Links({ data }) {
  return (<Button mr={5}>{data.komoot && <Link rel="noreferrer" target={'_blank'} href={data.komoot}>Komoot</Link>}</Button>)
}

function handleGpxDownload(slug) {
  umami.trackEvent(slug, 'gpx-download');
  window.location.href = `/api/gpx?slug=${slug}`;
}

function DownloadGpx({ slug }) {
  return (
    <Flex mr={5}>
      <Box>
        <Button
          leftIcon={<FaDownload />}
          colorScheme='gray'
          variant='solid'
          onClick={() => handleGpxDownload(slug)}
        >
          GPX
        </Button>
      </Box>
    </Flex>
  )
}

function Like({ slug, initialLikeCount }) {
  const itemName = `like-${slug}`;
  const [count, setCount] = useState(initialLikeCount ?? 0)
  const [isLike, setIsLike] = useState(false)

  useEffect(() => {
    const alreadyLiked = window.localStorage.getItem(itemName);
    if (alreadyLiked !== null) setIsLike(JSON.parse(alreadyLiked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(itemName, JSON.stringify(isLike));
  }, [itemName, isLike])

  const updateLikeCount = async (isIncrement) => {
    try {
      const response = await fetch('/api/like', { method: 'POST', body: JSON.stringify({ isIncrement, slug, count }) })
      const data = await response.json()
      if (!data.error) {
        setCount(data.data)
      }
    } catch (err) {
      // sentry
      console.error(err)
    }
  }

  const handleLikeClick = async () => {
    if (isLike) {
      await updateLikeCount(false)
      setIsLike(false)
    } else {
      await updateLikeCount(true);
      setIsLike(true);
    }
  }

  return (
    <>
      <IconButton
        aria-label='Add to friends'
        icon={<FaThumbsUp />}
        onClick={handleLikeClick}
        variant={isLike ? 'solid' : 'outline'}
      />
      <Text ml={5} mr={2}>
        {count}
      </Text>
    </>
  );
}

export default function RouteInteractions({ slug, initialLikeCount, links }) {
  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      <Flex
        justifyContent={'space-between'}
        boxShadow='inner'
        p={2}
        rounded='md'
        bg={useColorModeValue('white', 'blackAlpha.200')}
        alignItems={'center'}
      >
        <Text mx={5} height={'40px'}>Go</Text>
        <DownloadGpx slug={slug} />
        <Links data={links} />
        <Like slug={slug} initialLikeCount={initialLikeCount} />
      </Flex>
    </Flex>
  )
}
