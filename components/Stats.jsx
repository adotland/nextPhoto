import {
  Box, Wrap, Stat, StatHelpText, StatLabel, StatNumber, WrapItem, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Heading
} from "@chakra-ui/react";
import Link from "next/link";
import CountUp from 'react-countup';

function ParkStat({ name, data, link }) {

  const normScale = (amount) => Math.ceil(amount / 600)

  return (
    <WrapItem
    borderRadius={9}
      p='5px'
      _hover={{ background: useColorModeValue('blackAlpha.200', '#333'), color: useColorModeValue('black', '#eee'), borderColor: useColorModeValue('black', '#333') }}
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
    <section>
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem>
          <Heading as={'h2'}>
            <AccordionButton>
              <Box flex='1' textAlign='left' fontWeight={'bold'}>
                Stats
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Wrap spacing='20px' justify='center'>
              <ParkStat name={'Total Parks Visited'} data={stats.amount.all} link={'/map'} />
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
    </section>
  )
}
