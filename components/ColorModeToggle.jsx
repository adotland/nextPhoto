import { Box, FormControl, FormLabel, Switch, useColorMode } from '@chakra-ui/react'
import { BsMoonFill, BsFillCircleFill } from 'react-icons/bs'

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box mx={'auto'}>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='colorModeToggle' mb='0' cursor={'pointer'}>
          {colorMode === 'light' ? <BsFillCircleFill /> : <BsMoonFill />}
        </FormLabel>
        <Switch id='colorModeToggle' size={'md'} onChange={toggleColorMode} colorScheme='facebook' />
      </FormControl>
    </Box>
  )
}
