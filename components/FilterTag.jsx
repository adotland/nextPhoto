import { Box, Flex, Tag, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTag({ type, value }) {
  return (
    <Flex>
      {/* <Text>{type}: </Text> */}
      <Box>
        <Link href={`/filter/${type}/${value}`}>
          <a>
            <Tag bg={useColorModeValue('blackAlpha.400' ,'whiteAlpha.700')} color='gray.900' _hover={{background: useColorModeValue('blackAlpha.200', 'white')}}>{value}</Tag>
          </a>
        </Link>
      </Box>
    </Flex>
  )
}
