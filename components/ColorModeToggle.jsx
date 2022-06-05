import { Box, FormControl, FormLabel, Switch, useColorMode } from '@chakra-ui/react'
import { BsMoonFill, BsFillCircleFill } from 'react-icons/bs'

export default function ColorModeToggle({ setIsOpen }) {
  const { colorMode, toggleColorMode } = useColorMode()

  const handleChange = () => {
    setIsOpen(false)
    toggleColorMode()
  }

  return (
    <Box mx={'auto'}>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='colorModeToggle' mb='0' cursor={'pointer'}>
          {colorMode === 'light' ? <BsFillCircleFill /> : <BsMoonFill />}
        </FormLabel>
        <Switch id='colorModeToggle' size={'md'} onChange={handleChange} colorScheme='facebook' />
      </FormControl>
    </Box>
  )
}
