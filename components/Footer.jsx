import { Box, Flex } from "@chakra-ui/layout"
import { useColorModeValue } from "@chakra-ui/react"
import PillPity from 'pill-pity'

function Footer() {
  return (
    <Box
      pt={5}
      mt={3}
      color='gray.600'
    >
      <PillPity
        pattern="topography"
        as={Flex}
        patternFill={useColorModeValue("gray.200", "gray.600")}
        patternOpacity={useColorModeValue(0.4, 0.1)}
        bgColor={useColorModeValue("gray.100", "gray.800")}
        py={5}
        px={10}
      >
        &copy; {new Date().getFullYear()} A.Land
      </PillPity>
    </Box>
  )
}

export default Footer
