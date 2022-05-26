import { Box, Flex } from "@chakra-ui/layout"
import { useColorModeValue } from "@chakra-ui/react"
import PillPity from 'pill-pity'

function Footer() {
    return (
      <PillPity
      pattern="topography"
      as={Flex}
      justify="center"
      align="center"
      patternFill={useColorModeValue("gray.200", "gray.600")}
      patternOpacity={useColorModeValue(0.4, 0.1)}
      bgColor={useColorModeValue("gray.100", "gray.800")}
    >
        <Box textAlign='center' p='5' color='gray.600'>
            &copy; {new Date().getFullYear()} A.Land
        </Box>
        </PillPity>
    )
}

export default Footer
