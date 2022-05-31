import { Tag, TagCloseButton, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function FilterTagClose({ type, value }) {
  return (
    <Link href={'/'}>
      <a>
        <Tag bg={useColorModeValue('blackAlpha.400', 'whiteAlpha.700')} color='gray.900' mb={7} letterSpacing='wider'>
          {value}
          <TagCloseButton />
        </Tag>
      </a>
    </Link>
  )
}
