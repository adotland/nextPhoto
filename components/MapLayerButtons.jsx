import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import Image from 'next/image'
// import React, { useState } from 'react'
import layerImage from '../public/layers-2x.9859cd12.png'

const MapLayerButtons = () => {
  // const [position, setPosition] = useState(() => map.getCenter())
  return (
    // <div>MapLayerButtons:</div>
    <Box mx={[0,0, 8]} mt={[4,4, 0]} >
      <Heading as={'h3'} fontSize={'large'} borderBottom={'1px solid'} pb={1}>How to Use</Heading>
      <Text mt={4}>Use the layers control <Image alt='layer control' src={layerImage} width={44} height={44} /> in the top right corner of the map to add / remove layers. </Text>
      
      <Text>The changes in hue from bright red to bright green denote amount from least to greatest.</Text>

      <Heading mt={4} as={'h3'} fontSize={'large'} borderBottom={'1px solid'} pb={1}>Legend</Heading>
      <Text mt={4} fontWeight={'bold'}>Health Percentile: </Text>
      <Text>From Health Disadvantage Index*:         ranks census tracts by an index of seven equally weighted measures:</Text>
      <UnorderedList>
        <ListItem>        No leisure-time physical activity</ListItem>
        <ListItem>Diagnosed diabetes</ListItem>
        <ListItem>Obesity</ListItem>
        <ListItem>Mental health not good **</ListItem>
        <ListItem>Asthma</ListItem>
        <ListItem>Low life expectancy at birth</ListItem>
        <ListItem>Disability</ListItem>
      </UnorderedList>
      <Text mt={4} fontWeight={'bold'}>Economic Percentile (Financial Health): </Text>
      <Text>From Socioeconomic Disadvantage Index*: ranks census tracts by an index of two equally weighted measures:</Text>
      <UnorderedList>
        <ListItem> Income below 200% of poverty level </ListItem>
        <ListItem>grad Educational attainment less than a bachelor&apos;s degree</ListItem>
      </UnorderedList>
      <Text mt={4} fontWeight={'bold'}>Park Area Percentile: </Text>
      <Text>Ranks each census tract by percentage area of parks to total area (i.e., how much of this tract is park space?)</Text>
      <Text mt={4} fontWeight={'bold'}>Park Amount Percentile: </Text>
      <Text>Ranks each census tract by total number of individual city-owned parks, and p-patches</Text>
    </Box>
  )
}

export default MapLayerButtons
