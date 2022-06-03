// import { useState } from "react";
// import { Button, Menu, MenuList, MenuItem,MenuButton } from "@chakra-ui/react";

import { useState } from "react";
import Link from "next/link";
import { Box, Flex, Text, Stack, useColorModeValue } from "@chakra-ui/react";

import { BsFilter } from 'react-icons/bs';



const CloseIcon = ({ color }) => (
  <BsFilter size={'24px'} color={color} display={'inline'} />
  // <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  //   <title>Close</title>
  //   <path
  //     fill={color}
  //     d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
  //   />
  // </svg>
);

const MenuIcon = ({ color }) => (
  <BsFilter size={'24px'} color={color} display={'inline !important'} />
  // <svg
  //   width="24px"
  //   viewBox="0 0 20 20"
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill={color}
  // >
  //   <title>Menu</title>
  //   <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  // </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  const color = useColorModeValue("gray.800", "white")
  return (
    <Box
      display={"block"}
      onClick={toggle}

    >
            <Text
      color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={useColorModeValue("white", "gray.800")}
          py={1}
          px={2}
          // transform={'skew(-21deg)'}
          _hover={{background: useColorModeValue('blackAlpha.200', 'white'), color: "brand.700", borderColor: useColorModeValue('black', 'whiteAlpha.700')}}>Filter 
      {isOpen ? <CloseIcon color={color} /> : <MenuIcon color={color} />}</Text>
    </Box>
  );
};

const MenuItem = ({ children, to = "/", }) => {
  return (
    <Link href={to}>
      <a>
        <Text
          display="block"
          color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={useColorModeValue("white", "gray.800")}
          py={1}
          px={2}
          // transform={'skew(-21deg)'}
          _hover={{ background: useColorModeValue('blackAlpha.200', 'white'), color: "brand.700", borderColor: useColorModeValue('black', 'whiteAlpha.700') }}
        >
          {children}
        </Text>
      </a>
    </Link>
  );
};

const MenuLinks = ({ isOpen }) => {
  return (
    <Box
      // display={{ base: isOpen ? "block" : "none", md: "block" }}
      display={isOpen ? "block" : "none"}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/all">Color</MenuItem>
        <MenuItem to="/about">Animated</MenuItem>
      </Stack>
    </Box>
  );
};

export default function FilterMenu() {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Flex>

      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </Flex>
  );
};
