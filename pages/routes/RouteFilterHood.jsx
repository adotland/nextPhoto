import { Box, Flex, Text, useCheckbox, useCheckboxGroup } from "@chakra-ui/react"
import { useEffect } from "react"

export default function RouteFilterHood({ hoodFilter, setFilterValue }) {
  function CustomCheckbox(props) {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
      useCheckbox(props)

    return (
      <Text as="label"
        display='flex'
        flexDirection='row'
        alignItems='center'
        gridColumnGap={2}
        // maxW='40'
        bg='gray.50'
        border='1px solid'
        borderColor='gray.500'
        rounded='lg'
        px={3}
        py={1}
        m={1}
        cursor='pointer'
        {...htmlProps}
      >
        <input {...getInputProps()} hidden />
        <Flex
          alignItems='center'
          justifyContent='center'
          border='2px solid'
          borderColor='gray.500'
          w={4}
          h={4}
          {...getCheckboxProps()}
        >
          {state.isChecked && <Box w={2} h={2} bg='gray.500' />}
        </Flex>
        <Text color="gray.700" {...getLabelProps()}>{props.value}</Text>
      </Text>
    )
  }

  const { value: selectedHoods, getCheckboxProps } = useCheckboxGroup({
    defaultValue: hoodFilter,
  })

  useEffect(() => {
    setFilterValue(selectedHoods)
  }, [selectedHoods, setFilterValue])

  return (
    <Flex flexWrap={'wrap'} my={5} w={'100%'} justifyContent={'center'} alignItems={'center'} border={'1px solid #aaa'} p={3} rounded={'lg'}>
      <Text fontWeight={'bold'} mr={3}>Hoods</Text>
      {hoodFilter.map(hood => (<CustomCheckbox key={hood} {...getCheckboxProps({ value: `${hood}` })} />))}
    </Flex>
  )
}
