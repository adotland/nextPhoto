import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, Button, Input, Text, Box, Flex, VStack, useColorModeValue
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { AiOutlinePicture } from 'react-icons/ai';
import { BsCameraReels } from 'react-icons/bs';
import { useRouter } from 'next/router'

export function SearchResult({ slug, parkName, still }) {
  return (
    <Link href={`/park/${slug}`}>
      <a>
        <Flex>
          <Box mr={2}>{still ? <AiOutlinePicture /> : <BsCameraReels />}</Box>
          <Text textTransform={'capitalize'}>{parkName}</Text>
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
    return ''
  }
}

export default function Search({ setNavbarIsOpen }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState()
  const [inputText, setInputText] = useState()
  const [debouncedValue] = useDebounce(inputText, 300);
  const [resultsList, setResultsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
    setSearchTerm(null)
  }, [router.query])

  useEffect(() => {
    if (debouncedValue) setSearchTerm(debouncedValue)
  }, [debouncedValue])

  useEffect(() => {
    if (searchTerm && inputText) {
      setIsLoading(true)
      fetch(`/api/park?query=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          setResultsList(data?.props?.searchDataList)
        })
        .catch(err => {
          // console.log(err)
        })
    } else {
      setResultsList([])
    }
  }, [searchTerm])

  // useEffect(() => {

  // }, [isLoading])


  function onClose() {
    setIsOpen(false)
    setInputText(null)
    setResultsList([])
    setSearchTerm(null)
  }

  function handleSearchClick() {
    setIsOpen(true)
    setNavbarIsOpen(false)
  }

  function handleSearchInputChange(e) {
    setInputText(e.target.value)
  }

  const initialRef = React.useRef(null)

  return (
    <>
      <Button onClick={() => handleSearchClick()}
        as={Button}
        rightIcon={<Search2Icon />}
        color={useColorModeValue("brand.700", "brand.100")}
        backgroundColor={useColorModeValue("white", "#191a1a")}
        py={1.5}
        h={'auto'}
        rounded="md"
        _hover={{background: useColorModeValue("blackAlpha.800", "white"), color: useColorModeValue('white', 'blackAlpha.800')}}
        >
        <Text fontWeight={'normal'} fontFamily='Open Sans'>Search</Text>
      </Button>
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
                placeholder="Enter a name..."
                onInput={handleSearchInputChange} />
              <SearchResultList resultsList={resultsList} isLoading={isLoading} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
