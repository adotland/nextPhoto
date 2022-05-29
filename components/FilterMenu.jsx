// import { useState } from "react";
import { Button, Menu, MenuList, MenuItem,MenuButton } from "@chakra-ui/react";
import { BsFilter } from 'react-icons/bs';

export default function FilterMenu() {

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsFilter />}>Filter</MenuButton>
      <MenuList>
        <MenuItem>Menu 1</MenuItem>
        <MenuItem>New Window</MenuItem>
        <MenuItem>Open Closed Tab</MenuItem>
        <MenuItem>Open File</MenuItem>
      </MenuList>
    </Menu>
  )
}
