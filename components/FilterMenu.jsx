// import { useState } from "react";
import { Button, Menu, MenuList, MenuItem, MenuButton, useColorModeValue, MenuDivider, Text, Box, Flex, } from "@chakra-ui/react";
import Link from "next/link";
import { BsFilter, BsCameraReels } from 'react-icons/bs';
import { AiOutlinePicture, AiOutlineCamera } from 'react-icons/ai';
import { VscSymbolColor } from 'react-icons/vsc'
import COLORS, { getAllColors } from "../cms/data/live/scripts/palette";


export function FilterMenuLinkColor({ name, value, hex }) {
  return (
    <MenuItem justifyContent={'center'}>
      <Link href={`/filter/${name}/${value}`}>
        <a>
          <Flex justifyContent={'flex-end'}>
            <Text textTransform={'capitalize'}>
              {value}
            </Text>
            <Box bg={hex} w='45px' h={'15px'} ml="0.5rem"></Box>
          </Flex>
        </a>
      </Link>
    </MenuItem>
  )
}

export function FilterMenuLinkType({ value }) {
  value = value.toLowerCase()
  return (
    <MenuItem justifyContent={'center'}>
      <Link href={`/filter/type/${value}`}>
        <a>
          <Flex justifyContent={'flex-end'}>
            <Text textTransform={'capitalize'}>{value}</Text>
            <Box ml={2}>
              {value === 'animated' ? <BsCameraReels /> : <AiOutlinePicture />}
            </Box>
          </Flex>
        </a>
      </Link>
    </MenuItem>
  )
}

export default function FilterMenu() {

  const colors = getAllColors().sort();

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<BsFilter size={'1.4em'} />}
          color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={useColorModeValue("white", "#191a1a")}
          py={1.5}
          h={'auto'}
          // transform={'skew(-21deg)'}
          rounded="none"
          _hover={{ background: useColorModeValue('blackAlpha.200', 'white'), color: "brand.700", borderColor: useColorModeValue('black', 'whiteAlpha.700') }}
        >
          <Text fontWeight={'normal'} fontFamily='Open Sans'>Filter</Text>
        </MenuButton>
        <MenuList rounded={'none'} bgColor={useColorModeValue("gray.200", "#191a1a")}>
          <MenuItem isDisabled="true">
            <Text mr='2'>Type</Text>
            <AiOutlineCamera />
          </MenuItem>
          <FilterMenuLinkType value={'Animated'} />
          <FilterMenuLinkType value={'Still'} />
          <MenuDivider />
          <MenuItem isDisabled="true">
            <Text mr='2'>Color</Text>
            <VscSymbolColor />
          </MenuItem>
          {colors.map((color, index) => {
            return <FilterMenuLinkColor key={index} name={'color'} value={color} hex={COLORS[color].displayHex} />
          })}
        </MenuList>
      </Menu>
    </Box>
  )
}
