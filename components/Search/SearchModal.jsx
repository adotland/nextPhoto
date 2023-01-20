import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, Input, Text, Box, Flex, VStack, useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link';
import { AiOutlinePicture } from 'react-icons/ai';
import { BsCameraReels } from 'react-icons/bs';

function handleResultClick(parkName) {
  umami.trackEvent(parkName, 'search');
}

export function SearchResult({ slug, parkName, still }) {
  return (
    <Link href={`/park/${slug}`}>
      <a className={"umami--search--resultClick"} onClick={() => handleResultClick(parkName)}>
        <Flex>
          <Box mr={2}>{still ? <AiOutlinePicture /> : <BsCameraReels />}</Box>
          <Text textTransform={'capitalize'}
          >{parkName}</Text>
        </Flex>
      </a>
    </Link>
  )
}

export function SearchResultList({ resultsList, isLoading }) {
  // if (isLoading) {
  //   return ('Loading...')
  // }
  if (resultsList.length) {
    return (<VStack spacing={5} my={5}>{resultsList?.map((result, index) => <SearchResult key={index} still={result.item?.still} parkName={result.item?.parkName} slug={result.item?.slug} />)}</VStack>)
  } else {
    return <Box mt={4} textAlign={'center'}></Box>
  }
}

export default function SearchModal({ isOpen, onClose, initialRef, handleSearchInputChange, resultsList, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.800')}>
        <ModalHeader>Park Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={'1em'}>
            <Input
              ref={initialRef}
              variant="outline"
              type="text"
              placeholder="Start typing a name..."
              onInput={handleSearchInputChange} />
            <SearchResultList resultsList={resultsList} isLoading={isLoading} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
