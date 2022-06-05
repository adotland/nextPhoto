import {
  Box, Wrap, Stat, StatHelpText, StatLabel, StatNumber, WrapItem, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue
} from "@chakra-ui/react";
import Link from "next/link";
import CountUp from 'react-countup';

function ParkStat({ name, data, link }) {

  const normScale = (amount) => Math.ceil(amount / 600) + 0.5

  return (
    <WrapItem
      p='5px'
      _hover={{ background: useColorModeValue('blackAlpha.200', 'white'), color: "brand.700", borderColor: useColorModeValue('black', 'whiteAlpha.700') }}
    >
      <Link href={link} >
        <a>
          <Stat minW={30}>
            <StatLabel>
              {name}
            </StatLabel>
            <StatNumber textAlign={'center'}><CountUp end={data} duration={normScale(data)} /></StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
        </a>
      </Link>
    </WrapItem>
  )
}

export default function Stats({ stats }) {
  return (
    <Accordion allowToggle defaultIndex={0}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              Stats
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Wrap spacing='20px' justify='center'>
            <ParkStat name={'Total Parks Visited'} data={stats.amount.all} link={'/all'} />
            <ParkStat name={'Seattle City'} data={stats.amount.seattle} link={'/collection/seattle'} />
            <ParkStat name={'Seattle Other'} data={stats.amount['extras']} link={'/collection/extras'} />
            <ParkStat name={'P-Patches'} data={stats.amount['p-patch']} link={'/collection/p-patch'} />
            <ParkStat name={'Seattle Port'} data={stats.amount.port} link={'/collection/extras'} />
            <ParkStat name={'Mercer Island'} data={stats.amount.mercer} link={'/collection/mercer'} />
            <ParkStat name={'WA State'} data={stats.amount.state} link={'/collection/state'} />
            <ParkStat name={'King County'} data={stats.amount.county} link={'/collection/county'} />
            <ParkStat name={'Bainbridge Island'} data={stats.amount.bainbridge} link={'/collection/bainbridge'} />
          </Wrap>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
