import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Flex, Text, Stack, useColorModeValue, Tooltip } from "@chakra-ui/react";
import Logo from "./Logo";
import ColorModeToggle from "./ColorModeToggle";
import FilterMenu from "./FilterMenu/FilterMenu";
import { useRouter } from 'next/router'
import Search from "./Search/Search";
import { FaDice, FaMapMarkerAlt } from 'react-icons/fa';
import { GoBeaker } from 'react-icons/go';
import { BiInfoCircle } from 'react-icons/bi'

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
      backgroundColor={useColorModeValue("white", "#191a1a")}
      p={1}
      transform={'skew(-21deg)'}
      _hover={{ cursor: 'pointer' }}
    >
      {isOpen ? <CloseIcon color={color} /> : <MenuIcon color={color} />}
    </Box>
  );
};

const MenuItem = ({ children, to = "/", name }) => {
  return (
    <Link href={to}>
      <a aria-label={name}>
        <Text
          display="block"
          fontFamily='Open Sans'
          fontWeight={'bold'}
          fontSize={'md'}
          color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={useColorModeValue("white", "#191a1a")}
          py={1}
          px={2}
          rounded={'md'}
          _hover={{ background: useColorModeValue("blackAlpha.800", "white"), color: useColorModeValue('white', 'blackAlpha.800') }}
        >
          {children}
        </Text>
      </a>
    </Link>
  );
};

const MenuItemToolTip = ({ children, to = "/", name }) => {
  return (
    <Link href={to}>
      <a aria-label={name}>
        <Tooltip label={name}>
          <Text
            display="block"
            fontFamily='Open Sans'
            fontWeight={'bold'}
            fontSize={'md'}
            color={useColorModeValue("brand.700", "brand.100")}
            backgroundColor={useColorModeValue("white", "#191a1a")}
            py={1}
            px={2}
            rounded={'md'}
            _hover={{ background: useColorModeValue("blackAlpha.800", "white"), color: useColorModeValue('white', 'blackAlpha.800') }}
          >
            {children}
          </Text>
        </Tooltip>
      </a>
    </Link>
  );
};

const MenuLinks = ({ isOpen, setIsOpen }) => {
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
      ml={'20px'}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "center", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <FilterMenu setNavbarIsOpen={setIsOpen} />
        <Search setNavbarIsOpen={setIsOpen} />
        <MenuItemToolTip to="/map" name="Park Map"><FaMapMarkerAlt size={"1.4em"} /></MenuItemToolTip>
        <MenuItemToolTip to="/map/seattle-parks-and-health" name="Health Data Map"><GoBeaker size={'1.4em'} /></MenuItemToolTip>
        <MenuItemToolTip to="/featured" name="Featured"><FaDice size={'1.4em'} /></MenuItemToolTip>
        <MenuItemToolTip to="/about" name="About"><BiInfoCircle size={'1.4em'} /></MenuItemToolTip>
        <ColorModeToggle setIsOpen={setIsOpen} />
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  const router = useRouter();
  return (
    <Flex
      as="nav"
      align="flex-start"
      justify={["space-between", "space-between", "space-around", "space-between"]}
      wrap="wrap"
      maxWidth="1500px"
      w="100%"
      mb={8}
      p={8}
      bg={"transparent"}
      color={useColorModeValue("brand.700", "brand.200")}
      position={router.pathname.indexOf('/map') === -1 ? "fixed" : "relative"}
      backdropFilter="saturate(180%) blur(5px)"
      zIndex={1000}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
