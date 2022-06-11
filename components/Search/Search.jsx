import {Button, Text, useColorModeValue } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
const SearchModal = dynamic(() => import('./SearchModal'), {
  ssr: false,
});


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
      <SearchModal isOpen={isOpen} onClose={onClose} initialRef={initialRef} handleSearchInputChange={handleSearchInputChange} resultsList={resultsList} isLoading={isLoading}/>
    </>
  )
}
