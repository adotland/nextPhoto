import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Flex, Text, Stack, useColorModeValue, Tooltip } from "@chakra-ui/react";
import Logo from "./Logo";
import ColorModeToggle from "./ColorModeToggle";
import FilterMenu from "./FilterMenu/FilterMenu";
import { useRouter } from 'next/router'
import Search from "./Search/Search";
import { FaTree } from 'react-icons/fa';
import { GoBeaker } from 'react-icons/go';
import { BiInfoCircle } from 'react-icons/bi'
import { BsMap, BsPinMapFill } from "react-icons/bs";

const NavBar = (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState(router.pathname ?? '');
  const toggle = () => setIsOpen(!isOpen);
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      setIsOpen(!isOpen)
    }
  }

  useEffect(() => {
    setIsOpen(false)
  }, [router.query])

  useEffect(() => {
    setPathname(router.pathname)
  }, [router.pathname])

  return (
    <NavBarContainer {...props}>
      <Logo />
      <MenuToggle toggle={toggle} isOpen={isOpen} handleKeyUp={handleKeyUp} />
      <MenuLinks isOpen={isOpen} setIsOpen={setIsOpen} pathname={pathname} />
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
      display={{ base: "block", lg: "none" }}
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


const MenuItemToolTip = ({ children, to = "/", name, icon, pathname }) => {
  const activeColor = useColorModeValue("#eee", "#555");
  const inactiveColor = useColorModeValue("white", "#191a1a");
  return (
    <Link href={to}>
      <a aria-label={name}>
        {/* <Tooltip label={name}> */}
        <Box
          fontFamily='Open Sans'
          fontWeight={'bold'}
          fontSize={'md'}
          color={useColorModeValue("brand.700", "brand.100")}
          backgroundColor={pathname.includes(to) ? activeColor : inactiveColor}
          py={2.5}
          px={2.5}
          rounded={'md'}
          border={{ base: `1px solid ${useColorModeValue("#191a1a", "#555")}`, lg: "none" }}
          _hover={{ background: activeColor }}
        >
          <Flex justify={'space-between'}>
            <Text mr={1}>{children}</Text>
            {icon}
          </Flex>
        </Box>
        {/* </Tooltip> */}
      </a>
    </Link>
  );
};

const MenuLinks = ({ isOpen, setIsOpen, pathname }) => {
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", lg: "block" }}
      flexBasis={{ base: "100%", lg: "auto" }}
      ml={'20px'}
    >
      <Stack
        spacing={2}
        align="right"
        justify={"flex-end"}
        direction={["column", "column", "column", "row"]}
        pt={[2, 4, 0, 0]}
      >
        <MenuItemToolTip to="/featured" name="Featured" icon={<FaTree size={'1.4em'} />} pathname={pathname}>Featured Parks</MenuItemToolTip>
        <MenuItemToolTip to="/routes" name="Routes" icon={<BsPinMapFill size={'1.4em'} />} pathname={pathname}>Routes</MenuItemToolTip>
        <MenuItemToolTip to="/map" name="Park Map" icon={<BsMap size={"1.4em"} />} pathname={pathname}>Full Map</MenuItemToolTip>
        <FilterMenu setNavbarIsOpen={setIsOpen} />
        <Search setNavbarIsOpen={setIsOpen} />
        <MenuItemToolTip to="/data/seattle-parks-and-health" name="Health Data Map" icon={<GoBeaker size={'1.4em'} />} pathname={pathname}>Data Experiments</MenuItemToolTip>
        <MenuItemToolTip to="/about" name="About" icon={<BiInfoCircle size={'1.4em'} />} pathname={pathname}>About</MenuItemToolTip>
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
      justify={["space-between", "space-between", "space-between", "space-between"]}
      wrap="wrap"
      maxWidth="1500px"
      w="100%"
      // mb={8}
      px={8}
      paddingTop={8}
      paddingBottom={4}
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
