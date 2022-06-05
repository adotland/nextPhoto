import { Box, Flex } from "@chakra-ui/layout"
import { useColorModeValue, Link } from "@chakra-ui/react"
import { BsGithub, BsTwitter } from "react-icons/bs"

function Footer() {
  return (
    <Box
      color='gray.600'
    >
      <Flex
        bgColor={useColorModeValue("gray.200", "blackAlpha.300")}
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
    </Box>
  )
}

export default Footer
