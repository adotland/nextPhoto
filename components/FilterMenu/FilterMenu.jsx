const FilterDrawer = dynamic(() => import('./FilterDrawer'), {
  ssr: false,
});

import { Button } from "@chakra-ui/button"
import { useColorModeValue } from "@chakra-ui/color-mode"
import { useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import dynamic from "next/dynamic";

import { BsFilter } from 'react-icons/bs';

export default function FilterMenu({ setNavbarIsOpen }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const onButtonClick = () => {
    setNavbarIsOpen(false)
    onOpen()
  }

  return (
    <>
      <Button
        rightIcon={<BsFilter size={'1.4em'} />}
        fontFamily='Open Sans'
        color={useColorModeValue("brand.700", "brand.100")}
        backgroundColor={useColorModeValue("white", "#191a1a")}
        py={1.5}
        h={'auto'}
        // transform={'skew(-21deg)'}
        rounded="md"
        _hover={{ background: useColorModeValue("#eee", "555"), }}
        onClick={onButtonClick}
        ref={btnRef}
      >
        Filter
      </Button>
      <FilterDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </>
  )
}
