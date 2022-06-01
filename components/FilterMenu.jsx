// import { useState } from "react";
import { Button, Menu, MenuList, MenuItem, MenuButton, useColorModeValue, MenuDivider, Box } from "@chakra-ui/react";
import Link from "next/link";
import { BsFilter } from 'react-icons/bs';


export function FilterMenuLink({ name, value }) {
  return (
    <MenuItem justifyContent={'center'}>
      <Link href={`/filter/${name}/${value.toLowerCase()}`}><a>{value}</a></Link>
    </MenuItem>
  )
}

export default function FilterMenu() {

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BsFilter />}
        color={useColorModeValue("brand.700", "brand.100")}
        backgroundColor={useColorModeValue("white", "gray.800")}
        py={0.5}
        h={'auto'}
        transform={'skew(-21deg)'}
        rounded="none"
      >Filter
      </MenuButton>
      <MenuList>
        <MenuItem>Type</MenuItem>
        <FilterMenuLink name={'type'} value={'Animated'} />
        <FilterMenuLink name={'type'} value={'Still'} />
        <MenuDivider />
        <MenuItem>Color</MenuItem>
        <FilterMenuLink name={'color'} value={'Bold'} />
        <FilterMenuLink name={'color'} value={'Sky'} />
        <FilterMenuLink name={'color'} value={'Light'} />
        <FilterMenuLink name={'color'} value={'Green'} />
      </MenuList>
    </Menu>
  )
}
