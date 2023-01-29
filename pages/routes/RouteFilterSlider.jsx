import { Flex, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from '@chakra-ui/react'

const RouteFilterSlider = ({ title, setFilterValue, max, step, icon }) => {

  const steps = [];
  for (let index = 0; index <= (max - step); index += step) {
    steps.push(index)
  }
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  return (
    <Flex flexDir={'column'} w={'100%'} my={5}>
      <div>{title}</div>
      <Slider aria-label='slider-ex-4' min={0} step={step} max={max} defaultValue={max} onChange={(val) => setFilterValue(val)}>
        {steps.map(thisStep => (<SliderMark key={thisStep} value={thisStep} {...labelStyles}>
          {thisStep}
        </SliderMark>)
        )}
        <SliderMark value={max} {...labelStyles}>
          {max}+
        </SliderMark>
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          {icon}
        </SliderThumb>
      </Slider>
    </Flex>
  )
}

export default RouteFilterSlider
