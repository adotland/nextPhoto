import {
  Box, Wrap, Stat, StatHelpText, StatLabel, StatNumber, WrapItem, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

function ParkStat({ name, data }) {
  return (
    <WrapItem>
      <Stat minW={30}>
        <StatLabel>{name}</StatLabel>
        <StatNumber>{data}</StatNumber>
        <StatHelpText></StatHelpText>
      </Stat>
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
              Statistics
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Wrap spacing='30px' justify='center'>
            <ParkStat name={'Total Parks Visited'} data={stats.amount.all} />
            <ParkStat name={'Seattle City'} data={stats.amount.seattle} />
            <ParkStat name={'Seattle Other'} data={stats.amount['non-city']} />
            <ParkStat name={'P-Patches'} data={stats.amount.p_patch} />
            <ParkStat name={'Seattle Port'} data={stats.amount.port} />
            <ParkStat name={'Mercer Island'} data={stats.amount.mercer} />
            <ParkStat name={'WA State'} data={stats.amount.state} />
            <ParkStat name={'King County'} data={stats.amount.county} />
            <ParkStat name={'Bainbridge Island'} data={stats.amount.bainbridge} />
          </Wrap>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
