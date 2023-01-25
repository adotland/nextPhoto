import { Box, Button, Flex, IconButton, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

function handleGpxDownload(slug) {
  umami.trackEvent(slug, 'gpx-download');
  window.location.href = `/api/gpx?query=${slug}`;
}

function DownloadGpx({ slug }) {
  return (
    <Flex mr={5}>
      <Box>
        {/* <Link href={type === 'featured' ? '/featured' : `/filter/${type}/${value}`}> */}
        <Tag
          bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')}
          color='gray.900'
          _hover={{ background: useColorModeValue('blackAlpha.200', 'white') }}
          mt='0.5rem'
          boxShadow='md'
          onClick={() => handleGpxDownload(slug)}
          cursor={'pointer'}
        >
          download gpx
        </Tag>
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
    if ( alreadyLiked !== null ) setIsLike(JSON.parse(alreadyLiked));
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
      <Text ml={5}>
        {count}
      </Text>
    </>
  );
}

export default function RouteInteractions({ slug, initialLikeCount }) {

  return (
    <Flex my={4} mx={'auto'} justifyContent={['center', 'center', 'center', 'left']}>
      {/* <Text pt={2} mr={5}>Tags: </Text> */}
      <Flex
        justifyContent={['center', 'center', 'center', 'left']}
        boxShadow='inner'
        p={2}
        pl={6}
        rounded='md'
        bg={useColorModeValue('white', 'blackAlpha.200')}
      >
        <DownloadGpx slug={slug} />
        <Like slug={slug} initialLikeCount={initialLikeCount} />
        {/* <InteractionTag type={'color'} value={'share'} /> */}
        {/* {filterType && <FilterTag type={'type'} value={filterType} />} */}
        {/* {filterFeatured && <FilterTag type={'featured'} value={'featured'} />} */}
      </Flex>
    </Flex>
  )
}
