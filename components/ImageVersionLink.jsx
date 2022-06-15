import { BsCameraReels } from 'react-icons/bs';
import { AiOutlinePicture } from 'react-icons/ai';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function ImageVersionLink({ slug, type }) {
  const newSlug = type === 'animated' ? `${slug}-anim` : `${slug.replace('-anim', '')}`
  return (

    <Link href={`/park/${newSlug}`}>
      <a>
        <Flex
          justifyContent={['center', 'center', 'center', 'flex-start']}
          alignItems={'center'}
          ml={[0, 0, 0, 7]}
          mt={[7, 7, 7, 0]}
          roundedRight={'lg'}
          roundedLeft={['none', 'none', 'none', 'lg']}
          pl={5}
          
        >
          {type === 'animated' ? <BsCameraReels /> : <AiOutlinePicture />}
          <Text
            display={'inline-block'}
            px={4}
            _hover={{textDecoration: 'underline'}}
          >
            {type} verison available &rarr;
          </Text>
        </Flex>
      </a>
    </Link>
  )
}
