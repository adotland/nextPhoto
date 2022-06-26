import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/modal'
import { Text, Box, Flex } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode"

import Link from "next/link";
import { BsCameraReels } from 'react-icons/bs';
import { AiOutlinePicture, AiOutlineCamera } from 'react-icons/ai';
import { VscSymbolColor } from 'react-icons/vsc'
import COLORS, { getAllColors } from "../../data/scripts/palette";

import { useRouter } from 'next/router'
import { useEffect } from 'react';

function FilterLinkColor({ name, value, hex }) {
  return (
    <Link href={`/filter/${name}/${value}`}>
      <a>
        <Flex
          justifyContent={'flex-end'}
          alignItems={'center'}
          m={2}
          py={1}
          px={2}
          rounded={'md'}
          border={'1px solid gray'}
          _hover={{
            background: useColorModeValue("blackAlpha.400", "whiteAlpha.300"),
          }}
        >
          <Text textTransform={'capitalize'}>
            {value}
          </Text>
          <Box bg={hex} w='45px' h={'15px'} ml="0.5rem"></Box>
        </Flex>
      </a>
    </Link>
  )
}

function FilterLinkType({ value }) {
  value = value.toLowerCase()
  return (
    <Link href={`/filter/type/${value}`}>
      <a>
      <Flex
          justifyContent={'flex-end'}
          alignItems={'center'}
          m={2}
          py={1}
          px={2}
          rounded={'md'}
          border={'1px solid gray'}
          _hover={{
            background: useColorModeValue("blackAlpha.400", "whiteAlpha.300"),
          }}
        >
          <Text textTransform={'capitalize'}>{value}</Text>
          <Box ml={2}>
            {value === 'animated' ? <BsCameraReels /> : <AiOutlinePicture />}
          </Box>
        </Flex>
      </a>
    </Link>
  )
}

export default function ({ isOpen, onClose, btnRef }) {
  const router = useRouter();
  useEffect(() => {
    onClose()
  }, [router.query])

  const colors = getAllColors().sort();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={btnRef}
      placement={'bottom'}
    >
      <DrawerOverlay />
      <DrawerContent bgColor={useColorModeValue("whiteAlpha.900", "blackAlpha.900")} pb={5}>
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerHeader display={'flex'} alignItems={'center'}>Type&nbsp;<AiOutlineCamera /></DrawerHeader>
        <DrawerBody display={'flex'} justifyContent={['space-around', 'space-around', 'space-around', 'flex-start']} flexWrap={'wrap'}>
          <FilterLinkType value={'Animated'} />
          <FilterLinkType value={'Still'} />
        </DrawerBody>
        <DrawerHeader display={'flex'} alignItems={'center'}>Color&nbsp;<VscSymbolColor /></DrawerHeader>
        <DrawerBody display={'flex'} justifyContent={['space-around', 'space-around', 'space-around', 'flex-start']} flexWrap={'wrap'}>
          {colors.map((color, index) => {
            return <FilterLinkColor key={index} name={'color'} value={color} hex={COLORS[color].displayHex} />
          })}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
