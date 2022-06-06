import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Flex, Text, Stack, useColorModeValue } from "@chakra-ui/react";
import Logo from "./Logo";
import ColorModeToggle from "./ColorModeToggle";
import FilterMenu from "./FilterMenu";
import { useRouter } from 'next/router'
import Search from "./Search/Search";
import { FaDice } from 'react-icons/fa';

const NavBar = (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      setIsOpen(!isOpen)
    }
  }
  // const executedRef = useRef(false);

  useEffect(() => {
    // if (executedRef.current) return;
    setIsOpen(false)
    // executedRef.current = true;
  }, [router.query])

  return (
    <NavBarContainer {...props}>
      <Logo />
      <MenuToggle toggle={toggle} isOpen={isOpen} handleKeyUp={handleKeyUp} />
      <MenuLinks isOpen={isOpen} setIsOpen={setIsOpen} />
    </NavBarContainer>
  );
};

const CloseIcon = ({ color }) => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill={color}
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = ({ color }) => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen, handleKeyUp }) => {
  const color = useColorModeValue("gray.800", "white")
  return (
    <Box
      display={{ base: "block", md: "none" }}
      onClick={toggle}
      tabIndex={0}
      onKeyDown={handleKeyUp}

    >
      {isOpen ? <CloseIcon color={color} /> : <MenuIcon color={color} />}
    </Box>
  );
};

const MenuItem = ({ children, to = "/", py}) => {
  return (
    <Link href={to}>
      <a>
        <Text
          display="block"
          fontFamily='Open Sans'
          color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={useColorModeValue("white", "#191a1a")}
          py={py || 1}
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

const MenuLinks = ({ isOpen, setIsOpen }) => {
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "center", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <FilterMenu />
        <Search setNavbarIsOpen={setIsOpen} />
        <MenuItem to="/map">Map</MenuItem>
        <MenuItem to="/featured"><FaDice size={'1.4em'} /></MenuItem>
        <MenuItem to="/about">About</MenuItem>
        <ColorModeToggle setIsOpen={setIsOpen}/>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify={["space-between","space-between","space-around", "space-between"]}
      wrap="wrap"
      maxWidth="1500px"
      w="100%"
      mb={8}
      p={8}
      bg={"transparent"}
      color={useColorModeValue("brand.700", "brand.200")}
      position="fixed"
      backdropFilter="saturate(180%) blur(5px)"
      zIndex={99999}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
