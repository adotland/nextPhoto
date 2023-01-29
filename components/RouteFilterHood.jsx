import { Box, Flex, Stack, Text, useCheckbox, useCheckboxGroup } from "@chakra-ui/react"
import { useEffect } from "react"

export default function RouteFilterHood({ hoodList, routeDataList, filteredRouteDataList, setFilteredRouteDataList }) {
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
    defaultValue: hoodList,
  })

  useEffect(() => {
    const newFilteredRouteSet = new Set();
    routeDataList.forEach(route => {
      selectedHoods.forEach(hood => {
        if (route.hoodNameList.includes(hood)) {
          newFilteredRouteSet.add(route)
        }
      });
      setFilteredRouteDataList(Array.from(newFilteredRouteSet));
    });
  }, [selectedHoods, routeDataList, setFilteredRouteDataList])

  return (
    <Stack spacing={[1, 5]} direction={['column', 'row']} my={5} alignItems={'center'}>
      <Text>&apos;Hoods</Text>
      {/* <Text>The selected checkboxes are: {selectedHoods.sort().join(' and ')}</Text> */}
      {hoodList.map(hood => (<CustomCheckbox key={hood} {...getCheckboxProps({ value: `${hood}` })} />))}
    </Stack>
  )
}
