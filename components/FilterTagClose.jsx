import { Tag, TagCloseButton, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTagClose({ type, value }) {
  return (
    <Link href={'/'}>
      <a>
        <Tag bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')} color='gray.900' mb={7} border='2px'>
          {value}
          <TagCloseButton />
        </Tag>
      </a>
    </Link>
  )
}
