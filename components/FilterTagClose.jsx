import { Tag, TagCloseButton, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTagClose({ type, value }) {
  return (
    <Link href={'/all'}>
      <a>
        <Tag
          bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')}
          color='gray.900'
          mb={7}
          letterSpacing='wider'
          boxShadow='md'
          _hover={{background: useColorModeValue('blackAlpha.200', 'white')}}
        >
          {value}
          <TagCloseButton />
        </Tag>
      </a>
    </Link>
  )
}
