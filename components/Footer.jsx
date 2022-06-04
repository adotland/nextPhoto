import { Box, Flex } from "@chakra-ui/layout"
import { useColorModeValue, Link } from "@chakra-ui/react"
import { BsGithub, BsTwitter } from "react-icons/bs"
// import PillPity from 'pill-pity'

function Footer() {
  return (
    <Box
      pt={5}
      mt={3}
      color='gray.600'
    >
      {/* <PillPity
        pattern="topography"
        as={Flex}
        patternFill={useColorModeValue("gray.200", "gray.600")}
        patternOpacity={useColorModeValue(0.4, 0.1)}
        bgColor={useColorModeValue("gray.100", "gray.800")}
        py={5}
        px={10}
      > */}
      <Flex
        // patternFill={useColorModeValue("gray.200", "gray.600")}
        // opacity={useColorModeValue(0.4, 0.1)}
        bgColor={useColorModeValue("gray.100", "gray.800")}
        py={5}
        px={10}
        justifyContent={'space-between'}
      >
        &copy; {new Date().getFullYear()} TheParkAndTheBike
        <Flex justifyContent={'flex-end'}>
          <Box ml={5}>
            <Link href="https://twitter.com/TheParkAndTheB1" target={'_blank'}>
              <BsTwitter />
            </Link>
          </Box>
          <Box ml={5}>
            <Link href="https://github.com/adotland" target={'_blank'}>
              <BsGithub />
            </Link>
          </Box>
        </Flex>
      </Flex>
      {/* </PillPity> */}
    </Box>
  )
}

export default Footer
